import type { ServiceClient } from './types.ts';

export async function loadSettings(service: ServiceClient) {
  const { data, error } = await service.from('admin_app_settings').select('key,value,updated_at').order('key');
  if (error) return [];
  return (data ?? []).map((item) =>
    item.key === 'gemini_api_key' || item.key === 'openai_api_key'
      ? { ...item, value: { configured: Boolean(item.value?.value) } }
      : item,
  );
}

export async function updateSettings(service: ServiceClient, settings: Record<string, unknown>) {
  const allowedKeys = new Set([
    'starter_credits',
    'referral_reward',
    'feature_credit_costs',
    'generated_file_retention',
    'credit_purchasing',
    'translation_provider',
    'ai_generation',
    'visual_generation',
    'openai_api_key',
    'gemini_api_key',
  ]);
  const rows = Object.entries(settings)
    .filter(([key]) => allowedKeys.has(key))
    .filter(([, value]) => value && typeof value === 'object')
    .filter(([key, value]) =>
      !['gemini_api_key', 'openai_api_key'].includes(key) ||
      typeof (value as Record<string, unknown>).value === 'string'
    )
    .map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));

  if (!rows.length) throw new Error('No supported settings were provided');

  const { data, error } = await service
    .from('admin_app_settings')
    .upsert(rows, { onConflict: 'key' })
    .select('key,value,updated_at')
    .order('key');
  if (error) throw new Error(error.message);
  return (data ?? []).map((item) =>
    item.key === 'gemini_api_key' || item.key === 'openai_api_key'
      ? { ...item, value: { configured: Boolean(item.value?.value) } }
      : item,
  );
}
