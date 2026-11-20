/*
  Every string, number and seed record on the site lives here. Edit this
  file first: names, copy, plans, device makers and use cases. Photography
  goes through `images` so you can swap in your own files in one place.
*/

export const brand = {
  name: 'Gridwise',
  tagline: 'Orchestrating energy for the next grid',
  description:
    'One API that connects electric cars, chargers, heat pumps, home batteries and solar to the grid, so energy companies can shift load to the cheapest, cleanest hours.',
  salesEmail: 'sales@gridwise.example',
  apiBase: 'https://api.gridwise.example/v1',
  city: 'Copenhagen',
}

/** Every photograph on the site. Replace the files in public/images or point these at your own. */
export const images = {
  hero: { src: '/images/hero.webp', alt: 'A timber house with a solar roof among tall trees' },
  ev: { src: '/images/ev.webp', alt: 'An electric car charging from a wall charger beside a timber house' },
  heatpump: { src: '/images/heatpump.webp', alt: 'An outdoor heat pump unit beside a dark timber wall, surrounded by ferns' },
  battery: { src: '/images/battery.webp', alt: 'A white home battery mounted on a light wooden wall' },
  grid: { src: '/images/grid.webp', alt: 'Transmission towers crossing green fields towards a village with solar roofs at sunset' },
  neighbourhood: { src: '/images/neighbourhood.webp', alt: 'A leafy street of timber homes with solar roofs' },
} as const

export type NavItem = { label: string; href: string }

export const nav: NavItem[] = [
  { label: 'Platform', href: '/#platform' },
  { label: 'Devices', href: '/devices' },
  { label: 'Docs', href: '/docs' },
  { label: 'Use cases', href: '/use-cases' },
  { label: 'Pricing', href: '/pricing' },
]

export const cta = { label: 'Talk to our team', href: '/contact' }

export const hero = {
  title: ['Orchestrating energy', 'for the next grid'],
  primary: { label: 'Talk to our team', href: '/contact' },
  secondary: { label: 'Explore our platform', href: '/#platform' },
  chip: { device: 'Heat pump', action: 'Pre-heating before the evening peak', value: '2.4 kW shifted' },
}

// Invented customer wordmarks for the logo strip.
export const customers = ['Northwind Energy', 'Helio Retail', 'Vale Power', 'Kiln & Co', 'Brightmoor', 'Fjordline Utilities']

export const platform = {
  eyebrow: 'Platform',
  title: 'One API for every device behind the meter',
  body: 'Link a customer’s car, charger, heat pump or battery in under a minute. Gridwise normalises every brand into one data model, so your code reads state and sends schedules the same way for all of them.',
}

export type CategoryId = 'ev' | 'charger' | 'heatpump' | 'battery' | 'solar' | 'thermostat'

export const categories: { id: CategoryId; label: string; short: string; blurb: string }[] = [
  { id: 'ev', label: 'Electric vehicles', short: 'EVs', blurb: 'State of charge, charge limits, location and smart charging.' },
  { id: 'charger', label: 'EV chargers', short: 'Chargers', blurb: 'Start, stop and schedule sessions on home and work chargers.' },
  { id: 'heatpump', label: 'Heat pumps', short: 'Heat pumps', blurb: 'Pre-heat and pre-cool around price and carbon peaks.' },
  { id: 'battery', label: 'Home batteries', short: 'Batteries', blurb: 'Charge from the grid when cheap, discharge into the peak.' },
  { id: 'solar', label: 'Solar inverters', short: 'Solar', blurb: 'Live production, export limits and self-consumption.' },
  { id: 'thermostat', label: 'Thermostats', short: 'Thermostats', blurb: 'Setpoints and comfort bands for whole-home heating.' },
]

export const capabilities = [
  'Read state',
  'Live power',
  'Start and stop',
  'Schedules',
  'Charge limit',
  'Location',
  'Set temperature',
  'Export limits',
] as const
export type Capability = (typeof capabilities)[number]

