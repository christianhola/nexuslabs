/*
  Every string, number and seed record on the site lives here. Edit this file
  first: the sections and pages only lay it out.
*/
import type { CurrencyCode } from './shared/fx'

export const brand = {
  name: 'Ledgerly',
  domain: 'ledgerly.app',
  tagline: 'Payments and global transfers for small businesses.',
  support: 'support@ledgerly.app',
}

/**
 * Every photograph on the site goes through this map, so swapping in your own
 * photography is a one-file change. Files live in /public/images.
 */
export const images = {
  roastery: { src: '/images/roastery.webp', alt: 'A roaster sealing bags of coffee beans at a packing table' },
  studio: { src: '/images/studio.webp', alt: 'Two designers reviewing printed layouts beside a laptop' },
  workshop: { src: '/images/workshop.webp', alt: 'A mechanic adjusting a teal bicycle on a repair stand' },
  export: { src: '/images/export.webp', alt: 'A person scanning parcels in a small warehouse' },
} as const
export type ImageKey = keyof typeof images

export const nav = {
  links: [
    { label: 'Send money', href: '/send' },
    { label: 'Checkout', href: '/checkout' },
    { label: 'Customers', href: '/customers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Developers', href: '/developers' },
  ],
  login: { label: 'Log in', href: '/login' },
  signup: { label: 'Sign up', href: '/signup' },
}

export const hero = {
  title: ['Get paid early,', 'send money abroad', 'at the real rate.'],
  body: 'Ledgerly gives small businesses simple invoicing, checkout that converts and transfers to 60 countries, all from one account.',
  emailPlaceholder: 'Your business email',
  cta: 'Get started',
  success: 'You’re on the list. Check your inbox to finish opening your account.',
  partners: ['Northwind', 'brightline', 'Kestrel&Co'],
  partnersLabel: 'Trusted by teams at',
  widget: {
    payer: 'Harbor Coffee Co.',
    payerEmail: 'accounts@harborcoffee.co',
    invoiceLabel: 'Invoice',
    invoiceNumber: 'INV-2041',
    amount: 18_765.8,
    due: 'Due 21 Nov 2026',
    methods: [
      { id: 'card', label: 'Credit card', detail: 'Visa ending 4242' },
      { id: 'bank', label: 'Bank account', detail: 'ACH, free' },
    ],
    pay: 'Pay',
    paying: 'Processing',
    paid: 'Paid',
    paidNote: 'Funds land in your Ledgerly balance in seconds.',
    again: 'Reset demo',
    cardLabel: 'Business card',
    cardNumber: '4242',
  },
}

export const features = {
  eyebrow: 'Built for growth',
  title: 'A payments stack that grows with your scale.',
  body: 'One financial operating system for invoices, payouts and cross-border cash flow, without stitching five tools together.',
  items: [
    {
      icon: 'transfer',
      title: 'Free local transfers',
      body: 'Pay suppliers in the same currency at no cost, and schedule repeat payments so payroll and rent run themselves.',
    },
    {
      icon: 'bank',
      title: 'Accounts in 10 currencies',
      body: 'Hold, receive and convert USD, EUR, GBP and more with local account details your customers already trust.',
    },
    {
      icon: 'shield',
      title: 'Unmatched security',
      body: 'Organisation-wide MFA, card locking, payment approvals and account-level controls, audited every year.',
    },
  ],
}

export const insights = {
  stat: { value: 3200, suffix: '+', label: 'Businesses already running on Ledgerly' },
  withdraw: { title: 'Withdraw your funds instantly, any time', note: 'Balance to bank in under 30 seconds' },
  summary: {
    label: 'Balance',
    ranges: [
      { id: '3m', label: '3 months', points: [1_212_400, 1_356_900, 1_410_200, 1_498_000, 1_640_300, 1_876_580] },
      { id: '6m', label: '6 months', points: [612_000, 840_500, 1_024_900, 1_186_000, 1_498_000, 1_876_580] },
      { id: '12m', label: '12 months', points: [128_000, 310_400, 520_000, 688_200, 1_102_500, 1_876_580] },
    ],
    months: {
      '3m': ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      '6m': ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      '12m': ['Mar', 'May', 'Jul', 'Sep', 'Nov', 'Feb'],
    } as Record<string, string[]>,
  },
}

