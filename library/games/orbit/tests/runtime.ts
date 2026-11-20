/** Real workerd/WebSocket smoke and bounded load test. Local instances only. */
import { strict as assert } from 'node:assert'
import type { Snapshot } from '../src/shared/protocol'
const base = process.argv[2] ?? 'http://127.0.0.1:5192'
const origin = new URL(base).origin
const upgradeHeaders = {
  Upgrade: 'websocket',
  Connection: 'Upgrade',
  'Sec-WebSocket-Version': '13',
  'Sec-WebSocket-Key': Buffer.from(
    crypto.getRandomValues(new Uint8Array(16)),
  ).toString('base64'),
}
if (!['127.0.0.1', 'localhost', '[::1]'].includes(new URL(base).hostname))
  throw new Error('Refusing a non-local target')
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const Socket = globalThis.WebSocket as unknown as {
  new (url: string, options: Bun.WebSocketOptions): WebSocket
}
const sockets: WebSocket[] = []
type Client = {
  socket: WebSocket
  hello: { id: string; resume: string }
  state: Snapshot
  frames: number
  bytes: number
  intervals: number[]
  last: number
  seq: number
}
async function connect(
  room: string,
  name: string,
  token?: string,
  extra: Record<string, string> = {},
): Promise<Client> {
  return new Promise((resolve, reject) => {
    const c = {} as Client
    c.frames = 0
    c.bytes = 0
    c.intervals = []
    c.last = 0
    c.seq = 0
    const ws = new Socket(
      `${origin.replace('http', 'ws')}/api/play?${new URLSearchParams({ room, name, skin: '1' })}`,
      {
        protocols: token ? ['orbit', `resume.${token}`] : ['orbit'],
        headers: { Origin: origin, ...extra },
      },
    )
    c.socket = ws
    sockets.push(ws)
    const timeout = setTimeout(
      () => reject(new Error('WebSocket timeout')),
      5000,
    )
    ws.onmessage = (e) => {
      const d = JSON.parse(String(e.data))
      if (d.t === 'hello') c.hello = d
      if (d.t === 'state') {
        c.state = d
        c.frames++
        c.bytes += String(e.data).length
        const now = performance.now()
        if (c.last) c.intervals.push(now - c.last)
        c.last = now
        if (c.hello) {
          clearTimeout(timeout)
          resolve(c)
        }
      }
    }
    ws.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('Upgrade refused'))
    }
  })
}
const input = (c: Client) => {
  if (c.socket.readyState === WebSocket.OPEN && c.state)
    c.socket.send(
      JSON.stringify({
        t: 'input',
        seq: ++c.seq,
        frame: c.state.frame,
        x: c.state.center[0],
        y: c.state.center[1],
      }),
    )
}
let timer: ReturnType<typeof setInterval> | undefined
try {
  const foreign = await fetch(`${origin}/api/play?room=meadow`, {
    headers: { Origin: 'https://foreign.example', ...upgradeHeaders },
  })
  assert.equal(foreign.status, 403)
  const unsigned = await fetch(`${origin}/api/profile`, {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': 'application/json' },
    body: '{"skin":3}',
  })
  assert.equal(unsigned.status, 401)
  const badOrigin = await fetch(`${origin}/api/profile`, {
    method: 'POST',
    headers: {
      Origin: 'https://foreign.example',
      'Content-Type': 'application/json',
    },
    body: '{"skin":3}',
  })
  assert.equal(badOrigin.status, 403)
  assert.equal(
    (await fetch(`${origin}/api/result`, { method: 'POST' })).status,
    404,
  )
  assert.equal(
    (
      await fetch(`${origin}/api/play?room=arbitrary`, {
        headers: { Origin: origin, ...upgradeHeaders },
      })
    ).status,
    400,
  )
  const a = await connect('lagoon', 'Alpha'),
    b = await connect('lagoon', 'Beta'),
    separate = await connect('dusk', 'Separate')
  const clients = [a, b, separate]
  timer = setInterval(() => clients.forEach(input), 50)
  await sleep(350)
  assert(a.state.people.some((p) => p.name === 'Beta' && !p.bot))
  assert(b.state.people.some((p) => p.name === 'Alpha' && !p.bot))
  assert(!separate.state.people.some((p) => p.name === 'Alpha'))
  assert(a.state.foodDelta)
  assert(
    a.state.food.length < 100,
    'steady frames should contain deltas, not the whole food world',
  )
  const oldId = a.hello.id
  a.socket.close()
  await sleep(120)
  const resumed = await connect('lagoon', 'Alpha', a.hello.resume)
  clients[0] = resumed
  assert.equal(resumed.hello.id, oldId)
  const malformed = await connect('dusk', 'Malformed')
  const closed = new Promise<number>((resolve) => {
    malformed.socket.onclose = (e) => resolve(e.code)
  })
  malformed.socket.send('{"t":"input","x":1e99,"y":0,"seq":1}')
  assert.equal(await Promise.race([closed, sleep(2000).then(() => -1)]), 1008)
  separate.socket.send('{"t":"leave"}')
  separate.socket.close()
  await sleep(150)
  // Wait for the malformed socket's reconnect reservation to expire before the full room test.
  await sleep(12500)
  const load: Client[] = []
  for (let i = 0; i < 24; i++) {
    const c = await connect('dusk', `Load ${i}`)
    load.push(c)
    clients.push(c)
  }
  let refused = false
  try {
    await connect('dusk', 'Overflow')
  } catch {
    refused = true
  }
  assert(refused, '25th player must be refused')
  await sleep(3000)
  assert(
    load.every((c) => c.frames > 15),
    'every player must keep receiving updates',
  )
  const intervals = load
    .flatMap((c) => c.intervals.slice(-25))
    .sort((a, b) => a - b)
  const avgBytes = Math.round(
    load.reduce((s, c) => s + c.bytes / Math.max(1, c.frames), 0) / load.length,
  )
  console.log(
    JSON.stringify(
      {
        passed: [
          'guest multiplayer',
          'room isolation',
          'same-origin enforcement',
          'protected profile',
          'no client score route',
          'malformed input closes',
          'resume identity',
          'food deltas',
          '24-player room',
          'capacity rejection',
        ],
        snapshotIntervalMs: {
          median: Math.round(intervals[Math.floor(intervals.length * 0.5)]),
          p95: Math.round(intervals[Math.floor(intervals.length * 0.95)]),
        },
        averageFrameBytes: avgBytes,
      },
      null,
      2,
    ),
  )
} finally {
  clearInterval(timer)
  for (const ws of sockets) {
    if (ws.readyState === WebSocket.OPEN) ws.send('{"t":"leave"}')
    ws.close()
  }
}
