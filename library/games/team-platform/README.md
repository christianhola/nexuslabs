# Team platform

A marketing site for an employee app and internal-comms SaaS called
"Branchwork". It opens on a white hero with a hand-drawn underline, an email
field with a speech-bubble notch, proof numbers and a **live isometric
line-art drawing** of the app. In the drawing the to-do boxes tick, the
performance figure follows them, chat messages keep arriving and the calendar
shows today. A cookie bar sits at the bottom. The inner pages show the
product with working previews: an org chart, a team directory, a news feed,
chat, tasks and shifts, and a pulse survey. All copy and seed data live in
one file.

## Pages (`src/pages`, routed in `src/App.tsx`)

| Path | What it is |
|---|---|
| `/` | Hero, customer names, six modules, frontline section, a phone showcase with tabs (feed, chat, tasks, people), a testimonial, integrations and a closing CTA |
| `/product` | Live org chart (search, expand and collapse, zoom, profile panel), team directory (search, department, location, working-now filters, grid or list, profile dialog), news feed composer with audiences, reactions and read receipts, chat with replies, opening checklist, shift swaps, pulse survey |
| `/why-us` | Proof numbers, a comparison table and an ROI calculator |
| `/customers`, `/customers/:slug` | Case studies with an industry filter; story pages with metrics, a quote and the next story |
| `/integrations` | 22 integrations with search, category filter and detail dialogs, plus a "request an integration" form (`POST /api/integration-requests`) |
| `/pricing` | Monthly or yearly billing, a seat slider that prices every plan, a comparison table and an FAQ |
| `/about` | Team photo, numbers, timeline, values, leadership and open roles |
| `/demo` | Two-step demo booking (details, then a weekday and a time) posting to `/api/demo`; confirmation with an `.ics` file, reschedule and cancel |
| `/cookies` | Cookie policy with preference switches |
| `/styleguide` | The living [style guide](#style-guide) |
| anything else | 404 |

## Run it

```sh
bun install
bun run dev        # http://localhost:5327 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/team_platform/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string, price, person, case study,
  integration and the demo app's seed data. Start there.
- **Images**: every photograph goes through `images` in `src/content.ts`
  (`public/images/*.webp`). They are generated placeholders of fictional
  people; swap in your own photography there. `portraits.webp` is a 4×4
  sprite of headshots and each person's `face` (0–15) picks one. Replace the
  sprite with a grid of your own, or change `Avatar` to take a URL per person.
- **Languages**: the nav, hero and cookie bar are translated into English,
  German, French and Spanish (`strings` in `src/content.ts`). The rest of the
  site is English.
- **Tokens** live in `@theme` in `src/styles.css`: canvas (`page`,
  `backdrop`, `mist`, `line`), text (`ink`, `body`, `muted`, `faint`), accent
  (`mint` is the fill colour for primary buttons and done states; `leaf` is
  the green for text) and status colours, plus radii, shadows, easings and
  keyframes. `src/lib/tokens.ts` mirrors them for the style guide. Rounded
  shapes are squircles; circles opt out with `.round`.
- **Components** are in `src/components/`. The product mocks are
  `HeroIso`, `OrgChart`, `Directory`, `ProfileCard`, `FeedMock`, `ChatMock`,
  `TasksMock` (`TaskList`, `ShiftList`), `PulseMock` and `PeopleMock`.
- **State** is kept in this browser under `branchwork:*` keys
  (`src/lib/storage.ts`, `src/lib/stores.ts`): the cookie choice, language,
  tasks, posts, reactions, chat, pulse vote, swaps, directory layout, billing
  period, seats, the demo draft and the booking.

## Worker routes (`src/worker/index.ts`)

Forms are checked in the browser and again in the Worker with the same rules
(`src/lib/validate.ts`). Nothing is stored yet; each route has a TODO where
you connect your CRM, mailing list or calendar.

| Route | Returns |
|---|---|
| `GET /api/health` | `200 { ok: true }` |
| `POST /api/leads` | hero and CTA email: `201`, or `422` with `errors.email` |
| `POST /api/subscribe` | footer newsletter: `201` or `422` |
| `POST /api/demo` | demo booking: `201 { ref }` or `422` with field errors (weekday in the next 4 weeks, known slot) |
| `POST /api/integration-requests` | `201 { ref }` or `422` |
| other `/api/*` | `404` JSON; a body that is not JSON gets `400` |

## Style guide

`/styleguide` (linked in the footer) shows the colour tokens with hex
values, the type scale, spacing, radii, elevation, motion tokens with a
replay button, and every component in its states: buttons in five variants
by default, hover, focus, pressed, disabled and loading; chips, badges,
fields (default, hover, focus, error, disabled), the hero email field with
and without an error, checkbox, switch, segmented control, slider, dropdown,
tabs, accordion, dialog and drawer, notices, empty and loading states,
avatars, cards, plan cards and every product mock. Hover, focus and pressed
are pinned with a `data-force` attribute on the real component.

## Accessibility notes

The reference's lime is kept as a fill only; green text uses `leaf`
(#1f7a2a). Reduced motion turns off the floating cards, the underline
drawing, the typing dots and the counters. Below about 400px the hero drawing
is too small to tap, so it becomes a picture (inert) and the same checklist
stays usable in the showcase.
