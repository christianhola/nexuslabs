import { Miniflare, convertV4MiniflareOptions } from 'miniflare'
import { strict as assert } from 'node:assert'
import { resolve } from 'node:path'
const mf = new Miniflare(
  convertV4MiniflareOptions({
    name: 'orbit',
    modules: true,
    scriptPath: resolve('dist/server/index.js'),
    compatibilityDate: '2026-09-29',
    compatibilityFlags: ['nodejs_compat'],
    durableObjects: {
      ARENAS: { className: 'Arena', useSQLite: true },
      PROFILES: { className: 'Profiles', useSQLite: true },
    },
    bindings: {},
  }),
)
try {
  const ns = await mf.getDurableObjectNamespace('PROFILES'),
    stub = ns.get(ns.idFromName('profiles'))
  const call = async (user: string, path: string, data?: unknown) => {
    const r = await stub.fetch(`https://profiles/${path}`, {
      method: data ? 'POST' : 'GET',
      headers: { 'x-user': user },
      body: data ? JSON.stringify(data) : undefined,
    })
    assert.equal(r.status, 200)
    return (await r.json()) as Record<string, number>
  }
  const result = { id: crypto.randomUUID(), best: 320, eaten: 4, seconds: 90 }
  await call('a', 'result', result)
  await call('a', 'result', result)
  await call('a', 'skin', { skin: 5 })
  const a = await call('a', 'profile'),
    b = await call('b', 'profile')
  assert.deepEqual(a, { skin: 5, best: 320, rounds: 1, eaten: 4, seconds: 90 })
  assert.deepEqual(b, { skin: 0, best: 0, rounds: 0, eaten: 0, seconds: 0 })
  await call('a', 'result', {
    ...result,
    id: crypto.randomUUID(),
    best: 200,
    eaten: 1,
    seconds: 30,
  })
  assert.deepEqual(await call('a', 'profile'), {
    skin: 5,
    best: 320,
    rounds: 2,
    eaten: 5,
    seconds: 120,
  })
  console.log(
    'Profile SQL checks passed: account isolation, saved skin, best score, additive stats, duplicate result idempotency.',
  )
} finally {
  await mf.dispose()
}
