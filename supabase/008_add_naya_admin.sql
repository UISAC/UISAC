-- Run in the Supabase SQL Editor after 007.
-- Adds nayayazigi2028@u.northwestern.edu as an admin.
--
-- Keep all three copies in sync: ADMIN_EMAILS in lib/auth.ts, is_admin() in
-- supabase/schema.sql, and the deployed function below. Editing the files
-- alone grants nothing -- see 006 for what that failure looks like.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select (auth.jwt() ->> 'email') in (
    'harutsargsyan2027@u.northwestern.edu',
    'sofiasaega2029@u.northwestern.edu',
    'nayayazigi2028@u.northwestern.edu'
  );
$$;
