create table if not exists public.saved_test_papers (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  payload jsonb not null,
  expires_at timestamptz not null default (now() + interval '15 days'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists saved_test_papers_user_created_idx
  on public.saved_test_papers (user_id, created_at desc);

create index if not exists saved_test_papers_expires_idx
  on public.saved_test_papers (expires_at);

alter table public.saved_test_papers enable row level security;

drop policy if exists "owners manage saved test papers" on public.saved_test_papers;
create policy "owners manage saved test papers"
  on public.saved_test_papers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
