# Course platform

A marketing site and working product demo for a B2B course platform
("Coursekit"): the tool creators, schools and companies use to build, sell and
run online courses. The landing page has a **live product composite** in the
hero (a sortable course table with collaborator cursors, a quiz-code card that
joins a demo quiz, and a learner activity card), then a logo wall, a creator
dashboard, four live feature demos, how it works, a teams band, testimonials
and a call to action. Inner pages are real tools: a drag-and-drop course
builder, analytics, a storefront designer with checkout, pricing with a fee
calculator, an integrations directory, a blog, a demo-request form, sign-up,
a 404 and a live [style guide](#style-guide). All copy and seed data live in
one file.

## Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | The landing page (`Home.tsx` stacks `src/sections/*`) |
| `/builder` | Course builder: drag modules and lessons by their grips (or focus a grip and use the arrow keys), edit a lesson, move it between modules, free-preview toggle, learner preview, live quiz sessions with join codes, delete with undo, publish dialog posting to `/api/courses/publish`, reset demo |
| `/analytics` | KPI cards, revenue chart (hover or arrow keys), completion funnel, sortable course table, recent sales, CSV export; loading skeletons, and an empty state for the draft course |
| `/storefront` | Storefront designer: school name, headline, brand colour, grid/list, reviews and instructor toggles, desktop/phone preview; "Enroll" opens a demo checkout posting to `/api/enroll` |
| `/pricing` | Plans with monthly/yearly, a fee calculator (`#calculator`), a comparison table (`#compare`) and FAQ (`#faq`) |
| `/integrations` | Search, category chips, connect/disconnect, a details sheet with sync toggles, an empty state, and a request form (`#request`) posting to `/api/integration-request` |
| `/blog`, `/blog/:slug` | Blog index with a topic filter; articles with copy-link and related posts |
| `/contact` | "Book a demo" form posting to `/api/contact` (`?topic=teams` preselects the topic) |
| `/signup` | Start free (`?plan=starter` picks the plan); posts to `/api/signup`, keeps the workspace in this browser |
| `/styleguide` | The living style guide |
| anything else | 404 |

## Run it

```sh
bun install
bun run dev        # http://localhost:5330 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/course_platform/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, price, plan, integration, blog post and
  the seed data for the hero, the builder's demo course, analytics and the
  storefront. Start there.
- **Images**: every photograph goes through `images` in `src/content.ts`
  (`public/images/*.webp`, about 600 KB in all). They are generated
  placeholders; swap in your own photography there. Customer logos in
  `src/sections/TrustedBy.tsx` are fictional wordmarks, and integration tiles
  show a coloured initial rather than vendor logos.
- `src/styles.css` holds the tokens in `@theme`: canvas (`paper`, `canvas`,
  `wash`, `line`), text (`ink`, `body`, `muted`, `faint`), brand (`flame` for
  fills and glows, `flame-strong` for buttons with white text, `flame-ink` for
  orange text, `violet` and `azure` for collaborator cursors), status, radii,
  shadows, easings and keyframes. `src/lib/tokens.ts` mirrors them for the
  style guide. Rounded shapes are squircles; circles opt out with `.round`.
- `src/components/*` is the design system. `HeroMock.tsx` and
  `DashboardMock.tsx` are live product mocks laid out at a fixed size;
  `ScaledFrame.tsx` scales them to fit (they become a non-interactive picture
  on narrow screens). `SortableList.tsx` is the drag-and-keyboard reorder list
  used by the builder.
- Persisted state goes through `src/lib/storage.ts` (keys `coursekit:*`): the
  builder's course, selection and quiz codes, analytics filters, storefront
  design, billing period, calculator value, connected integrations, blog
  filter and the demo workspace.
- Forms use `src/lib/useForm.ts` with the rules in `src/lib/validate.ts`, which
  the Worker shares, so the page and the server always agree.

## Worker routes (`src/worker/index.ts`)

Every route validates its JSON body and returns 400 (not JSON), 422 (with
per-field `errors`) or a success code. Nothing is stored; each has a TODO
where you wire your email provider, payment provider, CRM or a D1 table.

| Route | Success | Notes |
|---|---|---|
| `GET /api/health` | 200 `{ ok: true }` | |
| `POST /api/subscribe` | 200 | Footer newsletter |
| `POST /api/quiz/join` | 200 | 422 bad format, 404 unknown code; demo codes `7Q4K2M`, `SQ1A9B` |
| `POST /api/contact` | 201 `{ ref }` | Book a demo |
| `POST /api/signup` | 201 `{ slug }` | Replace with real auth (for example Sign in with Freebuff) |
| `POST /api/enroll` | 201 `{ order }` | Demo checkout; no payment is taken |
| `POST /api/integration-request` | 201 `{ ref }` | |
| `POST /api/courses/publish` | 201 `{ url, publishedAt }` | 422 lists every problem with the outline |
| anything else under `/api/` | 404 JSON | |

## Style guide

`/styleguide` (linked from the footer) renders colour swatches with hex and
use, the type scale, spacing, radii, shadows, motion tokens with a replay
button, and every component in its variants and states. Hover, focus and
pressed are pinned with each component's `force` prop (`data-force`).

## Accessibility

Text tokens pass WCAG AA where they are used. The reference's bright orange
(`flame`, #f15a24) fails AA under white text, so buttons use `flame-strong`
(#d14710) and orange text uses `flame-ink` (#b23c0b). Modals and sheets trap
focus and return it, the reorder lists work from the keyboard and announce
moves, charts have hidden data tables, and `prefers-reduced-motion` turns off
non-essential motion.