export const steps = {
  eyebrow: 'How it works',
  title: 'Maximise returns with an account that works as hard as you do.',
  items: [
    { n: '1', title: 'Open your account', body: 'Sign up online in about eight minutes. No branch visit and no minimum balance.' },
    { n: '2', title: 'Get paid and transfer', body: 'Send invoices, take card payments and move money between currencies at the mid-market rate.' },
    { n: '3', title: 'Watch your balance grow', body: 'Idle cash earns 3.9% APY and stays instantly available, insulated from market swings.' },
  ],
}

export const mission = {
  eyebrow: 'Our mission',
  title: 'We’ve helped innovative companies move faster.',
  body: 'Hundreds of businesses of every size and industry have cut fees and freed up cash with Ledgerly.',
  stats: [
    { value: 4, suffix: '%', label: 'Average margin saved per business' },
    { value: 180, suffix: 'K', label: 'Saved in annual fees, on average' },
    { value: 10, suffix: '+', label: 'Extra months of runway' },
  ],
}

export const why = {
  eyebrow: 'Why us',
  title: 'Why teams prefer Ledgerly',
  reasons: [
    { title: 'The real exchange rate', body: 'We show the mid-market rate and a fee you can see. No markup hidden in the rate.' },
    { title: 'Checkout in one line', body: 'Drop in a hosted checkout or our API and start taking cards, wallets and bank payments today.' },
    { title: 'People who answer', body: 'Talk to a payments specialist in under two minutes, every day of the week.' },
  ],
  quote: {
    text: 'We used to lose almost 4% on every euro invoice. Ledgerly paid for itself in the first week.',
    name: 'Mara Lindqvist',
    role: 'Founder, Harbor Coffee Co.',
    initials: 'ML',
  },
}

/* ---------- Plans ---------- */

export type Plan = {
  id: 'starter' | 'growth' | 'scale'
  name: string
  monthly: number
  yearly: number
  blurb: string
  cardRate: number
  fxRate: number
  features: string[]
  cta: string
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    yearly: 0,
    blurb: 'For freelancers and new businesses.',
    cardRate: 2.9,
    fxRate: 0.65,
    features: ['Unlimited invoices', '2 currency accounts', 'Hosted checkout', 'Email support'],
    cta: 'Start free',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthly: 29,
    yearly: 24,
    blurb: 'For teams paying and getting paid abroad.',
    cardRate: 2.5,
    fxRate: 0.45,
    features: ['Everything in Starter', '10 currency accounts', 'Batch payouts up to 1,000', 'Approval rules', 'Priority chat'],
    cta: 'Choose Growth',
    featured: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 99,
    yearly: 82,
    blurb: 'For high-volume merchants and platforms.',
    cardRate: 2.1,
    fxRate: 0.3,
    features: ['Everything in Growth', 'Custom FX limits', 'Dedicated account manager', 'SAML single sign-on', '99.99% uptime SLA'],
    cta: 'Talk to sales',
  },
]

export const plansTeaser = {
  eyebrow: 'Choose a plan',
  title: 'Simple plans. Fees you can see.',
}

