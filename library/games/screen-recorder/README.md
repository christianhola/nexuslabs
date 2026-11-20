# Clipwise

A warm near-black site and working app for a screen-recording product:
"screen recording for busy teams; agents act on recordings". The landing page
opens on a cream display headline over hairline frame lines, an invented
partner-logo marquee, and a product shot of the library, a playing clip with
camera and microphone pickers, and an agent terminal that files tickets from
recordings. Behind it sit a recording library (`/app`), a share page with
timestamped comments (`/v/:id`), integrations, pricing, download, a style
guide and a 404.

All data lives in the browser (`localStorage`), so there is no sign-in or
database. Recording is simulated: no screen, camera or audio is captured.

## Run it

```sh
bun install
bun run dev        # http://localhost:5358 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/screen_recorder/index.js (Worker)
bun run typecheck
```

## Routes

| Route | What it is |
| --- | --- |
| `/` | Landing: hero + product shot, features, made-for tabs, agents, customers, email CTA |
| `/app` | Library: My Clips, Watched, Activity, Archive, playlists, search, sort, grid/list, recorder |
| `/app?view=<id>` | A view or playlist (`watched`, `activity`, `archive`, `pl-design`, …); `?q=` searches, `?sort=active` |
| `/v/:id` | Share page: player, chapters, summary, transcript, ask-the-agent, timestamped comments. `?t=52` starts at 0:52 |
| `/integrations` | Invented integrations with category filter, search and connect toggles |
| `/pricing` | Monthly/annual toggle, four plans, comparison table, FAQ |
| `/download` | OS-detected download card, other platforms, changelog (demo download dialog) |
| `/styleguide` | Every token and component, live, in every state |
| anything else | 404 |

Keyboard: in the library `/` searches and `r` opens the recorder. On the
player `Space`/`K` play, `←`/`→` seek 5 s, `J`/`L` seek 10 s; the scrubber is a
slider (`Home`/`End`). `⌘ Enter` posts a comment. Esc closes every menu,
modal and drawer, and focus returns to what opened it.

## Edit it

- `src/content.ts` holds every piece of copy and all seed data: nav, hero,
  logo ids, the agent terminal script, features, team tabs, customers,
  pricing, download, integrations, the 12 demo recordings (title, scene,
  chapters, transcript, summary), comments and playlists. Start there.
- **Images**: every photo goes through the `IMAGES` constant at the top of
  `src/content.ts`. The files in `public/images/` are generated placeholders
  (three presenters and a desk); replace them with your own footage stills
  and keep the keys.
- `src/lib/store.ts` is the data layer: one `localStorage` key
  (`clipwise:v1`), every action (`addRecording`, `patchRecording`,
  `removeRecording` with undo, playlists, comments, reactions, integrations)
  and `resetDemo()` (the ↺ button at the bottom of the library sidebar).
  The grid/list choice is under `clipwise:layout`.
- `src/components/` is the design system: `Button` (+ `ButtonLink`,
  `IconButton`), `ui.tsx` (Chip, Badge, Input, TextArea, Select, SearchField,
  Switch, Segmented, Avatar, Kbd, Skeleton, EmptyState), `Modal`, `Drawer`,
  `Popover`, `Menu`, `Toast`, `Contact` (the "Talk to us" dialog), `Library`
  (sidebar rows, clip cards), `ScreenMock` (CSS poster frames, six scenes),
  `Player`, `Terminal`, `Logo` (mark, wordmark, invented partner marks),
  `SiteNav`, `SiteFooter`, `Frame`.
- `src/sections/` is the landing page (`Hero` draws the product shot at a
  1540px design width and scales it to fit; below 1024px it stacks).
- `src/app/` is the library (`LibraryApp`, `Recorder`); `src/pages/` the
  share, integrations, pricing, download and 404 pages.
- `src/styles.css` holds the tokens (`@theme`), keyframes and the
  `data-force` variants the style guide uses to pin hover/focus/pressed.
- `src/worker/index.ts` is the Worker: `GET /api/health`,
  `POST /api/subscribe` (email; 400 on a bad address), `POST /api/contact`
  (400 with a `field` on a bad email or short message) and a JSON 404 for
  unknown `/api/*`. Both POSTs only validate and acknowledge: wire them to
  your email provider or CRM.

## Make it real

- **Recording**: replace the simulated flow in `src/app/Recorder.tsx` with
  `navigator.mediaDevices.getDisplayMedia` + `getUserMedia` and a
  `MediaRecorder`; upload the blob to R2 and store the row in D1.
- **Playback**: `Player` takes `time`/`playing` from its parent, so swap the
  `ScreenMock` inside it for a `<video>` and drive `time` from `timeupdate`.
- **Storage**: every write goes through `update()` in `store.ts`; move it to
  Worker routes over D1 and keep the actions' signatures.

Every company, person, logo and integration on these pages is invented.
