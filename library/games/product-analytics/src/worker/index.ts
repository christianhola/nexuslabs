import { Hono } from 'hono'

import { validateContact, validateEmail, validateSignup } from '../lib/validate'

// The Worker in front of the static site. Every form posts here and is
// validated with the same rules as the page (src/lib/validate.ts). Wire the
// TODOs to your email provider, CRM or a D1 table; nothing is stored yet.
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body(c: { req: { json: <T>() => Promise<T> } }) {
  const b = await c.req.json<Record<string, unknown>>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? b : null
}
const str = (v: unknown) => (typeof v === 'string' ? v : '')

app.get('/api/health', (c) => c.json({ ok: true }))

// Newsletter, changelog and status updates.
app.post('/api/subscribe', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error, errors: { email: error } }, 422)
  // TODO: add the address to your mailing list.
  return c.json({ ok: true })
})

// "Talk to us": 422 with per-field errors, or 201 with a reference.
app.post('/api/contact', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), company: str(b.company), size: str(b.size), topic: str(b.topic), message: str(b.message) }
  const errors = validateContact(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: forward to your inbox or CRM.
  return c.json({ ok: true, ref: `PB-${Date.now().toString(36).toUpperCase().slice(-6)}` }, 201)
})

// Sign up. The password is validated here but never stored or echoed.
app.post('/api/signup', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { name: str(b.name), email: str(b.email), password: str(b.password), company: str(b.company) }
  const errors = validateSignup(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: create the user with real auth (for example Sign in with Freebuff).
  return c.json({ ok: true, workspace: input.company.trim() }, 201)
})

// Status report for /status. Seeded so the bars are stable between reloads.
// `?fail=1` returns 503 so the page's error state can be tested.
app.get('/api/status', (c) => {
  if (c.req.query('fail')) return c.json({ error: 'The status service is unavailable. Try again in a minute.' }, 503)
  return c.json(statusReport(new Date()))
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app

const components = [
  { id: 'ingest', name: 'Event ingestion', description: 'SDKs and the HTTP collector', incidents: { 12: 'degraded', 57: 'degraded' } },
  { id: 'query', name: 'Query engine', description: 'Funnels, retention, journeys', incidents: { 33: 'degraded' } },
  { id: 'signals', name: 'Signals and alerts', description: 'Anomaly detection, Slack, email, webhooks', incidents: { 71: 'outage', 72: 'degraded' } },
  { id: 'app', name: 'Web app and API', description: 'app.pulseboard.dev and the Export API', incidents: {} },
] as const

function statusReport(now: Date) {
  const day = (i: number) => {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - (89 - i))
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  }
  return {
    updatedAt: now.toISOString(),
    overall: 'operational' as const,
    components: components.map((comp) => {
      const inc = comp.incidents as Record<number, 'degraded' | 'outage'>
      const days = Array.from({ length: 90 }, (_, i) => ({
        date: day(i),
        status: inc[i] ?? ('ok' as const),
        note: inc[i] === 'outage' ? 'Alert delivery delayed 38 min' : inc[i] ? 'Elevated latency' : undefined,
      }))
      const lost = Object.values(inc).reduce((s, v) => s + (v === 'outage' ? 0.04 : 0.01), 0)
      return { id: comp.id, name: comp.name, description: comp.description, status: 'operational' as const, uptime: Number((100 - lost).toFixed(2)), days }
    }),
    incidents: [
      { id: 'i3', date: day(72), title: 'Delayed Slack and email alerts', status: 'resolved' as const, body: 'A queue consumer stalled after a deploy. Alerts were delayed by up to 38 minutes; none were lost. We added a lag alarm on the queue.' },
      { id: 'i2', date: day(57), title: 'Slow ingestion in EU region', status: 'resolved' as const, body: 'Event ingestion latency rose to 40 s for 25 minutes during a storage rebalance. All events were processed.' },
      { id: 'i1', date: day(33), title: 'Slower funnel queries', status: 'resolved' as const, body: 'Large funnels took up to 20 s while a cache node was replaced. Results were correct throughout.' },
    ],
  }
}