export const pricing = {
  title: 'Pricing that stays out of your margin',
  body: 'Start free. Upgrade when your volume grows. Every fee is shown before you pay it.',
  monthly: 'Monthly',
  yearly: 'Yearly',
  yearlyNote: 'Save 17%',
  calculator: {
    title: 'Estimate your monthly cost',
    body: 'Move the sliders to your card and transfer volume. We pick the cheapest plan for you.',
    cardLabel: 'Card payments per month',
    fxLabel: 'International transfers per month',
    cheapest: 'Cheapest for you',
  },
  compare: {
    title: 'Compare plans',
    rows: [
      { label: 'Card processing', values: ['2.9% + 30¢', '2.5% + 30¢', '2.1% + 30¢'] },
      { label: 'FX fee', values: ['0.65%', '0.45%', '0.30%'] },
      { label: 'Currency accounts', values: ['2', '10', '10'] },
      { label: 'Team members', values: ['1', '10', 'Unlimited'] },
      { label: 'Batch payouts', values: [false, true, true] },
      { label: 'Approval rules', values: [false, true, true] },
      { label: 'SAML single sign-on', values: [false, false, true] },
      { label: 'Uptime SLA', values: [false, false, '99.99%'] },
    ] as { label: string; values: (string | boolean)[] }[],
  },
  faq: [
    { q: 'Are there setup or monthly minimums?', a: 'No. Starter is free forever and paid plans can be cancelled at the end of any billing period.' },
    { q: 'How is the exchange rate set?', a: 'We use the mid-market rate from our liquidity providers, refreshed every few seconds, and add only the FX fee shown for your plan.' },
    { q: 'When do card payments reach my balance?', a: 'Immediately on Growth and Scale. On Starter, funds settle the next business day.' },
    { q: 'Can I move plans later?', a: 'Yes. Upgrades apply at once and are prorated; downgrades take effect at the next renewal.' },
  ],
}

/* ---------- Send money ---------- */

export const send = {
  title: 'Send money abroad at the real rate',
  body: 'Lock a live quote for 30 seconds, see every fee, and track the transfer until it lands.',
  defaults: { from: 'USD' as CurrencyCode, to: 'EUR' as CurrencyCode, amount: 2500 },
  youSend: 'You send',
  theyGet: 'Recipient gets',
  speedLabel: 'Speed',
  speeds: [
    { id: 'instant', label: 'Instant', note: 'Arrives in seconds for most currencies' },
    { id: 'standard', label: 'Standard', note: 'Lower fee, 1 to 2 business days' },
  ],
  rateLabel: 'Mid-market rate',
  lockLabel: 'Rate locked for',
  refreshing: 'Refreshing quote',
  bankCompare: 'A typical bank would deliver',
  saving: 'You save',
  steps: ['Amount', 'Recipient', 'Review', 'Done'],
  recipient: {
    title: 'Who are you paying?',
    name: 'Full name',
    email: 'Email',
    emailHint: 'We email them a receipt and tracking link.',
    account: 'IBAN or account number',
    accountHint: 'Try DE89 3704 0044 0532 0130 00.',
    reference: 'Reference (optional)',
  },
  review: {
    title: 'Check and confirm',
    confirm: 'Confirm and send',
    expired: 'Your quote expired. We refreshed it below.',
  },
  done: {
    title: 'Money on its way',
    body: 'We’ve emailed you a receipt. Follow the transfer below.',
    track: ['Payment received', 'Converted', 'Sent to bank', 'Delivered'],
    another: 'Send another',
  },
  history: {
    title: 'Recent transfers',
    empty: 'No transfers yet. Your sends appear here and stay on this device.',
    clear: 'Clear history',
  },
}

/* ---------- Checkout demo ---------- */

