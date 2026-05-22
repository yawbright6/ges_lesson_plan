-- Settings and storage for generated inline lesson visuals.

insert into public.admin_app_settings (key, value)
values
  (
    'visual_generation',
    '{
      "enabled": false,
      "auto_generate": false,
      "provider": "gemini",
      "model": "gemini-3.1-flash-image-preview",
      "max_visuals_per_lesson": 2,
      "credit_cost_per_visual": 1
    }'::jsonb
  )
on conflict (key) do nothing;

insert into storage.buckets (id, name, public)
values ('lesson-visuals', 'lesson-visuals', true)
on conflict (id) do nothing;
