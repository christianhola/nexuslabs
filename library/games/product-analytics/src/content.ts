/*
  Every string, number and seed record in Pulseboard lives here. Change the
  brand, copy, prices, docs, changelog and demo data in this one file.
*/

export const brand = {
  name: 'Pulseboard',
  tagline: 'Product analytics that shows where you lose customers.',
  email: 'hello@pulseboard.dev',
}

/* Every photo/illustration goes through this map: swap in your own files. */
export const images = {
  hero: '/images/hero.webp',
  heroFront: '/images/hero-front.webp',
  meadowPath: '/images/meadow-path.webp',
  loneTree: '/images/lone-tree.webp',
}

export const nav = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Status', href: '/status' },
]

export const hero = {
  title: ['The fastest tool to see', 'where you’re losing customers'],
  lede: 'Pulseboard turns product behaviour into clear signals, so you can catch churn early and fix the moments that matter.',
  primary: { label: 'Start for free', href: '/signup' },
  secondary: { label: 'Talk to us', href: '/contact' },
  logosLabel: 'Used by product teams at',
}

export const logos = [
  { name: 'Northwind', style: 'italic-serif' },
  { name: 'Lumen', style: 'light' },
  { name: 'fieldnote', style: 'heavy' },
  { name: 'Halcyon', style: 'regular' },
  { name: 'Kestrel', style: 'bold' },
] as const

/* ------------------------------------------------------------------ */
/* Product demo (the hero mock and the feature-page mocks)             */
/* ------------------------------------------------------------------ */

export type Platform = 'web' | 'ios'

export type Account = {
  id: string
  name: string
  domain: string
  plan: 'Starter' | 'Growth' | 'Scale'
  seats: number
  drop: number
  region: 'EU' | 'US' | 'APAC'
  owner: 'Me' | 'Dana' | 'Ravi'
  hue: string
  tags: { label: string; hot?: boolean }[]
  note: string
  trend: number[]
  platform: Platform[]
}

export const accounts: Account[] = [
  {
    id: 'a1', name: 'Brightpath Health', domain: 'brightpath.io', plan: 'Growth', seats: 64, drop: 42, region: 'EU', owner: 'Me', hue: '#f3c9a6',
    tags: [{ label: 'Onboarding', hot: true }, { label: 'Reports', hot: true }, { label: 'Exports' }, { label: 'API' }],
    note: 'Weekly active seats fell from 42 to 19 after the reports redesign shipped. Most sessions now end on the date-range picker.',
    trend: [42, 41, 43, 39, 36, 31, 27, 24, 21, 19], platform: ['web'],
  },
  {
    id: 'a2', name: 'Copperline', domain: 'copperline.co', plan: 'Scale', seats: 180, drop: 35, region: 'US', owner: 'Dana', hue: '#c9d8f5',
    tags: [{ label: 'Billing', hot: true }, { label: 'Invites', hot: true }, { label: 'SSO' }, { label: 'Mobile' }],
    note: 'Invite acceptance dropped by a third since SSO became mandatory. Admins open the invite screen and leave without sending.',
    trend: [88, 86, 87, 80, 77, 70, 66, 61, 58, 57], platform: ['web', 'ios'],
  },
  {
    id: 'a3', name: 'Moss & Pine', domain: 'mosspine.com', plan: 'Growth', seats: 38, drop: 51, region: 'EU', owner: 'Ravi', hue: '#d6ecc4',
    tags: [{ label: 'Search', hot: true }, { label: 'Dashboards' }, { label: 'Alerts' }],
    note: 'Search usage halved in two weeks. Queries with filters return empty results 3x more often than before the index change.',
    trend: [30, 31, 29, 27, 24, 20, 18, 16, 15, 14], platform: ['web', 'ios'],
  },
  {
    id: 'a4', name: 'Tidewater Labs', domain: 'tidewater.dev', plan: 'Scale', seats: 140, drop: 31, region: 'APAC', owner: 'Me', hue: '#f5e1a8',
    tags: [{ label: 'API', hot: true }, { label: 'Webhooks' }, { label: 'Exports' }],
    note: 'API calls per seat are down 31%. The team switched two nightly jobs to CSV exports after webhook retries started failing.',
    trend: [72, 70, 71, 69, 63, 60, 56, 53, 51, 50], platform: ['web'],
  },
  {
    id: 'a5', name: 'Orchard Studio', domain: 'orchard.studio', plan: 'Starter', seats: 22, drop: 47, region: 'US', owner: 'Dana', hue: '#ecc6d9',
    tags: [{ label: 'Mobile', hot: true }, { label: 'Onboarding' }, { label: 'Comments' }],
    note: 'New iOS users finish onboarding half as often since the permissions prompt moved to step one. Desktop usage is flat.',
    trend: [20, 21, 19, 18, 16, 14, 13, 12, 11, 11], platform: ['ios'],
  },
  {
    id: 'a6', name: 'Granite Freight', domain: 'granitefreight.com', plan: 'Growth', seats: 96, drop: 38, region: 'EU', owner: 'Ravi', hue: '#cfe3ea',
    tags: [{ label: 'Dashboards', hot: true }, { label: 'Sharing' }, { label: 'Reports' }],
    note: 'Shared dashboards stopped loading for viewers on the free seat type. Viewers bounce in under ten seconds.',
    trend: [61, 60, 58, 57, 52, 47, 44, 41, 39, 38], platform: ['web', 'ios'],
  },
]

