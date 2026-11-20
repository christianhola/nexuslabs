export const WORLD = 4200
export const STEP = 1 / 30
export const MAX_PLAYERS = 24
export const MAX_CELLS = 16
export const START_MASS = 28
export const FOOD_COUNT = 1400
export const ROOMS = [
  { id: 'meadow', name: 'Meadow', color: '#7b9660' },
  { id: 'lagoon', name: 'Lagoon', color: '#6b9ba8' },
  { id: 'dusk', name: 'Dusk', color: '#ab86b7' },
] as const
export const SKINS = [
  {
    name: 'Matcha',
    light: '#e9f4bd',
    mid: '#afca79',
    dark: '#5c803c',
    ink: '#354b26',
    pattern: 'plain',
  },
  {
    name: 'Lagoon',
    light: '#d2f3ef',
    mid: '#8dc8ce',
    dark: '#437c96',
    ink: '#294b60',
    pattern: 'plain',
  },
  {
    name: 'Peach',
    light: '#fff0d0',
    mid: '#efb292',
    dark: '#c97b6c',
    ink: '#79473d',
    pattern: 'plain',
  },
  {
    name: 'Lilac',
    light: '#f0e3fb',
    mid: '#c2a4dd',
    dark: '#8c69a8',
    ink: '#59416e',
    pattern: 'plain',
  },
  {
    name: 'Honey',
    light: '#fff7b8',
    mid: '#e9ce73',
    dark: '#b8953b',
    ink: '#715c29',
    pattern: 'rings',
  },
  {
    name: 'Rose',
    light: '#ffe4ec',
    mid: '#e8a5b8',
    dark: '#b96888',
    ink: '#723d53',
    pattern: 'petals',
  },
  {
    name: 'Moon',
    light: '#f4f3ed',
    mid: '#c6cece',
    dark: '#819491',
    ink: '#4b605a',
    pattern: 'moon',
  },
  {
    name: 'Ink',
    light: '#bdcad8',
    mid: '#778b9e',
    dark: '#3f5366',
    ink: '#f1f6fa',
    pattern: 'rings',
  },
] as const
export const radius = (mass: number) => Math.sqrt(mass) * 4.5
export const speed = (mass: number) =>
  255 * Math.pow(Math.max(mass, 28) / 28, -0.2)
export const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n))
export const massOf = (cells: { mass: number }[]) =>
  cells.reduce((sum, c) => sum + c.mass, 0)