export const checkout = {
  title: 'A checkout your customers finish',
  body: 'Ledgerly Checkout is one embed. Customise it on the left, pay with a test card on the right.',
  merchant: 'Fernwood Supply',
  products: [
    { id: 'kettle', name: 'Pour-over kettle', variant: 'Matte black, 1 l', price: 64, qty: 1, swatch: '#1c2a30' },
    { id: 'beans', name: 'Single-origin beans', variant: 'Ethiopia, 250 g', price: 18, qty: 2, swatch: '#8a5a3c' },
    { id: 'filters', name: 'Paper filters', variant: '100 pack', price: 7, qty: 1, swatch: '#e4d6c3' },
  ],
  shipping: 6,
  taxRate: 0.08,
  promo: { code: 'WELCOME10', percent: 10 },
  accents: [
    { id: 'teal', label: 'Teal', hex: '#1f6f79' },
    { id: 'navy', label: 'Navy', hex: '#0b3647' },
    { id: 'plum', label: 'Plum', hex: '#6b3a8a' },
    { id: 'ember', label: 'Ember', hex: '#a3352e' },
  ],
  methods: [
    { id: 'card', label: 'Card' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'bank', label: 'Bank' },
  ],
  testCards: [
    { number: '4242 4242 4242 4242', label: 'Succeeds' },
    { number: '4000 0025 0000 3155', label: 'Asks for a one-time code' },
    { number: '4000 0000 0000 0002', label: 'Is declined' },
  ],
  otp: { title: 'Confirm it’s you', body: 'Enter the 6-digit code your bank sent. In this demo, any 6 digits work.', code: 'Code' },
  success: { title: 'Payment complete', body: 'A receipt is on its way to', again: 'Run another payment' },
}

/* ---------- Developers ---------- */

export type Endpoint = {
  id: string
  method: 'GET' | 'POST'
  path: string
  title: string
  body: string
  params: { name: string; type: string; required?: boolean; desc: string }[]
  response: string
}

export const developers = {
  title: 'Developer docs',
  body: 'A small REST API for quotes, transfers and checkout. JSON in, JSON out, test mode by default.',
  base: 'https://api.ledgerly.app/v1',
  sidebar: [
    { id: 'quickstart', label: 'Quickstart' },
    { id: 'auth', label: 'Authentication' },
    { id: 'quotes', label: 'Create a quote' },
    { id: 'transfers', label: 'Create a transfer' },
    { id: 'checkout', label: 'Checkout sessions' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'errors', label: 'Errors' },
    { id: 'console', label: 'Try it' },
  ],
  quickstart: [
    'Create a test key in Settings, under API keys. Test keys start with lk_test_.',
    'Request a quote, then create a transfer with the quote id within 30 seconds.',
    'Listen for transfer.delivered on your webhook endpoint.',
  ],
  auth: 'Send your secret key as a bearer token. Keep it on your server: never ship it to a browser or app.',
  endpoints: [
    {
      id: 'quotes',
      method: 'GET',
      path: '/quotes',
      title: 'Create a quote',
      body: 'Prices a transfer at the live mid-market rate and locks it for 30 seconds.',
      params: [
        { name: 'from', type: 'string', required: true, desc: 'ISO currency code you send, e.g. USD.' },
        { name: 'to', type: 'string', required: true, desc: 'ISO currency code they receive.' },
        { name: 'amount', type: 'number', required: true, desc: 'Amount in the send currency.' },
        { name: 'speed', type: 'string', desc: 'instant (default) or standard.' },
      ],
      response: `{
  "id": "qt_8fK2mZ",
  "from": "USD",
  "to": "EUR",
  "send_amount": 2500.00,
  "fee": 16.71,
  "rate": 0.921843,
  "receive_amount": 2289.18,
  "expires_at": "2026-11-12T09:30:30Z"
}`,
    },
    {
      id: 'transfers',
      method: 'POST',
      path: '/transfers',
      title: 'Create a transfer',
      body: 'Sends money using a quote. Returns the transfer with its tracking status.',
      params: [
        { name: 'quote', type: 'string', required: true, desc: 'The quote id, used within 30 seconds.' },
        { name: 'recipient.name', type: 'string', required: true, desc: 'Full legal name.' },
        { name: 'recipient.account', type: 'string', required: true, desc: 'IBAN or local account number.' },
        { name: 'reference', type: 'string', desc: 'Up to 40 characters, shown on their statement.' },
      ],
      response: `{
  "id": "tr_3Qp91L",
  "status": "converted",
  "receive_amount": 2289.18,
  "currency": "EUR",
  "eta": "in seconds"
}`,
    },
    {
      id: 'checkout',
      method: 'POST',
      path: '/checkout/sessions',
      title: 'Checkout sessions',
      body: 'Creates a hosted checkout. Redirect the customer to the returned url.',
      params: [
        { name: 'amount', type: 'integer', required: true, desc: 'Total in the smallest currency unit.' },
        { name: 'currency', type: 'string', required: true, desc: 'ISO currency code.' },
        { name: 'success_url', type: 'string', required: true, desc: 'Where to send the customer after paying.' },
      ],
      response: `{
  "id": "cs_test_a1B2c3",
  "url": "https://pay.ledgerly.app/cs_test_a1B2c3",
  "status": "open"
}`,
    },
  ] as Endpoint[],
  webhooks: [
    { event: 'transfer.converted', desc: 'Funds were converted at the quoted rate.' },
    { event: 'transfer.delivered', desc: 'The recipient’s bank confirmed the credit.' },
    { event: 'checkout.completed', desc: 'A customer paid a checkout session.' },
    { event: 'payout.failed', desc: 'A payout bounced; the funds are back in your balance.' },
  ],
  errors: [
    { code: '400', name: 'invalid_request', desc: 'A parameter is missing or malformed.' },
    { code: '401', name: 'unauthorized', desc: 'The key is missing or revoked.' },
    { code: '409', name: 'quote_expired', desc: 'Request a fresh quote and retry.' },
    { code: '422', name: 'validation_failed', desc: 'The body is well formed but a field is invalid.' },
    { code: '429', name: 'rate_limited', desc: 'Slow down: 100 requests per second per key.' },
  ],
  console: {
    title: 'Try it',
    body: 'This console calls the template’s own Worker at /api/quote, so you see a real response.',
    run: 'Send request',
  },
}

