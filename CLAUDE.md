# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the dev server (Next.js App Router, Turbopack)
- `npm run build` — production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`)
- `npx tsc --noEmit` — type-check (no dedicated `typecheck` script exists)

There is no test suite configured in this repo.

## Architecture

Next.js 16 (App Router) + React 19 + Tailwind 4, backed entirely by Supabase (Postgres + Auth). No other backend exists — all data access goes through `@supabase/supabase-js`, either directly from client components or via Server Actions.

### Auth

- `lib/supabase.ts` exports a browser `supabase` client and `createSupabaseClient(accessToken?)`. **Server Actions have no access to the browser session**, so any server-side Supabase call that must run as the signed-in user needs the caller to pass `session.access_token` explicitly (see `app/discussions/actions.ts`) — otherwise the query runs as `anon` and gets blocked by RLS.
- `app/components/auth-provider.tsx` wraps the app in a `useAuth()` context (`user`, `session`, `isAdminUser`, `loading`, `authError`). Sign-in is Google OAuth through Supabase, restricted to `@u.northwestern.edu`.
- Domain restriction is enforced in two places that must be kept in sync: the Supabase Auth Hook `hook_restrict_signup_by_email_domain` (blocks signup server-side) and a client-side check in `auth-provider.tsx` (`isNorthwestern`, defense-in-depth for accounts that predate the hook).
- Admin status (`lib/auth.ts` `ADMIN_EMAILS` / `isAdmin`) gates `/admin`. It has a SQL twin, `public.is_admin()` in `supabase/schema.sql`, used by RLS policies. The email list lives in **three** places — those two files *and the deployed function* — and editing the files changes nothing until the SQL is re-run in the dashboard. An admin present in `lib/auth.ts` but missing from the live function gets the entire `/admin` UI while every write is refused by RLS, and because that account can still `select` its own submissions the Pending tab looks populated rather than empty. This happened once (see `supabase/006_sync_admin_list.sql`); adding an admin is not finished until the function has been re-run.

### Database / RLS

- `supabase/schema.sql` and `supabase/002_discussions_and_domain_restriction.sql` are run manually in the Supabase SQL Editor (no migration tool) and are the source of truth for tables (`events`, `questions`, `replies`) and RLS policies. When changing access rules, update the `.sql` files and re-apply them in the dashboard — nothing applies these automatically.
- `events` has a `status` workflow (`pending` → `approved`/`rejected`) driven by `app/admin/page.tsx`; only approved events are publicly visible (`app/calendar/page.tsx`), enforced by RLS, not just UI filtering.
- Event owners can edit and delete their own events; admins can do either to any event. The owner update policy's `with check` requires `status = 'pending'`, so **an owner's edit always sends the event back for review** and an owner can never approve their own — the modal passes `status: "pending"` to match. Deleting an event also removes its banner file (`deleteEvent` in `app/calendar/actions.ts`).
- **Privileges on `events` are column-scoped** for `SELECT`, `INSERT` and `UPDATE` alike (see 005/007). That is what stops an owner reassigning `user_id`, but it also means **a newly added column is invisible to the API and unwritable until granted by name** — and without the `SELECT` grant, `select("*")` starts failing for everyone. `supabase/007_event_link_and_past_lock.sql` is the worked example.
- **Owners cannot edit an event once its date has passed** (`event_date >= (now() at time zone 'America/Chicago')::date` in both `using` and `with check`, so an event also cannot be edited *into* the past). Admins are exempt via the separate policy. Deleting a past event is still allowed. The cutoff uses America/Chicago rather than `current_date` so it flips at local midnight, matching `isPastEvent()` in `app/calendar/types.ts`; UTC would lock events out several hours early each evening. `calendar-client.tsx` mirrors this by showing "Past · locked" instead of the Edit button.
- **Testing an RLS policy as an admin proves nothing.** Permissive policies are OR'd, so the "Admins can edit any event" policy makes any admin pass every owner-side check. Impersonate a *non-admin* account (`isac@u.northwestern.edu` is one) when verifying owner restrictions.
- Discussions record an author (`user_id`, defaulting to `auth.uid()`) so people can edit/delete their own posts, but `SELECT` on that column is revoked and re-granted per column, so the API never returns it and **`select("*")` on `questions`/`replies` now fails** — list columns explicitly (see `app/discussions/actions.ts`). `UPDATE` is granted only on `(text, edited_at)`, which is what stops an author inflating their own `upvotes` or reassigning `user_id`; the row-level policy alone would permit both. Ownership reaches the client through the `my_discussion_ids()` security-definer RPC. Admins can delete any post via `public.is_admin()`. Rows predating this have a null `user_id` and are owned by nobody. **Authors may only edit within 5 minutes of posting** (`now() - created_at < interval '5 minutes'` in the policy); admins are exempt. Deleting is not time-limited. The client mirrors the window with a 15s ticker so the Edit control disappears rather than failing on save.
- Discussions upvoting (`increment_upvotes` RPC) requires a signed-in user: the function raises if `auth.uid()` is null and `EXECUTE` is granted to `authenticated` only (revoked from `anon`), so callers must pass `session.access_token` through `adjustUpvote`. Repeat-vote dedup is still per-browser `localStorage` (see `discussions-client.tsx`), not server-side, so the same user can vote again from another browser.

### Calendar views

- `/calendar` has a List/Calendar toggle. The calendar view (`app/calendar/calendar-month-view.tsx`) renders the current and next month with **FullCalendar v6** (`@fullcalendar/react` + `daygrid`). It is loaded through `next/dynamic` because it is a large dependency and List is the default.
- Pin FullCalendar to the **v6** line. v7 looks newer but is half-published: `@fullcalendar/core` is stable at 7.x while `daygrid`/`multimonth` stop at a `7.0.0-rc.0` from Feb 2025, and v7 core pulls in `temporal-polyfill`. v6.1.21 declares React 19 support and is current.
- FullCalendar injects its own CSS; the `.fc-uisac` block at the end of `app/globals.css` is what pulls it back into the site's palette. Styles are scoped to that class.
- `EventCard` (`app/calendar/event-card.tsx`) is shared by the list and the calendar's detail pane. Cards are a **fixed height** (`sm:h-52`) with the description clamped (`line-clamp-2`), so long copy is truncated rather than resizing the card.

### Conventions

- Server Actions (`"use server"`, e.g. `app/discussions/actions.ts`) are the pattern for mutations that need `revalidatePath`; plain client-side `supabase.from(...)` calls (e.g. `app/calendar/submit-event-modal.tsx`, `app/admin/page.tsx`) are used where a full round-trip isn't needed. Follow whichever pattern the surrounding file already uses.
- Styling is Tailwind-first with a Northwestern purple accent (`#4e2a84`) hardcoded throughout rather than pulled from a token; `app/globals.css` defines the shared `foreground`/`card`/`border`/`divider` tokens used alongside it.
