import { fetchWithTimeout } from './http.ts';
import { createServiceClient } from './supabase.ts';

export const DEFAULT_GEMINI_TEXT_MODEL = 'gemini-2.5-flash';

type GeminiJsonOptions = {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
};

export async function callGeminiJson<T = unknown>(opts: GeminiJsonOptions): Promise<T> {
  const apiKey = await loadGeminiApiKey();
  const model = opts.model || DEFAULT_GEMINI_TEXT_MODEL;

  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: opts.system }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: opts.user }],
          },
        ],
        generationConfig: {
          temperature: opts.temperature ?? 0.4,
          maxOutputTokens: opts.maxTokens ?? 8192,
          responseMimeType: 'application/json',
        },
      }),
    },
    opts.timeoutMs ?? 120000,
  );

  const raw = await response.text();
  const payload = parseJson(raw);
  if (!response.ok) {
    const message = cleanText((payload?.error as Record<string, unknown> | undefined)?.message);
    throw new Error(`Gemini API error ${response.status}: ${message || raw.slice(0, 1200)}`);
  }

  const text = extractGeminiText(payload);
  if (!text) throw new Error('Unexpected Gemini response shape');

  const cleaned = extractJsonText(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`Gemini did not return valid JSON. Raw text: ${text.slice(0, 300)}`);
  }
}

async function loadGeminiApiKey() {
  const envKey = Deno.env.get('GEMINI_API_KEY')?.trim();
  if (envKey) return envKey;

  const service = createServiceClient();
  const { data } = await service
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'gemini_api_key')
    .maybeSingle();
  const key = cleanText((data?.value as Record<string, unknown> | null)?.value);
  if (!key) throw new Error('GEMINI_API_KEY is not configured for this edge function');
  return key;
}

function extractGeminiText(payload: Record<string, unknown> | null) {
  const parts = ((payload?.candidates as Array<Record<string, unknown>> | undefined)?.[0]?.content as Record<string, unknown> | undefined)?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((part) => cleanText((part as Record<string, unknown>).text)).filter(Boolean).join('\n').trim();
}

function extractJsonText(text: string) {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}

function parseJson(raw: string) {
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
