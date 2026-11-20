# Waitlist page

A coming-soon page with a working waitlist: a white split with the headline,
copy and an email form on the left, and a grey stage on the right with a
laptop (bleeding off the edge) and a phone in front, both showing a sunset
mountain wallpaper that slowly cycles through dusk, night, dawn and day.
Sign-ups go to D1 with a queue position, a share link and duplicate handling.

Below the fold: a press and social-proof strip, a features preview (four
cards with small animated product mocks), "move up the list" with a live
referral leaderboard, a founder note and an FAQ. Extra pages:

| Path | What |
|---|---|
| `/` | The landing page |
| `/?ref=<code>` | A share link: credits the friend who sent it. Opening your own link offers your status page |
| `/status/<code>` | Your spot, referrals, people ahead, share link and the leaderboard |
| `/admin` | Owner view: signups table, search, CSV export. Needs `ADMIN_TOKEN` |
| `/email-preview` | The confirmation email design (desktop/mobile, copy HTML). Nothing is sent |
| `/styleguide` | Every token and component, rendered live (also linked in the footer) |
| anything else | A 404 page |

## Run it

```sh
bun install
cp .dev.vars.example .dev.vars   # optional: set ADMIN_TOKEN to try /admin
bun run dev        # http://localhost:5173 with a local D1 database (Miniflare)
bun run build      # dist/client (assets) + dist/waitlist/index.js (Worker)
```

## Edit it

- `src/content.ts` holds every string: hero, form, success, press outlets,
  features, referral steps, founder note, FAQ, status, email and 404 copy, the
  launch date for the countdown (`launch.at`) and the laptop's bezel label.
  Start there.
- `src/worker/rank.ts` holds `BOOST`, how many places each referral moves
  someone up (5). Ranks are computed on read, so changing it re-ranks everyone.
- `src/pages/` has one file per route; `src/App.tsx` maps paths to pages with
  the tiny router in `src/lib/router.tsx` (`Link`, `navigate`, `usePath`).
- `src/sections/` are the landing page blocks: `Intro` and `Showcase` (the
  reference hero; pointer parallax, entrance and the wallpaper cycle,
  `CYCLE_MS`), then `Press`, `Features`, `Referrals`, `Founder`, `Faq`.
- `src/components/Wallpaper.tsx` draws the mountains: seeded ridge lines
  (change a `seed` for a different range), sky, clouds, stars and snow.
  `wallpaper-palettes.ts` holds one colour set per time of day. To use a photo
  instead, put it in `public/images/` and render an
  `<img className="h-full w-full object-cover">` in place of `<Wallpaper>`
  inside `<Laptop>` and `<Phone>`.
- `src/email/confirmation.ts` builds the confirmation email HTML (tables and
  inline styles). Pass its output to your email provider when you add
  sending; the template itself never sends mail.

## Design system

Open **`/styleguide`** to see all of it rendered by the real components.

- `src/styles.css` holds the tokens (`@theme`):
  - colours `page`, `stage`, `sunken`, `ink`, `body`, `muted`, `faint`,
    `line` (+ `-strong`, `-soft`), `accent` and its text-safe variants
    (`accent-strong` for display type, `accent-ink` for small text,
    `accent-fill` behind white button labels; all pass WCAG AA), `success`,
    `danger` (+ `-ink`, `-soft`);
  - type scale `text-display`, `-title`, `-heading`, `-lead`, `-copy`,
    `-small`, `-micro`;
  - `radius-control` (2px, the near-square inputs and buttons), `radius-card`;
  - `shadow-control`, `-card`, `-raised`, `-focus` (the orange ring),
    `-focus-danger`;
  - motion `ease-out-expo`, `ease-spring`, `duration-fast/base/slow`
    (mirrored for JS in `src/lib/motion.ts`), keyframes for the shake,
    success ring, cloud drift and the feature mocks;
  - state variants `is-hover:`, `is-active:`, `is-focus:`: components use
    these so the style guide can pin a state with `data-force="hover"`.
  - `prefers-reduced-motion` turns motion off everywhere; the mocks hold a
    finished frame.
- `src/tokens.ts` lists token names and notes for the style guide (values are
  read from the live CSS).
- `src/components/`
  - `ui.tsx`: `Button` / `ButtonLink` (primary, secondary, ghost; md and sm;
    loading), `TextLink`, `Input` (invalid, subtle, sm), `Label`,
    `FieldMessage`, `Badge`, `LiveDot`, `Spinner`, `Skeleton`, `Card`,
    `Callout`, `Stat`, `Avatar`, `AvatarStack`, `Eyebrow`, `SectionHeading`,
    `Container`.
  - `CopyField`, `SegmentedControl`, `Accordion`, `Reveal` (rise in on
    scroll), `Leaderboard` (+ `useLeaderboard`), `FeatureMocks`, `Brand`
    (`Logo`, `LogoMark`), `Layout` (`SiteHeader`, `SiteFooter`, `PageShell`).
  - `Devices.tsx`: CSS `Laptop` and `Phone` frames, sized in stage units
    (`--u`, one reference pixel at a 1440px window).
  - `WaitlistForm.tsx`: validation, submit, error and the success swap;
    `SuccessPanel.tsx`: check animation, counted-up spot, copy link, status
    link, share and email; `Countdown.tsx`: rolling digits to `launch.at`.

## The API

`src/worker/index.ts` is the Cloudflare Worker (Hono). All responses are
`no-store` JSON; unknown `/api/*` paths return 404.

- `GET /api/waitlist` returns `{ count }`.
- `POST /api/waitlist` with `{ email, ref? }` validates and lowercases the
  email, stores it with a short share code and returns
  `{ status: 'joined' | 'exists', position, count, code, referrals }` (201 or
  200; 400 for a bad email). Signing up twice returns the original spot.
  `?ref=<code>` on the page URL is recorded as `referred_by`. A hidden
  `company` field is a honeypot for bots.
- `GET /api/status/:code` returns `{ position, joinedAt, referrals, count,
  boost }` (400 for a malformed code, 404 for an unknown one). It never
  returns the email.
- `GET /api/leaderboard?code=` returns the top five referrers with masked
  names (`ja•••`), marking your row when you pass your code.
- `GET /api/admin` returns `{ enabled }` so the page can say admin is off.
- `GET /api/admin/signups` and `GET /api/admin/signups.csv` need
  `Authorization: Bearer <ADMIN_TOKEN>`. 401 for a wrong or missing token;
  404 `admin_disabled` when `ADMIN_TOKEN` is not set. The CSV defuses
  spreadsheet formulas. The admin page keeps the token in sessionStorage and
  downloads the CSV with the header, never in a URL.

`src/worker/db.ts` creates the `waitlist` table on the first request.

## Deploy with Freebuff Sites

1. `sites_create`, then `sites_add_storage` for D1 named `DB`.
2. To use `/admin`, add a secret `ADMIN_TOKEN` (a long random value, e.g.
   `openssl rand -hex 24`). Without it, admin stays off.
3. `bun run build`, then `sites_deploy` with `deploy.json` from this directory.

Without a `DB` binding the form shows "The waitlist database is not attached
yet" instead of failing silently.

Referrals are counted as they come in; the template does not verify that a
referred email is real, so add confirmation (double opt-in) before you rely on
the leaderboard for prizes.
