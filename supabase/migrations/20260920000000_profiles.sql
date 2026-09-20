-- MUI website: the only Supabase table the app uses.
-- Run once in the Supabase dashboard -> SQL Editor (or `supabase db push`).
-- Safe to re-run.

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  email       text,
  role        text not null default 'student' check (role in ('student', 'admin')),
  joined_at   timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A signed-in user can read only their own profile. The app never updates
-- profiles from the browser, so there is deliberately no update/insert policy:
-- roles can only be changed from the dashboard/SQL editor.
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Create a profile row automatically whenever someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for any users created before this ran.
insert into public.profiles (id, email, full_name)
select id, email, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do nothing;

-- Make the site owner an admin (no-op until that user exists).
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = 'micdupinitiative@gmail.com';
