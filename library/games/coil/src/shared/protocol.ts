export const ROOMS = ['Meadow', 'Lagoon', 'Dusk'] as const
export const ROOM_LIMIT = 24
export const WORLD_RADIUS = 2100
export const STEP = 1 / 30
export const SPEED = 150
export const BOOST_SPEED = 265
export const MIN_SCORE = 24
export const FOOD_SCORE = 3
export const SEGMENT_GAP = 8
export const SKINS = [
  { name: 'Mint', light: '#defee7', main: '#9fdfbd', dark: '#4c9f83' },
  { name: 'Tide', light: '#d6f3ff', main: '#89c7e7', dark: '#4a81b8' },
  { name: 'Peach', light: '#fff0d7', main: '#efb58e', dark: '#b87461' },
  { name: 'Lilac', light: '#f5e5ff', main: '#c3aceb', dark: '#8265b2' },
  { name: 'Honey', light: '#fff5c2', main: '#e9d177', dark: '#b4934b' },
  { name: 'Rose', light: '#ffe3ee', main: '#e7a2bc', dark: '#a55f86' },
] as const
export type Point = { x: number; y: number }
export type Input = { angle: number; boost: boolean }
export type Pellet = {
  id: number
  x: number
  y: number
  value: number
  color: number
}
export type Snake = {
  id: string
  name: string
  skin: number
  bot: boolean
  points: Point[]
  angle: number
  input: Input
  score: number
  kills: number
  born: number
  boosting: boolean
  boostSpent: number
  alive: boolean
  best: number
}
export type WireSnake = {
  id: string
  name: string
  skin: number
  bot: boolean
  body: number[]
  angle: number
  score: number
  kills: number
  boost: boolean
  shield: boolean
}
export type Standing = {
  id: string
  name: string
  skin: number
  score: number
  bot: boolean
}
export type Snapshot = {
  type: 'state'
  tick: number
  snakes: WireSnake[]
  food: Pellet[]
  leaders: Standing[]
  online: number
  total: number
  removedFood?: number[]
}
export type Result = {
  score: number
  kills: number
  seconds: number
  reason: 'snake' | 'edge' | 'left'
}
export type Profile = {
  best: number
  games: number
  kills: number
  seconds: number
  skin: number
}
export const EMPTY_PROFILE: Profile = {
  best: 0,
  games: 0,
  kills: 0,
  seconds: 0,
  skin: 0,
}
export function angleDelta(a: number, b: number) {
  return Math.atan2(Math.sin(b - a), Math.cos(b - a))
}
export function steer(
  angle: number,
  target: number,
  dt: number,
  boost = false,
) {
  const max = (boost ? 3.15 : 3.8) * dt
  return angle + Math.max(-max, Math.min(max, angleDelta(angle, target)))
}
export function radius(score: number) {
  return Math.min(18, 10 + Math.sqrt(score) * 0.13)
}
export function validInput(value: unknown): value is Input {
  if (!value || typeof value !== 'object') return false
  const v = value as Input
  return (
    typeof v.angle === 'number' &&
    Number.isFinite(v.angle) &&
    Math.abs(v.angle) <= Math.PI * 4 &&
    typeof v.boost === 'boolean'
  )
}
export function cleanName(value: unknown) {
  return typeof value === 'string'
    ? value
        .replace(/[\p{C}<>]/gu, '')
        .trim()
        .slice(0, 18) || 'Wanderer'
    : 'Wanderer'
}
export function validSkin(value: unknown): value is number {
  return (
    Number.isInteger(value) &&
    (value as number) >= 0 &&
    (value as number) < SKINS.length
  )
}
