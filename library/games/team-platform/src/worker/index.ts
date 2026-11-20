import { Hono } from 'hono'

import { validateDemo, validateEmail, validateIntegrationRequest } from '../lib/validate'

// The Worker in front of the static site. Every form posts here and is
// validated with the same rules as the page (src/lib/validate.ts). Nothing
// is stored yet: wire the TODOs to your CRM, inbox or a D1 table.
type Env = { ASSETS: Fetcher }

const app = new Hono<{ Bindings: Env }>()

async function body(c: { req: { json: <T>() => Promise<T> } }) {
  const b = await c.req.json<Record<string, unknown>>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? b : null
}
const str = (v: unknown) => (typeof v === 'string' ? v : '')
const ref = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`

app.get('/api/health', (c) => c.json({ ok: true }))

// Hero and footer email capture: 422 with a field error, or 201.
app.post('/api/leads', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error, errors: { email: error } }, 422)
  // TODO: add the lead to your CRM, tagged with b.source.
  return c.json({ ok: true }, 201)
})

// Newsletter sign-up in the footer.
app.post('/api/subscribe', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const error = validateEmail(str(b.email))
  if (error) return c.json({ error, errors: { email: error } }, 422)
  // TODO: add the address to your mailing list.
  return c.json({ ok: true }, 201)
})

// Demo booking: details plus a weekday slot in the next four weeks.
app.post('/api/demo', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = {
    name: str(b.name),
    email: str(b.email),
    company: str(b.company),
    size: str(b.size),
    role: str(b.role),
    interests: Array.isArray(b.interests) ? b.interests.map(str) : [],
    date: str(b.date),
    slot: str(b.slot),
    notes: str(b.notes),
  }
  const errors = validateDemo(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: create the meeting in your calendar tool and notify sales.
  return c.json({ ok: true, ref: ref('BW') }, 201)
})

// "Request an integration" on /integrations.
app.post('/api/integration-requests', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON body.' }, 400)
  const input = { tool: str(b.tool), email: str(b.email), useCase: str(b.useCase) }
  const errors = validateIntegrationRequest(input)
  if (Object.keys(errors).length) return c.json({ error: 'Check the highlighted fields.', errors }, 422)
  // TODO: send to your product team's intake.
  return c.json({ ok: true, ref: ref('INT') }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'Not found' }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
