import { corsHeaders } from '../_shared/claude.ts';
import { createServiceClient, getAuthenticatedUser, HttpError, logEdgeError } from '../_shared/supabase.ts';
import { consumeCreditsForRequest, refundCredits } from '../_shared/credits.ts';

type VisualInput = {
  id?: string;
  title?: string;
  prompt?: string;
  caption?: string;
  type?: string;
  visualKind?: string;
  phase?: number;
};

type Body = {
  lessonPlanId?: string;
  subject?: string;
  classLevel?: string;
  week?: number;
  visuals?: VisualInput[];
};

const BUCKET = 'lesson-visuals';
const DEFAULT_MODEL = 'gemini-3.1-flash-image-preview';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const visuals = Array.isArray(body.visuals) ? body.visuals.filter((item) => cleanText(item.prompt)) : [];
  if (!visuals.length) return json({ visuals: [] }, 200);

  let userId: string | null = null;
  try {
    const user = await getAuthenticatedUser(req);
    userId = user.id;
    const service = createServiceClient();
    const settings = await loadVisualSettings(service);

    if (!settings.enabled) {
      throw new HttpError(400, 'Visual generation is disabled by admin settings.');
    }
    if (settings.provider !== 'gemini') {
      throw new HttpError(400, `Unsupported visual provider: ${settings.provider}`);
    }

    const apiKey = await loadGeminiApiKey(service);
    const limit = Math.max(0, settings.maxVisualsPerLesson || 0);
    const selected = visuals.slice(0, limit);
    const creditCost = Math.max(0, Math.round(settings.creditCostPerVisual || 0));
    const totalCreditCost = creditCost * selected.length;
    const creditDebit = totalCreditCost > 0
      ? await consumeCreditsForRequest(
          req,
          totalCreditCost,
          'visual_generation',
          'Inline visual generation',
          {
            lessonPlanId: body.lessonPlanId ?? null,
            subject: body.subject ?? null,
            classLevel: body.classLevel ?? null,
            week: body.week ?? null,
            visualCount: selected.length,
          },
        )
      : null;
    const generated = [];

    for (const visual of selected) {
      const id = cleanText(visual.id) || crypto.randomUUID();
      try {
        const image = await generateGeminiImage({
          apiKey,
          model: settings.model || DEFAULT_MODEL,
          prompt: buildPrompt(visual, body),
        });
        const path = `${user.id}/${cleanPath(body.lessonPlanId || 'unsaved')}/${id}-${Date.now()}.${extensionForMime(image.mimeType)}`;
        const { error: uploadError } = await service.storage
          .from(BUCKET)
          .upload(path, base64ToBytes(image.base64), {
            contentType: image.mimeType,
            upsert: true,
          });
        if (uploadError) throw new Error(uploadError.message);

        const { data } = service.storage.from(BUCKET).getPublicUrl(path);
        generated.push({
          ...visual,
          id,
          imageUrl: data.publicUrl,
          storagePath: path,
          status: 'generated',
          error: '',
        });
      } catch (err) {
        generated.push({
          ...visual,
          id,
          status: 'failed',
          error: (err as Error).message,
        });
      }
    }

    const failedCount = generated.filter((item) => item.status === 'failed').length;
    if (creditDebit && creditCost > 0 && failedCount > 0) {
      await refundCredits(
        creditDebit.user.id,
        creditCost * failedCount,
        'Refund for failed inline visual generation',
        {
          originalTransactionId: failedCount === selected.length ? creditDebit.transactionId : undefined,
          failedCount,
          visualCount: selected.length,
        },
      );
    }

    return json({ visuals: generated, creditBalance: creditDebit?.balance }, 200);
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message, ...(err.payload ?? {}) }, err.status);
    await logEdgeError({
      userId,
      source: 'edge',
      action: 'generate_lesson_visuals',
      message: (err as Error).message,
      metadata: { lessonPlanId: body.lessonPlanId, subject: body.subject },
    });
    return json({ error: (err as Error).message }, 500);
  }
});

async function loadVisualSettings(service: ReturnType<typeof createServiceClient>) {
  const { data } = await service
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'visual_generation')
    .maybeSingle();
  const value = (data?.value ?? {}) as Record<string, unknown>;
  return {
    enabled: value.enabled === true,
    provider: cleanText(value.provider) || 'gemini',
    model: cleanText(value.model) || DEFAULT_MODEL,
    maxVisualsPerLesson: Number(value.max_visuals_per_lesson ?? 2),
    creditCostPerVisual: Number(value.credit_cost_per_visual ?? 1),
  };
}

async function loadGeminiApiKey(service: ReturnType<typeof createServiceClient>) {
  const envKey = Deno.env.get('GEMINI_API_KEY')?.trim();
  if (envKey) return envKey;
  const { data } = await service
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'gemini_api_key')
    .maybeSingle();
  const key = cleanText((data?.value as Record<string, unknown> | null)?.value);
  if (!key) throw new HttpError(400, 'Gemini API key is not configured.');
  return key;
}

async function generateGeminiImage(input: { apiKey: string; model: string; prompt: string }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(input.model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': input.apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: input.prompt }] }],
      }),
    },
  );
  const payload = await response.json().catch(() => null) as Record<string, unknown> | null;
  if (!response.ok) {
    throw new Error(cleanText((payload?.error as Record<string, unknown> | undefined)?.message) || `Gemini failed with HTTP ${response.status}`);
  }
  const parts = ((payload?.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)?.parts;
  if (!Array.isArray(parts)) throw new Error('Gemini returned no image parts.');
  for (const part of parts) {
    const inlineData = (part as Record<string, unknown>).inlineData as Record<string, unknown> | undefined;
    const base64 = cleanText(inlineData?.data);
    if (base64) {
      return {
        base64,
        mimeType: cleanText(inlineData?.mimeType) || 'image/png',
      };
    }
  }
  throw new Error('Gemini did not return an image.');
}

function buildPrompt(visual: VisualInput, body: Body) {
  return [
    'Create a clean classroom teaching visual for a Ghanaian lesson.',
    'Style: simple educational diagram, clear labels where useful, white background, no decorative clutter.',
    'Avoid copyrighted characters, logos, brand names, and unnecessary realistic people.',
    `Subject: ${body.subject || ''}`,
    `Class: ${body.classLevel || ''}`,
    `Week: ${body.week || ''}`,
    `Title: ${visual.title || ''}`,
    `Teacher prompt: ${visual.prompt || ''}`,
  ].join('\n');
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function extensionForMime(mimeType: string) {
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'jpg';
  if (mimeType.includes('webp')) return 'webp';
  return 'png';
}

function cleanPath(value: string) {
  return cleanText(value).toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-|-$/g, '') || 'lesson';
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });
}