export const regions = ['Europe', 'United Kingdom', 'North America', 'Australia'] as const
export type Region = (typeof regions)[number]

export type MakerStatus = 'live' | 'beta' | 'soon'

export type Maker = {
  id: string
  name: string
  category: CategoryId
  models: number
  status: MakerStatus
  regions: Region[]
  capabilities: Capability[]
  since: string
  note: string
}

// Device makers in the coverage directory. All invented.
export const makers: Maker[] = [
  { id: 'voltaro', name: 'Voltaro', category: 'ev', models: 14, status: 'live', regions: ['Europe', 'United Kingdom', 'North America'], capabilities: ['Read state', 'Live power', 'Start and stop', 'Schedules', 'Charge limit', 'Location'], since: '2023', note: 'Full smart charging on every model since 2021.' },
  { id: 'nordvik', name: 'Nordvik Motors', category: 'ev', models: 9, status: 'live', regions: ['Europe', 'United Kingdom'], capabilities: ['Read state', 'Start and stop', 'Schedules', 'Charge limit', 'Location'], since: '2023', note: 'Charge limit writes take up to two minutes to confirm.' },
  { id: 'aster', name: 'Aster EV', category: 'ev', models: 6, status: 'live', regions: ['Europe', 'Australia'], capabilities: ['Read state', 'Start and stop', 'Schedules', 'Location'], since: '2024', note: 'Location needs the owner’s consent in the Aster app.' },
  { id: 'kestrel', name: 'Kestrel Auto', category: 'ev', models: 11, status: 'live', regions: ['North America', 'Europe'], capabilities: ['Read state', 'Live power', 'Start and stop', 'Schedules', 'Charge limit'], since: '2024', note: 'Live power updates every 30 seconds while charging.' },
  { id: 'lumen', name: 'Lumen Drive', category: 'ev', models: 4, status: 'beta', regions: ['Europe'], capabilities: ['Read state', 'Start and stop', 'Location'], since: '2026', note: 'Schedules arrive with Lumen’s next firmware release.' },
  { id: 'halden', name: 'Halden', category: 'ev', models: 7, status: 'live', regions: ['Europe', 'United Kingdom'], capabilities: ['Read state', 'Start and stop', 'Schedules', 'Charge limit', 'Location'], since: '2025', note: 'Includes the Halden commercial van range.' },
  { id: 'orrin', name: 'Orrin Motors', category: 'ev', models: 3, status: 'soon', regions: ['North America'], capabilities: ['Read state'], since: '2027', note: 'Read access is in testing with early partners.' },

  { id: 'plugwell', name: 'Plugwell', category: 'charger', models: 8, status: 'live', regions: ['Europe', 'United Kingdom'], capabilities: ['Read state', 'Live power', 'Start and stop', 'Schedules'], since: '2023', note: 'Supports load balancing on three-phase installs.' },
  { id: 'ampora', name: 'Ampora', category: 'charger', models: 5, status: 'live', regions: ['Europe', 'Australia'], capabilities: ['Read state', 'Live power', 'Start and stop', 'Schedules'], since: '2024', note: 'Works over the charger’s local cloud and OCPP.' },
  { id: 'chargewood', name: 'Chargewood', category: 'charger', models: 4, status: 'live', regions: ['United Kingdom'], capabilities: ['Read state', 'Start and stop', 'Schedules'], since: '2024', note: 'Randomised start delays honoured as UK rules require.' },
  { id: 'linden', name: 'Linden Charge', category: 'charger', models: 6, status: 'live', regions: ['North America'], capabilities: ['Read state', 'Live power', 'Start and stop', 'Schedules'], since: '2025', note: 'Level 2 home and workplace chargers.' },
  { id: 'fennel', name: 'Fennel Power', category: 'charger', models: 2, status: 'beta', regions: ['Europe'], capabilities: ['Read state', 'Start and stop'], since: '2026', note: 'Schedules in beta with a small partner group.' },

  { id: 'thermwell', name: 'Thermwell', category: 'heatpump', models: 12, status: 'live', regions: ['Europe', 'United Kingdom'], capabilities: ['Read state', 'Live power', 'Schedules', 'Set temperature'], since: '2023', note: 'Air-to-water units, hot water tank included.' },
  { id: 'fjordheat', name: 'Fjordheat', category: 'heatpump', models: 7, status: 'live', regions: ['Europe'], capabilities: ['Read state', 'Live power', 'Schedules', 'Set temperature'], since: '2024', note: 'Ground-source and air-source ranges.' },
  { id: 'calder', name: 'Calder Climate', category: 'heatpump', models: 5, status: 'live', regions: ['United Kingdom', 'Europe'], capabilities: ['Read state', 'Schedules', 'Set temperature'], since: '2024', note: 'Comfort bands keep homes within 1 °C of the setpoint.' },
  { id: 'brisa', name: 'Brisa Heat', category: 'heatpump', models: 4, status: 'beta', regions: ['Europe'], capabilities: ['Read state', 'Set temperature'], since: '2026', note: 'Live power reporting coming in Q1.' },
  { id: 'oakhearth', name: 'Oakhearth', category: 'heatpump', models: 3, status: 'soon', regions: ['North America'], capabilities: ['Read state'], since: '2027', note: 'Cold-climate units, in certification.' },

  { id: 'stillcell', name: 'Stillcell', category: 'battery', models: 6, status: 'live', regions: ['Europe', 'United Kingdom', 'Australia'], capabilities: ['Read state', 'Live power', 'Schedules', 'Export limits'], since: '2023', note: 'Grid charge and forced discharge supported.' },
  { id: 'ferrocore', name: 'Ferrocore', category: 'battery', models: 4, status: 'live', regions: ['North America', 'Europe'], capabilities: ['Read state', 'Live power', 'Schedules'], since: '2024', note: 'Iron-phosphate packs from 5 to 20 kWh.' },
  { id: 'cellara', name: 'Cellara', category: 'battery', models: 3, status: 'live', regions: ['Australia'], capabilities: ['Read state', 'Live power', 'Schedules', 'Export limits'], since: '2025', note: 'Ready for virtual power plant programmes.' },
  { id: 'basalt', name: 'Basalt Energy', category: 'battery', models: 2, status: 'beta', regions: ['Europe'], capabilities: ['Read state', 'Live power'], since: '2026', note: 'Schedules expected after the spring firmware.' },
  { id: 'harbor', name: 'Harbor Storage', category: 'battery', models: 5, status: 'live', regions: ['North America'], capabilities: ['Read state', 'Live power', 'Schedules', 'Export limits'], since: '2025', note: 'Backup reserve is never discharged by a schedule.' },

  { id: 'sunloom', name: 'Sunloom', category: 'solar', models: 18, status: 'live', regions: ['Europe', 'United Kingdom', 'Australia'], capabilities: ['Read state', 'Live power', 'Export limits'], since: '2023', note: 'String and hybrid inverters.' },
  { id: 'helioforge', name: 'Helio Forge', category: 'solar', models: 10, status: 'live', regions: ['North America', 'Europe'], capabilities: ['Read state', 'Live power', 'Export limits'], since: '2024', note: 'Microinverter systems, per-panel production.' },
  { id: 'ravenray', name: 'Ravenray', category: 'solar', models: 6, status: 'live', regions: ['Europe'], capabilities: ['Read state', 'Live power'], since: '2024', note: 'Read-only today; export limits on the roadmap.' },
  { id: 'solenne', name: 'Solenne', category: 'solar', models: 4, status: 'beta', regions: ['Australia', 'Europe'], capabilities: ['Read state', 'Live power'], since: '2026', note: 'Hybrid inverters with battery passthrough.' },

  { id: 'tempo', name: 'Tempo Home', category: 'thermostat', models: 3, status: 'live', regions: ['North America', 'United Kingdom'], capabilities: ['Read state', 'Schedules', 'Set temperature'], since: '2024', note: 'Smart thermostats for gas and electric heating.' },
  { id: 'cosyline', name: 'Cosyline', category: 'thermostat', models: 4, status: 'live', regions: ['Europe', 'United Kingdom'], capabilities: ['Read state', 'Schedules', 'Set temperature'], since: '2024', note: 'Room-by-room radiator valves included.' },
  { id: 'hearthly', name: 'Hearthly', category: 'thermostat', models: 2, status: 'soon', regions: ['Europe'], capabilities: ['Read state'], since: '2027', note: 'Integration under review with Hearthly.' },
]

