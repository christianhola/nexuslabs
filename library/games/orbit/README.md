# Orbit

A restrained, pastel cell arena inspired by Agar.io. Guests can join public rooms immediately. Optional Sign in with Freebuff saves a skin, best mass, rounds, cells eaten, and survival time. The client is a small TypeScript/Canvas 2D application with a locally bundled variable font; no framework, asset CDN, or third-party game server is required.

## Hosting

Orbit runs on its own Cloudflare Worker with two SQLite Durable Object classes: `Arena` for authoritative multiplayer and `Profiles` for account records. Every copy deploys independent rooms and data. It requires a Cloudflare account with Durable Objects enabled.

**Freebuff Sites' managed deployer does not currently support this game's custom Durable Objects.** Use the direct Cloudflare deployment below. Do not strip the bindings, route copies to a shared demo server, or claim `sites_deploy` can host this project. The Freebuff template catalogue installs the complete source; it does not provision this game server.

Guest play works immediately in local development. Freebuff sign-in is optional and appears only after the owner registers this project's callback and supplies the public auth configuration. The account storage tests cover isolation and server-computed stats; a real sign-in/callback/sign-out must also be checked against the owner's registration before enabling it for players.

## Local development

```sh
bun install
bun run dev
```

Open the printed address (normally `http://127.0.0.1:5192`). Vite runs actual local workerd and SQLite, not a mock WebSocket server. An unconfigured loopback preview supports guests and never substitutes a fake signed-in account. For a remote Cloud preview, bind with `bun run dev --host 0.0.0.0` and set `APP_ORIGIN` in an ignored `.dev.vars` to its exact assigned HTTPS preview origin before restarting the server.

```sh
bun run typecheck
bunx bun@1.3.14 test tests/physics.test.ts tests/protocol.test.ts
bun run build
bun run test:profiles
bun run preview
# In another terminal; uses only this local Worker:
bun tests/runtime.ts http://127.0.0.1:8792
```

The runtime check creates at most 24 players in a room, verifies capacity rejection and reconnects, and closes its sockets. Only loopback targets are allowed. Stop both local servers after testing. `test:profiles` uses an isolated, ephemeral Miniflare SQLite instance and synthetic subjects.

## Controls

- Cursor to move; drag anywhere in the arena on touch.
- Space or Split divides a sufficiently large cell, with forward momentum.
- Hold `w` or Feed to eject mass.
- Escape opens the leave menu. Online play continues while menus are open.
- Spiky cells burst larger cells. Split cells reunite after their cooldown.

## Runtime

The Worker validates the canonical origin and Freebuff session, then forwards a WebSocket to a private `ARENAS` binding. Identity headers are stripped and overwritten before forwarding. Only the three checked-in room names resolve; clients cannot create more room objects. Each room allows 24 humans, 16 cells per player, 1,400 ambient food dots, bounded ejected food and viruses, and a small bot population. Bots are labelled and leave as humans arrive.

The server simulates at a fixed 30 Hz with a bounded catch-up budget. The client sends aim/actions at 20 Hz; it never controls positions, mass, collisions, or results. Snapshots target 15 Hz, include nearby entities, and send food deltas. Frame acknowledgements cap outstanding snapshots at 12. Input frames are capped at 512 characters and a 40-per-second token bucket. Inactive inputs stop movement, abandoned sockets are removed, and rounds have a one-hour maximum. Disconnects have a 12-second reconnect grace using an opaque, in-memory resume capability tied to the authenticated subject. Active rooms use CPU; the tick stops when the last session leaves. These are **not hibernating game loops**.

The renderer caches cell textures, culls offscreen objects, caps device pixel ratio at 2, interpolates remote motion, predicts at most 100 ms of local movement, and smooths camera position/zoom. It respects reduced motion and stops drawing while hidden. Skins and the font ship with the bundle. Soft synthesized sounds are opt-in.

`PROFILES` is a separate private SQLite Durable Object. Server-computed round results are recorded once per result ID, with additive totals and a monotonic personal best. Client-facing profile writes permit only an allowlisted skin and require a verified user plus same-origin POST. Guest records stay on the device. There is no public score-submission endpoint. Recent result IDs are bounded per subject. Live rounds are ephemeral: Worker restarts end them, while completed account stats survive.

## Deploy to Cloudflare

1. Choose a unique Worker `name` in `wrangler.jsonc`. Log in with `bunx wrangler login`, or use an existing `CLOUDFLARE_API_TOKEN` in your shell. Never add credentials to project files.
2. Set `vars.APP_ORIGIN` in `wrangler.jsonc` to the exact public origin, such as `https://your-game.your-subdomain.workers.dev`. It is a public URL, without a trailing slash. Request Host headers are accepted as an origin only on loopback; deployed WebSockets require this explicit origin.
3. Run `bun run build`, then `bun run deploy`. The build output stays in `dist/server` even when the Worker is renamed. Wrangler creates the two private Durable Object namespaces from the migration.
4. Verify two browsers can join the same room, see each other, reconnect, and play. Check a second room is isolated. Use your own test deployment for capacity testing.

Active matches consume Durable Object CPU and duration. There are three rooms with at most 24 human players each, not an unbounded matchmaking service. Stop advertising a deployment before removing its Worker or namespaces; deleting profile storage erases saved stats.

## Optional Freebuff auth

Using the creator's Freebuff CLI login, register a separate client for the new project's exact callback:

```sh
bunx @freebuff/auth register --project your-game --name Orbit \
  --environment production \
  --redirect-uri https://your-game.your-subdomain.workers.dev/auth/freebuff/callback
```

Add the returned public `FREEBUFF_CLIENT_ID` and `FREEBUFF_ISSUER` to `vars` beside `APP_ORIGIN` in `wrangler.jsonc`, rebuild, and deploy. These are public auth configuration fields; there is no client or session secret. Never reuse another project's client ID. For local auth, use a development registration with the exact loopback callback and put its public fields in an ignored `.dev.vars` file.

Check sign-in, callback, sign-out, saved skin and completed-round stats with two real accounts. Account profiles must remain separate. Without auth configuration the game stays fully playable as a guest and does not offer a nonfunctional sign-in link.

## Customize

- `src/shared/config.ts`: room names, palette, world size and player limits.
- `src/shared/physics.ts`: movement, split/merge, eating and bots.
- `src/client/render.ts`: canvas textures, camera and animation.
- `src/client/style.css`: typography and responsive interface.
- `src/server/index.ts`: verified identity, WebSocket routing and stored profiles.

Keep the server authoritative and the client/server protocol in sync. The runtime test opens real sockets and verifies room capacity, reconnect identity, input limits and room isolation.
