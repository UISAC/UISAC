-- Run in the Supabase SQL Editor after 004.
-- Two changes: discussion edits become time-limited, and event owners gain
-- edit/delete rights alongside admins.

-- ─── Discussions: owners may fix mistakes for 5 minutes, admins anytime ─────
-- The window is meant for typos, not for rewriting a post other people have
-- already replied to. Enforced here, not just in the UI.

drop policy if exists "Authors can edit their own questions" on public.questions;
drop policy if exists "Authors edit for 5 minutes, admins anytime" on public.questions;
create policy "Authors edit for 5 minutes, admins anytime"
  on public.questions for update
  to authenticated
  using (
    (user_id = auth.uid() and now() - created_at < interval '5 minutes')
    or public.is_admin()
  )
  with check (
    (user_id = auth.uid() and now() - created_at < interval '5 minutes')
    or public.is_admin()
  );

drop policy if exists "Authors can edit their own replies" on public.replies;
drop policy if exists "Authors edit for 5 minutes, admins anytime" on public.replies;
create policy "Authors edit for 5 minutes, admins anytime"
  on public.replies for update
  to authenticated
  using (
    (user_id = auth.uid() and now() - created_at < interval '5 minutes')
    or public.is_admin()
  )
  with check (
    (user_id = auth.uid() and now() - created_at < interval '5 minutes')
    or public.is_admin()
  );

-- Deleting stays open to the author indefinitely: someone who regrets asking
-- something personal should be able to withdraw it at any point.

-- ─── Events: owners may edit and delete their own ───────────────────────────

-- UPDATE was granted on every column, which was harmless while only admins had
-- an update policy. Owners are about to get one, so scope it: without this an
-- owner could reassign user_id or approve their own event.
revoke update on public.events from anon, authenticated;
grant update (title, copy, event_date, time, place, type, banner_url, status)
  on public.events to authenticated;

drop policy if exists "Owners can edit their own events" on public.events;
create policy "Owners can edit their own events"
  on public.events for update
  to authenticated
  using (user_id = auth.uid())
  -- Forcing the result to 'pending' is what sends an edited event back for
  -- review, and simultaneously stops an owner approving their own event.
  -- Without it, someone could get a bland event approved and then rewrite it.
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "Admins can update event status" on public.events;
drop policy if exists "Admins can edit any event" on public.events;
create policy "Admins can edit any event"
  on public.events for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Events had no delete policy at all, so nothing could ever be removed.
drop policy if exists "Owners and admins can delete events" on public.events;
create policy "Owners and admins can delete events"
  on public.events for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());
