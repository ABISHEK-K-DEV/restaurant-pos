# Design System — "Swiss"

Restaurant POS follows the **International Typographic Style** (Swiss
design): a strict grid, one neo-grotesk type family, hairline rules instead
of drop shadows, near-monochrome ink on paper, and a single signal-red
accent. The bar is the calm precision of Swiss/European product software —
Stripe, Linear, Vercel, and the posters of Müller-Brockmann — not a "POS
with rounded corners." A screen that looks like a generic admin template is
not done.

The tokens live in `apps/web/app/globals.css`; components consume them
through Tailwind (`bg-primary`, `text-brand`, `border-border`…). Never
hard-code a hex value in a component when a token exists.

## Principles

1. **Ink does the work, red signals.** Primary actions are ink (black in
   light mode, paper in dark). The red is reserved for *live / active /
   now / brand*: the active nav bar, the live dot, "needs attention", the
   full stop after a headline. If more than one or two red things are on
   screen, one of them is wrong.
2. **Rules, not shadows.** Cards are flat with a 1px hairline. Elevation is
   only for things that float: menus, dialogs, popovers (`--shadow-pop`).
3. **Type is the hierarchy.** Big, tight display headings; small mono
   eyebrows (`.eyebrow`) for labels, table heads and KPI captions; numbers
   in tabular figures. Avoid coloured icon chips to signal hierarchy.
4. **Number things.** Sections, nav items and feature lists carry a running
   index (`01`, `02`…) in mono — it gives the grid a rhythm.
5. **Crisp corners.** `--radius: 0.375rem`. Pills are for avatars and
   status dots only.

## Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#F5F5F2` paper | `#0B0B0B` | page |
| `--card` | `#FFFFFF` | `#121212` | surfaces |
| `--foreground` | `#0A0A0A` ink | `#F2F2EF` | text |
| `--muted-foreground` | `#5E5E5A` | `#9A9A95` | secondary text |
| `--border` | `#E2E2DD` | `#242424` | hairlines |
| `--primary` | `#0A0A0A` | `#F2F2EF` | primary buttons, occupied tables, hero KPI |
| `--brand` | `#E3000F` | `#FF3B30` | signal red — see principle 1 |
| `--success` | `#0E7A43` | `#3DD68C` | paid, available, ready |
| `--warning` | `#B45F06` | `#F5A524` | pending, reserved, low stock |
| `--destructive` | `#B4121B` | `#FF6B61` | delete, reject |
| `--sidebar` | `#0A0A0A` | `#050505` | the ink column (both themes) |

The sidebar is dark in both themes on purpose: it is the one large dark
mass that anchors the layout. The customer kiosk (`.kiosk-root`) always
uses the light palette, and its primary call-to-action is the brand red
(customers, not staff).

Charts: `--chart-1` red, `--chart-2` ink, `--chart-3` grey, `--chart-4`
blue, `--chart-5` ochre. Revenue is drawn in ink, costs/waste in red.

## Typography

- **Inter** for text, **Inter Tight** for display sizes (`font-display`,
  `font-heading`), **JetBrains Mono** for eyebrows, indices, order numbers
  and figures (`font-mono`). Loaded with `next/font` in `app/layout.tsx`.
- Base size 14px. Headings use negative tracking (`-0.022em`, page titles
  `-0.032em`, display `-0.04em`).

| Role | Style |
|---|---|
| Display (landing, auth) | 64–96px, Inter Tight semibold, `tracking-[-0.045em]`, leading 0.92–0.95 |
| Page title (`main h1`) | 34px → 40px (sm), semibold |
| Section title | 36px → 52px on marketing; card titles 15px semibold |
| Eyebrow (`.eyebrow`) | 10.5px JetBrains Mono, uppercase, `0.12em` tracking |
| KPI figure | Inter Tight semibold, tabular, 24–60px |
| Body | 14px Inter, muted for secondary copy |

## Layout

- **App shell** (`components/layout/app-shell.tsx`): ink sidebar
  (252px, collapses to a 68px icon rail, preference stored per device),
  sticky top bar with *group / page* breadcrumb, `⌘K` search, live clock,
  language, notifications and user menu. Content max-width 1600px.
- **Sidebar sections**: Service · Kitchen & stock · Guests & team ·
  Business (`NAV_GROUPS` in `nav-items.ts`). Active item = 2px red bar +
  lighter background.
- **Command palette** (`command-palette.tsx`): `⌘K` / `Ctrl K` from any
  screen; jumps to every page the role can open, plus global actions.
- Below `lg` the sidebar becomes a drawer and a bottom tab bar takes over —
  verify at ~375px / ~768px / desktop before calling a layout done.
- Marketing pages use a 12-column grid: titles on 8 columns, supporting
  copy on 4, every section opened by a full-width rule with its index
  (`SectionHeader`).

## Components

- **Button**: `default` (ink), `brand` (red — use sparingly), `outline`
  (white field, hairline), `secondary`, `ghost`, `destructive`, `link`.
  A `render={<Link/>}` button is automatically marked non-native.
- **Card**: 6px radius, 1px `ring-border`, no shadow, 20px padding.
- **Badge**: 3px radius, 11px; `brand` variant for "new"/"live".
- **Inputs**: white field on paper, hairline border, ink border on focus.
- **Tables**: mono uppercase heads, tabular numbers.
- **Status colors on floor plans**: available = white tile with green
  rule, occupied = solid ink tile, reserved = dashed ochre, cleaning = muted.
- **Utilities**: `.eyebrow`, `.swiss-grid` (48px grid paper),
  `.animate-rise`, `--ease-swiss` (`cubic-bezier(0.2, 0, 0, 1)`).

## Motion

Short and purposeful (150–200ms, `--ease-swiss`): colour/border on hover,
a 2px lift on tappable tiles, headline lines that slide up once on the
landing page. Only "live" indicators move on their own. Everything honours
`prefers-reduced-motion`.

## Accessibility

WCAG AA minimum. Measured: ink on paper 18.1:1; muted text `#5E5E5A` on
paper 6.0:1 (6.5:1 on white cards); dark-mode muted 7.0:1; white on the
signal red 4.9:1; success and warning text on white 5.4:1 and 4.6:1. Keyboard-navigable everywhere (POS and KDS especially), visible
2px red focus outlines, screen-reader labels on icon-only buttons, 44px
touch targets on coarse pointers (48px on the kiosk).

## Surface-specific notes

- **POS order screen:** built for speed — large touch targets, fast search,
  minimal clicks. It trades some of the spacious aesthetic for density on
  purpose.
- **KDS:** read from 2–3 metres away in a kitchen, so type size floors are
  higher than the rest of the app; timers and status colours stay visible.
- **Reservation calendar:** timeline view, colour-coded by status/table.
