---
name: UISAC
description: Northwestern International Student Advancement and Advocacy Project — a campus bulletin-board of advocacy, community, and practical help
colors:
  primary: "#4e2a84"
  primary-foreground: "#fffdf8"
  background: "#faf6ee"
  card: "#fffdf8"
  foreground: "#241b2e"
  secondary: "#f1e8d8"
  accent: "#f4eefa"
  accent-foreground: "#4e2a84"
  destructive: "#b0402a"
  destructive-foreground: "#fdece5"
  success: "#2c7a4b"
  success-bg: "#eaf5ee"
  sun: "#f6b93b"
  sun-foreground: "#3a2705"
  coral: "#ff7a5c"
  coral-foreground: "#3d1408"
  sky: "#4fb2c4"
  sky-foreground: "#062b30"
  border: "rgba(36, 27, 46, 0.14)"
  divider: "rgba(36, 27, 46, 0.12)"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5vw, 3.9rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.2
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.4rem"
    fontWeight: 800
    lineHeight: 1.35
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.5
rounded:
  sm: "14px"
  md: "20px"
  lg: "28px"
  xl: "40px"
  pill: "999px"
spacing:
  sm: "20px"
  md: "28px"
  lg: "36px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "#3f216d"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  nav-item-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  card-pillar:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    rounded: "28px"
    padding: "28px"
---

# Design System: UISAC

## Overview

**Creative North Star: "The Campus Bulletin Board"**

UISAC reads like a well-kept student-org flyer wall: warm cream paper, rounded sticker-shaped cards, and strips of washi tape pinning things in place, anchored throughout by Northwestern purple. The world is casual and hand-arranged rather than gridded and corporate — cards sit at a slight tilt as if pressed onto a board, icons are drawn as simple line marks rather than photographic or skeuomorphic, and color shows up as warm companion accents (sun, coral, sky) doing the job sticky-notes and marker highlights would do on a real board.

The bulletin-board device is now applied at full strength across all five Persuade/Read marketing pages: Home (hero photo frame plus four staggered, rotated, tape-pinned pillar cards with a pin-settle entrance animation), About (mission/vision cards, sponsor block), Tax Filing (tape-pinned disclaimer card, all four numbered steps carrying an alternating-rotation tape accent that cycles through the full warm/purple palette, rotated deadline/forms cards, a tape accent on the FAQ heading, and a rotated tape-pinned "More resources" card), Calendar (every event row carries a visible alternating ±1° rotation plus a tape accent cycling through sun/coral/sky), and Discussions (every question card carries a companion-colored tape accent plus a subtle alternating ±0.6° rotation — kept lighter than Home/Calendar's ±1–2° since these cards contain an inline expandable reply composer, and a stronger tilt would fight the reply form's readability once opened). Admin and Auth drop the motif completely by design: flat, unrotated, untaped cards on the same warm/purple palette, a deliberate Operate-mode restraint, not an inconsistency to fix.

