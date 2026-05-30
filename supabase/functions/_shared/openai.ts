// Shared OpenAI caller for Supabase Edge Functions (Deno runtime).
// The API key is read from the OPENAI_API_KEY secret - never bundled with the app.
import { fetchWithTimeout } from './http.ts';
import { createServiceClient } from './supabase.ts';

const RESPONSES_API_URL = 'https://api.openai.com/v1/responses';
export const DEFAULT_OPENAI_TEXT_MODEL = 'gpt-5.5';
export const DEFAULT_OPENAI_IMAGE_MODEL = 'gpt-image-2';

export interface OpenAiJsonOptions {
  system: string;
  user: string;
  model?: string;
  maxTokens?: number;
  timeoutMs?: number;
}

export async function callOpenAiJson<T = unknown>(opts: OpenAiJsonOptions): Promise<T> {
  const apiKey = await loadOpenAiApiKey();

  const res = await fetchWithTimeout(RESPONSES_API_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_OPENAI_TEXT_MODEL,
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: opts.system }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: opts.user }],
        },
      ],
      max_output_tokens: opts.maxTokens ?? 8192,
      text: {
        format: { type: 'json_object' },
      },
    }),
  }, opts.timeoutMs ?? 120000);

  const raw = await res.text();
  const payload = parseJson(raw);
  if (!res.ok) {
    const message = cleanText((payload?.error as Record<string, unknown> | undefined)?.message);
    throw new Error(`OpenAI API error ${res.status}: ${message || raw.slice(0, 1200)}`);
  }

  const text = extractOutputText(payload);
  if (!text) {
    throw new Error('Unexpected OpenAI response shape');
  }

  const cleaned = extractJsonText(text);
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(`OpenAI did not return valid JSON. Raw text: ${text.slice(0, 300)}`);
  }
}

export async function generateOpenAiImage(input: {
  prompt: string;
  model?: string;
  size?: '1024x1024' | '1024x1536' | '1536x1024';
  quality?: 'low' | 'medium' | 'high' | 'auto';
  timeoutMs?: number;
}) {
  const apiKey = await loadOpenAiApiKey();

  const res = await fetchWithTimeout('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: input.model || DEFAULT_OPENAI_IMAGE_MODEL,
      prompt: input.prompt,
      n: 1,
      size: input.size ?? '1024x1024',
      quality: input.quality ?? 'medium',
    }),
  }, input.timeoutMs ?? 120000);

  const raw = await res.text();
  const payload = parseJson(raw);
  if (!res.ok) {
    const message = cleanText((payload?.error as Record<string, unknown> | undefined)?.message);
    throw new Error(`OpenAI image API error ${res.status}: ${message || raw.slice(0, 1200)}`);
  }

  const base64 = cleanText((payload?.data as Array<Record<string, unknown>> | undefined)?.[0]?.b64_json);
  if (!base64) throw new Error('OpenAI did not return image data.');
  return { base64, mimeType: 'image/png' };
}

async function loadOpenAiApiKey() {
  const envKey = Deno.env.get('OPENAI_API_KEY')?.trim();
  if (envKey) return envKey;

  const service = createServiceClient();
  const { data } = await service
    .from('admin_app_settings')
    .select('value')
    .eq('key', 'openai_api_key')
    .maybeSingle();
  const key = cleanText((data?.value as Record<string, unknown> | null)?.value);
  if (!key) {
    throw new Error('OPENAI_API_KEY is not configured for this edge function');
  }
  return key;
}

function extractOutputText(payload: Record<string, unknown> | null) {
  const outputText = cleanText(payload?.output_text);
  if (outputText) return outputText;

  const output = payload?.output;
  if (!Array.isArray(output)) return '';

  const chunks: string[] = [];
  for (const item of output) {
    const content = (item as Record<string, unknown>)?.content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      const text = cleanText((part as Record<string, unknown>)?.text);
      if (text) chunks.push(text);
    }
  }
  return chunks.join('\n').trim();
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
