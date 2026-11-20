import { expect, test } from 'bun:test'
import {
  cleanName,
  parseInput,
  skinIndex,
  validRoom,
} from '../src/shared/protocol'
test('rejects non-finite, huge, replay and malformed client inputs', () => {
  for (const v of [
    null,
    {},
    [],
    { t: 'input', x: NaN, y: 0, seq: 1 },
    { t: 'input', x: 1e20, y: 0, seq: 1 },
    { t: 'input', x: 0, y: 0, seq: -1 },
  ])
    expect(parseInput(v)).toBeNull()
  expect(
    parseInput({
      t: 'input',
      x: 0,
      y: 0,
      seq: 1,
      score: 999999,
      user: 'other',
    }),
  ).toEqual({
    t: 'input',
    x: 0,
    y: 0,
    seq: 1,
    frame: 0,
    split: false,
    eject: false,
  })
})
test('only fixed rooms and skins are accepted', () => {
  expect(validRoom('meadow')).toBe(true)
  expect(validRoom('arbitrary-new-room')).toBe(false)
  expect(skinIndex(99)).toBe(0)
  expect(skinIndex(-1)).toBe(0)
})
test('names strip markup and directional controls and are bounded', () => {
  expect(cleanName('<sam>\u202e')).toBe('sam')
  expect(cleanName('a'.repeat(100))).toHaveLength(18)
  expect(cleanName('')).toBe('Guest')
})
