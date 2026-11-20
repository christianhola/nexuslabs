/*
  All seed data and copy for the dashboard.

  `accounts` is 160 deterministic, seeded accounts. Swap it for your own data:
  anything that produces `Account[]` works (a fetch to /api/accounts in the
  Worker, a CSV import, a CRM export). Every KPI, the chart and the watchlist
  are computed from this array in src/lib/metrics.ts.
*/

export type Segment = 'Enterprise' | 'Mid-Market' | 'SMB'

export const SEGMENTS: Segment[] = ['Enterprise', 'Mid-Market', 'SMB']

export type Account = {
  id: string
  name: string
  segment: Segment
  /** Annual recurring revenue in dollars. */
  arr: number
  /** 13 weekly health scores (0–100), oldest first. The last one is the current score. */
  history: number[]
  /** Share of purchased seats active in the last 30 days, 0–1. */
  seatUtilization: number
  /** Days since the last logged customer touch (call, meeting, QBR). */
  lastTouchDays: number
  /** Renewal date, ISO yyyy-mm-dd. */
  renewal: string
  /** Customer success owner. */
  owner: string
  /** The 13 weeks before `history`, oldest first (for the 13-week comparison and the detail chart). */
  earlier: number[]
  /** Per-factor offsets from the blended score; see FACTORS and src/lib/scoring.ts. */
  factors: Record<FactorKey, number>
  /** Signup quarter, e.g. "Q3 ’25" (cohort heatmap). */
  cohort: string
  /** Purchased seats. */
  seats: number
}

/** "Today" for the seeded data, so dates and runway stay stable. */
export const TODAY = '2026-11-11'

export const DEFAULT_THRESHOLD = 40

export const copy = {
  title: 'Customer health',
  watchlist: 'Watchlist',
  axisLabel: 'Health score',
  thresholdLabel: 'Risk threshold',
}

/** Comparison windows for the date-range control. */
export const RANGES = [4, 8, 13] as const
export type Range = (typeof RANGES)[number]
export const DEFAULT_RANGE: Range = 4

/** Health score factors. The score is their weighted blend; Settings re-weights them live. */
export type FactorKey = 'usage' | 'adoption' | 'support' | 'sentiment' | 'engagement'
export const FACTORS: Array<{ key: FactorKey; label: string; hint: string; weight: number }> = [
  { key: 'usage', label: 'Product usage', hint: 'Weekly active usage of core features', weight: 30 },
  { key: 'adoption', label: 'Seat adoption', hint: 'Share of purchased seats active in 30 days', weight: 25 },
  { key: 'support', label: 'Support health', hint: 'Ticket volume, severity and time to resolve', weight: 15 },
  { key: 'sentiment', label: 'Sentiment', hint: 'NPS and survey responses', weight: 15 },
  { key: 'engagement', label: 'Engagement', hint: 'Recency of calls, QBRs and exec touches', weight: 15 },
]
export const DEFAULT_WEIGHTS = Object.fromEntries(FACTORS.map((f) => [f.key, f.weight])) as Record<FactorKey, number>

/** Cohorts shown in the heatmap, oldest first. */
export const COHORTS = ['Q4 ’24', 'Q1 ’25', 'Q2 ’25', 'Q3 ’25', 'Q4 ’25', 'Q1 ’26', 'Q2 ’26', 'Q3 ’26'] as const

export const STALE_TOUCH_DAYS = 45

export type Contact = { name: string; role: string; email: string; lastContactDays: number; primary?: boolean }
export type ActivityKind = 'note' | 'call' | 'email' | 'qbr' | 'ticket' | 'touch'
export type Activity = { id: string; kind: ActivityKind; date: string; author: string; text: string }

