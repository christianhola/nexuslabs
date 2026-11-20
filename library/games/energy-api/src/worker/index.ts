import { Hono } from 'hono'
import type { Context } from 'hono'

import { contact } from '../content'
import { SANDBOX_KEY, sandboxDevices, validateSchedule } from '../shared/sandbox'
import { validateContact } from '../shared/validate'
import type { ContactInput } from '../shared/validate'

/*
  The Worker in front of the static site. It serves a small sandbox API the
  docs console calls (`/api/v1/*`) and the contact form. Nothing is stored:
  wire `/api/contact` to your CRM or inbox and `/api/v1` to your real API.
  Everything that is not /api/* falls through to the built assets (SPA mode).
*/
type Env = {
  ASSETS: Fetcher
}

const app = new Hono<{ Bindings: Env }>()

const id = (prefix: string) => `${prefix}_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`

async function body(c: Context): Promise<Record<string, unknown> | null> {
  const b = await c.req.json<unknown>().catch(() => null)
  return b && typeof b === 'object' && !Array.isArray(b) ? (b as Record<string, unknown>) : null
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

app.get('/api/health', (c) => c.json({ ok: true }))

// Sandbox API: every route needs `Authorization: Bearer gw_sbx_…`.
app.use('/api/v1/*', async (c, next) => {
  const auth = c.req.header('authorization') ?? ''
  const key = auth.replace(/^Bearer\s+/i, '')
  if (!SANDBOX_KEY.test(key)) {
    return c.json({ error: { type: 'unauthorized', message: 'Send a sandbox key as "Authorization: Bearer gw_sbx_…".' } }, 401)
  }
  await next()
})

app.get('/api/v1/devices', (c) => {
  const type = c.req.query('type')
  const data = type ? sandboxDevices.filter((d) => d.type === type) : sandboxDevices
  return c.json({ data, has_more: false })
})

app.get('/api/v1/devices/:id', (c) => {
  const device = sandboxDevices.find((d) => d.id === c.req.param('id'))
  if (!device) return c.json({ error: { type: 'not_found', message: `No device with id ${c.req.param('id')}.` } }, 404)
  return c.json(device)
})

app.post('/api/v1/devices/:id/schedules', async (c) => {
  const device = sandboxDevices.find((d) => d.id === c.req.param('id'))
  if (!device) return c.json({ error: { type: 'not_found', message: `No device with id ${c.req.param('id')}.` } }, 404)
  const b = await body(c)
  if (!b) return c.json({ error: { type: 'invalid_json', message: 'Send a JSON object.' } }, 400)
  const errors = validateSchedule(b)
  if (Object.keys(errors).length) return c.json({ error: { type: 'invalid_request', message: 'Some fields are invalid.', fields: errors } }, 422)
  return c.json(
    {
      id: id('sch'),
      device_id: device.id,
      status: 'scheduled',
      target_percent: Number(b.targetPercent),
      ready_by: b.readyBy,
      windows: [
        { start: '01:00', end: '03:30', power_kw: 7.4 },
        { start: '04:00', end: '05:00', power_kw: 7.4 },
      ],
      estimated_cost_eur: 3.42,
      estimated_saving_percent: 38,
    },
    201,
  )
})

app.post('/api/contact', async (c) => {
  const b = await body(c)
  if (!b) return c.json({ error: 'Send a JSON object.' }, 400)
  const input: ContactInput = {
    firstName: str(b.firstName),
    lastName: str(b.lastName),
    email: str(b.email),
    company: str(b.company),
    role: str(b.role),
    volume: str(b.volume),
    devices: Array.isArray(b.devices) ? b.devices.filter((d): d is string => typeof d === 'string') : [],
    message: str(b.message),
  }
  const errors = validateContact(input, contact.roles)
  if (Object.keys(errors).length) return c.json({ error: 'Some fields need attention.', errors }, 422)
  return c.json({ ok: true, id: id('req') }, 201)
})

app.all('/api/*', (c) => c.json({ error: 'not_found', path: new URL(c.req.url).pathname }, 404))

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