export const statusLabel: Record<MakerStatus, string> = { live: 'Live', beta: 'Beta', soon: 'Coming soon' }

export const stats = [
  { value: 1240, suffix: '+', label: 'Device models supported' },
  { value: 92, suffix: '%', label: 'Of EVs on European roads covered' },
  { value: 6.4, suffix: ' GW', decimals: 1, label: 'Flexible capacity under management' },
  { value: 38, suffix: ' ms', label: 'Median read latency' },
]

export const scheduler = {
  eyebrow: 'Smart scheduling',
  title: 'Shift load to the cheapest, cleanest hours',
  body: 'Tell Gridwise how much energy a device needs and when it must be ready. We plan around tomorrow’s prices and grid carbon, then send the schedule to the device and keep it on track.',
  devices: [
    { id: 'ev' as const, label: 'Electric car', kw: 7.4, need: 32, needMax: 60, unit: 'kWh to add', readyBy: 7 },
    { id: 'heatpump' as const, label: 'Heat pump', kw: 2.6, need: 12, needMax: 24, unit: 'kWh of heat', readyBy: 6 },
    { id: 'battery' as const, label: 'Home battery', kw: 5, need: 10, needMax: 13, unit: 'kWh to store', readyBy: 16 },
  ],
  // Hourly day-ahead price (cents/kWh) and carbon (g/kWh) from 18:00 to 17:00 the next day.
  startHour: 18,
  prices: [34, 38, 36, 29, 24, 19, 15, 12, 11, 10, 12, 16, 21, 25, 23, 18, 14, 12, 13, 16, 19, 22, 26, 30],
  carbon: [310, 330, 320, 280, 240, 200, 170, 150, 140, 135, 150, 190, 230, 250, 220, 160, 110, 90, 95, 120, 160, 200, 250, 290],
}

