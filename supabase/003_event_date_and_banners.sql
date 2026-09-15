-- Run in the Supabase SQL Editor after 002.
-- Replaces the year-less month/day text pair with a real date so events can be
-- sorted chronologically and past ones identified, and adds banner uploads.

alter table public.events add column if not exists event_date date;
alter table public.events add column if not exists banner_url text;
update public.events set event_date = current_date where event_date is null;
alter table public.events alter column event_date set not null;
alter table public.events drop column if exists month;
alter table public.events drop column if exists day;

-- ─── Event banner storage ───────────────────────────────────────────────────
-- Public read so approved banners render for anyone; uploads restricted to
-- signed-in Northwestern accounts. The size cap and MIME allowlist are
-- enforced by storage itself, not just the upload form.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-banners',
  'event-banners',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view event banners" on storage.objects;
create policy "Public can view event banners"
  on storage.objects for select
  using (bucket_id = 'event-banners');

drop policy if exists "Northwestern users can upload event banners" on storage.objects;
create policy "Northwestern users can upload event banners"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-banners' and public.is_northwestern());

-- Without a delete policy nobody, not even an admin, can remove a banner, so
-- rejected or deleted events would leave orphaned files in the bucket.
drop policy if exists "Owners and admins can delete event banners" on storage.objects;
create policy "Owners and admins can delete event banners"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'event-banners'
    and (owner = auth.uid() or public.is_admin())
  );
