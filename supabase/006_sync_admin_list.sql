-- Run in the Supabase SQL Editor after 005.
--
-- Commit 99c6257 added sofiasaega2029@u.northwestern.edu to ADMIN_EMAILS in
-- lib/auth.ts and to is_admin() in schema.sql, but schema.sql was never
-- re-applied, so the live function still listed one address. The effect was
-- that she got the whole /admin UI (the client gate passed) while every write
-- was refused by RLS with "new row violates row-level security policy" -- an
-- error app/admin/page.tsx discarded, so Approve silently did nothing.
--
-- This restates is_admin() so the database matches the two code copies.
-- Keep all three in sync: lib/auth.ts, supabase/schema.sql, and the live
-- function -- adding an admin is not done until this has been run here.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select (auth.jwt() ->> 'email') in (
    'harutsargsyan2027@u.northwestern.edu',
    'sofiasaega2029@u.northwestern.edu'
  );
$$;
