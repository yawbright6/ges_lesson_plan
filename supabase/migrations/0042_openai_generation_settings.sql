-- OpenAI provider defaults for text generation and optional image generation.

insert into public.admin_app_settings (key, value)
values (
  'ai_generation',
  '{
    "provider": "openai",
    "model": "gpt-5.5"
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
    "max_visuals_per_lesson": 2,
    "credit_cost_per_visual": 1
  }'::jsonb
)
on conflict (key) do update
set value = public.admin_app_settings.value || '{
    "provider": "openai",
    "model": "gpt-image-2"
  }'::jsonb,
    updated_at = now();
