-- Lesson sharing for admin feedback
-- Teachers can share lesson snapshots with admins for suggestions/improvements

create table if not exists public.lesson_shares (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null,  -- reference to original lesson in saved_lesson_plans (not strict FK, allows deleted lessons to still have feedback)
  teacher_id uuid not null references auth.users(id) on delete cascade,
  lesson_data jsonb not null,  -- full snapshot of LessonPlan at time of share
  teacher_message text,  -- optional note from teacher
  admin_feedback text,  -- optional feedback from admin
  shared_at timestamptz not null default now(),
  feedback_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lesson_shares_teacher_idx on public.lesson_shares (teacher_id, shared_at desc);
create index if not exists lesson_shares_lesson_idx on public.lesson_shares (lesson_id);

alter table public.lesson_shares enable row level security;

-- Teachers can read and create their own shares
create policy "teachers read own shares"
  on public.lesson_shares for select
  using (auth.uid() = teacher_id);

create policy "teachers create own shares"
  on public.lesson_shares for insert
  with check (auth.uid() = teacher_id);

-- Teachers can update only their message/view feedback (not modify admin_feedback)
create policy "teachers update own teacher_message"
  on public.lesson_shares for update
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- Admins can read all shares
create policy "admins read all shares"
  on public.lesson_shares for select
  using (public.is_admin());

-- Admins can update admin_feedback and feedback_updated_at
create policy "admins update feedback"
  on public.lesson_shares for update
  using (public.is_admin());