export type PlaybookRule = 'below-threshold' | 'drawdown' | 'adoption' | 'quiet' | 'renewal-risk'
export type Role = 'CSM' | 'Account exec' | 'Support lead' | 'Exec sponsor' | 'Product'
export type Playbook = {
  id: PlaybookRule
  name: string
  trigger: string
  goal: string
  steps: Array<{ id: string; title: string; role: Role; dueDays: number }>
}

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'below-threshold',
    name: 'Rescue',
    trigger: 'Health under the risk threshold',
    goal: 'Back above the threshold within six weeks',
    steps: [
      { id: 'diagnose', title: 'Review the health factors and write a one-line diagnosis', role: 'CSM', dueDays: 2 },
      { id: 'call', title: 'Call the champion; confirm what changed', role: 'CSM', dueDays: 4 },
      { id: 'exec', title: 'Exec sponsor emails their counterpart', role: 'Exec sponsor', dueDays: 7 },
      { id: 'plan', title: 'Agree a written success plan with dates', role: 'CSM', dueDays: 14 },
      { id: 'review', title: 'Re-score and review in the weekly risk meeting', role: 'Account exec', dueDays: 21 },
    ],
  },
  {
    id: 'drawdown',
    name: 'Steep slide',
    trigger: '15+ points below the 13-week peak',
    goal: 'Stop the slide before it crosses the threshold',
    steps: [
      { id: 'trend', title: 'Find the week the slide started and the factor that moved', role: 'CSM', dueDays: 2 },
      { id: 'tickets', title: 'Check open tickets and escalations', role: 'Support lead', dueDays: 3 },
      { id: 'checkin', title: 'Book a check-in with the day-to-day admin', role: 'CSM', dueDays: 5 },
      { id: 'roadmap', title: 'Share roadmap items that address their asks', role: 'Product', dueDays: 10 },
    ],
  },
  {
    id: 'adoption',
    name: 'Low adoption',
    trigger: 'Under 45% of seats active',
    goal: 'Reach 60% active seats',
    steps: [
      { id: 'inactive', title: 'Export inactive users and share with the admin', role: 'CSM', dueDays: 3 },
      { id: 'training', title: 'Run a 30-minute enablement session', role: 'CSM', dueDays: 10 },
      { id: 'sso', title: 'Check SSO / provisioning for blocked users', role: 'Support lead', dueDays: 7 },
      { id: 'rightsize', title: 'Discuss right-sizing before renewal if adoption stays low', role: 'Account exec', dueDays: 30 },
    ],
  },
  {
    id: 'quiet',
    name: 'Gone quiet',
    trigger: `No logged touch in ${45} days`,
    goal: 'A real conversation this week',
    steps: [
      { id: 'reach', title: 'Reach out to the primary contact', role: 'CSM', dueDays: 1 },
      { id: 'multithread', title: 'Find a second contact (multi-thread)', role: 'Account exec', dueDays: 5 },
      { id: 'log', title: 'Log the touch and next step', role: 'CSM', dueDays: 7 },
    ],
  },
  {
    id: 'renewal-risk',
    name: 'Renewal at risk',
    trigger: 'Renews within 90 days and health under threshold + 10',
    goal: 'Signed renewal, no surprises',
    steps: [
      { id: 'forecast', title: 'Flag in the renewal forecast with a risk note', role: 'Account exec', dueDays: 1 },
      { id: 'value', title: 'Prepare a value review (usage, outcomes, ROI)', role: 'CSM', dueDays: 7 },
      { id: 'sponsor', title: 'Exec sponsor joins the renewal call', role: 'Exec sponsor', dueDays: 14 },
      { id: 'terms', title: 'Agree terms and send paperwork', role: 'Account exec', dueDays: 30 },
      { id: 'notice', title: 'Confirm before the notice deadline', role: 'Account exec', dueDays: 45 },
    ],
  },
]

/** Keyboard shortcuts (see src/lib/hotkeys.ts). */
export const SHORTCUTS: Array<{ keys: string[]; label: string }> = [
  { keys: ['g', 'o'], label: 'Go to Overview' },
  { keys: ['g', 'a'], label: 'Go to Accounts' },
  { keys: ['g', 'r'], label: 'Go to Renewals' },
  { keys: ['g', 'p'], label: 'Go to Playbooks' },
  { keys: ['g', 's'], label: 'Go to Settings' },
  { keys: ['/'], label: 'Search accounts' },
  { keys: ['1'], label: 'Range: 4 weeks' },
  { keys: ['2'], label: 'Range: 8 weeks' },
  { keys: ['3'], label: 'Range: 13 weeks' },
  { keys: ['t'], label: 'Toggle light / dark' },
  { keys: ['?'], label: 'Show this help' },
  { keys: ['Esc'], label: 'Close dialogs and menus' },
]