export const developers = {
  eyebrow: 'For developers',
  title: 'Ship your first integration this afternoon',
  body: 'Typed SDKs, a sandbox full of simulated devices and webhooks for every state change. Read a car’s battery in three lines.',
  points: ['REST and webhooks, versioned and stable', 'Sandbox with 40 simulated devices', 'SDKs for Node, Python and Go', 'SOC 2 Type II and GDPR ready'],
  link: { label: 'Read the quickstart', href: '/docs' },
}

export type UseCase = {
  id: string
  label: string
  title: string
  body: string
  points: string[]
  metric: { value: string; label: string }
  image: keyof typeof images
}

export const useCases: UseCase[] = [
  {
    id: 'retailers',
    label: 'Energy retailers',
    title: 'Smart tariffs that run themselves',
    body: 'Offer time-of-use and EV tariffs where the car charges at the right time without the customer opening an app. Settle each session against the real meter data.',
    points: ['Tariff-aware schedules per customer', 'Session-level kWh for billing', 'Onboarding in your own app'],
    metric: { value: '41%', label: 'lower charging cost for customers' },
    image: 'ev',
  },
  {
    id: 'utilities',
    label: 'Utilities and grid operators',
    title: 'Flexibility on the local network',
    body: 'Turn thousands of homes into a dispatchable resource. Reduce peaks on constrained feeders and respond to demand events within seconds.',
    points: ['Feeder-level device groups', 'Demand response in under 10 s', 'Audit trail for every dispatch'],
    metric: { value: '18 MW', label: 'peak reduction on one network' },
    image: 'grid',
  },
  {
    id: 'aggregators',
    label: 'Aggregators and VPPs',
    title: 'A virtual power plant from rooftops',
    body: 'Pool batteries, heat pumps and chargers into one portfolio and bid it into balancing markets, with forecasts of what each home can give.',
    points: ['Availability forecasts per device', 'Market-ready baselines', 'Dispatch with comfort limits'],
    metric: { value: '6.4 GW', label: 'of flexible capacity managed' },
    image: 'battery',
  },
  {
    id: 'apps',
    label: 'Home energy apps',
    title: 'Every device in one app',
    body: 'Build the home energy app your customers keep open. Show live solar, battery and heating data side by side and let people automate the rest.',
    points: ['One data model for 1,240+ models', 'Live power streams', 'White-label device linking'],
    metric: { value: '3 days', label: 'from sandbox to first release' },
    image: 'heatpump',
  },
]

