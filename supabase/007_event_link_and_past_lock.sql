-- Run in the Supabase SQL Editor after 006.
-- Two changes: events gain an optional related link, and owners lose the
-- ability to edit an event once it is in the past.

-- ─── Optional related link ─────────────────────────────────────────────────
alter table public.events add column if not exists link text;

-- Privileges on this table are column-scoped (see 005), so a new column is
-- invisible to the API and unwritable until it is granted by name. Without
-- the select grant, `select("*")` would start failing for everyone.
grant select (link) on public.events to anon, authenticated;
grant insert (link), update (link) on public.events to authenticated;

-- ─── Owners cannot edit an event that has already happened ─────────────────
-- Editing is for fixing an event people have not attended yet. Once the date
-- has passed the listing is a record, so only admins may still touch it (the
-- separate "Admins can edit any event" policy is unchanged).
--
-- The cutoff is evaluated in America/Chicago rather than UTC so it flips at
-- local midnight, matching isPastEvent() in app/calendar/types.ts. Using
-- current_date here would lock events out several hours early each evening.
drop policy if exists "Owners can edit their own events" on public.events;
create policy "Owners can edit their own events"
  on public.events for update
  to authenticated
  using (
    user_id = auth.uid()
    and event_date >= (now() at time zone 'America/Chicago')::date
  )
  with check (
    user_id = auth.uid()
    and status = 'pending'
    and event_date >= (now() at time zone 'America/Chicago')::date
  );

-- Deleting is deliberately left alone: someone may still want to withdraw a
-- past event they posted.
