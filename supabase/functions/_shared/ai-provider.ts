import { callClaudeJson } from './claude.ts';
import { callOpenAiJson, DEFAULT_OPENAI_TEXT_MODEL } from './openai.ts';
import { createServiceClient } from './supabase.ts';

type TextProvider = 'anthropic' | 'openai';

type TextGenerationSettings = {
  provider: TextProvider;
  model: string;
};

type JsonGenerationOptions = {
  system: string;
  user: string;
  maxTokens?: number;
  timeoutMs?: number;
};

export async function callConfiguredTextJson<T = unknown>(opts: JsonGenerationOptions): Promise<T> {
  const settings = await loadTextGenerationSettings();

  if (settings.provider === 'openai') {
    return callOpenAiJson<T>({
      ...opts,
      model: settings.model || DEFAULT_OPENAI_TEXT_MODEL,
    });
  }

  return callClaudeJson<T>(opts);
}

async function loadTextGenerationSettings(): Promise<TextGenerationSettings> {
  const envProvider = cleanText(Deno.env.get('AI_TEXT_PROVIDER') || Deno.env.get('AI_PROVIDER')).toLowerCase();
  const envModel = cleanText(Deno.env.get('OPENAI_TEXT_MODEL'));
  if (envProvider) {
    return normalizeSettings({ provider: envProvider, model: envModel });
  }

  try {
    const service = createServiceClient();
    const { data } = await service
      .from('admin_app_settings')
      .select('value')
      .eq('key', 'ai_generation')
      .maybeSingle();
    return normalizeSettings((data?.value ?? {}) as Record<string, unknown>);
  } catch {
    return { provider: 'anthropic', model: '' };
  }
}

function normalizeSettings(value: Record<string, unknown>): TextGenerationSettings {
  const provider = cleanText(value.provider).toLowerCase();
  const model = cleanText(value.model || value.text_model);

  if (provider === 'openai') {
    return { provider: 'openai', model: model || DEFAULT_OPENAI_TEXT_MODEL };
  }

  return { provider: 'anthropic', model: '' };
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}