export const accountFilters = {
  plan: { label: 'Plan & seats', options: ['Starter', 'Growth', 'Scale'] },
  drop: { label: 'Activity drop', options: ['> 30%', '> 40%', '> 50%'] },
  region: { label: 'Region', options: ['EU', 'US', 'APAC'] },
  owner: { label: 'Owner', options: ['Me', 'Dana', 'Ravi'] },
} as const

export type FilterKey = keyof typeof accountFilters

export const defaultFilters: Record<FilterKey, string[]> = {
  plan: ['Growth', 'Scale'],
  drop: ['> 30%'],
  region: [],
  owner: [],
}

export const mockNav = {
  main: [
    { id: 'overview', label: 'Overview', icon: 'grid' },
    { id: 'funnels', label: 'Funnels', icon: 'filter' },
    { id: 'accounts', label: 'Accounts', icon: 'users' },
    { id: 'journeys', label: 'Journeys', icon: 'route' },
    { id: 'signals', label: 'Signals', icon: 'bell', badge: 3 },
  ],
  support: [
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
    { id: 'help', label: 'Help & support', icon: 'help' },
  ],
} as const

export type MockView = (typeof mockNav.main)[number]['id'] | (typeof mockNav.support)[number]['id']

export const overview = {
  kpis: [
    { label: 'Weekly active users', value: 18420, delta: 4.2, format: 'int' },
    { label: 'Activation rate', value: 61.4, delta: -2.8, format: 'pct' },
    { label: 'Net revenue at risk', value: 48200, delta: -11.5, format: 'usd' },
    { label: 'Median time to value', value: 3.6, delta: 8.1, format: 'days' },
  ],
  series: [14.2, 14.8, 15.1, 14.9, 15.8, 16.4, 16.1, 16.9, 17.2, 17.0, 17.8, 18.4],
  seriesLabels: ['Aug 25', 'Sep 1', 'Sep 8', 'Sep 15', 'Sep 22', 'Sep 29', 'Oct 6', 'Oct 13', 'Oct 20', 'Oct 27', 'Nov 3', 'Nov 10'],
}

export const funnels = {
  name: 'Trial to paid',
  segments: ['All users', 'Self-serve', 'Sales-led'] as const,
  steps: [
    { label: 'Signed up', values: [12480, 9120, 3360] },
    { label: 'Created a project', values: [8930, 6110, 2820] },
    { label: 'Invited a teammate', values: [5210, 3020, 2190] },
    { label: 'Connected a source', values: [3870, 2010, 1860] },
    { label: 'Started a plan', values: [1640, 760, 880] },
  ],
}

