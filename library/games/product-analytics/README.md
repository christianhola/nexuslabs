# Product analytics

A marketing site for a product analytics SaaS ("Pulseboard"): a painted
meadow hero with a **live product mock** standing in the grass (the near hills
pass in front of it), then signals, proof numbers, setup steps, a testimonial,
integrations, pricing, FAQ and a closing call to action. Inner pages cover
features, pricing, docs, changelog, status, a sales contact form, sign up and
log in, a 404 and a live [style guide](#style-guide). All copy and seed data
live in one file.

## Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | The landing page (`Home.tsx` stacks `src/sections/*`) |
| `/features` | Funnels, Retention, Journeys and Signals, each with a working demo (segment switch, step select, cohort grid, path filter, alert-rule builder saved in the browser) |
| `/pricing` | Plans with a monthly/yearly switch, an event-volume cost calculator (`#calculator`), a comparison table (`#compare`) and FAQ |
| `/docs`, `/docs/:slug` | Docs home with search; articles with sidebar, on-this-page links, copyable code, "was this helpful" and previous/next |
| `/changelog` | Release timeline with a tag filter and email subscribe |
| `/status` | Live report from `/api/status`: loading skeleton, error with retry (`/status?fail=1`), 90-day uptime bars, incidents |
| `/contact` | "Talk to us" form posting to `/api/contact` (`?topic=pricing` preselects the topic) |
| `/signup`, `/login` | Demo accounts kept in this browser (password stored as a SHA-256 hash), strength meter, show/hide, wrong-password and forgot-password states |
| `/styleguide` | The living style guide |
| anything else | 404 |

## Run it

```sh
bun install
bun run dev        # http://localhost:5328 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/product_analytics/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, price, doc page, changelog entry and
  the demo data in the product mock (accounts, funnels, cohorts, signals).
  Start there.
- **Images**: every illustration is routed through `images` in
  `src/content.ts` (`public/images/*.webp`). They are generated placeholders;
  swap in your own photography or illustration there. The hero uses two
  files cut from one painting: `hero.webp` (the whole scene) and
  `hero-front.webp` (the same pixels with the sky made transparent). If you
  replace the hero, give it a matching front layer and set `RIDGE_AT` in
  `src/sections/Hero.tsx` to where its hill line sits.
- `src/styles.css` holds the tokens in `@theme`: canvas (`sky`, `paper`,
  `card`, `wash`, `line`), text (`ink`, `body`, `muted`, `faint`), accent
  (`lime` for primary fills, `leaf` for accent text and focus), status (`ok`,
  `warn`, `bad`), radii, shadows, easings and keyframes. `src/lib/tokens.ts`
  mirrors them for the style guide. Rounded shapes are squircles; circles opt
  out with `.round`.
- `src/components/*` is the design system. `AppMock.tsx` is the live
  workspace in the hero; `ScaledFrame.tsx` lays it out at 1200px and scales it
  to fit (it is a non-interactive picture below 640px).
- Persisted state goes through `src/lib/storage.ts` (keys `pulseboard:*`):
  the mock's view and filters, billing period, changelog filter, alert rules,
  docs votes, subscriptions and the demo account.

## Worker routes (`src/worker/index.ts`)

All forms validate with `src/lib/validate.ts`, shared by the page and the
Worker. Nothing is stored server-side yet; each route has a `TODO` where you
connect email, a CRM or a D1 table. Replace the demo sign-up with real auth
(for example Sign in with Freebuff) before taking real accounts.

| Route | Returns |
|---|---|
| `GET /api/health` | `200 { ok: true }` |
| `POST /api/subscribe` | `200`, `422` bad email, `400` bad JSON |
| `POST /api/contact` | `201 { ref }`, `422 { errors }` |
| `POST /api/signup` | `201`, `422 { errors }` (the password is never echoed or stored) |
| `GET /api/status` | `200` report; `?fail=1` returns `503` to test the error state |
| anything else under `/api` | `404 { error }` |

## Style guide

`/styleguide` (linked in the footer) renders colour swatches with hex and
use, the type scale, spacing, radii, shadows, motion tokens with a replay
button, and every component in each state: buttons and icon buttons
(default, hover, focus, pressed, disabled, loading, pinned with
`data-force`), badges, chips, fields (default, hover, focus, error, disabled,
optional), select, textarea, password with strength, checkbox, segmented,
toggle, slider, filter menu, notices, empty state, skeleton, accordion,
sheet, avatars, sparkline, line chart, funnel, retention grid, signal feed,
journeys, uptime bars, code block, plan cards and the product mock.

## Accessibility and motion

Text tokens pass WCAG AA (`faint` was darkened to `#636c64`; lime is never
used for text). Menus, the sheet and the segmented controls are keyboard
operable (arrows, Esc, focus restore, focus trap). With reduced motion the
hero parallax, the signal feed and transform animations stop.
