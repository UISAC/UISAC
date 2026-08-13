# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

International students at Northwestern University, most on F-1/J-1 visas, navigating the transition to a new country and campus. Access is restricted to `@u.northwestern.edu` accounts (Google OAuth), so the primary user is a verified Northwestern-affiliated international student looking for community, practical guidance, and an advocacy channel to the university.

## Product Purpose

UISAC (the Northwestern International Student Advancement and Advocacy Project) is a resource hub and advocacy organization for international students. It connects students to community events, plain-language U.S. tax filing guidance, an anonymous peer Q&A, and channels student concerns directly to university administration.

## Positioning

A Northwestern-recognized student organization (RSO) — distinct from, and not a replacement for, the university's official International Office. UISAC's differentiator is that it advocates directly to administration on students' behalf, rather than only dispensing information.

## Operating Context

- Community events are user-submitted, then reviewed by admins through a `pending` → `approved`/`rejected` workflow (`app/admin/page.tsx`); only `approved` events are publicly visible, enforced by Supabase RLS, not just UI filtering.
- Discussions are anonymous by design: no login required to ask or read, upvoting dedup happens client-side via `localStorage`, not server-side.
- Sign-in is Google OAuth through Supabase, restricted to the `@u.northwestern.edu` domain, enforced both server-side (Supabase Auth Hook) and client-side (defense-in-depth for pre-existing accounts).
- Admin/moderation access currently gates on a single hardcoded email in `lib/auth.ts` (`ADMIN_EMAILS`); this is a placeholder for a small officer board, not the intended steady state.

## Capabilities and Constraints

- Events: submission requires sign-in; approval workflow is admin-only; rejected/pending events are not publicly queryable.
- Discussions: anonymous Q&A and replies, no auth required to participate; abuse/spam moderation has no server-side mechanism yet beyond RLS scoping.
- Tax filing content is explicitly informational only — UISAC states it is not a tax or legal professional and directs students to consult qualified advisors. Guidance must stay accurate to nonresident-alien filing basics (Form 8843, Form 1040-NR, F-1/J-1 5-year rule) and not drift into confident tax advice.
- Admin allowlist (`ADMIN_EMAILS` in `lib/auth.ts`, mirrored by `public.is_admin()` in `supabase/schema.sql`) needs to grow from one founder email to a small board of named officers — open implementation step, not yet built.
- No dedicated backend beyond Supabase (Postgres + Auth); all mutations are Server Actions or direct client `supabase.from(...)` calls, no separate API layer.

## Brand Commitments

- Name: UISAC (Northwestern International Student Advancement and Advocacy Project).
- Northwestern purple (`#4e2a84`) as the fixed accent color, used throughout rather than as a swappable token.
- Real assets on hand: `logo.jpg` (site logo) and `about.jpg` (About page photo) — treat as real, not placeholder.
- Sponsor: the Buffett Institute for Global Affairs, named and thanked on the About page — a real, confirmed relationship.
- Founding facts stated on About: founded 2025, student-led, team drawn from 30+ countries.

## Evidence on Hand

Real and confirmed: org name/description, `logo.jpg`, `about.jpg`, the Buffett Institute sponsorship, the founding-year and "30+ countries" team facts.

Placeholder — must not be read as real content or extended as if it were:
- Home page hero image is a labeled placeholder box ("PHOTO — students at fall orientation"), not a real photo.
- Calendar events, when present, are example/seed data, not live community submissions.
- Discussion questions/replies are example content.
- Tax-filing "More resources" links (`href="#"`) are unfilled placeholders.

Future work must not fabricate testimonials, usage stats, additional sponsors, or specific event/question content beyond what's listed above as real.

## Product Principles

1. Advocacy first — UISAC represents students to administration; it is not just an information clearinghouse.
2. Domain-gated trust — every feature (auth, event submission, admin) enforces the `@u.northwestern.edu` boundary so the community stays verified peers.
3. Anonymity where it matters — sensitive questions (visa, academic, personal) get a genuinely low-friction, judgment-free channel with no sign-in required.
4. Practical over exhaustive — guidance (tax filing) stays plain-language and scoped, with explicit disclaimers rather than implied expertise.
5. Volunteer-run, board-scaled — moderation/admin capacity is scaling from one founder to a small officer board, not a full ops team; workflows should stay usable at that scale.

## Accessibility & Inclusion

Serves students from 30+ countries, many encountering U.S. bureaucracy (visas, taxes, university admin processes) and English-language academic/administrative contexts for the first time. No formal accessibility standard has been specified yet.