**Key Characteristics:**
- Northwestern purple (#4e2a84) as the fixed, non-swappable anchor color across every surface
- Warm cream paper background (#faf6ee) with off-white card surfaces (#fffdf8), never stark white or dark
- Generously rounded geometry (14–40px radii, pill buttons/nav) — no sharp corners anywhere
- Washi-tape and slight-rotation "pinned to a board" motif, present across all five Persuade/Read pages (Home, About, Calendar, Tax Filing, Discussions — the last at a deliberately lighter ±0.6° given its inline reply composer); absent by design on Admin and Auth (Operate mode)
- lucide-react line icons (consistent ~2.25 stroke weight) as the sole icon system — no glyph/emoji icons, no bare colored-square placeholders

## Colors

The palette is warm-neutral paper plus one fixed purple anchor plus three warm companion accents used the way highlighter or sticky-note colors would be used on a real board.

### Primary
- **Northwestern Purple** (`#4e2a84`): the fixed brand anchor. Used on primary CTAs, active nav pills, section-banner backgrounds, icon chips, focus rings, and `::selection`. Never swapped for a token-driven alternative — it is a brand commitment, not a themeable value.

### Secondary
- **Warm Sand** (`#f1e8d8`): secondary/muted surfaces — the admin tab-switcher track, muted backgrounds, empty-state fills on Operate-mode pages.

### Tertiary — warm companions
- **Marigold Sun** (`#f6b93b`, foreground `#3a2705`): community-events accent (icon chip, tape strips, deadline badges).
- **Coral** (`#ff7a5c`, foreground `#3d1408`): tax-filing accent (icon chip, tape strips, error/destructive-adjacent warm accent).
- **Sky Teal** (`#4fb2c4`, foreground `#062b30`): discussions/Q&A accent (icon chip, tape strips, forms-card accent).

### Neutral
- **Warm Paper** (`#faf6ee`): the midpoint tone of the page background gradient (see Colors — Page Background Gradient below); the flat token remains defined but is no longer applied on its own.
- **Card Cream** (`#fffdf8`): card/popover/sidebar surface, one step lighter than the page background.
- **Ink Plum** (`#241b2e`): primary text color; never pure black.
- **Border/Divider** (`rgba(36,27,46,0.09–0.14)`): hairline borders and dividers, always a translucent tint of the ink color rather than a flat gray.
- **Destructive Clay** (`#b0402a` on `#fdece5`): errors and rejection states.
- **Success Green** (`#2c7a4b` on `#eaf5ee`): confirmation states.

### Named Rules
**The Fixed Anchor Rule.** Northwestern Purple (#4e2a84) is a brand commitment, not a swappable design token — it appears identically across every page and mode, light or dark accent variations aside.

**The One Warm Companion Per Surface Rule.** Each of the four homepage pillars (and the page it links to) claims exactly one warm companion color as its accent — sun for events, coral for tax filing, sky for Q&A, purple itself for advocacy. A page's tape, icon-chip background, and badge tints all draw from that same single companion; companions are not mixed within one card.

## Typography

**Display/Body Font:** Archivo (with system-ui, sans-serif fallback) — the single typeface for the entire product; there is no separate serif or mono display face.

**Character:** A geometric grotesque used at heavy weight for headlines and regular weight for body copy — confident and a little blunt, matching the hand-pinned-flyer casualness rather than an editorial or corporate register.

### Hierarchy
- **Display** (extrabold/800, `2.6–3.9rem` clamped, line-height ~1.05): hero H1s on Home, About, Calendar, Tax Filing — always set inline at this larger size, overriding the base `h1` tag rule.
- **Headline** (extrabold/800, `~2rem`, line-height 1.2): section headers ("Four ways UISAC supports you", "Filing in four steps").
- **Title** (extrabold/800, `1.4–1.75rem`, line-height 1.35): card and list-item titles (pillar card titles, event titles, FAQ questions).
- **Body** (normal/400, `15–17px`, line-height 1.5–1.6, `foreground/70–75` opacity): paragraph copy, capped informally around 52–75ch via `max-w` utilities.
- **Label** (bold/700, `13–15px`): nav items, buttons, badges, form labels — always bold, often on a pill background.

### Named Rules
**The Extrabold-Only Headline Rule.** Every headline-role heading in the built product uses weight 800 (extrabold); there is no medium-weight headline in practice, even though the base `h1`–`h4` tag rules in `globals.css` default to `--font-weight-medium` (500) — page components consistently override that base with `font-extrabold` inline.

## Layout

Content is centered in a `max-w-350` (about 1400px) outer container with `px-5`/`lg:px-8` gutters; narrower reading-focused pages (Tax Filing FAQ/resources, Auth) drop to `max-w-225`–`max-w-250`. Sections stack vertically with generous vertical rhythm (`py-14` to `py-24` between major sections). The homepage pillar grid and About's mission grid use CSS grid (`grid-cols-1` → `sm:grid-cols-2` → `lg:grid-cols-4` for pillars, `md:grid-cols-2` for two-up content), collapsing to a single column below `sm`/`md`. Card internal padding runs `p-5` to `p-10` depending on card size, with `gap-4` to `gap-14` between siblings. The nav is a sticky, blurred header (`sticky top-0 backdrop-blur`) rather than a fixed overlay.

## Elevation & Depth

The system is a hybrid: mostly flat, warm-tinted "stacked paper" shadows carry depth rather than hard drop shadows or heavy tonal layering. Two shadow tokens do all the work; there is no larger elevation scale.

### Shadow Vocabulary
- **Soft** (`--shadow-soft: 0 1px 2px rgba(78,42,132,0.06), 0 12px 28px -12px rgba(78,42,132,0.22)`): resting-state depth on cards, buttons, and pillar tiles.
- **Lift** (`--shadow-lift: 0 4px 8px rgba(78,42,132,0.08), 0 20px 40px -14px rgba(78,42,132,0.28)`): hover/active state on cards and primary CTAs, always paired with a small `-translate-y` nudge.

### Named Rules
**The Purple-Tinted Shadow Rule.** Both shadow tokens are tinted with the primary purple (`rgba(78,42,132,...)`), never neutral black — depth reads as warm, not as generic UI chrome.

## Shapes

Radius is large and consistent: `14px` (sm) for small controls, `20px` (md) for inputs, `28px` (lg) for standard cards, `40px` (xl) for hero-scale photo frames and CTA banners, and full pill (`999px`) for every button and nav item. Nothing in the shipped system uses a sharp (0px) corner. The signature recurring geometry is the **tape strip** (`.tape`, `1.6rem × 3.4rem`, `opacity 0.85`, a soft drop shadow, always rotated a few degrees and overlapping a card's top edge) plus **slight card rotation** (`-2deg` to `2deg` on pillar/mission/step/event cards, alternating sign per row via `i % 2`; Discussions dials this down to `±0.6deg` given its inline reply composer). Both now appear on every Persuade/Read page (Home, About, Tax Filing, Calendar, Discussions).

## Components

### Buttons
- **Shape:** full pill (`rounded-full`, 999px), no square or soft-rounded button anywhere.
- **Primary:** purple fill (`#4e2a84`) with cream text (`#fffdf8`), `px-8 py-4` on hero-scale CTAs down to `px-4.5 py-2.5` on nav pills; carries `--shadow-soft` at rest.
- **Hover/Focus:** background deepens to `#3f216d`, shadow upgrades to `--shadow-lift`, and the button nudges up (`-translate-y-0.5`); focus-visible adds a 2.5px purple outline with 2px offset and 4px corner rounding (defined globally, not per-component).
- **Secondary/Ghost:** transparent fill with a `2px` purple-tinted border (`border-[#4e2a84]/25`) and purple-tinted hover background (`hover:bg-[#4e2a84]/5`).

### Cards / Containers
- **Corner Style:** 28px (`rounded-[1.75rem]`) is the default card radius; larger feature cards (sponsor block, event empty-state, modals) go up to 32–40px.
- **Background:** cream (`#fffdf8`) for neutral/content cards; a companion-color tint (`#f4eefa` lavender, `#fef1de` sun-tint, `#fff0eb` coral-tint, `#eaf6f8` sky-tint) for pillar/feature cards that carry a specific accent role.
- **Shadow Strategy:** `--shadow-soft` at rest, `--shadow-lift` + `-translate-y` on hover, per Elevation & Depth.
- **Border:** none by default on tinted cards; a hairline `border-border` on flat neutral cards (sponsor logo block, calendar/admin empty states).
- **Internal Padding:** `p-5`–`p-6` for list-style cards (events, admin rows), `p-7`–`p-10` for feature/hero cards.
- **Icon chips:** every card-with-an-icon uses a 48px (`h-12 w-12`) rounded-2xl chip in the card's companion color, holding one lucide icon at 20–22px / stroke 2.25.

### Inputs / Fields
- **Style:** `rounded-2xl` (20px), `1.5px` border (`border-border`), cream input background, `px-4 py-3`, `15px` text.
- **Focus:** border shifts to purple (`#4e2a84`) with a `2px` purple ring at 25% opacity.

### Navigation
- Sticky, blurred header (`bg-card/90 backdrop-blur`) with a 2px divider border. Nav items are pill buttons (`rounded-full`): active item is solid purple fill with cream text; inactive items are `foreground/70` text with a faint purple hover wash (`hover:bg-[#4e2a84]/8`). Logo is a circular (`rounded-full`) 40px crop of `logo.jpg` in a purple-tinted ring. Mobile collapses to a hamburger-triggered dropdown using the same pill treatment stacked vertically.

### Tape & Pin-Settle (signature component)
`.tape` is a small rotated rectangle (washi-tape look) absolutely positioned over a card's top edge in one of the page's companion colors at 60–85% opacity; it has no independent hover/focus state — it's decorative pinning, not interactive. Tape now appears throughout Home, About, Tax Filing (disclaimer, each of the four steps via a `STEP_TAPE` color cycle, the FAQ heading, and the "More resources" card), Calendar (every event row via a `ROW_TAPE` color cycle), and Discussions (every question card via a `CARD_TAPE` color cycle, paired with a lighter `±0.6deg` rotation than the other pages'). `.pin-settle` is the one authored motion moment in the system: pillar/feature cards animate in with a translate + scale + hold-rotation "settling onto the board" curve (`cubic-bezier(0.16,1,0.3,1)`, 0.7s, staggered ~90ms per card), respecting `prefers-reduced-motion`; it remains specific to Home's pillar grid and hasn't been extended elsewhere. Admin and Auth carry neither tape nor rotation, by deliberate Operate-mode restraint.

### Scattered Photo Print (About hero)
A second, deliberately distinct photo treatment from the tape-pinned card: a small white-bordered "print" (`rounded-[10px]` — noticeably tighter than the card system's 20–40px radii, reading as a physical photograph rather than a UI card), `--shadow-lift` at rest, no tape. Four prints (one real photo, three labeled `PHOTO — …` placeholders on the established honest-placeholder pattern) are scattered with overlapping absolute positioning and mixed rotation (`-7deg` to `9deg`) inside a `relative` pile container on About's merged hero section, reading as loose photographs dropped on a surface rather than pinned to a board. On hover/focus a print rises to the top of the stack (`hover:z-40`, above every base z-index in the pile), scales to `1.06`, and its shadow deepens (`0 24px 48px -14px rgba(78,42,132,0.38)`) — the pile's one interactive affordance. Collapses to a simple `grid-cols-2` tilted grid below `md`.

## Colors — Page Background Gradient
The flat `--background` cream has been superseded: every page now sits on a shared `--gradient-page` token (`app/globals.css`, applied directly on `body`), a five-stop vertical wash from near-white cream at the top through the original `#faf6ee` tone at ~22% down to a richer warm sand/tan (`#e6d6b4`) by the bottom: `linear-gradient(to bottom, #fdfbf5 0%, #faf6ee 22%, #f6efdf 48%, #efe2c9 74%, #e6d6b4 100%)`. Because it's set on `body` with percentage stops, each page warms in proportion to its own scroll length — a short page (Admin, Auth) stays mostly in the lighter band, a long page (Home, Tax Filing) reaches the deeper tan by its footer. Stops are deliberately close in lightness so no band reads as a hard edge; this is the site's ambient tone now, not a decorative flourish scoped to one page. `--background` and `bg-background` remain defined as the flat fallback token but are no longer applied anywhere in the shipped product.

## Do's and Don'ts

### Do:
- **Do** keep Northwestern Purple (`#4e2a84`) as the fixed anchor on every surface, including the two calmer Operate-mode pages.
- **Do** use pill radius (999px) for every button and nav item, and the 14–40px radius scale for everything else — no sharp corners.
- **Do** tint shadows with purple (`rgba(78,42,132,...)`) rather than neutral black.
- **Do** pair one warm companion color (sun/coral/sky) per topic area (events/tax/Q&A) consistently across icon chip, tape, and badge tint within that surface.
- **Do** use lucide-react line icons at a consistent ~2.25 stroke weight; do not mix in glyph or emoji icons.
- **Do** keep Admin and Auth flat, unrotated, and tape-free — Operate-mode restraint is intentional, not an oversight to "fix" toward Home's density.
- **Do** apply the tape/rotation motif consistently across all Persuade/Read marketing pages (Home, About, Calendar, Tax Filing, Discussions) now that the density gap between them has been closed.
- **Do** keep scattered photo prints untaped and tighter-radius (`10px`) than the card system — they read as loose photographs, a deliberately different material from the pinned/tape-cornered cards.
- **Do** rely on the shared `--gradient-page` token (`body` background in `globals.css`) for every page's background rather than a per-page inline gradient; one token, one source of truth.

### Don't:
- **Don't** apply the tape/rotation bulletin-board motif inside Admin or Auth; those two surfaces are deliberately calmer tools, not marketing surfaces.
- **Don't** introduce a second display typeface or a monospace/serif face; Archivo is the only typeface in the shipped system.
- **Don't** use pure white or pure black; every neutral is a warm cream (`#faf6ee`/`#fffdf8`) or ink-plum (`#241b2e`) tint.
- **Don't** rotate Discussions' question cards as aggressively as Home/Calendar's ±1–2° — keep it at the documented ±0.6° so the inline reply composer stays comfortable to read and use once a card is expanded.
- **Don't** apply a flat `--background` cream anywhere; every page uses the shared `--gradient-page` token on `body` now — reintroducing a flat background on one page would break the site's now-consistent warming-as-you-scroll feel.
