# Messaging SaaS site (Relaytext)

A midnight-navy, multi-page marketing site for a two-way SMS product
("Relaytext"): the reference hero (speech-bubble logo chip, grey link pill,
outlined Get started, three-line promise over a kinetic 3D render, and the
"Enter your brand's URL / Test our AI" field), the charcoal proof band with a
logo marquee, then pillars, an interactive phone conversation, stats, a tabbed
tour of live product UI, testimonials and the 20% guarantee. Every product
screen (phone thread, inbox, campaign dashboard, flow builder, AI picks) is a
working React component, not an image. All copy lives in one file.

### Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | Landing page (`Home.tsx` stacks `src/sections/*`) |
| `/features` | Anchor nav and deep dives: text to buy, AI picks, inbox, flows, compliance, integrations |
| `/pricing` | Plans with monthly/yearly toggle, bill estimator slider, comparison table, billing FAQ |
| `/customers`, `/customers/:slug` | Case studies with industry filter; case study page with metrics and quote |
| `/blog`, `/blog/:slug` | Featured post, category filter, newsletter; article page |
| `/faq` | Search and topic filter over the FAQ, empty state |
| `/demo?url=` | "Test our AI": posts the URL to `/api/preview` and plays back a drafted conversation; recent tests saved |
| `/contact` | Book-a-demo form posting to `/api/contact` |
| `/login` | Magic-link sign-in form (`/api/login`, validation only) |
| `/signup` | Trial sign-up (`/api/signup`), then an onboarding checklist saved on this device |
| `/styleguide` | The living [style guide](/styleguide) |
| anything else | 404 |

## Run it

```sh
bun install
bun run dev        # http://localhost:5325 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/messaging_saas/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, price, plan, post, case study, FAQ and
  all the mock data (inbox threads, campaigns, chart series, flow steps).
- **Images**: every photo and render goes through the `images` map at the top
  of `src/content.ts`. Replace a path with your own photography (same aspect
  ratio) and every page that shows it updates. The bundled images are
  generated placeholders in `public/images/` (WebP, about 0.7 MB in all).
- `src/styles.css` holds the tokens in `@theme`: surfaces (`bg`, `night`,
  `panel`, `panel-2`, `tile`, `raised`), text (`fg`, `soft`, `muted`, `faint`),
  brand (`cobalt`, `cobalt-hover`, `cobalt-text`, `cherry`, `saffron`, `mint`
  and their `-text` variants), radii, shadows, easings and keyframes.
  `src/lib/tokens.ts` mirrors them for the style guide.
- `src/components/` is the design system (Button, fields, SegmentedControl,
  Switch, Slider, Accordion, Badge, Notice, EmptyState, cards, Sheet...);
  `src/components/mocks/` holds the live product UI.
- Fonts: Red Hat Display (headings), Red Hat Text (body), Instrument Serif
  (two customer wordmarks), from Google Fonts in `index.html`.

## Worker routes (`src/worker/index.ts`)

All forms validate in the browser and again in the Worker with the same rules
(`src/lib/validate.ts`). Nothing is stored server-side; wire each route to
your CRM, email tool or a D1 table.

| Route | Good input | Bad input |
|---|---|---|
| `GET /api/health` | `200 { ok: true }` | |
| `POST /api/preview` `{ url }` | `200 { preview }` (deterministic draft, `src/lib/preview.ts`) | `422` invalid URL, `400` not JSON |
| `POST /api/contact` | `200` | `422 { errors }` |
| `POST /api/signup` | `200 { workspace }` | `422 { errors }` |
| `POST /api/login`, `POST /api/subscribe` `{ email }` | `200` | `422 { errors }` |
| any other `/api/*` | | `404` JSON |

Browser state (localStorage, `relaytext:` prefix): billing period, calculator
list size, recent demo URLs, newsletter sign-up, the trial account and its
onboarding checklist.

## Style guide

`/styleguide` (linked in the footer) renders the colour tokens with hex
values, the type scale, spacing, radii, shadows, motion tokens with a replay
button, and every component in each state (default, hover, focus-visible,
pressed, disabled, loading, error, empty), with states pinned by a
`data-force` attribute on the real component.
