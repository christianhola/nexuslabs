/*
  All app seed data and the shapes it uses: offices, floors and their plans,
  people, parking, lockers and the demo bookings. Landing-page copy lives in
  src/content.ts. Edit freely; the store (src/lib/store.ts) builds today's
  state from these on first run and then persists to localStorage.
*/

export type ResourceKind = 'desk' | 'room' | 'parking' | 'locker'
export type DayMode = 'office' | 'remote' | 'off'

export type Desk = {
  id: string
  floorId: string
  x: number
  y: number
  w: number
  h: number
  zone: string
  features: string[]
}

export type Room = {
  id: string
  name: string
  floorId: string
  capacity: number
  x: number
  y: number
  w: number
  h: number
  amenities: string[]
}

export type Area = { label: string; x: number; y: number; w: number; h: number; tone: 'plain' | 'soft' | 'hatch' }

export type Floor = { id: string; name: string; areas: Area[] }

export type Person = {
  id: string
  name: string
  role: string
  team: string
  hue: number
}

export type Spot = { id: string; label: string; note: string }

export type Booking = {
  id: string
  kind: ResourceKind
  resourceId: string
  personId: string
  date: string // YYYY-MM-DD (local)
  start: string // HH:MM
  end: string // HH:MM
  title?: string
  checkedIn?: boolean
}

export const ME = 'u-lisa'

export const offices = [
  { id: 'london', name: 'London HQ', address: '12 Clerkenwell Green, London' },
  { id: 'berlin', name: 'Berlin', address: 'Torstraße 44, Berlin' },
  { id: 'nyc', name: 'New York', address: '75 Spring St, New York' },
]

export const teams = ['Product', 'Design', 'Engineering', 'Sales', 'Operations']

export const people: Person[] = [
  { id: ME, name: 'Lisa Park', role: 'Product lead', team: 'Product', hue: 18 },
  { id: 'u-omar', name: 'Omar Haddad', role: 'Product manager', team: 'Product', hue: 200 },
  { id: 'u-jade', name: 'Jade Fournier', role: 'Product designer', team: 'Design', hue: 330 },
  { id: 'u-ben', name: 'Ben Okafor', role: 'Brand designer', team: 'Design', hue: 270 },
  { id: 'u-mia', name: 'Mia Lindqvist', role: 'Frontend engineer', team: 'Engineering', hue: 160 },
  { id: 'u-raj', name: 'Raj Mehta', role: 'Backend engineer', team: 'Engineering', hue: 40 },
  { id: 'u-tom', name: 'Tom Becker', role: 'Engineering manager', team: 'Engineering', hue: 220 },
  { id: 'u-sara', name: 'Sara Costa', role: 'Account executive', team: 'Sales', hue: 350 },
  { id: 'u-leo', name: 'Leo Tanaka', role: 'Sales lead', team: 'Sales', hue: 120 },
  { id: 'u-ana', name: 'Ana Ruiz', role: 'Office manager', team: 'Operations', hue: 300 },
  { id: 'u-kai', name: 'Kai Nguyen', role: 'Data analyst', team: 'Product', hue: 185 },
  { id: 'u-eva', name: 'Eva Novak', role: 'QA engineer', team: 'Engineering', hue: 90 },
]

export const floors: Floor[] = [
  {
    id: 'ground',
    name: 'Ground floor',
    areas: [
      { label: 'Reception', x: 40, y: 450, w: 230, h: 110, tone: 'soft' },
      { label: 'Kitchen', x: 290, y: 450, w: 200, h: 110, tone: 'soft' },
      { label: 'Lockers', x: 510, y: 450, w: 180, h: 110, tone: 'hatch' },
      { label: 'Stairs', x: 710, y: 450, w: 210, h: 110, tone: 'hatch' },
      { label: 'Lounge', x: 660, y: 320, w: 260, h: 110, tone: 'soft' },
      { label: 'Collab space', x: 40, y: 320, w: 300, h: 110, tone: 'soft' },
    ],
  },
  {
    id: 'first',
    name: 'First floor',
    areas: [
      { label: 'Library', x: 40, y: 450, w: 260, h: 110, tone: 'soft' },
      { label: 'Print & post', x: 320, y: 450, w: 180, h: 110, tone: 'hatch' },
      { label: 'Stairs', x: 710, y: 450, w: 210, h: 110, tone: 'hatch' },
      { label: 'Terrace', x: 520, y: 450, w: 170, h: 110, tone: 'soft' },
    ],
  },
]

