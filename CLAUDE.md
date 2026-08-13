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
- Admin status (`lib/auth.ts` `ADMIN_EMAILS` / `isAdmin`) gates `/admin`. It has a SQL twin, `public.is_admin()` in `supabase/schema.sql`, used by RLS policies — **the email list must be updated in both places.**

### Database / RLS

- `supabase/schema.sql` and `supabase/002_discussions_and_domain_restriction.sql` are run manually in the Supabase SQL Editor (no migration tool) and are the source of truth for tables (`events`, `questions`, `replies`) and RLS policies. When changing access rules, update the `.sql` files and re-apply them in the dashboard — nothing applies these automatically.
- `events` has a `status` workflow (`pending` → `approved`/`rejected`) driven by `app/admin/page.tsx`; only approved events are publicly visible (`app/calendar/page.tsx`), enforced by RLS, not just UI filtering.
- Discussions upvoting (`increment_upvotes` RPC) is anonymous/login-free by design; dedup happens client-side via `localStorage` (see `discussions-client.tsx`), not server-side.

### Conventions

- Server Actions (`"use server"`, e.g. `app/discussions/actions.ts`) are the pattern for mutations that need `revalidatePath`; plain client-side `supabase.from(...)` calls (e.g. `app/calendar/submit-event-modal.tsx`, `app/admin/page.tsx`) are used where a full round-trip isn't needed. Follow whichever pattern the surrounding file already uses.
- Styling is Tailwind-first with a Northwestern purple accent (`#4e2a84`) hardcoded throughout rather than pulled from a token; `app/globals.css` defines the shared `foreground`/`card`/`border`/`divider` tokens used alongside it.