export const retention = {
  cohorts: [
    { label: 'Sep 1', size: 1840, values: [100, 62, 51, 46, 43, 41, 40, 39] },
    { label: 'Sep 8', size: 1922, values: [100, 64, 53, 47, 44, 42, 41] },
    { label: 'Sep 15', size: 2010, values: [100, 61, 49, 44, 41, 40] },
    { label: 'Sep 22', size: 2104, values: [100, 66, 55, 50, 47] },
    { label: 'Sep 29', size: 1987, values: [100, 58, 44, 39] },
    { label: 'Oct 6', size: 2230, values: [100, 67, 57] },
    { label: 'Oct 13', size: 2318, values: [100, 69] },
    { label: 'Oct 20', size: 2402, values: [100] },
  ],
}

export const journeys = [
  { path: ['Home', 'Pricing', 'Sign up'], share: 31, outcome: 'converted' },
  { path: ['Home', 'Docs', 'Quickstart', 'Sign up'], share: 22, outcome: 'converted' },
  { path: ['Reports', 'Date range', 'Exit'], share: 18, outcome: 'dropped' },
  { path: ['Invite', 'SSO settings', 'Exit'], share: 14, outcome: 'dropped' },
  { path: ['Dashboard', 'Share', 'Viewer error'], share: 9, outcome: 'dropped' },
] as const

export const signalFeed = [
  { id: 's1', kind: 'drop', title: 'Reports usage fell 38%', detail: 'Brightpath Health, 14 days', time: '2m' },
  { id: 's2', kind: 'spike', title: 'Errors on /invite up 4.1x', detail: 'All workspaces on SSO', time: '9m' },
  { id: 's3', kind: 'win', title: 'Onboarding step 3 fixed', detail: 'Completion back to 72%', time: '26m' },
  { id: 's4', kind: 'drop', title: 'iOS activation dipped 9%', detail: 'Since build 4.12', time: '41m' },
  { id: 's5', kind: 'spike', title: 'Export jobs doubled', detail: 'Tidewater Labs', time: '1h' },
  { id: 's6', kind: 'win', title: 'Search empty-results down 60%', detail: 'After index rollback', time: '2h' },
] as const

/* ------------------------------------------------------------------ */
/* Landing page                                                         */
/* ------------------------------------------------------------------ */

export const pillars = {
  eyebrow: 'What you get',
  title: 'Signals, not another wall of charts',
  lede: 'Pulseboard watches your product the way a good PM would: it notices when something changes, works out who it affects, and points at the screen to fix.',
  items: [
    {
      id: 'funnels',
      title: 'Funnels that name the leak',
      body: 'Every step shows who dropped, where they went instead and what they had in common.',
      href: '/features#funnels',
    },
    {
      id: 'retention',
      title: 'Retention you can read at a glance',
      body: 'Cohort grids with the week a habit formed, or did not, highlighted for you.',
      href: '/features#retention',
    },
    {
      id: 'signals',
      title: 'Signals before the churn email',
      body: 'Alerts when an account’s usage bends, ranked by the revenue at stake.',
      href: '/features#signals',
    },
  ],
}

export const metrics = [
  { value: 3.2, suffix: 'B', label: 'events processed a day', decimals: 1 },
  { value: 12, suffix: ' min', label: 'from install to first funnel', decimals: 0 },
  { value: 41, suffix: '%', label: 'less churn in the first quarter', decimals: 0 },
  { value: 99.98, suffix: '%', label: 'uptime over the last 12 months', decimals: 2 },
]

export const steps = [
  { n: '01', title: 'Drop in one snippet', body: 'Add the SDK to your web or mobile app. Autocapture starts at once; name the events that matter later.' },
  { n: '02', title: 'Let Pulseboard learn your normal', body: 'Within a week it knows each account’s usual rhythm and which paths lead to a paid plan.' },
  { n: '03', title: 'Act on the signal', body: 'Get a ranked list of accounts drifting away, the moment they stalled and a link to the session.' },
]

