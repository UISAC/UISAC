-- Run once in the Supabase SQL Editor, after supabase/schema.sql.
-- Adds: northwestern.edu domain restriction (RLS layer) + full discussions
-- schema (questions/replies), which did not exist before.
--
-- After running this file, also register the Auth Hook manually:
--   Dashboard -> Authentication -> Hooks -> Before User Created
--   -> Postgres Function -> public.hook_restrict_signup_by_email_domain
-- That hook is the real block (rejects signup at creation time). The RLS
-- checks below are defense-in-depth for any account that already exists.

-- ─── Domain restriction ─────────────────────────────────────────────────────

create or replace function public.is_northwestern()
returns boolean
language sql
stable
security definer
as $$
  select (auth.jwt() ->> 'email') ilike '%@u.northwestern.edu';
$$;

create or replace function public.hook_restrict_signup_by_email_domain(event jsonb)
returns jsonb
language plpgsql
as $$
declare
  email text;
begin
  email := event->'user'->>'email';

  if email is null or email !~* '^[^@]+@u\.northwestern\.edu$' then
    return jsonb_build_object(
      'error', jsonb_build_object(
        'message', 'Only Northwestern University (@u.northwestern.edu) accounts are allowed.',
        'http_code', 403
      )
    );
  end if;

  return '{}'::jsonb;
end;
$$;

grant execute on function public.hook_restrict_signup_by_email_domain to supabase_auth_admin;
revoke execute on function public.hook_restrict_signup_by_email_domain from authenticated, anon, public;

-- Defense-in-depth: require northwestern domain on event submission too,
-- on top of the existing auth.uid() = user_id check.
-- TEMPORARILY DISABLED: the "and public.is_northwestern()" clause is dropped
-- below while sign-in is open to any Google account. Restore it (and the two
-- discussions policies further down) once the Northwestern-only gate is back.
drop policy if exists "Authenticated users can submit pending events" on public.events;

create policy "Authenticated users can submit pending events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

-- ─── Discussions schema (new) ───────────────────────────────────────────────

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  upvotes int not null default 0,
  created_at timestamptz not null default now()
);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  text text not null,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.replies enable row level security;

create policy "Public can read questions"
  on public.questions for select
  using (true);

create policy "Public can read replies"
  on public.replies for select
  using (true);

-- TEMPORARILY DISABLED: public.is_northwestern() check dropped from both
-- policies below while sign-in is open to any Google account.
drop policy if exists "Northwestern users can ask questions" on public.questions;

create policy "Northwestern users can ask questions"
  on public.questions for insert
  to authenticated
  with check (true);

drop policy if exists "Northwestern users can reply" on public.replies;

create policy "Northwestern users can reply"
  on public.replies for insert
  to authenticated
  with check (true);

-- security definer so upvoting stays anonymous/login-free, matching the
-- existing localStorage-dedup design in discussions-client.tsx.
create or replace function public.increment_upvotes(question_id uuid, delta int)
returns void
language sql
security definer
set search_path = public
as $$
  update public.questions
  set upvotes = greatest(0, upvotes + delta)
  where id = question_id;
$$;

grant execute on function public.increment_upvotes to anon, authenticated;
