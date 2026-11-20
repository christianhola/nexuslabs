// Local workerd only. Never run a load probe against production infrastructure.
import { strict as assert } from 'node:assert'
const origin = 'http://127.0.0.1:5197'
const sockets: WebSocket[] = []
const deltas: number[] = []
let bytes = 0,
  states = 0
async function connect(ack = true) {
  return await new Promise<{ ws: WebSocket; closed: Promise<number> }>(
    (resolve, reject) => {
      const ws = new WebSocket(
        `${origin.replace('http', 'ws')}/api/play?room=Dusk`,
        { headers: { Origin: origin } },
      )
      sockets.push(ws)
      let done!: (code: number) => void,
        last = 0
      const closed = new Promise<number>((r) => (done = r))
      const timeout = setTimeout(() => reject(new Error('Probe timeout')), 8000)
      ws.onmessage = (event) => {
        const m = JSON.parse(String(event.data))
        if (m.type === 'welcome') {
          clearTimeout(timeout)
          ws.send(
            JSON.stringify({ type: 'join', name: 'Capacity probe', skin: 1 }),
          )
          resolve({ ws, closed })
        }
        if (m.type === 'state') {
          bytes += String(event.data).length
          states++
          const now = performance.now()
          if (last) deltas.push(now - last)
          last = now
          if (ack) ws.send(JSON.stringify({ type: 'ack', tick: m.tick }))
        }
      }
      ws.onerror = () => {
        clearTimeout(timeout)
        reject(new Error('Refused'))
      }
      ws.onclose = (e) => done(e.code)
    },
  )
}
try {
  for (let i = 0; i < 24; i++) await connect()
  await assert.rejects(connect())
  await Bun.sleep(1800)
  deltas.sort((a, b) => a - b)
  assert.ok(states > 200)
  console.log(
    JSON.stringify({
      clients: 24,
      overflowRefused: true,
      snapshots: states,
      intervalMedianMs: Math.round(deltas[Math.floor(deltas.length * 0.5)]),
      intervalP95Ms: Math.round(deltas[Math.floor(deltas.length * 0.95)]),
      payloadKiB: Math.round(bytes / 1024),
    }),
  )
} finally {
  for (const ws of sockets) ws.close(1000, 'Probe complete')
}
await Bun.sleep(200)
try {
  const slow = await connect(false)
  assert.equal(
    await Promise.race([slow.closed, Bun.sleep(6000).then(() => 0)]),
    1013,
  )
  console.log('Slow client disconnected without an unbounded snapshot queue.')
  const flood = await connect()
  flood.ws.send('x'.repeat(513))
  assert.equal(
    await Promise.race([flood.closed, Bun.sleep(2000).then(() => 0)]),
    1008,
  )
  console.log('Oversized frame rejected.')
} finally {
  for (const ws of sockets) ws.close(1000, 'Probe complete')
}
