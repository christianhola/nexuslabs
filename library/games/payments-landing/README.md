# Payments landing page

A light, mist-and-teal marketing site for a payments and money-transfer
product ("Ledgerly"). The landing page has a live invoice widget in the hero
(choose a method, pay, watch it settle), a feature card, a balance chart, a
navy how-it-works band, stats, testimonials and plans. Around it sit working
product screens: a send-money calculator with a live FX quote, a merchant
checkout demo, developer API docs with a console, a security and compliance
page, pricing with a cost calculator, customer stories, sign-up and log-in,
a 404 and a live [style guide](/styleguide).

## Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | Landing page (`Home.tsx` stacks `src/sections/*`) |
| `/send` | Four-step transfer: amount with live quote (30 s rate lock, fees, bank comparison), recipient, review, tracking. Draft and history persist in localStorage |
| `/checkout` | Hosted-checkout demo: brand colour, wallet/bank toggles (saved), cart with quantities and promo `WELCOME10`, card form with brand detection, one-time-code dialog, decline and success states |
| `/developers` | API reference with scroll-spy sidebar, parameter tables, cURL/Node/Python tabs, webhooks, errors, and a console that calls the Worker's `/api/quote` |
| `/security` | Trust center: controls, card data flow, certifications, 30-day status bars, security-pack request form (`#request`) |
| `/pricing` | Plans with monthly/yearly (saved), monthly cost calculator (`#calculator`), comparison table (`#compare`), FAQ |
| `/customers` | Filterable customer stories with photography and metrics |
| `/signup`, `/login` | Demo account opening (3 steps, draft saved) and log-in with forgot-password dialog. Nothing is created |
| `/styleguide` | Tokens and every component in every state |
| anything else | 404 |

## Worker routes (`src/worker/index.ts`)

All validate with the same rules as the forms (`src/shared/validate.ts`) and
store nothing; wire them to your providers.

| Route | Good input | Bad input |
|---|---|---|
| `GET /api/health` | 200 `{ ok: true }` | |
| `GET /api/quote?from&to&amount&speed` | 200 priced quote | 400 with field errors |
| `POST /api/transfers` | 201 transfer | 400 bad JSON, 422 field errors, 409 expired quote |
| `POST /api/checkout` | 201 succeeded, 200 `requires_action` (card `4000 0025 0000 3155`) | 402 declined (`4000 0000 0000 0002`), 422 |
| `POST /api/contact`, `/api/subscribe`, `/api/signup` | 201 | 400 / 422 |
| `POST /api/login` | 200 | 401 wrong password rule, 422 bad email |
| any other `/api/*` | | 404 JSON |

FX rates are demo values with a small time-based drift (`src/shared/fx.ts`).
Replace `midRate` with your FX provider; the page and Worker share the fee
rules, so estimates and charges always agree.

## Run it

```sh
bun install
bun run dev        # http://localhost:5324 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/payments_landing/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, number, plan, story and the seed
  data. Start there.
- **Photography**: every image goes through the `images` map in
  `src/content.ts` (files in `public/images/`, generated placeholders). Swap
  in your own photos there.
- `src/styles.css` holds the tokens (`@theme`): colours, radii, shadows,
  motion. `teal` (#2b8a96) is the brand fill; `teal-ink` (#1f6f79) is the
  AA-safe version used under small white text.
- `src/components/` is the design system (Button, fields, RadioCard,
  Segmented, Tabs, Toggle, Dialog, Notice, MoneyInput, PaymentCard,
  AreaChart, CodeBlock, Stepper, PlanCard and more), all shown on
  `/styleguide`.
- localStorage keys are listed in `src/lib/store.ts`.
- Fonts: Inter Tight and JetBrains Mono from Google Fonts (`index.html`).