export const rooms: Room[] = [
  { id: 'r-atlas', name: 'Atlas', floorId: 'ground', capacity: 8, x: 40, y: 40, w: 200, h: 130, amenities: ['Screen', 'Video'] },
  { id: 'r-birch', name: 'Birch', floorId: 'ground', capacity: 4, x: 260, y: 40, w: 150, h: 130, amenities: ['Screen'] },
  { id: 'r-cedar', name: 'Cedar', floorId: 'ground', capacity: 6, x: 430, y: 40, w: 170, h: 130, amenities: ['Whiteboard', 'Video'] },
  { id: 'r-dune', name: 'Dune', floorId: 'ground', capacity: 1, x: 620, y: 40, w: 90, h: 130, amenities: ['Phone booth'] },
  { id: 'r-eden', name: 'Eden', floorId: 'ground', capacity: 12, x: 360, y: 320, w: 280, h: 110, amenities: ['Screen', 'Video', 'Whiteboard'] },
  { id: 'r-fjord', name: 'Fjord', floorId: 'first', capacity: 6, x: 40, y: 40, w: 200, h: 130, amenities: ['Screen', 'Video'] },
  { id: 'r-grove', name: 'Grove', floorId: 'first', capacity: 4, x: 260, y: 40, w: 150, h: 130, amenities: ['Whiteboard'] },
]

const DESK_W = 52
const DESK_H = 36

function cluster(floorId: string, start: number, x: number, y: number, zone: string, features: string[][]): Desk[] {
  const out: Desk[] = []
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      const n = start + r * 4 + c
      out.push({
        id: `D-${String(n).padStart(2, '0')}`,
        floorId,
        x: x + c * (DESK_W + 4),
        y: y + r * (DESK_H + 4),
        w: DESK_W,
        h: DESK_H,
        zone,
        features: features[(r * 4 + c) % features.length],
      })
    }
  }
  return out
}

const F = [['Monitor'], ['Monitor', 'Standing'], ['Monitor'], ['Dual monitor']]

export const seedDesks: Desk[] = [
  ...cluster('ground', 1, 40, 210, 'Product', F),
  ...cluster('ground', 9, 360, 210, 'Design', F),
  ...cluster('ground', 17, 680, 210, 'Quiet zone', F),
  ...cluster('first', 25, 40, 230, 'Engineering', F),
  ...cluster('first', 33, 360, 230, 'Engineering', F),
  // A single window desk on the first floor
  { id: 'D-41', floorId: 'first', x: 760, y: 60, w: DESK_W, h: DESK_H, zone: 'Window', features: ['Monitor'] },
]

export const parking: Spot[] = Array.from({ length: 12 }, (_, i) => ({
  id: `P-${String(i + 1).padStart(2, '0')}`,
  label: `Bay ${i + 1}`,
  note: i < 2 ? 'EV charger' : i === 11 ? 'Accessible' : i < 6 ? 'Level -1' : 'Level -2',
}))

export const lockers: Spot[] = Array.from({ length: 16 }, (_, i) => ({
  id: `L-${String(i + 1).padStart(2, '0')}`,
  label: `Locker ${i + 1}`,
  note: i < 8 ? 'Ground floor' : 'First floor',
}))

/** Working hours the pickers and the room timeline cover. */
export const DAY_START = 7
export const DAY_END = 20