export const flexCalc = {
  title: 'Estimate your flexible capacity',
  body: 'How much load your customers’ devices could shift at the evening peak, using typical availability for each device type.',
  homesMin: 500,
  homesMax: 200000,
  homesDefault: 20000,
  // Typical shiftable kW per device at 17:00–20:00, after availability.
  devices: [
    { id: 'ev', label: 'Electric cars', kw: 3.1, share: 30 },
    { id: 'heatpump', label: 'Heat pumps', kw: 1.4, share: 20 },
    { id: 'battery', label: 'Home batteries', kw: 3.8, share: 10 },
  ],
}

export type Plan = {
  id: 'sandbox' | 'scale' | 'enterprise'
  name: string
  blurb: string
  price: { monthly: number | null; label?: string; unit?: string }
  cta: { label: string; href: string }
  features: string[]
  featured?: boolean
}

export const pricing = {
  title: 'Pay per connected device',
  body: 'Build for free in the sandbox. Pay only for real devices your customers link, with volume discounts as you grow.',
  yearlyDiscount: 0.15,
  plans: [
    {
      id: 'sandbox',
      name: 'Sandbox',
      blurb: 'For building and testing your integration.',
      price: { monthly: 0, label: 'Free' },
      cta: { label: 'Start building', href: '/docs' },
      features: ['40 simulated devices', 'Up to 25 real devices', 'All device categories', 'Community support'],
    },
    {
      id: 'scale',
      name: 'Scale',
      blurb: 'For products in production with real customers.',
      price: { monthly: 1.2, unit: 'per device per month' },
      cta: { label: 'Talk to our team', href: '/contact' },
      features: ['Unlimited devices', 'Smart scheduling and webhooks', 'Volume pricing from 1,000 devices', 'Email support, 1 business day'],
      featured: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      blurb: 'For utilities and aggregators at network scale.',
      price: { monthly: null, label: 'Custom' },
      cta: { label: 'Contact sales', href: '/contact' },
      features: ['Flexibility and dispatch APIs', 'Dedicated regions and SSO', '99.95% uptime SLA', 'Named solutions engineer'],
    },
  ] as Plan[],
  // Volume tiers for the Scale plan, per device per month.
  tiers: [
    { upTo: 1000, price: 1.2 },
    { upTo: 10000, price: 0.8 },
    { upTo: Infinity, price: 0.5 },
  ],
  compare: [
    { feature: 'Simulated devices', values: ['40', '40', 'Unlimited'] },
    { feature: 'Real devices', values: ['25', 'Unlimited', 'Unlimited'] },
    { feature: 'Read state and live power', values: [true, true, true] },
    { feature: 'Start, stop and schedules', values: [true, true, true] },
    { feature: 'Smart scheduling', values: [false, true, true] },
    { feature: 'Webhooks', values: [true, true, true] },
    { feature: 'Flexibility and dispatch', values: [false, false, true] },
    { feature: 'White-label device linking', values: [false, true, true] },
    { feature: 'SSO and audit logs', values: [false, false, true] },
    { feature: 'Uptime SLA', values: ['', '99.9%', '99.95%'] },
    { feature: 'Support', values: ['Community', 'Email', 'Named engineer'] },
  ] as { feature: string; values: (string | boolean)[] }[],
  faq: [
    { q: 'What counts as a connected device?', a: 'Any real device a customer has linked and that is active at some point in the month. Simulated sandbox devices are always free, and a device unlinked before the 3rd is not billed.' },
    { q: 'Do volume tiers apply to all devices?', a: 'Tiers are graduated: the first 1,000 devices are billed at the first rate, the next 9,000 at the second, and the rest at the third.' },
    { q: 'Can we move from Sandbox to Scale later?', a: 'Yes. Your keys, webhooks and linked test devices carry over. Switch the plan and real devices start billing from that day.' },
    { q: 'Which regions do you host in?', a: 'Europe (Frankfurt and Stockholm) and North America (Virginia). Enterprise customers can pin data to one region.' },
    { q: 'Is there a minimum commitment?', a: 'Not on Sandbox or Scale. Enterprise contracts are annual and include a committed device volume.' },
  ],
}

