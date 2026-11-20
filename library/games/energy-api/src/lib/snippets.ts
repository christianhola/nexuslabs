import { brand } from '../content'

/*
  Code samples for the landing page and the quickstart, per language. The
  base URL is the placeholder in `brand.apiBase`; swap it for your own.
*/
export type Lang = 'curl' | 'node' | 'python'

const base = brand.apiBase

export const snippets: Record<'install' | 'link' | 'read' | 'schedule' | 'webhook', Record<Lang, string>> = {
  install: {
    curl: `# No install needed: every endpoint is plain HTTPS.
export GRIDWISE_KEY="gw_sbx_..."`,
    node: `npm install @gridwise/node

# then, in your shell
export GRIDWISE_KEY="gw_sbx_..."`,
    python: `pip install gridwise

# then, in your shell
export GRIDWISE_KEY="gw_sbx_..."`,
  },
  link: {
    curl: `curl -X POST ${base}/link-sessions \\
  -H "Authorization: Bearer $GRIDWISE_KEY" \\
  -d '{ "user_id": "user_123", "vendor": "voltaro", "redirect_uri": "https://app.example/linked" }'

# → { "link_url": "https://link.gridwise.example/s/lnk_...", "expires_in": 900 }`,
    node: `import Gridwise from '@gridwise/node'

const gw = new Gridwise(process.env.GRIDWISE_KEY)

const session = await gw.linkSessions.create({
  userId: 'user_123',
  vendor: 'voltaro',
  redirectUri: 'https://app.example/linked',
})

// Send your customer to session.linkUrl`,
    python: `from gridwise import Gridwise
import os

gw = Gridwise(os.environ["GRIDWISE_KEY"])

session = gw.link_sessions.create(
    user_id="user_123",
    vendor="voltaro",
    redirect_uri="https://app.example/linked",
)

# Send your customer to session.link_url`,
  },
  read: {
    curl: `curl ${base}/devices?type=vehicle \\
  -H "Authorization: Bearer $GRIDWISE_KEY"`,
    node: `import Gridwise from '@gridwise/node'

const gw = new Gridwise(process.env.GRIDWISE_KEY)

const { data } = await gw.devices.list({ type: 'vehicle' })
console.log(data[0].state.battery_percent) // 46`,
    python: `from gridwise import Gridwise
import os

gw = Gridwise(os.environ["GRIDWISE_KEY"])

cars = gw.devices.list(type="vehicle")
print(cars.data[0].state.battery_percent)  # 46`,
  },
  schedule: {
    curl: `curl -X POST ${base}/devices/veh_7Hq2Lx/schedules \\
  -H "Authorization: Bearer $GRIDWISE_KEY" \\
  -d '{ "targetPercent": 80, "readyBy": "07:00" }'`,
    node: `const schedule = await gw.devices.schedules.create('veh_7Hq2Lx', {
  targetPercent: 80,
  readyBy: '07:00',
})

console.log(schedule.windows) // the cheapest hours before 07:00`,
    python: `schedule = gw.devices.schedules.create(
    "veh_7Hq2Lx",
    target_percent=80,
    ready_by="07:00",
)

print(schedule.windows)  # the cheapest hours before 07:00`,
  },
  webhook: {
    curl: `# Gridwise POSTs this to your endpoint
{
  "type": "device.state.updated",
  "device_id": "veh_7Hq2Lx",
  "changes": { "battery_percent": 52, "is_charging": true },
  "created_at": "2026-11-12T01:04:22Z"
}`,
    node: `import express from 'express'

app.post('/webhooks/gridwise', express.raw({ type: 'application/json' }), (req, res) => {
  const event = gw.webhooks.verify(req.body, req.headers['gridwise-signature'], process.env.GRIDWISE_WEBHOOK_SECRET)
  if (event.type === 'device.state.updated') updateDashboard(event.device_id, event.changes)
  res.sendStatus(200)
})`,
    python: `@app.post("/webhooks/gridwise")
def gridwise_webhook(request):
    event = gw.webhooks.verify(
        request.body, request.headers["gridwise-signature"], os.environ["GRIDWISE_WEBHOOK_SECRET"]
    )
    if event.type == "device.state.updated":
        update_dashboard(event.device_id, event.changes)
    return 200`,
  },
}