/**
  Today's demo bookings, built relative to the current date so the app always
  looks lived-in. `d` is a day offset from today.
*/
export const seedBookings: Array<Omit<Booking, 'id' | 'date'> & { d: number }> = [
  { d: 0, kind: 'desk', resourceId: 'D-01', personId: ME, start: '09:00', end: '17:00' },
  { d: 1, kind: 'desk', resourceId: 'D-03', personId: ME, start: '09:00', end: '17:30' },
  { d: 2, kind: 'desk', resourceId: 'D-12', personId: ME, start: '10:00', end: '16:00' },
  { d: 0, kind: 'room', resourceId: 'r-cedar', personId: ME, start: '14:00', end: '15:00', title: 'Roadmap review' },
  { d: 0, kind: 'parking', resourceId: 'P-04', personId: ME, start: '08:00', end: '18:00' },
  ...(
    [
      ['u-omar', 'D-02', '09:00', '17:00'],
      ['u-kai', 'D-04', '08:30', '16:30'],
      ['u-jade', 'D-09', '10:00', '18:00'],
      ['u-ben', 'D-10', '09:00', '13:00'],
      ['u-mia', 'D-25', '09:00', '17:00'],
      ['u-raj', 'D-26', '09:30', '18:00'],
      ['u-tom', 'D-27', '08:00', '16:00'],
      ['u-eva', 'D-30', '09:00', '17:00'],
      ['u-sara', 'D-17', '09:00', '12:00'],
      ['u-leo', 'D-18', '09:00', '17:00'],
      ['u-ana', 'D-05', '08:00', '17:00'],
      ['u-ana', 'D-19', '08:00', '17:00'],
      ['u-omar', 'D-33', '09:00', '17:00'],
      ['u-mia', 'D-34', '09:00', '17:00'],
      ['u-raj', 'D-35', '09:00', '17:00'],
      ['u-tom', 'D-41', '09:00', '17:00'],
    ] as const
  ).map(([personId, resourceId, start, end]) => ({ d: 0, kind: 'desk' as const, personId, resourceId, start, end })),
  { d: 1, kind: 'desk', resourceId: 'D-02', personId: 'u-omar', start: '09:00', end: '17:00' },
  { d: 1, kind: 'desk', resourceId: 'D-09', personId: 'u-jade', start: '09:00', end: '17:00' },
  { d: 1, kind: 'desk', resourceId: 'D-25', personId: 'u-mia', start: '09:00', end: '17:00' },
  { d: 2, kind: 'desk', resourceId: 'D-26', personId: 'u-raj', start: '09:00', end: '17:00' },
  { d: 3, kind: 'desk', resourceId: 'D-11', personId: 'u-jade', start: '09:00', end: '17:00' },
  { d: 3, kind: 'desk', resourceId: 'D-04', personId: 'u-kai', start: '09:00', end: '17:00' },
  { d: 0, kind: 'room', resourceId: 'r-atlas', personId: 'u-tom', start: '09:30', end: '10:30', title: 'Eng standup' },
  { d: 0, kind: 'room', resourceId: 'r-atlas', personId: 'u-sara', start: '13:00', end: '14:30', title: 'Client pitch' },
  { d: 0, kind: 'room', resourceId: 'r-birch', personId: 'u-jade', start: '11:00', end: '12:00', title: 'Design crit' },
  { d: 0, kind: 'room', resourceId: 'r-eden', personId: 'u-ana', start: '16:00', end: '17:30', title: 'All hands' },
  { d: 0, kind: 'room', resourceId: 'r-dune', personId: 'u-leo', start: '10:00', end: '10:30', title: 'Call' },
  { d: 0, kind: 'room', resourceId: 'r-fjord', personId: 'u-mia', start: '15:00', end: '16:00', title: 'Sprint planning' },
  ...['P-01', 'P-02', 'P-07'].map((resourceId, i) => ({
    d: 0,
    kind: 'parking' as const,
    resourceId,
    personId: ['u-tom', 'u-ana', 'u-leo'][i],
    start: '08:00',
    end: '18:00',
  })),
  ...['L-01', 'L-02', 'L-04', 'L-06', 'L-09', 'L-10', 'L-13'].map((resourceId, i) => ({
    d: 0,
    kind: 'locker' as const,
    resourceId,
    personId: people[(i + 1) % people.length].id,
    start: '08:00',
    end: '18:00',
  })),
]

/** Default office/remote pattern for the week planner, Monday first. */
export const seedWeekPattern: DayMode[] = ['office', 'office', 'remote', 'office', 'remote']

/** Teammates' usual office days (0 = Monday), for "who's in" on the planner. */
export const teammatePatterns: Record<string, number[]> = {
  'u-omar': [0, 1, 3],
  'u-kai': [0, 3],
  'u-jade': [1, 3, 4],
  'u-ben': [0, 2],
  'u-mia': [0, 1, 2],
  'u-raj': [1, 2, 3],
  'u-tom': [0, 1, 2, 3],
  'u-sara': [0, 4],
  'u-leo': [0, 1, 4],
  'u-ana': [0, 1, 2, 3, 4],
  'u-eva': [2, 3],
}