export const contact = {
  title: 'Talk to our team',
  body: 'Tell us what you are building. A solutions engineer replies within one business day with a plan and a sandbox walkthrough.',
  roles: ['Energy retailer', 'Utility or grid operator', 'Aggregator or VPP', 'Device maker', 'App developer', 'Other'],
  volumes: [
    { id: 'lt1k', label: 'Under 1,000', hint: 'Pilot or early product' },
    { id: '1k-10k', label: '1,000 to 10,000', hint: 'Launched, growing' },
    { id: '10k-100k', label: '10,000 to 100,000', hint: 'Regional scale' },
    { id: 'gt100k', label: 'Over 100,000', hint: 'National scale' },
  ],
  promises: [
    { title: 'Reply in one business day', body: 'From an engineer, not a sequence.' },
    { title: 'A working sandbox', body: 'With your device mix preloaded.' },
    { title: 'Pricing in writing', body: 'Based on your real volumes.' },
  ],
}

export const docs = {
  title: 'Quickstart',
  body: 'Link a simulated car, read its battery and send it a smart-charging schedule. About ten minutes, no hardware needed.',
  steps: [
    { id: 'key', title: 'Create a sandbox key' },
    { id: 'install', title: 'Install the SDK' },
    { id: 'link', title: 'Link a device' },
    { id: 'read', title: 'Read device state' },
    { id: 'schedule', title: 'Send a schedule' },
    { id: 'webhooks', title: 'Listen for webhooks' },
  ],
}

export const footer = {
  blurb: 'The API between home energy devices and the grid.',
  columns: [
    { title: 'Product', links: [{ label: 'Platform', href: '/#platform' }, { label: 'Device coverage', href: '/devices' }, { label: 'Pricing', href: '/pricing' }] },
    { title: 'Developers', links: [{ label: 'Quickstart', href: '/docs' }, { label: 'Webhooks', href: '/docs#webhooks' }, { label: 'Style guide', href: '/styleguide' }] },
    { title: 'Solutions', links: [{ label: 'Energy retailers', href: '/use-cases#retailers' }, { label: 'Utilities', href: '/use-cases#utilities' }, { label: 'Aggregators', href: '/use-cases#aggregators' }] },
    { title: 'Company', links: [{ label: 'Talk to our team', href: '/contact' }, { label: 'Use cases', href: '/use-cases' }] },
  ],
  legal: '© 2026 Gridwise ApS. Device makers and customers shown are fictional.',
}