export const NAV = [
  { path: '/', label: 'Overview' },
  { path: '/accounts', label: 'Accounts' },
  { path: '/renewals', label: 'Renewals' },
  { path: '/playbooks', label: 'Playbooks' },
  { path: '/settings', label: 'Settings' },
] as const

// ---------------------------------------------------------------------------
// Seeded generator. Deterministic: same output on every load and machine.
// ---------------------------------------------------------------------------

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(8_160)
const between = (lo: number, hi: number) => lo + rand() * (hi - lo)
const int = (lo: number, hi: number) => Math.floor(between(lo, hi + 1))
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]!
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

function shuffle<T>(list: T[]): T[] {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j]!, list[i]!]
  }
  return list
}

const FIRST = [
  'Aldine', 'Ashgrove', 'Banyan', 'Bellweather', 'Birchline', 'Brightwell', 'Calder', 'Carrow', 'Cedarpoint',
  'Clearwater', 'Copperline', 'Corvid', 'Dunmore', 'Eastbrook', 'Ember', 'Fairhaven', 'Fieldstone', 'Foxglove',
  'Galloway', 'Glasshouse', 'Greywell', 'Halcyon', 'Harbor', 'Hartwell', 'Heron', 'Holloway', 'Ironbridge',
  'Juniper', 'Kestrel', 'Kingsley', 'Lakemont', 'Larkspur', 'Linden', 'Lowell', 'Meridian', 'Millbrook',
  'Northgate', 'Oakhurst', 'Orchard', 'Pemberton', 'Pinecrest', 'Quarry', 'Redfern', 'Ridgeway', 'Rowan',
  'Saltmarsh', 'Sable', 'Southwick', 'Stillwater', 'Stonebridge', 'Tamsin', 'Thornbury', 'Tidewater', 'Upland',
  'Vantage', 'Verity', 'Westbrook', 'Whitlock', 'Wildmere', 'Wren',
] as const

const SECOND = [
  'Analytics', 'Bank', 'Biotech', 'Capital', 'Clinics', 'Cloud', 'Foods', 'Freight', 'Group', 'Health', 'Holdings',
  'Insurance', 'Labs', 'Logistics', 'Media', 'Mobility', 'Partners', 'Retail', 'Robotics', 'Studio', 'Systems',
  'Telecom', 'Ventures', 'Works',
] as const

const OWNERS = ['Priya Raman', 'Marcus Lee', 'Elena Sousa', 'Tom Okafor', 'Hana Kim', 'Leo Brandt'] as const

