import { describe, expect, test } from 'bun:test'
import { World } from '../src/shared/simulation'
import {
  BOOST_SPEED,
  FOOD_SCORE,
  MIN_SCORE,
  SEGMENT_GAP,
  SPEED,
  STEP,
  WORLD_RADIUS,
  angleDelta,
  cleanName,
  steer,
  validInput,
} from '../src/shared/protocol'

function seeded(seed = 42) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 4294967296
  }
}
function isolated() {
  return new World(seeded(), 0)
}
function at(w: World, id: string, x: number, y: number, angle: number) {
  const s = w.spawn(id, id, 0)
  s.angle = angle
  s.input.angle = angle
  s.points = Array.from({ length: 30 }, (_, i) => ({
    x: x - Math.cos(angle) * i * SEGMENT_GAP,
    y: y - Math.sin(angle) * i * SEGMENT_GAP,
  }))
  return s
}

describe('authoritative gameplay', () => {
  test('normal movement advances at a fixed speed and preserves segment spacing', () => {
    const w = isolated(),
      s = at(w, 'a', 0, 0, 0)
    for (let i = 0; i < 30; i++) w.step()
    expect(s.points[0].x).toBeCloseTo(SPEED, 4)
    for (let i = 1; i < s.points.length; i++)
      expect(
        Math.hypot(
          s.points[i].x - s.points[i - 1].x,
          s.points[i].y - s.points[i - 1].y,
        ),
      ).toBeLessThanOrEqual(SEGMENT_GAP + 0.001)
  })
  test('a fresh snake boosts immediately, keeps its minimum length, and releases cleanly', () => {
    const w = isolated(),
      s = at(w, 'a', 0, 0, 0)
    s.input.boost = true
    for (let i = 0; i < 30; i++) w.step()
    expect(s.points[0].x).toBeCloseTo(BOOST_SPEED)
    expect(s.score).toBe(MIN_SCORE)
    expect(s.points.length).toBe(w.length(MIN_SCORE))
    expect(s.boosting).toBe(true)
    expect(w.food.size).toBe(0)
    s.input.boost = false
    w.step()
    expect(s.boosting).toBe(false)
    expect(s.points[0].x).toBeCloseTo(BOOST_SPEED + SPEED * STEP)
  })
  test('boost only drops mass that was spent, including across presses', () => {
    const w = isolated(),
      s = at(w, 'a', 0, 0, 0)
    s.score = MIN_SCORE + 12
    for (let i = 0; i < 90; i++) {
      s.input.boost = i % 3 !== 0
      w.step()
    }
    expect(s.score).toBe(MIN_SCORE)
    const dropped = [...w.food.values()].reduce(
      (sum, p) => sum + p.value * FOOD_SCORE,
      0,
    )
    expect(dropped).toBeGreaterThanOrEqual(9)
    expect(dropped).toBeLessThanOrEqual(12)
    expect(dropped + s.boostSpent).toBeCloseTo(12)
  })
  test('turning follows the shortest arc and cannot instantly reverse', () => {
    expect(
      Math.abs(
        angleDelta(
          Math.PI - 0.01,
          steer(Math.PI - 0.01, -Math.PI + 0.01, STEP),
        ),
      ),
    ).toBeLessThan(0.1)
    expect(steer(0, Math.PI, STEP)).toBeCloseTo(3.8 * STEP)
  })
  test('crossing the boundary ends one run and cannot record twice', () => {
    const w = isolated(),
      s = at(w, 'a', WORLD_RADIUS - 5, 0, 0)
    let deaths = 0
    w.onDeath = (_, result) => {
      deaths++
      expect(result.reason).toBe('edge')
    }
    w.step()
    w.kill(s, 'edge')
    expect(deaths).toBe(1)
    expect(w.snakes.has('a')).toBe(false)
  })
  test('opponent body contact kills a snake and drops collectible food', () => {
    const w = isolated(),
      a = at(w, 'a', 0, 0, 0)
    at(w, 'b', 55, 0, Math.PI / 2)
    w.tick = 100
    const results: string[] = []
    w.onDeath = (s) => results.push(s.id)
    for (let i = 0; i < 9; i++) w.step()
    expect(a.alive).toBe(false)
    expect(results).toContain('a')
    expect([...w.food.values()].some((f) => f.value === 4)).toBe(true)
  })
  test('spawn protection prevents instant collisions with other players', () => {
    const w = isolated(),
      a = at(w, 'a', 0, 0, 0)
    at(w, 'b', 10, 0, Math.PI)
    w.step()
    expect(a.alive).toBe(true)
    expect(w.snakes.size).toBe(2)
  })
  test('head-on contact kills both snakes independent of insertion order', () => {
    for (const reverse of [false, true]) {
      const w = isolated()
      for (const id of reverse ? ['b', 'a'] : ['a', 'b'])
        at(w, id, id === 'a' ? 0 : 20, 0, id === 'a' ? 0 : Math.PI)
      w.tick = 100
      const results: string[] = []
      w.onDeath = (s) => {
        results.push(s.id)
        expect(s.kills).toBe(0)
      }
      w.step()
      expect(results.sort()).toEqual(['a', 'b'])
    }
  })
  test('food can be collected once, and the client cannot supply a score', () => {
    const w = isolated(),
      a = at(w, 'a', 0, 0, 0)
    w.addFood({ x: 5, y: 0 }, 4, 0)
    const score = a.score
    w.step()
    expect(a.score).toBe(score + 12)
    w.step()
    expect(a.score).toBe(score + 12)
    expect(validInput({ angle: 0, boost: false, score: 999999 })).toBe(true)
    expect(a.score).not.toBe(999999)
  })
  test('interest snapshots do not expose account identities and bound long snakes', () => {
    const w = isolated(),
      a = at(w, 'opaque-id', 0, 0, 0)
    a.score = 1e9
    w.step()
    const state = w.snapshot(a.id, 1)
    expect(a.points.length).toBe(240)
    expect(state.snakes[0].body.length).toBe(480)
    expect(JSON.stringify(state)).not.toContain('sub')
    expect(state.online).toBe(1)
  })
  test('full-room simulation remains finite under sustained turning and boost', () => {
    const w = new World(seeded(123))
    for (let i = 0; i < 24; i++) w.spawn(String(i), 'Player', i % 6, true)
    for (let i = 0; i < 900; i++) w.step()
    for (const s of w.snakes.values())
      for (const p of s.points) {
        expect(Number.isFinite(p.x)).toBe(true)
        expect(Number.isFinite(p.y)).toBe(true)
      }
    expect(w.food.size).toBeLessThanOrEqual(2200)
  })
})
test('reject malformed motion and safely normalize public names', () => {
  for (const angle of [NaN, Infinity, -Infinity, '0', null, 100])
    expect(validInput({ angle, boost: false })).toBe(false)
  expect(validInput({ angle: 0, boost: 'true' })).toBe(false)
  expect(cleanName('<Sam>\u0000')).toBe('Sam')
  expect(cleanName('')).toBe('Wanderer')
  expect(cleanName('a'.repeat(100)).length).toBe(18)
})