/* ---------- Security ---------- */

export const security = {
  title: 'Security and compliance',
  body: 'Your money and your customers’ data are protected by the same controls banks use, and we publish how.',
  pillars: [
    { icon: 'lock', title: 'Encrypted everywhere', body: 'TLS 1.3 in transit, AES-256 at rest, and card data tokenised in a separate PCI vault.' },
    { icon: 'key', title: 'Access you control', body: 'Enforced MFA, hardware keys, per-user limits and dual approval for large payments.' },
    { icon: 'eye', title: 'Fraud screening', body: 'Every payment is scored in under 50 ms; risky ones are paused, not silently declined.' },
    { icon: 'vault', title: 'Safeguarded funds', body: 'Customer balances are held in segregated accounts at partner banks, never lent out.' },
  ],
  certs: [
    { name: 'PCI DSS Level 1', note: 'Annual on-site assessment' },
    { name: 'SOC 2 Type II', note: 'Report available on request' },
    { name: 'ISO 27001', note: 'Certified information security' },
    { name: 'GDPR', note: 'EU data residency option' },
  ],
  flow: ['Your customer', 'Tokenised at the edge', 'PCI vault', 'Card network'],
  status: {
    title: 'System status',
    note: 'Uptime over the last 30 days',
    services: [
      { name: 'Payments API', uptime: 99.99 },
      { name: 'Transfers', uptime: 99.97 },
      { name: 'Dashboard', uptime: 100 },
      { name: 'Webhooks', uptime: 99.95 },
    ],
  },
  request: {
    title: 'Request our security pack',
    body: 'Get the SOC 2 report, penetration test summary and data processing agreement.',
    topics: ['SOC 2 report', 'Penetration test summary', 'Data processing agreement', 'Security questionnaire'],
    submit: 'Request documents',
    success: 'Thanks. Our security team will email the documents within one business day. Reference',
  },
}

/* ---------- Customers ---------- */

export type Story = {
  id: string
  company: string
  industry: 'Retail' | 'Services' | 'Export'
  image: ImageKey
  headline: string
  body: string
  metric: string
  metricLabel: string
  quote: string
  person: string
}

