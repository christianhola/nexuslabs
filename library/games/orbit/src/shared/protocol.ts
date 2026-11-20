import { ROOMS, SKINS } from './config'
export type Input = {
  t: 'input'
  x: number
  y: number
  seq: number
  frame?: number
  split?: boolean
  eject?: boolean
}
export type Cell = {
  id: number
  owner: string
  x: number
  y: number
  mass: number
  vx: number
  vy: number
  mergeAt: number
}
export type Food = {
  id: number
  x: number
  y: number
  hue: number
  mass: number
  vx: number
  vy: number
  from?: string
  born?: number
}
export type Virus = { id: number; x: number; y: number; feeds: number }
export type Result = {
  id: string
  best: number
  eaten: number
  seconds: number
}
export type Player = {
  id: string
  name: string
  skin: number
  bot: boolean
  cells: Cell[]
  input: Input
  joined: number
  shield: number
  best: number
  eaten: number
  splitAt: number
  ejectAt: number
  targetAt: number
  run: string
}
export type CellWire = [number, string, number, number, number, number]
export type FoodWire = [number, number, number, number, number]
export type PersonWire = {
  id: string
  name: string
  skin: number
  mass: number
  bot: boolean
}
export type Snapshot = {
  t: 'state'
  time: number
  ack: number
  frame?: number
  foodDelta?: boolean
  removedFood?: number[]
  cells: CellWire[]
  food: FoodWire[]
  viruses: [number, number, number, number][]
  people: PersonWire[]
  players: number
  bots: number
  score: number
  best: number
  rank: number
  eaten: number
  center: [number, number]
}
export type ServerMessage =
  | Snapshot
  | { t: 'hello'; id: string; room: string }
  | { t: 'end'; result: Result; by: string }
  | { t: 'pong'; at: number }
  | { t: 'error'; message: string }
export function parseInput(value: unknown): Input | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (
    v.t !== 'input' ||
    typeof v.x !== 'number' ||
    typeof v.y !== 'number' ||
    !Number.isFinite(v.x) ||
    !Number.isFinite(v.y) ||
    Math.abs(v.x) > 10000 ||
    Math.abs(v.y) > 10000 ||
    !Number.isSafeInteger(v.seq) ||
    (v.seq as number) < 0 ||
    (v.seq as number) > 2 ** 31
  )
    return null
  return {
    t: 'input',
    x: v.x,
    y: v.y,
    seq: v.seq as number,
    frame:
      Number.isSafeInteger(v.frame) && (v.frame as number) >= 0
        ? (v.frame as number)
        : 0,
    split: v.split === true,
    eject: v.eject === true,
  }
}
export const cleanName = (v: unknown) =>
  typeof v === 'string'
    ? v
        .replace(
          /[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069<>]/g,
          '',
        )
        .trim()
        .slice(0, 18) || 'Guest'
    : 'Guest'
export const validRoom = (v: string | null) => ROOMS.some((r) => r.id === v)
export const skinIndex = (v: unknown) =>
  Number.isInteger(v) && (v as number) >= 0 && (v as number) < SKINS.length
    ? (v as number)
    : 0