export const testimonial = {
  quote: 'We used to find out an account was unhappy from the cancellation email. Now Pulseboard tells us two weeks earlier, and tells us which screen to fix.',
  name: 'Maren Okafor',
  role: 'Head of Product, Copperline',
  initials: 'MO',
  stats: [
    { value: '2 weeks', label: 'earlier churn warning' },
    { value: '−27%', label: 'logo churn in two quarters' },
  ],
}

export const sources = ['JavaScript', 'React', 'iOS', 'Android', 'Segment', 'Snowflake', 'BigQuery', 'Postgres', 'Stripe', 'HubSpot', 'Slack', 'Webhooks']

export const cta = {
  title: 'Stop guessing why customers leave',
  lede: 'Free for your first million events a month. No card, no sales call, set up before your coffee cools.',
  primary: { label: 'Start for free', href: '/signup' },
  secondary: { label: 'Talk to us', href: '/contact' },
}

export const faq = [
  { q: 'How long does setup take?', a: 'Most teams see their first funnel in about 12 minutes. Add the snippet, deploy, and autocapture fills in clicks, page views and sessions straight away.' },
  { q: 'Do you sample our data?', a: 'No. Every event is stored and queryable on every plan. Large queries run on the full set and come back in seconds.' },
  { q: 'Where is the data stored?', a: 'In the EU or the US, your choice, encrypted at rest and in transit. You can export or delete everything at any time.' },
  { q: 'Can we import history from another tool?', a: 'Yes. Import CSV or Parquet, or sync from your warehouse. Growth and Scale plans include a guided migration.' },
  { q: 'What counts as an event?', a: 'Any action you track or we autocapture: a page view, a click, a custom event. Identify calls and session replays are free.' },
]

/* ------------------------------------------------------------------ */
/* Features page                                                        */
/* ------------------------------------------------------------------ */

export const featureSections = [
  {
    id: 'funnels',
    eyebrow: 'Funnels',
    title: 'See the exact step where people give up',
    body: 'Build a funnel from any events in seconds. Split it by plan, platform or acquisition channel, then open the people who dropped to see what they did next.',
    points: ['Any order, any time window', 'Split by any property', 'Jump from a step to the sessions behind it'],
  },
  {
    id: 'retention',
    eyebrow: 'Retention',
    title: 'Know which week a habit forms',
    body: 'Cohort grids show how many people come back, week by week. Pulseboard highlights the cohorts that beat or miss your normal, so a regression stands out on day one.',
    points: ['Weekly or monthly cohorts', 'Compare to your baseline', 'Retention by feature used'],
  },
  {
    id: 'journeys',
    eyebrow: 'Journeys',
    title: 'Follow the paths that lead out',
    body: 'Journeys rank the most common paths before a conversion or an exit. Dead ends surface by themselves, with the screens and errors that caused them.',
    points: ['Paths to and from any event', 'Error events in the path', 'Share a journey as a link'],
  },
  {
    id: 'signals',
    eyebrow: 'Signals',
    title: 'Hear about it before the churn email',
    body: 'Signals watch every account’s rhythm and tell you when it bends. Write your own rules too, then send them to Slack, email or a webhook.',
    points: ['Automatic anomaly detection', 'Rules on any metric', 'Ranked by revenue at stake'],
  },
] as const

/* ------------------------------------------------------------------ */
/* Pricing                                                              */
/* ------------------------------------------------------------------ */

export const plans = [
  {
    id: 'free',
    name: 'Free',
    blurb: 'For side projects and first launches.',
    monthly: 0,
    included: 1_000_000,
    overage: 0,
    cta: 'Start for free',
    href: '/signup',
    features: ['1M events a month', 'Funnels, retention, journeys', '3 seats', '90-day history'],
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For teams turning signals into roadmap.',
    monthly: 149,
    included: 5_000_000,
    overage: 0.00003,
    cta: 'Start a 14-day trial',
    href: '/signup?plan=growth',
    popular: true,
    features: ['5M events, then $30 per extra 1M', 'Signals and account health', 'Unlimited seats', '3-year history', 'Slack and webhook alerts'],
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb: 'For products with serious traffic.',
    monthly: 690,
    included: 50_000_000,
    overage: 0.00002,
    cta: 'Talk to us',
    href: '/contact?topic=pricing',
    features: ['50M events, then $20 per extra 1M', 'Warehouse sync', 'SSO and audit log', 'Unlimited history', 'Guided migration'],
  },
] as const

