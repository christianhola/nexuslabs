# Desk booking (DeskFlow)

A hybrid-office booking product: a white marketing page with an orange-red
wordmark and a framed app window that tilts into place on scroll, and the
working app behind it at `/app`. Book desks on an SVG floor map, meeting rooms
on a day timeline, parking bays and lockers; check in; see who's in and find
them on the map; plan office/remote days; edit the floor plan as an admin.
Everything persists in the browser (localStorage), so it runs with no backend.

The design system is documented live at [`/styleguide`](http://localhost:5173/styleguide)
(also linked from the footer and the app sidebar).

## Run it

```sh
bun install
bun run dev        # http://localhost:5173 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/desk_booking/index.js (Worker)
bun run typecheck
```

Routes: `/` landing, `/app` (onboarding on first visit, then the dashboard),
`/app/floor`, `/app/rooms`, `/app/bookings`, `/app/parking`, `/app/team`,
`/app/week`, `/app/admin`, `/styleguide`. Anything else shows the 404 page.
To start over, use "Reset all demo data" in the floor plan editor, or clear the
`deskflow:v1` key in localStorage.

## Edit it

- `src/content.ts`: every landing-page string (hero, features, steps,
  testimonials, pricing, FAQ, footer).
- `src/data.ts`: offices, teams, people, floors (areas), rooms, desks, parking,
  lockers and the demo bookings, which are generated relative to today.
- `src/lib/store.ts`: the whole app state and its actions (`book`, `cancel`,
  `restore`, `checkIn`, `setDay`, desk editing, onboarding, notifications).
  Conflict rules live in `book`: a resource can't be double-booked for
  overlapping times, and a person can hold only one desk, bay or locker at a
  time. To move to a shared backend, keep the action names and replace
  `commit` with calls to API routes in `src/worker/index.ts` (add a D1 binding).
- `src/app/*`: the app screens. `AppShell` is the sidebar layout (a drawer on
  phones); `FloorPlan` is the SVG office plan used by the map, the editor and
  the style guide; `BookDialog` books any resource kind.
- `src/sections/*` + `src/pages/Landing.tsx`: the landing page. `HeroMock`
  renders the real `AppShell` + `Dashboard` against an in-memory store, scaled
  to fit and inert.
- There are no photos; the product shot is the live app. Testimonial avatars
  are initials; swap `Avatar` for an `<img>` if you add real portraits.

### Tokens (`src/styles.css`)

- Colour: `brand` `#d63f0f` (AA on white, used for buttons and orange text),
  `brand-bright` `#f24e1e` (wordmark and display type only), `brand-soft`
  highlight, neutrals `ink` / `fg` / `body` / `muted` / `line` / `canvas`,
  `navy` for the dark band, and one tone per resource: desk brand, room teal,
  parking slate, locker amber, plus `free` / `busy` / `danger`.
- Type: Plus Jakarta Sans; scale `2xs` 11 → `display` 80 (hero uses 72).
- Radii are small (`xs` 3px to `xl` 14px); elevation `card`, `soft`, `button`,
  `pop`, `window`.
- Motion: durations and easings in `src/lib/motion.ts`; keyframes
  `pulse-ring`, `fade-in`, `pop`, `shimmer`. `prefers-reduced-motion` turns
  CSS animation off and Motion skips transform animations (`MotionConfig
  reducedMotion="user"`).

### Components (`src/components`)

`Button` / `ButtonLink` / `IconButton` (primary, soft, outline, ghost, danger;
xs–lg; loading, disabled), `Field` + `Input` + `Select`, `DateStepper`,
`TimeRange`, `Segmented`, `ChoiceChip`, `Card` (+ `rule` accent), `Badge`,
`IconChip`, `Avatar` / `AvatarStack`, `Dialog` (modal, bottom sheet on phones,
or side drawer), `Popover`, `Toast` (`useToast`, with Undo actions),
`EmptyState`, `Skeleton`, `Spinner`, `Logo`, `WindowFrame`, `Reveal`,
`SectionHeading`. Overlays trap focus, close on Esc and restore focus.

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy
it with the `sites_deploy` tool (or the Sites API) from this directory. The
Worker serves `/api/health` and `/api/subscribe` (footer email capture: 400 on
a bad address) and returns 404 JSON for other `/api/*` paths; every other path
falls through to the single-page app.
