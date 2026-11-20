# Customer health

A warm, dark dashboard for a customer success team: ARR at risk and other
KPIs between heavy rules, a beeswarm of every account on a 0–100 health axis
(circle size is ARR, colour runs orange to grey by score) with a draggable risk
threshold, and a sortable watchlist with 13-week sparklines and a detail
drawer. It ships with 160 seeded accounts, a light theme and six more pages:

- **Overview**: the KPIs, beeswarm and watchlist above, plus a heatmap of
  median health by signup quarter.
- **Accounts**: every account in a searchable, filterable table (segment,
  status, owner) with a column chooser and CSV export. Filters live in the URL.
- **Account detail** (`/accounts/:id`): 26-week health history, score factors,
  weekly-active-user bars against seats, contacts (loaded from the Worker, with
  loading and error states), the contract-year renewal timeline and a notes /
  activity log.
- **Renewals**: the next 90 days as weekly ARR columns or a calendar, coloured
  by health, with a by-month list.
- **Playbooks**: five risk playbooks that pick up accounts automatically, with
  steps, reassignable owners and a per-account checklist.
- **Settings**: health-score weights (sliders re-score every account live),
  the risk threshold and which segments are included.
- **Style guide** (`/styleguide`): the design system rendered live (see below).

A 4 / 8 / 13-week date-range control in the top bar changes every delta, the
sparklines' highlighted window and the heatmap. Press `?` for keyboard
shortcuts; actions confirm with toasts.

## Run it

```sh
bun install
bun run dev        # http://localhost:5187 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/customer_health/index.js (Worker)
```

## Edit it

- `src/data.ts` holds the `Account` type, the copy and the seeded generator
  (deterministic, 160 accounts, $26.6M ARR). Replace `accounts` with your own
  `Account[]` and everything else follows. The in-app "Template guide" walks
  through it.
- `src/lib/metrics.ts` defines every number: ARR at risk, accounts at risk,
  median health, renewals in 90 days, drawdown (points below the 13-week
  peak), runway (weeks to the threshold at the two-week slope), WoW and the
  watchlist rule (under the threshold, or 15+ points off peak).
- `src/pages/*` are the routes; `src/lib/router.ts` is a 60-line History API
  router (`usePath`, `navigate`, `<Link>`). `src/app/*` are the pieces the pages
  share: `TopNav`, `Header`, `KpiStrip`, `HealthSwarm`, `Watchlist`,
  `CohortHeatmap`, `AccountDrawer`, `RenewalTimeline`, `ShortcutsHelp`,
  `TemplateGuide`, and `columns.tsx` (every account column, shared by the
  watchlist and the Accounts table).
- `src/lib/store.tsx` holds app state in one context and persists what people
  change to localStorage (`customer-health:*`): settings, range, logged
  touches, notes, checklist state, owners and columns.
- `src/lib/scoring.ts`: the score is a weighted blend of five factors
  (`FACTORS` in `src/data.ts`). Each account stores its factor offsets, centred
  so the default weights reproduce the seeded history exactly.
- `src/components/*` are the design system: `Pill` (outline, solid, ghost,
  danger; sm / md; loading) and `pillClass()` for links, `TextTabs` (text or
  caps), `Field` (`TextInput`, `TextArea`, `Select`, `Checkbox`, `Switch`,
  `Slider`), `DataTable` (sortable, animated rows), `Panel`, `PageHeader`,
  `Kpi`, `Stat`, `StatusTag`, `SegmentTag`, `HealthDot`, `Avatar`, `Kbd`,
  `Progress`, `Sparkline`, `WeeklyChart` (line or bars, hover and arrow-key
  readout), `Overlay` (modal / drawer, focus trap), `Popover`, `Toast`,
  `EmptyState`, `Skeleton`, `Spinner` and `Link`.
- **Style guide**: open `/styleguide` (also linked in the footer). It reads
  the colour tokens from the CSS at runtime and renders every component with
  its variants and states in both themes. Forced states use
  `data-force="hover | focus | active"` (custom variants in `src/styles.css`).
- `src/lib/beeswarm.ts` packs circles without a force simulation: largest
  first, each at the free y nearest the lane centre. The chart shrinks every
  radius together until all lanes fit, so it works at any width.
- `src/styles.css` holds the tokens. Raw colours live on `:root` (dark) and
  `[data-theme='light']`; `@theme inline` maps them to Tailwind utilities
  (`bg-bg`, `bg-panel`, `text-muted`, `border-rule`, `text-risk`, ...). The
  health scale is `--risk` → `--mid` → `--high`, mixed in CSS
  (`src/lib/healthColor.ts`), so the chart follows the theme. Fonts are
  Newsreader (titles), IBM Plex Mono (numbers, caps labels) and Inter.
- `src/worker/index.ts` is the Cloudflare Worker. `GET /api/accounts`
  (`?segment=` optional, 400 if unknown) and `GET /api/accounts/:id/contacts`
  (400 malformed id, 404 unknown) serve the seeded data; point them at your
  warehouse, CRM or a D1 table.

## Interactions

- Drag the risk threshold line (or focus it and use the arrow keys, Shift for
  steps of 5); the KPIs, runway and watchlist recompute.
- Combined / By segment splits the swarm into lanes; the segment filter
  re-packs it. Circles glide to their new positions.
- Hover a circle for a tooltip; click a circle or a row for the drawer, where
  "Log touch" updates the account and "Copy summary" copies a plain-text
  brief.
- Sort the watchlist by any column; rows animate into place.
- Keyboard: `g` then `o / a / r / p / s` to switch pages, `/` to search
  accounts, `1 / 2 / 3` for the date range, `t` for the theme, `?` for help.
- The theme toggle swaps every token with a short cross-fade and is
  remembered. All motion respects `prefers-reduced-motion`.

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy
it with the `sites_deploy` tool (or the Sites API) from this directory.
