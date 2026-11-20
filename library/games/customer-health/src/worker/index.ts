import { Hono } from 'hono'

import { accounts, contactsFor, SEGMENTS, type Segment } from '../data'

// The Worker in front of the dashboard. API routes live here; everything else
// falls through to the built assets (single-page-application mode).
//
// The routes below serve the seeded data so the app has real loading and
// error states. Point them at your warehouse, CRM or a D1 table instead.
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

const ID = /^acct-\d{3}$/

app.get('/api/health', (c) => c.json({ ok: true }))

/** GET /api/accounts?segment=Enterprise — account summaries. 400 on an unknown segment. */
app.get('/api/accounts', (c) => {
  const segment = c.req.query('segment')
  if (segment !== undefined && !SEGMENTS.includes(segment as Segment)) {
    return c.json({ error: `Unknown segment. Use one of: ${SEGMENTS.join(', ')}` }, 400)
  }
  const list = segment ? accounts.filter((a) => a.segment === segment) : accounts
  return c.json({
    accounts: list.map(({ id, name, segment, arr, owner, renewal, history }) => ({ id, name, segment, arr, owner, renewal, health: history[history.length - 1] })),
  })
})

/** GET /api/accounts/:id/contacts — 400 for a malformed id, 404 for an unknown one. */
app.get('/api/accounts/:id/contacts', (c) => {
  const id = c.req.param('id')
  if (!ID.test(id)) return c.json({ error: 'Malformed account id' }, 400)
  const account = accounts.find((a) => a.id === id)
  if (!account) return c.json({ error: 'Account not found' }, 404)
  return c.json({ contacts: contactsFor(account) }, 200, { 'Cache-Control': 'private, max-age=60' })
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
