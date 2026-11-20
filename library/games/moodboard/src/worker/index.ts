import { Hono } from 'hono'

// The Worker in front of the static app. Boards live in the browser
// (localStorage + IndexedDB), so the only API is a health check; add routes
// here (with D1/R2 bindings) if you want boards to sync between devices.
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

app.get('/api/health', (c) => c.json({ ok: true }))

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
