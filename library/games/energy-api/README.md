# Energy API

A pale-mint marketing and docs site for an API that connects home energy
devices (electric cars, chargers, heat pumps, batteries, solar, thermostats)
to the grid ("Gridwise"). The landing page opens on a big two-line headline
over drifting dot-matrix columns and a full-width photo, then a platform hub
diagram, a working smart-charging scheduler (cheapest or cleanest hours
before a ready time), a dark developer band with code tabs, stats, use cases
and a closing call to action. Around it: a quickstart whose Run buttons call a
sandbox API in the Worker, a searchable device-coverage directory, use cases
with a flexible-capacity calculator, pricing with a bill estimator, a contact
sales form, a 404 and a live [style guide](/styleguide).

## Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | Landing page (`Home.tsx` stacks `src/sections/*`) |
| `/docs` | Six-step quickstart: sandbox key, SDK install, a simulated link flow, Run buttons for `GET /v1/devices` and `POST /v1/devices/:id/schedules`, webhooks. Key, progress and language persist |
| `/devices` | Directory of device makers: search (`/` focuses it, Esc clears), category chips with counts, region, live-only, sort, detail dialog, empty state. Filters live in the URL |
| `/use-cases` | Four use cases with photos and metrics, and a flexible-capacity calculator |
| `/pricing` | Plans with monthly/yearly (saved), graduated bill estimator, comparison table, FAQ |
| `/contact` | Sales form with shared validation (work email required), draft saved until sent, loading, error and success states. `?device=ev` preselects a device |
| `/styleguide` | Tokens and every component in every state |
| anything else | 404 |

## Worker routes (`src/worker/index.ts`)

Nothing is stored. Wire `/api/contact` to your CRM and `/api/v1` to your real API.

| Route | Good input | Bad input |
|---|---|---|
| `GET /api/health` | 200 `{ ok: true }` | |
| `GET /api/v1/devices[?type=]`, `GET /api/v1/devices/:id` | 200 sandbox devices | 401 without a `gw_sbx_` key, 404 unknown id |
| `POST /api/v1/devices/:id/schedules` | 201 schedule | 400 bad JSON, 422 field errors |
| `POST /api/contact` | 201 with a reference id | 400 bad JSON, 422 field errors |
| any other `/api/*` | | 404 JSON |

Sandbox keys are minted in the browser and only need the right shape
(`src/shared/sandbox.ts`); they are demo values, not credentials. Replace the
check with your real key verification.

## Run it

```sh
bun install
bun run dev        # http://localhost:5365 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/energy_api/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, plan, use case, scheduler price curve
  and the device makers (all invented). Start there.
- **Photography**: every image goes through the `images` map in
  `src/content.ts` (files in `public/images/`, generated placeholders). Swap
  in your own photography there.
- Tokens (colours, radii, shadows, motion) are in `src/styles.css` `@theme`;
  the style guide mirrors them. `volt` is the bright brand green for fills
  and dots; `leaf` is the AA-safe green for small text.
- Components are in `src/components/`, landing sections in `src/sections/`,
  code samples in `src/lib/snippets.ts`, the scheduler maths in
  `src/lib/schedule.ts`, form rules in `src/shared/validate.ts` (used by both
  the page and the Worker).
- localStorage keys are listed in `src/lib/store.ts`.
