-- OpenAI provider defaults for text generation and optional image generation.

insert into public.admin_app_settings (key, value)
values (
  'ai_generation',
  '{
    "provider": "openai",
    "model": "gpt-5.5",
    "openai_models": ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano", "gpt-5.2", "gpt-5.1", "gpt-5"],
    "anthropic_models": ["claude-sonnet-4-5"],
    "gemini_models": ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-2.0-flash", "gemini-2.0-flash-lite"]
  }'::jsonb
)
on conflict (key) do update
set value = public.admin_app_settings.value || excluded.value,
    updated_at = now();

insert into public.admin_app_settings (key, value)
values (
  'openai_api_key',
  '{"value": ""}'::jsonb
)
on conflict (key) do nothing;

insert into public.admin_app_settings (key, value)
values (
  'visual_generation',
  '{
    "enabled": false,
    "auto_generate": false,
    "provider": "openai",
    "model": "gpt-image-2",
    "openai_models": ["gpt-image-2", "gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"],
    "gemini_models": ["gemini-3.1-flash-image-preview"],
    "max_visuals_per_lesson": 2,
    "credit_cost_per_visual": 1
  }'::jsonb
)
on conflict (key) do update
set value = public.admin_app_settings.value || '{
    "provider": "openai",
    "model": "gpt-image-2",
    "openai_models": ["gpt-image-2", "gpt-image-1.5", "gpt-image-1", "gpt-image-1-mini"],
    "gemini_models": ["gemini-3.1-flash-image-preview"]
  }'::jsonb,
    updated_at = now();
