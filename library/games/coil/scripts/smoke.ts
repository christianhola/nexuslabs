// Bounded integration probe against workerd or the isolated preview; no browser automation.
import { strict as assert } from 'node:assert'
import { BOOST_SPEED, SPEED, STEP } from '../src/shared/protocol'
const origin = process.argv[2] ?? 'http://127.0.0.1:5197'
const wsOrigin = origin.replace(/^http/, 'ws')
type Client = {
  ws: WebSocket
  id: string
  states: any[]
  bytes: number
  started: number
  closed: Promise<number>
}
async function connect(
  room: string,
  name: string,
  originHeader = origin,
): Promise<Client> {
  return await new Promise((resolve, reject) => {
    const ws = new WebSocket(`${wsOrigin}/api/play?room=${room}`, {
      headers: { Origin: originHeader },
    })
    let closeResolve!: (code: number) => void
    const client: Client = {
      ws,
      id: '',
      states: [],
      bytes: 0,
      started: performance.now(),
      closed: new Promise((r) => (closeResolve = r)),
    }
    const timeout = setTimeout(() => {
      ws.close()
      reject(new Error('Connection timeout'))
    }, 8000)
    ws.onmessage = (event) => {
      const m = JSON.parse(String(event.data))
      client.bytes += String(event.data).length
      if (m.type === 'welcome') {
        client.id = m.id
        ws.send(JSON.stringify({ type: 'join', name, skin: 0 }))
      }
      if (m.type === 'state') {
        client.states.push(m)
        ws.send(JSON.stringify({ type: 'ack', tick: m.tick }))
        if (client.states.length === 1) {
          clearTimeout(timeout)
          resolve(client)
        }
      }
    }
    ws.onerror = () => {
      clearTimeout(timeout)
      reject(new Error('WebSocket refused'))
    }
    ws.onclose = (e) => {
      clearTimeout(timeout)
      closeResolve(e.code)
    }
  })
}
const clients: Client[] = []
try {
  assert.equal(
    (
      await fetch(`${origin}/api/skin`, {
        method: 'POST',
        headers: {
          Origin: 'https://foreign.example',
          'Content-Type': 'application/json',
        },
        body: '{"skin":1}',
      })
    ).status,
    403,
  )
  assert.equal(
    (
      await fetch(`${origin}/api/skin`, {
        method: 'POST',
        headers: {
          Origin: origin,
          'Content-Type': 'application/json',
          'x-coil-sub': 'forged',
        },
        body: '{"skin":1}',
      })
    ).status,
    401,
  )
  const a = await connect('Lagoon', 'Probe one')
  clients.push(a)
  const b = await connect('Lagoon', 'Probe two')
  clients.push(b)
  const c = await connect('Dusk', 'Isolated')
  clients.push(c)
  // A newly joined snake must boost before collecting any food. Keep its
  // initial heading so displacement measures speed, not a turning chord.
  const fresh = c.states[0].snakes.find((s: any) => s.id === c.id)
  assert.ok(fresh)
  c.ws.send(JSON.stringify({ type: 'input', angle: fresh.angle, boost: true }))
  await Bun.sleep(400)
  const boosted = c.states.filter(
    (s) => s.snakes.find((p: any) => p.id === c.id)?.boost,
  )
  assert.ok(boosted.length >= 2, 'Fresh snake did not boost')
  const speedBetween = (a: any, b: any) => {
    const p = a.snakes.find((s: any) => s.id === c.id)
    const q = b.snakes.find((s: any) => s.id === c.id)
    return (
      Math.hypot(q.body[0] - p.body[0], q.body[1] - p.body[1]) /
      ((b.tick - a.tick) * STEP)
    )
  }
  assert.ok(
    Math.abs(speedBetween(boosted[0], boosted.at(-1)) - BOOST_SPEED) < 3,
  )
  const releasedAt = c.states.length
  c.ws.send(JSON.stringify({ type: 'input', angle: fresh.angle, boost: false }))
  await Bun.sleep(400)
  const released = c.states
    .slice(releasedAt)
    .filter((s) => !s.snakes.find((p: any) => p.id === c.id)?.boost)
  assert.ok(released.length >= 2, 'Boost did not release')
  assert.ok(Math.abs(speedBetween(released[0], released.at(-1)) - SPEED) < 3)
  await Bun.sleep(900)
  assert.notEqual(a.id, b.id)
  assert.equal(a.states.at(-1).online, 2)
  assert.equal(b.states.at(-1).online, 2)
  assert.equal(c.states.at(-1).online, 1)
  // Players can spawn outside each other's interest area. Compare a shared
  // entity at the same authoritative tick, rather than requiring global visibility.
  const paired = a.states.flatMap((sa) =>
    b.states.filter((sb) => sb.tick === sa.tick).map((sb) => ({ sa, sb })),
  )
  const shared = paired.flatMap(({ sa, sb }) =>
    sa.snakes.flatMap((s: any) =>
      sb.snakes
        .filter((other: any) => other.id === s.id)
        .map((other: any) => ({ s, other })),
    ),
  )
  assert.ok(shared.length > 0)
  for (const { s, other } of shared) assert.deepEqual(s.body, other.body)
  assert.ok(
    c.states.every((s) =>
      s.snakes.every((p: any) => p.id !== a.id && p.id !== b.id),
    ),
  )
  assert.ok(a.states.length >= 5)
  assert.ok(a.states.at(-1).tick > a.states[0].tick)
  assert.ok(a.states.slice(1).some((s) => s.food.length < 30))
  assert.ok(
    a.states
      .flatMap((s) => s.snakes)
      .filter((s: any) => s.bot)
      .every((s: any) => s.id.startsWith('bot-')),
  )
  // The server owns motion even when a client invents a score and position.
  a.ws.send(
    JSON.stringify({
      type: 'input',
      angle: 0,
      boost: false,
      score: 999999,
      x: 999999,
    }),
  )
  await Bun.sleep(150)
  const me = a.states.at(-1).snakes.find((s: any) => s.id === a.id)
  assert.ok(me && me.score < 10000 && Math.abs(me.body[0]) < 2100)
  await assert.rejects(connect('Meadow', 'Foreign', 'https://foreign.example'))
  await assert.rejects(connect('arbitrary-object-name', 'Unknown'))
  console.log(
    JSON.stringify({
      ok: true,
      sameRoomPlayers: 2,
      isolatedRooms: true,
      crossOriginRejected: true,
      guestStatsRejected: true,
      deltaFood: true,
      freshSnakeBoost: true,
      boostSpeed: BOOST_SPEED,
      releasedSpeed: SPEED,
      snapshots: a.states.length,
      bytesPerSecond: Math.round(
        a.bytes / ((performance.now() - a.started) / 1000),
      ),
    }),
  )
} finally {
  for (const c of clients) c.ws.close(1000, 'Probe complete')
}
