# Coil

A polished multiplayer snake arena. Guests enter immediately, gather light,
boost, and cut off other snakes to collect their trails. Original procedural
artwork, local variable fonts, six colors and mouse, keyboard and touch controls.

[Play the demo](https://freebuff-coil-preview.james-6e5.workers.dev).

## Run

```sh
bun install --frozen-lockfile
bun run dev
```

Requires Bun 1.3.14 (see `.bun-version`). Vite runs the Worker and its Durable
Objects in local workerd at `http://127.0.0.1:5197`. No cloud account or sign-in
is required locally. For a Cloud workspace, use `bun run dev --host 0.0.0.0`
and open the forwarded port. A different port can be passed with `--port`.

Steer with the mouse or arrow/WASD keys. Hold Space or the left mouse button to
boost. On touchscreens, drag in the arena to steer and hold the lightning button.
Boost works immediately; it spends accumulated length but never reduces a snake
below its starting length. Only spent mass becomes collectible food.

## Customize

- `src/client/style.css`: interface colors, spacing and typography.
- `src/client/renderer.ts`: Canvas 2D artwork, particles, camera and interpolation.
- `src/client/main.ts`: lobby, controls, sound, invite links and account UI.
- `src/shared/protocol.ts`: skins, rooms, speeds, world size and shared messages.
- `src/shared/simulation.ts`: authoritative movement, collision, food and bot AI.
- `src/worker/arena.ts`: game connections, room lifecycle and saved profiles.
- `src/worker/index.ts`: API routes, origin checks and optional Freebuff auth.

## Deploy

This game requires **its own Cloudflare Worker and Durable Objects**. The managed
Freebuff Sites realtime service handles broadcasts and presence, not custom game
loops; ordinary `sites_deploy` does not support this template's Durable Object
class. Deploy it directly with Wrangler. Do not deploy just the static assets or
point copied projects at the demo's server.

```sh
bun run build
bunx wrangler deploy --config dist/coil_preview/wrangler.json \
  --name your-coil-game --var APP_ORIGIN:https://your-game.example
```

Use a unique Worker name and the actual canonical origin (including the scheme,
without a trailing slash). The example origin must be replaced before deploying.
Configure the corresponding Workers domain or custom domain in your own account.
Wrangler provisions the `Arena` Durable Object binding and its SQLite migration.
Supply credentials through Wrangler's login or your secret manager; never put
account tokens in this project. The source config contains no deployed identity.

During local development the origin is derived from the request URL, so forwarded
previews and alternate ports work. A deployed `APP_ORIGIN` pins browser writes and
WebSocket upgrades to the configured origin. Active matches are ephemeral: a
Worker restart or deployment ends them and the client offers re-entry. Active
game timers incur Durable Object duration charges; they do not hibernate.

## Runtime

The server owns positions, score, collisions and results. Clients send only
heading and boost. The world runs at 30 Hz with spatial collision and food grids;
clients receive up to 15 interest-filtered snapshots per second, incremental food
updates and acknowledged delivery. Client prediction, remote interpolation and
an eased camera keep drawing smooth between updates. Pixel ratio is capped at
two; hidden tabs stop drawing and reduced motion suppresses decorative movement.

There are three fixed rooms, each allowing 24 human connections and eight labeled
bots. A room stops its timer and clears its match when the last socket leaves.
Each connection allows 40 incoming frames/second, burst 60, at most 512 characters
per frame. Slow clients disconnect rather than accumulate outgoing snapshots.
Sessions end after 20 minutes; idle connections close after 90 seconds. Arbitrary
room names cannot create Durable Objects.

## Optional Freebuff sign-in

Guest play is the default. Name, color, sound preference and personal best stay
in the player's browser. The demo currently runs in guest mode.

To enable accounts, sign in to the Freebuff CLI and register a new auth client for
your own project and its `/auth/freebuff/callback` URL. Follow the installed
`node_modules/@freebuff/auth/AGENTS.md` for registration and hosted auth testing.
Set the returned public `FREEBUFF_CLIENT_ID`, `FREEBUFF_ISSUER` (if supplied) and
canonical `APP_ORIGIN` in your Worker config. Never reuse the demo's identity or
put the creator's CLI token into the Worker.

Once configured, the UI exposes Sign in with Freebuff, saved color, best score,
games and knockouts. A fourth, fixed `profiles` Durable Object stores these under
the server-verified user ID. Only the authoritative game server records results.
Caller-supplied identity headers are discarded; guests cannot write account
stats. Nothing uses Freebuff's shared Postgres or Convex databases.

Before enabling accounts publicly, verify sign-in, sign-out, saved stats and
isolation between two real accounts. Account flows have not been exercised on
the guest demo.

## Verify

```sh
bun run typecheck
bun run test
bun run build
# With the dev server running:
bun scripts/smoke.ts
bun scripts/capacity.ts
```

The smoke probe also accepts an isolated preview origin as its first argument.
It checks real two-client shared state, separate rooms, fresh-snake boost speed,
release speed, forged-score rejection, cross-origin rejection and guest account
write rejection. The capacity probe is deliberately restricted to localhost;
it tests 24 connections, rejection of the 25th, slow clients and oversized frames.
Stop the dev server after testing.

Twelve gameplay/protocol tests, browser/Worker/probe typechecks and the build
passed. Browser checks covered Space and left-click activation/release, keyboard
focus after joining, and no page overflow at 390×844 and 844×390. The local
capacity probe measured a 74 ms median snapshot interval and 77 ms p95; these
are local observations, not a production capacity or latency guarantee. Physical
touchscreen play and registered-account flows remain unverified.
