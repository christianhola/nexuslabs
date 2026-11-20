# Inkwell: newsletter platform

A dark marketing site and working product demo for a newsletter platform:
an all-caps hero with a layered product collage (templates, monetization,
analytics), a scrolling strip of invented publisher logos, and sections for
the editor, growth, podcasts, monetization, analytics and testimonials.

Screens:

| Route | What it does |
| --- | --- |
| `/` | Landing page with the "Ask Inkwell" chat drawer (canned replies) |
| `/editor` | Block editor: edit, add, reorder and delete blocks, accent and typeface, write/preview (desktop, phone, plain text), send a test, schedule. The draft autosaves to localStorage. |
| `/templates` | Gallery with category filters (kept in `?category=`), search, sort, a preview dialog and "Use this template", which loads it into the editor |
| `/analytics` | Dashboard fed by the Worker's `/api/analytics`: range switch, metric tabs, chart with hover/keyboard tooltip, sources, sortable posts table, CSV export. Open `/analytics?fail=1` to see the error state. |
| `/monetize` | Balance and withdraw flow, ad network offers to accept or decline, paid-tier calculator, boosts, payout history (all kept in localStorage) |
| `/pricing` | Subscriber slider, monthly/annual billing, plan cards, compare table, FAQ |
| `/signup`, `/login`, `/demo` | Forms validated on the page and again in the Worker |
| `/styleguide` | Tokens and every component in every state |

## Run it

```sh
bun install
bun run dev        # http://localhost:5355 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/newsletter_platform/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, plan, template, offer and seed number.
- `images` in `src/content.ts` is the one map every photo goes through. The
  pictures in `public/images/` are generated placeholders; swap in your own
  photography at the same aspect ratio.
- The publisher logos (`src/components/PublisherLogos.tsx`) are invented
  wordmarks. Replace them with your customers' logos, with permission.
- `src/styles.css` holds the tokens (colours, radii, shadows, fonts,
  keyframes); `src/lib/tokens.ts` mirrors them for the style guide at
  `/styleguide` (also linked from the footer).
- `src/components/` is the design system, `src/sections/` the landing page
  sections, `src/pages/` the screens and `src/App.tsx` the route table.
- `src/worker/index.ts` is the Cloudflare Worker: `/api/health`,
  `/api/signup`, `/api/login`, `/api/demo` and `/api/analytics`
  (`src/shared-analytics.ts` builds the demo report). The forms only validate
  and acknowledge; the TODOs mark where to connect auth, email and a CRM.
  Unknown `/api/*` paths return a JSON 404.
- The chat assistant's answers are keyword matches in `chatCopy`; replace
  `answer()` in `src/components/ChatWidget.tsx` with a real API call.

localStorage keys all start with `inkwell:` (`draft`, `balance`, `offers`,
`payouts`, `paid`, `boosts`, `analytics-range`, `billing`, `pricing-step`).

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`,
deploy it with the `sites_deploy` tool (or the Sites API) from this directory.
