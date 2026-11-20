# Inspo moodboard

An infinite-canvas moodboard app. The landing page is a dotted canvas of
scattered image cards with a frosted "Inspo — Your visual thinking space" card;
**Get Started** fades it away into the editor on the same canvas. Everything is
saved in the browser: boards and items in `localStorage`, uploaded image files
in IndexedDB.

- **Canvas**: pan (drag empty space with the hand tool, hold Space, middle
  mouse, scroll / two-finger drag, one finger on touch), zoom (pinch,
  Ctrl/⌘ + wheel, the zoom bar, double-click), zoom to fit, minimap.
- **Items**: images, sticky notes (six papers), text and colour swatches.
  Select, Shift-select and marquee; move with snap guides (hold ⌘/Ctrl to skip
  snapping); resize from eight handles (images keep their aspect, Shift frees
  it); rotate from just outside a corner (Shift snaps to 15°); z-order,
  duplicate, delete, copy/paste, arrow-key nudge, undo/redo.
- **Adding**: drop files, paste images, or use the file picker. "Extract
  colours" on an image adds a palette swatch built from its pixels.
- **Boards**: a switcher in the top bar, a boards grid with live thumbnails
  (`/boards`), rename / duplicate / delete with undo, export to PNG, and a
  fullscreen present mode (`/b/<id>/present`, arrows, autoplay, Esc).
- **Keyboard**: press `?` in the editor for the full sheet. With the canvas
  focused, Tab steps through items.

## Run it

```sh
bun install
bun run dev        # http://localhost:5188 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/moodboard/index.js (Worker)
bun run typecheck
```

## Edit it

- `src/content.ts` holds all copy, the seed boards, the landing layout,
  note colours and the shortcuts list. Start there.
- **Photos**: every built-in picture goes through the `IMAGES` constant in
  `src/content.ts`. Put your own photography in `public/images/` and change
  the `src` (and `alt`) there; the landing page, seed boards and style guide
  all follow. The painterly pieces in `public/images/art/` (peony, florals,
  two sitters, profile, dusk) are generated SVG: tweak palettes in
  `scripts/art.mjs` and run `node scripts/art.mjs`.
- `src/app/` holds the screens: `Editor.tsx` (canvas, gestures, keyboard,
  paste/drop, export), `EditorChrome.tsx` (top bar, board switcher, tools,
  zoom), `ContextBar.tsx`, `SelectionLayer.tsx`, `Minimap.tsx`, `Hero.tsx`,
  `BoardsPage.tsx`, `PresentPage.tsx`, `StyleGuide.tsx`.
- `src/lib/` is the logic: `store.ts` (boards, selection, per-board undo
  history, persistence), `geometry.ts` (camera maths, snapping, rotated
  resize), `images.ts` (IndexedDB blobs and object URLs), `palette.ts`
  (colour extraction), `exportPng.ts`, `router.ts` (a tiny history router).
- `src/worker/index.ts` is the Cloudflare Worker: `/api/health` and a JSON 404
  for other `/api/*` paths. Add routes (with D1/R2 bindings) there if boards
  should sync between devices.

## Design system

The live reference is **`/styleguide`** (linked from the boards page footer
and the shortcuts sheet). It renders every token and component with its
variants and states.

**Tokens** (`src/styles.css`, Tailwind v4 `@theme`):

- Colour: `canvas` #f9f9f9, `dot`, `surface` 1–3, `ink`, `ink-2`, `muted`,
  `faint`, `select` #4f6ef7 (selection and focus only), `guide` (snap lines
  only), `danger`, `success`, and six `note-*` papers.
- Type: Google Sans. Wordmark 108/500 at −5.5% tracking, tagline 27/400,
  page title 40/500, body 14, meta 13, caps label 11.5.
- Radii: control 7, card 11, panel 14 (notes 6). Shadows: `card`,
  `card-lift`, `panel`, `float`; `.frost` is the translucent blurred panel.
- Motion: `--duration-fast/base/slow/hero`, `--ease-out/spring/in-out`,
  keyframes `rise`, `pop`, `fade`, `drift-a/b/c` (landing cards). Everything
  collapses under `prefers-reduced-motion`.

**Components** (`src/components/`): `Button` (primary / secondary / ghost /
danger, sm / md / lg, loading; `buttonClasses` for links), `IconButton`
(labelled, tooltip with shortcut, pressed state), `Panel` + `Toolbar` +
`ToolbarDivider`, `Menu` (keyboard navigable dropdown), `Dialog` (focus trap,
Esc, focus restore), `Input` (label, hint, error), `Toast` (`useToast`, with
Undo actions), `Tooltip`, `Kbd` / `KeyCombo`, `Swatch`, `EmptyState`,
`Spinner`, `Wordmark`, `Link`.

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy
it with the `sites_deploy` tool (or the Sites API) from this directory.
