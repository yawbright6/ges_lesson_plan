create or replace function public.get_shared_lessons_with_teacher_info()
returns table (
  id uuid,
  lesson_id text,
  teacher_id uuid,
  lesson_data jsonb,
  teacher_message text,
  admin_feedback text,
  shared_at timestamptz,
  feedback_updated_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  teacher_email text,
  teacher_name text,
  school_name text
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin(auth.uid()) then
    raise exception 'Only admins can view shared lessons';
  end if;

  return query
  select
    shares.id,
    shares.lesson_id,
    shares.teacher_id,
    shares.lesson_data,
    shares.teacher_message,
    shares.admin_feedback,
    shares.shared_at,
    shares.feedback_updated_at,
    shares.created_at,
    shares.updated_at,
    users.email::text as teacher_email,
    coalesce(profiles.teacher_name, '')::text as teacher_name,
    coalesce(profiles.school_name, '')::text as school_name
  from public.lesson_shares shares
  left join auth.users users on users.id = shares.teacher_id
  left join public.teacher_profiles profiles on profiles.user_id = shares.teacher_id
  order by shares.shared_at desc;
end;
$$;

grant execute on function public.get_shared_lessons_with_teacher_info() to authenticated;
