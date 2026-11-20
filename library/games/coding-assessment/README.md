# Codetrial: coding assessment platform

A dark, teal-lit marketing site for a technical hiring product, plus a working
demo of the product itself: a candidate challenge with an in-browser editor,
tests that really run, a scripted pair assistant, and the candidate report,
question library and assessment builder a hiring team would use.

```sh
bun install
bun run dev        # http://localhost:5326 (Vite + the Worker in workerd)
bun run typecheck
bun run build      # dist/client (assets) + dist/coding_assessment/index.js (Worker)
```

## Screens

| Route | What it is |
| --- | --- |
| `/` | Landing: stage hero (human + AI headline over the conductor photograph), customer strip, Screen/Interview/Report tabs with live product mocks (the Screen mock types a solution and runs the real tests), stats, features, developer community, testimonials, call to action |
| `/demo` | The candidate experience: pick a challenge, give a name, then solve it with a statement panel, code editor (highlighting, Tab indent, auto-indent), Run tests (Ctrl/Cmd+Enter), console output, a timer, the pair assistant, reset and submit. Code and session survive a reload |
| `/reports` | Candidates: stage tabs, search, sort, your own attempts marked "You" |
| `/reports/:id` | Candidate report: score ring, skill meters, every test (hidden ones marked), code playback with play, scrub and speed, AI prompt log, integrity signals, advance/reject, reviewer notes |
| `/library` | Question library: search and filters (type, difficulty, skill), preview drawer, add to the draft assessment, "Try it" for playable questions |
| `/assessments` | Assessment builder: name, role, time limit, assistant on/off, ordered questions; saved assessments with email invites and delete |
| `/pricing` | Plans with a monthly/annual switch, comparison table, FAQ |
| `/request-demo` | Demo request form (rejects free email domains) |
| `/signup` | Workspace sign-up |
| `/developers` | Practice challenges, the weekly leaderboard and events with RSVP |
| `/styleguide` | Every token and component in every state, rendered by the real code |
| anything else | 404 |

## Where things live

- Copy, plans, FAQ, assistant lines and image paths: `src/content.ts`. Every image goes through `IMAGES`, so swap in your own photography in `public/images/` from one place. The three images were generated for this template.
- Challenges (statement, starter code, tests, hints), the question library, sample candidates and the leaderboard: `src/data.ts`.
- Form rules and scoring shared by the page and the Worker: `src/shared/validate.ts`.
- The test runner: `src/lib/runner.ts`. Candidate code runs in a throwaway Web Worker in the browser with a 2.5 s limit; nothing executes on the server.
- The scripted assistant: `reply` in `src/components/AiPanel.tsx`. It answers from the problem's hints and refuses to write the solution.
- App state (attempts, review decisions and notes, assessments, draft, demo session): `src/lib/store.ts`, saved in localStorage under `codetrial:`. "Reset demo data" in the workspace bar clears it.
- Tokens (colours, radii, shadows, motion, syntax colours): `src/styles.css`. Components: `src/components/`. Landing sections: `src/sections/`. Pages: `src/pages/`.

## Worker routes

All in `src/worker/index.ts`. Each validates its input and answers JSON; nothing is stored server-side.

| Route | Body | Answers |
| --- | --- | --- |
| `GET /api/health` | | `{ ok: true }` |
| `POST /api/attempts/start` | `{ name, email, consent }` | 200 with an attempt id, 422 with field errors |
| `POST /api/attempts` | `{ candidate, problemId, code, passed, total, durationSec, aiPrompts, pastes, tabSwitches }` | 201 with `{ id, score }`, 422 for an unknown challenge or bad fields |
| `POST /api/demo-request` | `{ name, email, company, size, message }` | 200 or 422 |
| `POST /api/signup` | `{ name, email, company, password, terms }` | 201 or 422 |
| `POST /api/invites` | `{ assessment, emails[] }` | 200 with the count, 422 for a bad address or more than 25 |
| `POST /api/subscribe` | `{ email }` | 200 or 422 |
| anything else under `/api/` | | 404 JSON |

A body that is not a JSON object gets 400.

## Making it real

- Run tests server-side in a sandbox (or keep the browser runner and re-run hidden tests on the server) before trusting a score: today `/api/attempts` scores what the browser reports.
- Store attempts, reviews and assessments in D1 and send invites through your email provider from `/api/invites`.
- Replace `reply` in the assistant with a model call that is told never to write the solution.
- Swap `/api/signup` for Sign in with Freebuff.

## Deploy with Freebuff Sites

`deploy.json` already points at the build output. After `bun run build`, deploy it with the `sites_deploy` tool from this directory.
