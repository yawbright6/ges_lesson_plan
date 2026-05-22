-- Lesson IDs in saved_lesson_plans are text slugs, not UUIDs.
alter table public.lesson_shares
  alter column lesson_id type text using lesson_id::text;
