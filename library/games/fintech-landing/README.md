# Fintech landing page

A pure-black, multi-page marketing site for a fintech SaaS ("Revio"): the
landing page from the reference (pixel-block logo, nav with an animated active
underline, glossy payment card over a CSS 3D coin, live balance card, bento,
card-controls demo, pricing, testimonials, blog, FAQ, CTA) plus Features,
Pricing, Company, Blog, Contact, Sign up, Log in, a 404 and a live
[style guide](#style-guide). All copy lives in one file.

### Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | The landing page (`Home.tsx` stacks `src/sections/*`) |
| `/features` | Sticky sub-nav and four deep dives (cards, payouts, invoicing, analytics), each with an animated product mock |
| `/pricing` | Plans with billing toggle, savings/fee calculator (`#calculator`), feature comparison table (`#compare`), FAQ |
| `/company` | Story timeline, stats, values, team grid with SVG avatars, careers list with department filter (`#careers`) |
| `/blog`, `/blog/:slug` | Featured post, topic filter + search, newsletter; article page with reading progress and copy-link |
| `/contact` | Validated contact form posting to `/api/contact` (`?topic=sales` preselects the topic) |
| `/signup`, `/login` | Demo-only auth screens (nothing leaves the browser): password strength meter, show/hide, forgot-password and error states |
| `/styleguide` | The living style guide |
| anything else | 404 |

Routing is a tiny History API router (`src/lib/router.tsx`: `Link`,
`navigate`, `useLocation`). The Worker runs in SPA mode, so deep links and
reloads work. Inner pages are lazy-loaded. Below `lg` the nav moves into a
side sheet (focus trap, Esc, focus restore).

## Run it

```sh
bun install
bun run dev        # http://localhost:5184 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/fintech_landing/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, number, price and link. Start there.
- `src/sections/*` are the landing-page sections; `src/pages/Home.tsx` stacks
  them. `src/pages/*` are the other pages; add one by adding a line to the
  route table in `src/App.tsx` and a link in `nav` in `content.ts`.
- `src/styles.css` holds the design tokens in `@theme`: black canvas
  (`bg`, `surface`, `surface-2`, `raised`), text (`fg`, `soft`, `muted`,
  `faint`), the violet accent (`violet`, `violet-hover`, `violet-text`), the
  money-up green (`up`, `up-soft`), radii (`control`, `button`, `card`,
  `card-sm`), easings (`--ease-brand`, `--ease-count`, `--ease-swing`) and the
  keyframes (`coin-spin`, `float`, `sheen`, `marquee`, `pulse-dot`).
  `src/lib/tokens.ts` mirrors them as data for the style guide and motion code.
  Rounded shapes are squircles; circles opt out with `.round`. Bordered
  surfaces use the `depth` utility (inset edge + top highlight).
- `src/worker/index.ts` is the Cloudflare Worker. `/api/subscribe` (200 / 400)
  receives email captures; `/api/contact` returns 201 with a reference, 422
  with per-field errors, or 400 for a non-JSON body. Both share validation
  with the forms (`src/lib/validate.ts`). Connect them to your provider or a
  D1 table.

### Style guide

`/styleguide` (linked from the footer) documents the system live, rendered by
the real components: colour swatches with hex, the type scale, spacing, radii,
elevation, motion tokens with a replay button and keyframe demos, then every
component with its variants, sizes and states (default, hover, focus-visible,
pressed, disabled, loading, error, empty) and usage notes.

### Components (`src/components`)

| Component | What it is |
|---|---|
| `Button` | `primary`, `dark`, `outline`, `light`, `ghost`; `sm`/`md`/`lg`; `href` routes via `Link`; `loading` |
| `Badge` | Pill label: `neutral`, `violet`, `up`, `down`, `info`, `glass`; `sm`/`md`; optional icon |
| `Card` | `depth` surface: `surface`, `raised`, `featured`, `glass`; padding, radius, `interactive`, `as` |
| `IconChip` | Icon in a squircle tile; `neutral`/`violet`/`up`; `sm`/`md`/`lg` |
| `Field`, `Input`, `Textarea`, `Select`, `Checkbox` | Labelled controls with hint/error wiring (`aria-describedby`, `aria-invalid`) |
| `PasswordInput`, `PasswordStrength` | Show/hide password; 4-segment meter with a checklist (`scorePassword`) |
| `SegmentedControl`, `BillingToggle` | Radio-group pill with a sliding thumb and arrow-key support |
| `Slider` | Labelled range with violet fill and an `output` |
| `Toggle` | Accessible switch (`role="switch"`), disabled state |
| `Accordion` | One-open disclosure list |
| `Sheet` | Modal side drawer: focus trap, Esc, backdrop, scroll lock, focus restore |
| `Notice`, `EmptyState` | Inline info/success/error message; empty list with a way out |
| `Avatar` | Illustrated SVG face derived from a name (or `src` for a photo) |
| `PlanCard`, `PostCard`/`PostCover` | Pricing plan; blog teaser with gradient cover |
| `PageHeader`, `Section`, `SectionHeading`, `Eyebrow`, `Container`, `Reveal` | Page top, section rhythm, headings, gutter, scroll reveal |
| `AuthShell` | Two-column frame for the sign-up and log-in screens |
| `CreditCard` | 450×293 glossy card; `theme` graphite/violet/pearl, `tilt`, `frozen` |
| `Coin` | CSS 3D coin with a reeded rim; rests at `pose`, spins every 12 s |
| `BalanceCard`, `AppIcon`, `CountUp`, `Sparkline`, `CheckBadge`, `Logo` | Hero widgets, animated numbers and lines, proof badge, brand |

Imagery is drawn, not photographed: the card, coin, avatars and blog covers
are CSS/SVG (blog covers are the `covers` array in
`src/components/PostCard.tsx`; avatars take a `src`; swap in real photography
there).

Motion: hero entrance (staggered proof points, word-by-word headline, card,
coin and balance card fly in), card tilt on pointer move, coin spin and float,
counting balance and stats, scroll reveals, nav active underline, billing pill,
FAQ accordion, page-header word rise, feature mocks that loop while in view,
timeline draw, sheet slide. Everything respects `prefers-reduced-motion`
(`MotionConfig reducedMotion="user"` plus a CSS rule; the feature mocks show
their finished state).

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy
it with the `sites_deploy` tool (or the Sites API) from this directory.