export const comparison = {
  groups: [
    {
      name: 'Analytics',
      rows: [
        { label: 'Funnels and retention', values: [true, true, true] },
        { label: 'Journeys', values: [true, true, true] },
        { label: 'Session replay', values: ['1k / mo', '25k / mo', 'Unlimited'] },
        { label: 'Data history', values: ['90 days', '3 years', 'Unlimited'] },
      ],
    },
    {
      name: 'Signals',
      rows: [
        { label: 'Anomaly detection', values: [false, true, true] },
        { label: 'Custom rules', values: ['2', 'Unlimited', 'Unlimited'] },
        { label: 'Slack, email, webhooks', values: ['Email', true, true] },
      ],
    },
    {
      name: 'Admin',
      rows: [
        { label: 'Seats', values: ['3', 'Unlimited', 'Unlimited'] },
        { label: 'SSO / SAML', values: [false, false, true] },
        { label: 'Audit log', values: [false, false, true] },
        { label: 'Support', values: ['Community', 'Email, 1 day', 'Slack, 4 hours'] },
      ],
    },
  ],
}

export const pricingFaq = [
  { q: 'What happens if we go over our events?', a: 'Nothing breaks. We keep collecting and bill extra events at your plan’s rate at the end of the month. You can set a hard cap in Settings.' },
  { q: 'Is there a discount for paying yearly?', a: 'Yes, two months free: yearly plans cost ten times the monthly price.' },
  { q: 'Do you offer startup or nonprofit pricing?', a: 'Yes. Companies under two years old or registered nonprofits get Growth at half price for the first year.' },
  { q: 'Can we change plans later?', a: 'Any time. Upgrades are prorated to the day; downgrades take effect at the next billing date.' },
]

/* ------------------------------------------------------------------ */
/* Docs                                                                 */
/* ------------------------------------------------------------------ */

export type DocBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'code'; lang: string; code: string }
  | { type: 'note'; text: string }

export type Doc = { slug: string; group: string; title: string; summary: string; blocks: DocBlock[] }

