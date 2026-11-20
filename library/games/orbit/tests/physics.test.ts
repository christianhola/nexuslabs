import { describe, expect, test } from 'bun:test'
import { World } from '../src/shared/physics'
import { massOf, radius, STEP, WORLD } from '../src/shared/config'
function world() {
  let seed = 23
  const w = new World(() => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 2 ** 32
  })
  w.food.clear()
  w.viruses = []
  return w
}
function tick(w: World, n: number) {
  for (let i = 0; i < n; i++) {
    w.step(STEP)
    w.food.clear()
  }
}
describe('authoritative cell simulation', () => {
  test('movement stays bounded, larger cells move more slowly', () => {
    const w = world(),
      a = w.spawn('a', 'a'),
      b = w.spawn('b', 'b')
    a.cells[0].x = b.cells[0].x = 500
    a.cells[0].y = 500
    b.cells[0].y = 900
    b.cells[0].mass = 280
    a.input.x = b.input.x = WORLD
    a.input.y = 500
    b.input.y = 900
    tick(w, 30)
    expect(a.cells[0].x).toBeGreaterThan(b.cells[0].x)
    a.cells[0].x = WORLD
    tick(w, 1)
    expect(a.cells[0].x).toBeLessThanOrEqual(WORLD - radius(a.cells[0].mass))
  })
  test('split conserves mass and has a merge cooldown', () => {
    const w = world(),
      p = w.spawn('a', 'a')
    p.cells[0].mass = 120
    w.split(p)
    expect(p.cells).toHaveLength(2)
    expect(massOf(p.cells)).toBe(120)
    expect(p.cells[1].vx ** 2 + p.cells[1].vy ** 2).toBeGreaterThan(10000)
    p.cells.forEach((c) => {
      c.x = 500
      c.y = 500
      c.vx = c.vy = 0
    })
    p.input.x = p.input.y = 500
    tick(w, 1)
    expect(p.cells).toHaveLength(2)
    w.time = 20
    p.cells.forEach((c) => {
      c.x = 500
      c.y = 500
    })
    tick(w, 1)
    expect(p.cells).toHaveLength(1)
  })
  test('only sufficiently larger cells eat; shield blocks contact', () => {
    const w = world(),
      a = w.spawn('a', 'a'),
      b = w.spawn('b', 'b')
    a.cells[0].mass = 100
    for (const p of [a, b]) {
      p.cells[0].x = p.cells[0].y = 500
      p.input.x = p.input.y = 500
    }
    tick(w, 1)
    expect(w.players.has('b')).toBe(true)
    w.time = 4
    tick(w, 1)
    expect(w.players.has('b')).toBe(false)
    expect(a.eaten).toBe(1)
    expect(w.deaths).toHaveLength(1)
  })
  test('split cap and virus burst are bounded and conserve mass', () => {
    const w = world(),
      p = w.spawn('a', 'a')
    p.cells[0].mass = 1000
    w.split(p, true)
    expect(p.cells.length).toBeLessThanOrEqual(16)
    expect(massOf(p.cells)).toBeCloseTo(1000)
    w.time += 2
    w.split(p, true)
    expect(p.cells).toHaveLength(16)
  })
  test('ejected mass cannot be farmed immediately', () => {
    const w = world(),
      p = w.spawn('a', 'a')
    p.cells[0].mass = 100
    w.eject(p)
    expect(p.cells[0].mass).toBe(88)
    expect(w.food.size).toBe(1)
    const food = [...w.food.values()][0]
    food.x = p.cells[0].x
    food.y = p.cells[0].y
    food.vx = food.vy = 0
    w.step(STEP)
    expect(p.cells[0].mass).toBeLessThan(89)
  })
  test('duplicate input sequences never repeat actions or replace aim', () => {
    const w = world(),
      p = w.spawn('a', 'a')
    w.input('a', { t: 'input', seq: 1, x: 100, y: 200, split: true })
    w.input('a', { t: 'input', seq: 1, x: 900, y: 900 })
    expect(p.input.x).toBe(100)
    expect(p.input.split).toBe(true)
  })
  test('bots fill a quiet room and leave as humans join', () => {
    const w = world()
    w.spawn('human', 'Sam')
    w.balanceBots()
    expect(w.players.size).toBe(12)
    w.spawn('second', 'Jo')
    w.balanceBots()
    expect([...w.players.values()].filter((p) => p.bot)).toHaveLength(10)
  })
  test('100 seconds of simulation keep finite positions and bounds', () => {
    const w = new World()
    w.spawn('human', 'Sam')
    w.balanceBots()
    for (let i = 0; i < 3000; i++) {
      w.step(STEP)
      if (i % 90 === 0) w.balanceBots()
    }
    for (const p of w.players.values())
      for (const c of p.cells) {
        expect(Number.isFinite(c.x + c.y + c.mass)).toBe(true)
        expect(c.x).toBeGreaterThanOrEqual(radius(c.mass) - 0.01)
        expect(c.x).toBeLessThanOrEqual(WORLD - radius(c.mass) + 0.01)
      }
  }, 15000)
})
