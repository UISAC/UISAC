-- Run once in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Sets up the events table, RLS, and the admin gate backing:
--   app/auth/page.tsx, app/calendar/submit-event-modal.tsx, app/admin/page.tsx
--
-- IMPORTANT: keep the email list in is_admin() below in sync with
-- ADMIN_EMAILS in lib/auth.ts. Two places, must match manually.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  copy text not null,
  month text not null,
  day text not null,
  time text not null,
  place text not null,
  type text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  user_id uuid references auth.users(id),
  user_email text,
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select (auth.jwt() ->> 'email') in (
    'harutsargsyan2027@u.northwestern.edu'
  );
$$;

create policy "Public can view approved events"
  on public.events for select
  using (status = 'approved');

create policy "Users can view their own submissions"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Admins can view all events"
  on public.events for select
  using (public.is_admin());

create policy "Authenticated users can submit pending events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

create policy "Admins can update event status"
  on public.events for update
  using (public.is_admin())
  with check (public.is_admin());
