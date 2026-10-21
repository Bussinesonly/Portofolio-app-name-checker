create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now()
);

create table public.members (
  id uuid primary key default gen_random_uuid(),
  member_number text unique,
  full_name text not null check (char_length(full_name) between 2 and 120),
  normalized_name text not null check (char_length(normalized_name) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index members_normalized_name_idx on public.members (normalized_name);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger members_set_updated_at before update on public.members for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.members enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create policy "admins read their own profile" on public.profiles for select using (id = auth.uid());
create policy "admins manage member data" on public.members for all using (public.is_admin()) with check (public.is_admin());

-- Create the first Supabase Auth user in Authentication > Users, then run once:
-- insert into public.profiles (id, role) values ('AUTH_USER_UUID', 'admin') on conflict (id) do update set role = 'admin';
