alter table public.credit_transactions
  drop constraint if exists credit_transactions_kind_check;

alter table public.credit_transactions
  add constraint credit_transactions_kind_check
  check (kind in (
    'starter',
    'purchase',
    'lesson_generation',
    'scheme_generation',
    'scheme_parsing',
    'teaching_notes_generation',
    'visual_generation',
    'referral_reward',
    'refund',
    'adjustment'
  ));

insert into public.admin_app_settings (key, value)
values ('feature_credit_costs', '{"lesson_generation": 1, "scheme_generation": 1, "scheme_parsing": 1, "teaching_notes_generation": 1, "visual_generation": 1}'::jsonb)
on conflict (key) do update
set value = public.admin_app_settings.value || '{"visual_generation": 1}'::jsonb,
    updated_at = now()
where not (public.admin_app_settings.value ? 'visual_generation');