function isoDaysFromToday(days: number): string {
  const d = new Date(`${TODAY}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

/** A 13-week path that ends at `end`, peaks near `peak` and was `fourWeeksAgo` at index 8. */
function path(end: number, peak: number, fourWeeksAgo: number): number[] {
  const out: number[] = []
  const peakAt = int(2, 7)
  const start = clamp(peak - between(0, 6), 0, 100)
  for (let i = 0; i < 13; i++) {
    let v: number
    if (i <= peakAt) v = start + ((peak - start) * i) / Math.max(1, peakAt)
    else if (i <= 8) v = peak + ((fourWeeksAgo - peak) * (i - peakAt)) / Math.max(1, 8 - peakAt)
    else v = fourWeeksAgo + ((end - fourWeeksAgo) * (i - 8)) / 4
    out.push(v + (i === 8 || i === 12 || i === peakAt ? 0 : between(-1.6, 1.6)))
  }
  return out.map((v) => Math.round(clamp(v, 1, 100)))
}

type Draft = Omit<Account, 'arr' | 'id' | 'earlier' | 'factors' | 'cohort' | 'seats'> & { rawArr: number; risk: boolean; renews: boolean; fixedArr?: number }

function buildAccounts(): Account[] {
  // Score bands, chosen so 28 accounts sit under the default threshold of 40
  // and the median lands on 88.
  const scores: number[] = []
  for (let i = 0; i < 27; i++) scores.push(i < 2 ? int(14, 20) : int(24, 38))
  for (let i = 0; i < 17; i++) scores.push(int(42, 58))
  for (let i = 0; i < 9; i++) scores.push(int(59, 71))
  for (let i = 0; i < 24; i++) scores.push(i < 5 ? int(72, 79) : int(80, 87))
  scores.push(88, 88, 88)
  for (let i = 0; i < 78; i++) scores.push(int(89, 100))

  const segments = shuffle([
    ...Array<Segment>(29).fill('Enterprise'),
    ...Array<Segment>(60).fill('Mid-Market'),
    ...Array<Segment>(69).fill('SMB'),
  ])
  // 10 of the at-risk accounts and 44 healthy ones renew in the next 90 days.
  const riskRenews = new Set(shuffle([...Array(27).keys()]).slice(0, 10))
  const okRenews = new Set(shuffle([...Array(131).keys()]).slice(0, 44))

  const usedNames = new Set(['Fenwick Legal', 'Marlowe Capital'])
  const drafts: Draft[] = []

  scores.forEach((score, i) => {
    const segment = segments[i]!
    let name = ''
    do name = `${pick(FIRST)} ${pick(SECOND)}`
    while (usedNames.has(name))
    usedNames.add(name)

    const risk = score < 40
    const renews = risk ? riskRenews.has(i) : okRenews.has(i - 27)
    // Healthy accounts barely move; struggling ones have slid further.
    const slide = risk ? between(4, 22) : score < 72 ? between(0, 16) : between(0, 7)
    const peak = clamp(score + slide + between(0, 6), score, Math.min(100, score + 30))
    // Most healthy accounts improved a little over the last month.
    let back = score >= 72 ? clamp(score - between(-2, 3), 41, peak) : clamp(score + slide * between(0.2, 0.8), 0, peak)
    // Keep every account on the same side of 40 it was on four weeks ago,
    // except the handful steered below.
    if (risk) back = Math.min(back, 38)
    else if (score >= 40) back = Math.max(back, 41)

    const segmentArr =
      segment === 'Enterprise' ? between(320_000, 900_000) : segment === 'Mid-Market' ? between(70_000, 300_000) : between(12_000, 80_000)

    drafts.push({
      name,
      segment,
      rawArr: segmentArr,
      history: path(score, peak, back),
      seatUtilization: clamp(0.22 + (score / 100) * 0.7 - between(0, 0.18), 0.14, 0.97),
      lastTouchDays: risk ? int(6, 52) : int(1, 40),
      renewal: isoDaysFromToday(renews ? int(4, 89) : int(95, 540)),
      owner: pick(OWNERS),
      risk,
      renews,
    })
  })

  // Two hand-written anchors: the accounts sliding fastest.
  drafts.push({
    name: 'Fenwick Legal',
    segment: 'Enterprise',
    rawArr: 720_000,
    fixedArr: 720_000,
    history: [55, 57, 59, 58, 56, 52, 50, 47, 44, 37, 31, 24, 22],
    seatUtilization: 0.31,
    lastTouchDays: 29,
    renewal: '2027-05-24',
    owner: 'Priya Raman',
    risk: true,
    renews: false,
  })
  drafts.push({
    name: 'Marlowe Capital',
    segment: 'Enterprise',
    rawArr: 840_000,
    fixedArr: 840_000,
    history: [84, 86, 88, 87, 85, 85, 84, 80, 76, 72, 66, 60, 54],
    seatUtilization: 0.63,
    lastTouchDays: 47,
    renewal: '2027-03-15',
    owner: 'Marcus Lee',
    risk: false,
    renews: false,
  })

  // Movement over the last four weeks: one account slipped under 40 besides
  // Fenwick, one recovered above it.
  const slipped = drafts.find((d) => d.risk && !d.renews && d.segment === 'SMB' && d.history[12]! >= 30 && !d.fixedArr)!
  slipped.history = path(slipped.history[12]!, 47, 43)
  slipped.fixedArr = 63_000
  const recovered = drafts.find((d) => !d.risk && d.history[12]! < 48 && d.segment === 'Mid-Market' && !d.fixedArr)!
  recovered.history = path(recovered.history[12]!, 44, 36)
  recovered.fixedArr = 162_000

  // Scale ARR inside four groups so the headline numbers come out exactly:
  // $26.6M total, $6.7M under the threshold, $8.4M renewing within 90 days.
  const targets: Record<string, number> = { 'risk-renew': 2_400_000, 'risk-later': 4_300_000, 'ok-renew': 6_000_000, 'ok-later': 13_900_000 }
  const arrs = new Map<Draft, number>()
  for (const key of Object.keys(targets)) {
    const group = drafts.filter((d) => `${d.risk ? 'risk' : 'ok'}-${d.renews ? 'renew' : 'later'}` === key)
    const fixed = group.reduce((s, d) => s + (d.fixedArr ?? 0), 0)
    const free = group.filter((d) => d.fixedArr === undefined)
    const raw = free.reduce((s, d) => s + d.rawArr, 0)
    const k = (targets[key]! - fixed) / raw
    let sum = fixed
    for (const d of group) {
      const v = d.fixedArr ?? Math.max(8_000, Math.round((d.rawArr * k) / 1000) * 1000)
      arrs.set(d, v)
      sum += d.fixedArr === undefined ? v : 0
    }
    // Put the rounding remainder on the largest free account.
    const largest = free.reduce((a, b) => (arrs.get(a)! >= arrs.get(b)! ? a : b))
    arrs.set(largest, arrs.get(largest)! + targets[key]! - sum)
  }

  return drafts
    .map(({ rawArr: _raw, risk: _risk, renews: _renews, fixedArr: _fixed, ...rest }, i) => {
      const id = `acct-${String(i + 1).padStart(3, '0')}`
      const arr = arrs.get(drafts[i]!)!
      return { ...rest, id, arr, ...extras(id, rest.history, rest.seatUtilization, rest.lastTouchDays, arr) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

// ---------------------------------------------------------------------------
// Per-account extras. Each account gets its own RNG (seeded from its id), so
// adding fields here never reshuffles the headline numbers above.
// ---------------------------------------------------------------------------

function hash(text: string): number {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619)
  return h >>> 0
}

export function rngFor(id: string, salt: string) {
  const r = mulberry32(hash(`${id}:${salt}`))
  return {
    next: r,
    between: (lo: number, hi: number) => lo + r() * (hi - lo),
    int: (lo: number, hi: number) => Math.floor(lo + r() * (hi - lo + 1)),
    pick: <T,>(list: readonly T[]) => list[Math.floor(r() * list.length)]!,
  }
}

function extras(id: string, history: number[], seatUtilization: number, lastTouchDays: number, arr: number) {
  const r = rngFor(id, 'extras')
  const now = history[history.length - 1]!
  // Walk back 13 weeks from the first point; slipping accounts were healthier before.
  const drift = now < 40 ? 0.7 : now < 70 ? 0.35 : 0
  const earlier: number[] = []
  let v = history[0]!
  for (let i = 0; i < 13; i++) {
    v = clamp(v + drift + r.between(-1.8, 1.8), 4, 100)
    earlier.unshift(Math.round(v))
  }
  // Factor offsets around the blended score, then centred so the default
  // weights reproduce the seeded score exactly.
  const raw: Record<FactorKey, number> = {
    usage: r.between(-9, 9),
    adoption: (seatUtilization - 0.62) * 45,
    support: r.between(-12, 10),
    sentiment: r.between(-11, 11),
    engagement: (18 - lastTouchDays) * 0.45,
  }
  const total = FACTORS.reduce((s, f) => s + f.weight, 0)
  const mean = FACTORS.reduce((s, f) => s + f.weight * raw[f.key], 0) / total
  const factors = Object.fromEntries(FACTORS.map((f) => [f.key, Math.round((raw[f.key] - mean) * 100) / 100])) as Record<FactorKey, number>
  // Re-centre after rounding so the weighted sum is exactly zero.
  const residual = FACTORS.reduce((s, f) => s + f.weight * factors[f.key], 0) / FACTORS[0]!.weight
  factors.usage = Math.round((factors.usage - residual) * 1e6) / 1e6
  // Newer cohorts skew lower: they have not finished onboarding.
  const skew = now < 40 ? 0.45 : now < 72 ? 0.2 : -0.1
  const ci = Math.round(clamp(r.between(0, COHORTS.length - 1) + skew * r.between(0, 4), 0, COHORTS.length - 1))
  return { earlier, factors, cohort: COHORTS[ci]!, seats: Math.max(12, Math.round(arr / r.between(700, 1300))) }
}

// ---------------------------------------------------------------------------
// Detail-page seed data: contacts, activity and usage, generated per account.
// ---------------------------------------------------------------------------

const PEOPLE = [
  'Avery Chen', 'Jordan Patel', 'Samira Haddad', 'Noah Fischer', 'Imani Brooks', 'Luca Romano', 'Grace Okoye', 'Mateo Alvarez',
  'Freya Lindqvist', 'Owen Gallagher', 'Yuki Tanaka', 'Clara Dubois', 'Ravi Menon', 'Hannah Weiss', 'Diego Navarro', 'Ines Moreau',
] as const
const CONTACT_ROLES = ['Champion · Head of Operations', 'Economic buyer · VP Finance', 'Admin · IT Manager', 'Exec sponsor · COO'] as const

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z]+/g, '')
}

export function contactsFor(a: Pick<Account, 'id' | 'name'>): Contact[] {
  const r = rngFor(a.id, 'contacts')
  const used = new Set<string>()
  const n = r.int(3, 4)
  return CONTACT_ROLES.slice(0, n).map((role, i) => {
    let name = ''
    do name = r.pick(PEOPLE)
    while (used.has(name))
    used.add(name)
    const [first, last] = name.toLowerCase().split(' ')
    return { name, role, email: `${first}.${last}@${slug(a.name)}.example`, lastContactDays: r.int(2, 70), primary: i === 0 }
  })
}

const ACTIVITY_TEXT: Record<Exclude<ActivityKind, 'note' | 'touch'>, string[]> = {
  call: ['Check-in call: rollout to the second team is on hold until Q1', 'Call with the champion about reporting gaps', 'Weekly sync; asked for SSO audit logs'],
  email: ['Sent the usage report and renewal timeline', 'Followed up on the training request', 'Shared release notes for the new dashboard'],
  qbr: ['QBR: agreed three goals for next quarter', 'QBR moved by the customer; rebooked'],
  ticket: ['Ticket escalated: export timeouts on large workspaces', 'Ticket resolved: SAML login loop', 'Feature request logged: bulk seat reassignment'],
}

export function activityFor(a: Pick<Account, 'id' | 'owner' | 'lastTouchDays'>): Activity[] {
  const r = rngFor(a.id, 'activity')
  const out: Activity[] = []
  let day = a.lastTouchDays
  const kinds = ['call', 'email', 'ticket', 'qbr', 'email', 'call'] as const
  const n = r.int(4, 6)
  for (let i = 0; i < n; i++) {
    const kind = i === 0 ? 'call' : r.pick(kinds)
    out.push({ id: `${a.id}-seed-${i}`, kind, date: isoDaysFromToday(-day), author: kind === 'ticket' ? 'Support' : a.owner, text: r.pick(ACTIVITY_TEXT[kind]) })
    day += r.int(6, 24)
  }
  return out
}

export function isoFromToday(days: number): string {
  return isoDaysFromToday(days)
}

export const accounts: Account[] = buildAccounts()