export const docs: Doc[] = [
  {
    slug: 'quickstart',
    group: 'Get started',
    title: 'Quickstart',
    summary: 'Install the SDK, send your first event and build a funnel in about ten minutes.',
    blocks: [
      { type: 'p', text: 'This guide takes you from an empty workspace to your first funnel. You need a Pulseboard workspace and access to your app’s code.' },
      { type: 'h2', id: 'install', text: 'Install the SDK' },
      { type: 'code', lang: 'bash', code: 'npm install @pulseboard/browser' },
      { type: 'h2', id: 'init', text: 'Initialise it once' },
      { type: 'p', text: 'Call `init` as early as possible, with the project key from Settings → Project. Autocapture starts straight away.' },
      { type: 'code', lang: 'ts', code: "import { pulse } from '@pulseboard/browser'\n\npulse.init('pk_live_your_project_key', {\n  autocapture: true,\n  region: 'eu',\n})" },
      { type: 'h2', id: 'track', text: 'Track an event that matters' },
      { type: 'code', lang: 'ts', code: "pulse.track('Project created', {\n  template: 'blank',\n  teamSize: 4,\n})" },
      { type: 'note', text: 'Events show up in Live view within a few seconds. Funnels and retention update every minute.' },
      { type: 'h2', id: 'funnel', text: 'Build your first funnel' },
      { type: 'p', text: 'Open Funnels, choose “Signed up” as the first step and “Project created” as the second. Pulseboard fills in conversion, time to convert and the people who dropped.' },
    ],
  },
  {
    slug: 'identify',
    group: 'Get started',
    title: 'Identify users and accounts',
    summary: 'Tie events to people and companies so account health and signals work.',
    blocks: [
      { type: 'p', text: 'Anonymous events are merged into a person once you call `identify`. Group calls tie that person to an account, which powers account health and signals.' },
      { type: 'h2', id: 'identify', text: 'Identify a person' },
      { type: 'code', lang: 'ts', code: "pulse.identify(user.id, {\n  email: user.email,\n  plan: user.plan,\n})" },
      { type: 'h2', id: 'group', text: 'Attach them to an account' },
      { type: 'code', lang: 'ts', code: "pulse.group('account', account.id, {\n  name: account.name,\n  seats: account.seats,\n  mrr: account.mrr,\n})" },
      { type: 'note', text: 'Send `mrr` on the account to rank signals by revenue at stake.' },
    ],
  },
  {
    slug: 'events',
    group: 'Tracking',
    title: 'Naming events',
    summary: 'A short convention that keeps your event list readable a year from now.',
    blocks: [
      { type: 'p', text: 'Name events as an object and a past-tense verb, in title case: “Report exported”, “Invite sent”. Put detail in properties, not in the name.' },
      { type: 'h2', id: 'properties', text: 'Properties' },
      { type: 'p', text: 'Use camelCase keys and plain values. Pulseboard detects types automatically; numbers can be summed and averaged in any chart.' },
      { type: 'code', lang: 'ts', code: "pulse.track('Report exported', {\n  format: 'csv',\n  rows: 1840,\n  durationMs: 920,\n})" },
    ],
  },
  {
    slug: 'mobile',
    group: 'Tracking',
    title: 'iOS and Android',
    summary: 'The mobile SDKs share the same calls as the browser one.',
    blocks: [
      { type: 'p', text: 'Install with Swift Package Manager or Gradle, then initialise in your app delegate or application class.' },
      { type: 'h2', id: 'ios', text: 'iOS' },
      { type: 'code', lang: 'swift', code: 'import Pulseboard\n\nPulse.setup(key: "pk_live_your_project_key")\nPulse.track("Onboarding finished")' },
      { type: 'h2', id: 'android', text: 'Android' },
      { type: 'code', lang: 'kotlin', code: 'Pulse.setup(context, "pk_live_your_project_key")\nPulse.track("Onboarding finished")' },
    ],
  },
  {
    slug: 'signals',
    group: 'Analysis',
    title: 'Signals and alert rules',
    summary: 'How automatic signals work and how to write your own rules.',
    blocks: [
      { type: 'p', text: 'Signals compare each account’s last 14 days with its own previous 8 weeks. A change beyond the expected range becomes a signal, ranked by MRR.' },
      { type: 'h2', id: 'rules', text: 'Custom rules' },
      { type: 'p', text: 'A rule is a metric, a condition and a destination. For example: weekly active seats drop more than 30%, send to #cs-alerts.' },
      { type: 'note', text: 'Rules are checked every 15 minutes. A rule fires once per account until it resolves.' },
    ],
  },
  {
    slug: 'export-api',
    group: 'API',
    title: 'Export API',
    summary: 'Pull raw events or query results into your own systems.',
    blocks: [
      { type: 'p', text: 'The Export API returns newline-delimited JSON. Authenticate with a personal API key from Settings → API keys.' },
      { type: 'code', lang: 'bash', code: 'curl https://api.pulseboard.dev/v1/export \\\n  -H "Authorization: Bearer $PULSEBOARD_KEY" \\\n  -d from=2026-11-01 -d to=2026-11-07' },
      { type: 'h2', id: 'limits', text: 'Limits' },
      { type: 'p', text: 'Up to 60 requests a minute and 10 GB a day per workspace. Larger exports should use warehouse sync.' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Changelog                                                            */
/* ------------------------------------------------------------------ */

export type ChangeTag = 'New' | 'Improved' | 'Fixed'

export const changelog: { id: string; date: string; version: string; title: string; body: string; tags: ChangeTag[]; items: string[] }[] = [
  {
    id: '2026-11-06', date: 'Nov 6, 2026', version: '4.18', title: 'Revenue at stake on every signal', tags: ['New', 'Improved'],
    body: 'Signals now carry the account’s MRR, so the list sorts by what you could lose, not just by how big the change was.',
    items: ['Sort signals by revenue at stake', 'MRR column on the Accounts table', 'Signals digest in Slack now groups by owner'],
  },
  {
    id: '2026-10-28', date: 'Oct 28, 2026', version: '4.17', title: 'Journeys with error events', tags: ['New'],
    body: 'Errors captured by the SDK now appear inline in Journeys, so a dead end shows the exception that caused it.',
    items: ['Error nodes in Journeys', 'Filter journeys by error type', 'Link from an error node to the session'],
  },
  {
    id: '2026-10-15', date: 'Oct 15, 2026', version: '4.16', title: 'Faster cohort grids', tags: ['Improved', 'Fixed'],
    body: 'Retention grids over large workspaces load up to 4x faster, and the colour scale now adapts to your baseline.',
    items: ['Cohorts over 10M people render in under 2 s', 'Baseline-relative colour scale', 'Fixed: week 0 sometimes showed 99%'],
  },
  {
    id: '2026-10-01', date: 'Oct 1, 2026', version: '4.15', title: 'Android SDK 3.0', tags: ['New', 'Fixed'],
    body: 'The Android SDK is now a third of the size and batches events on poor connections.',
    items: ['Batched uploads with retry', '62% smaller binary', 'Fixed: duplicate app-open events on resume'],
  },
]

/* ------------------------------------------------------------------ */
/* Status                                                               */
/* ------------------------------------------------------------------ */

export const statusCopy = {
  title: 'System status',
  lede: 'Live health of Pulseboard’s ingestion, query and alerting services. Updated every minute.',
}

/* ------------------------------------------------------------------ */
/* Contact, sign up, log in                                             */
/* ------------------------------------------------------------------ */

export const contact = {
  title: 'Talk to us',
  lede: 'Tell us about your product and we’ll show you Pulseboard on your own kind of data. A product specialist replies within one working day.',
  topics: [
    { value: 'demo', label: 'A live demo' },
    { value: 'pricing', label: 'Pricing and plans' },
    { value: 'migration', label: 'Moving from another tool' },
    { value: 'security', label: 'Security review' },
    { value: 'other', label: 'Something else' },
  ],
  sizes: [
    { value: '1-10', label: '1–10 people' },
    { value: '11-50', label: '11–50 people' },
    { value: '51-200', label: '51–200 people' },
    { value: '201-1000', label: '201–1,000 people' },
    { value: '1000+', label: 'More than 1,000' },
  ],
  expect: [
    { title: 'A 30-minute call', body: 'We start with your questions, not a slide deck.' },
    { title: 'Your kind of data', body: 'We load a sample shaped like your product, so the demo is relevant.' },
    { title: 'A clear quote', body: 'Pricing in writing the same day, with no annual lock-in on Growth.' },
  ],
}

export const signup = {
  title: 'Start for free',
  lede: 'Your first million events every month are on us. No card needed.',
  perks: ['Set up in about 12 minutes', 'Funnels, retention and journeys included', 'Invite your whole team'],
}

export const footer = {
  blurb: 'Product analytics that shows where you lose customers, and what to fix first.',
  columns: [
    { title: 'Product', links: [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }, { label: 'Changelog', href: '/changelog' }, { label: 'Status', href: '/status' }] },
    { title: 'Developers', links: [{ label: 'Docs', href: '/docs' }, { label: 'Quickstart', href: '/docs/quickstart' }, { label: 'Mobile SDKs', href: '/docs/mobile' }, { label: 'Export API', href: '/docs/export-api' }] },
    { title: 'Company', links: [{ label: 'Talk to us', href: '/contact' }, { label: 'Sign up', href: '/signup' }, { label: 'Log in', href: '/login' }, { label: 'Style guide', href: '/styleguide' }] },
  ],
  legal: '© 2026 Pulseboard. Demo content.',
}