export const customers = {
  title: 'Businesses that run on Ledgerly',
  body: 'From one-person studios to exporters shipping to 40 countries.',
  filters: ['All', 'Retail', 'Services', 'Export'] as const,
  stories: [
    {
      id: 'harbor',
      company: 'Harbor Coffee Co.',
      industry: 'Retail',
      image: 'roastery',
      headline: 'Wholesale invoices paid 11 days sooner',
      body: 'Harbor sends invoices with a pay-by-card link and gets paid early, then pays its growers in Ethiopia at the real rate.',
      metric: '11 days',
      metricLabel: 'faster payment',
      quote: 'Our cash cycle went from a month to under three weeks.',
      person: 'Mara Lindqvist, founder',
    },
    {
      id: 'parallel',
      company: 'Parallel Studio',
      industry: 'Services',
      image: 'studio',
      headline: 'Clients in 9 countries, one simple bill',
      body: 'Parallel bills in each client’s currency and converts only when the rate suits them.',
      metric: '£24K',
      metricLabel: 'saved in FX fees a year',
      quote: 'Clients pay in euros and dollars and we just see one balance.',
      person: 'Theo Marchetti, partner',
    },
    {
      id: 'spoke',
      company: 'Spoke & Gear',
      industry: 'Retail',
      image: 'workshop',
      headline: 'Checkout conversion up 18%',
      body: 'The bike shop moved repairs and online orders onto Ledgerly Checkout, with wallets and pay-by-bank.',
      metric: '+18%',
      metricLabel: 'checkout conversion',
      quote: 'Customers pay on their phone before the bike is off the stand.',
      person: 'Ines Duarte, owner',
    },
    {
      id: 'meridian',
      company: 'Meridian Goods',
      industry: 'Export',
      image: 'export',
      headline: 'Batch payouts to 300 suppliers',
      body: 'Meridian pays its supplier network weekly with one CSV, with approvals for anything over $10,000.',
      metric: '6 hrs',
      metricLabel: 'saved every week',
      quote: 'Payout day used to take the whole afternoon.',
      person: 'Sam Okafor, finance lead',
    },
  ] as Story[],
}

/* ---------- Auth ---------- */

export const signup = {
  title: 'Open your Ledgerly account',
  body: 'Three short steps. Your progress is saved on this device.',
  steps: ['Business', 'You', 'Done'],
  types: ['Sole trader', 'Limited company', 'Partnership', 'Nonprofit'],
  countries: ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Singapore'],
  volumes: ['Under $10K', '$10K to $100K', '$100K to $1M', 'Over $1M'],
  success: 'Your account is ready',
  successBody: 'We sent a verification link to',
}

export const login = {
  title: 'Welcome back',
  body: 'Log in to send money, manage checkout and see your balance.',
  demoNote: 'Demo: any email and a password of 10+ characters with a number signs you in on this device.',
  forgot: 'Forgot password?',
  resetSent: 'If an account exists, we’ve sent a reset link to',
}

export const contactTopics = security.request.topics

/* ---------- Footer ---------- */

export const footer = {
  blurb: 'Payments, checkout and global transfers for small businesses.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Send money', href: '/send' },
        { label: 'Checkout', href: '/checkout' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'Customers', href: '/customers' },
        { label: 'Security', href: '/security' },
        { label: 'Open an account', href: '/signup' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { label: 'API docs', href: '/developers' },
        { label: 'Webhooks', href: '/developers#webhooks' },
        { label: 'Style guide', href: '/styleguide' },
      ],
    },
  ],
  legal: 'Ledgerly is a demo brand. Payment services would be provided by licensed partner institutions.',
}

export const cta = {
  title: 'Start getting paid the Ledgerly way',
  body: 'Open an account in minutes. No setup fees, no minimum balance.',
  primary: { label: 'Open an account', href: '/signup' },
  secondary: { label: 'Try a transfer', href: '/send' },
}

export const notFound = {
  title: 'This page took a wrong turn',
  body: 'The link may be old, or the page has moved. Try one of these instead.',
}
