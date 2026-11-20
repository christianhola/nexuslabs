# Keepsake: bookmark library

A calm, off-white landing page for a bookmarking app with memory, plus the
working library behind it: save links with a line of why, tag them, file them
into collections, and search in plain sentences ("typography I saved about two
weeks ago for the redesign"). The search reads dates, tags, collections, types
and favourites out of the sentence as chips you can drop. Everything runs in
the browser; the Worker only takes waitlist signups.

```sh
bun install
bun run dev        # http://localhost:5354
bun run typecheck
bun run build
```

## Screens

| Route | What it is |
| --- | --- |
| `/` | Landing: hero with the live library demo (it types a query, then it is yours), finding, saving, FAQ, waitlist call to action |
| `/pricing` | Three plans with a monthly/yearly switch, comparison table, billing FAQ |
| `/waitlist` | Waitlist confirmation: place in line, invite link, next steps (empty state if you have not joined) |
| `/app` | My shelf: natural-language search, filter chips, sort, grid/list, favourites |
| `/app/today`, `/app/favourites` | The same view over today's saves and starred saves |
| `/app/c/:id` | Collection: search within it, rename, delete with undo, empty state |
| `/app/item/:id` | Item detail: the why note (editable), tags, move collection, open link, delete with undo, related saves |
| `/styleguide` | Every token and component in every state, rendered by the real code |
| anything else | 404 |

Keyboard: `/` focuses search, `N` opens "Save a link", `Esc` closes dialogs and menus.

## Where things live

- Copy, plans, FAQ, seed shelf and image paths: `src/content.ts`. Every photo goes through `IMAGES`; swap the files in `public/images/` (they were generated for this template) for your own photography from that one place.
- The sentence parser and ranking: `src/lib/search.ts` (`parseQuery`, `searchItems`). Replace `searchItems` with an embedding search when you have a backend.
- Library state (items, collections) and its actions: `src/lib/library.ts`, saved in localStorage under `keepsake:library`. Layout, sort and billing choices are remembered too. The account menu in the app has "Reset demo data" and "Start empty".
- Tokens (colours, radii, shadows, motion): `src/styles.css`. Components: `src/components/`. Landing sections: `src/sections/`. Pages: `src/pages/` (library screens in `src/pages/app/`).
- Style guide: [`/styleguide`](/styleguide), also linked from the footer.

## Worker routes

All in `src/worker/index.ts`.

| Route | Body | Answers |
| --- | --- | --- |
| `GET /api/health` | | `{ ok: true }` |
| `POST /api/waitlist` | `{ email, plan? }` | 200 with `{ position, referral }`, 400 for a non-JSON body, 422 for a bad email or plan |
| anything else under `/api/` | | 404 JSON |

## Making it real

- Store waitlist signups in D1 (or send them to your email provider) in `/api/waitlist`.
- Move the library to D1 behind Sign in with Freebuff, and unfurl pasted links server-side for real titles and preview images.
- Add a browser extension or bookmarklet that posts to a `/api/save` route.
