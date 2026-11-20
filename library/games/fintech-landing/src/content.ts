// Every string, number and link on the page lives here. Edit this file first.

export const brand = {
  name: 'Revio',
  tagline: 'Business accounts, cards and spend controls for modern teams.',
}

// Top navigation. Each link is a page (see src/App.tsx for the route table).
export const nav = {
  links: [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/company', label: 'Company' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  cta: { label: 'Get Started', href: '/signup' },
  login: { label: 'Log in', href: '/login' },
}

export const hero = {
  proof: [
    { text: 'SaaS website design template' },
    { text: 'Use over ', strong: '12K+', after: ' businesses worldwide.' },
  ],
  title: 'Revio Landing Page',
  primary: { label: 'Get Started for Free', href: '/signup' },
  secondary: { label: 'Explore Features', href: '/features' },
  card: {
    holder: 'Studio Seven',
    number: '5243 7890 5623 4512',
    validFrom: '01/25',
    validThru: '01/30',
  },
  account: {
    name: 'Revio',
    label: 'Business Account',
    balanceLabel: 'Balance',
    balance: 12099,
    change: '+2.09%',
    spark: [12, 14, 13, 17, 16, 19, 18, 22, 21, 25, 24, 29, 28, 33],
  },
  badge: 'Fintech SaaS Website',
}

export const logos = ['Northwind', 'Lumen', 'Arcadia', 'Halcyon', 'Quanta', 'Fieldnote', 'Meridian', 'Copperline']

export const features = {
  eyebrow: 'Features',
  title: 'One account for every way your business moves money',
  body: 'Open a business account in minutes, issue cards to the whole team and see every transaction the second it happens.',
  stats: [
    { value: 12000, suffix: '+', label: 'Businesses on Revio' },
    { value: 4.2, suffix: 'B', prefix: '$', decimals: 1, label: 'Processed each year' },
    { value: 38, suffix: '', label: 'Currencies supported' },
  ],
  analytics: {
    title: 'Real-time spend analytics',
    body: 'Every card swipe lands on the dashboard instantly, sorted by team, vendor and budget.',
    bars: [38, 52, 44, 68, 58, 82, 74, 92, 66, 78, 88, 96],
  },
  cards: {
    title: 'Virtual cards in one click',
    body: 'Create a card per vendor, per project or per person. Set it to expire after one payment.',
  },
  currencies: {
    title: 'Hold and pay in 38 currencies',
    body: 'Local account details for USD, EUR and GBP, with mid-market FX.',
    rows: [
      { code: 'USD', name: 'US Dollar', amount: '$48,210.40', flag: '#2563eb' },
      { code: 'EUR', name: 'Euro', amount: '€12,904.12', flag: '#7c3aed' },
      { code: 'GBP', name: 'British Pound', amount: '£6,380.00', flag: '#dc2626' },
    ],
  },
  invoices: {
    title: 'Invoices that chase themselves',
    body: 'Send branded invoices, accept card or bank payment and reconcile automatically.',
  },
  security: {
    title: 'Bank-grade security',
    body: 'Funds held with FDIC-insured partner banks, 2FA on every login and instant freeze.',
  },
}

export const controls = {
  eyebrow: 'Card controls',
  title: 'Spend rules that live on the card itself',
  body: 'Set limits, block categories and freeze a card the moment something looks off. Changes apply before the next swipe.',
  themes: [
    { id: 'graphite', label: 'Graphite' },
    { id: 'violet', label: 'Violet' },
    { id: 'pearl', label: 'Pearl' },
  ] as const,
  toggles: [
    { id: 'online', label: 'Online payments', hint: 'Allow e-commerce and subscriptions', on: true },
    { id: 'intl', label: 'International use', hint: 'Allow charges outside your country', on: false },
    { id: 'atm', label: 'ATM withdrawals', hint: 'Cash up to your daily limit', on: true },
  ],
  limit: { min: 500, max: 20000, step: 250, initial: 7500 },
  recent: [
    { merchant: 'Figma', category: 'Software', amount: -45 },
    { merchant: 'AWS', category: 'Infrastructure', amount: -1284.32 },
    { merchant: 'Client refund', category: 'Income', amount: 920 },
  ],
}

export const pricing = {
  eyebrow: 'Pricing',
  title: 'Simple plans that grow with you',
  body: 'Start free. Upgrade when your team and volume do.',
  yearlyNote: 'Save 20%',
  plans: [
    {
      id: 'starter',
      href: '/signup?plan=starter',
      name: 'Starter',
      monthly: 0,
      yearly: 0,
      blurb: 'For freelancers and new companies.',
      features: ['1 business account', '3 virtual cards', 'Basic spend analytics', 'Email support'],
      cta: 'Start for free',
    },
    {
      id: 'growth',
      href: '/signup?plan=growth',
      name: 'Growth',
      monthly: 49,
      yearly: 39,
      blurb: 'For teams that spend together.',
      features: ['Unlimited virtual cards', 'Card controls and limits', 'Multi-currency accounts', 'Automated invoicing', 'Priority support'],
      cta: 'Start 14-day trial',
      featured: true as boolean,
    },
    {
      id: 'scale',
      href: '/contact?topic=sales',
      name: 'Scale',
      monthly: 149,
      yearly: 119,
      blurb: 'For finance teams with approvals.',
      features: ['Everything in Growth', 'Approval workflows', 'ERP and accounting sync', 'Custom roles', 'Dedicated manager'],
      cta: 'Talk to sales',
    },
  ],
}

export const testimonials = {
  eyebrow: 'Company',
  title: 'Trusted by finance teams that move fast',
  items: [
    {
      quote: 'We closed our books four days faster the first month. Every receipt is already matched when the card is swiped.',
      name: 'Maya Chen',
      role: 'CFO, Northwind',
      hue: 262,
    },
    {
      quote: 'Giving each contractor a card with its own limit removed a whole category of expense reports.',
      name: 'Daniel Okafor',
      role: 'Head of Ops, Lumen',
      hue: 18,
    },
    {
      quote: 'The multi-currency account replaced two banks and a spreadsheet. Our EU payroll now runs in one click.',
      name: 'Sofia Martins',
      role: 'Finance Lead, Arcadia',
      hue: 152,
    },
    {
      quote: 'Freezing a card from my phone while still on the call with the vendor. That alone sold the team.',
      name: 'Liam Becker',
      role: 'Founder, Quanta',
      hue: 205,
    },
  ],
}

export const blog = {
  eyebrow: 'Blog',
  title: 'Notes on running a lean finance stack',
  more: { label: 'Read the blog', href: '/blog' },
}

export const faq = {
  eyebrow: 'FAQ',
  title: 'Questions, answered',
  items: [
    {
      q: 'Is Revio a bank?',
      a: 'Revio is a financial technology company. Banking services are provided by our FDIC-insured partner banks, so deposits are insured up to the standard limits.',
    },
    {
      q: 'How long does it take to open an account?',
      a: 'Most businesses are approved in under ten minutes. You need your company registration details and an ID for each owner.',
    },
    {
      q: 'Can I issue cards to contractors?',
      a: 'Yes. Invite them as limited members and issue virtual or physical cards with their own limits, categories and expiry.',
    },
    {
      q: 'Which accounting tools do you sync with?',
      a: 'QuickBooks, Xero, NetSuite and Sage on Growth and above. Exports to CSV are available on every plan.',
    },
    {
      q: 'What happens if I cancel?',
      a: 'You can cancel any time. Your balance is transferred to the account of your choice and your data stays exportable for 90 days.',
    },
  ],
}

export const cta = {
  title: 'Open your business account today',
  body: 'Free to start. No minimum balance. Cards in your wallet in minutes.',
  placeholder: 'Work email',
  button: 'Get Started for Free',
  success: 'Demo complete. No subscription was saved.',
}

export const footer = {
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Cards', href: '/features#cards' },
        { label: 'Payouts', href: '/features#payouts' },
        { label: 'Invoicing', href: '/features#invoicing' },
        { label: 'Analytics', href: '/features#analytics' },
        { label: 'Pricing', href: '/pricing' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/company' },
        { label: 'Careers', href: '/company#careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Sign up', href: '/signup' },
        { label: 'Log in', href: '/login' },
        { label: 'Fee calculator', href: '/pricing#calculator' },
        { label: 'Compare plans', href: '/pricing#compare' },
      ],
    },
  ],
  legal: 'Revio is a financial technology company, not a bank. Banking services provided by partner banks, Member FDIC.',
  styleguide: { label: 'Style guide', href: '/styleguide' },
}

/* ------------------------------------------------------------------ */
/* Inner pages                                                         */
/* ------------------------------------------------------------------ */

export const pricingPage = {
  eyebrow: 'Pricing',
  title: 'Pricing that scales with your volume',
  body: 'Every plan includes a business account, virtual cards and FDIC-insured balances. Pay for seats and features, never for swiping.',
  calculator: {
    eyebrow: 'Fee calculator',
    title: 'See what you would save',
    body: 'Move the sliders to match a typical month. We compare Revio with the fees a traditional business bank charges for the same activity.',
    inputs: {
      spend: { label: 'Monthly card spend', min: 1000, max: 250000, step: 1000, initial: 42000 },
      fx: { label: 'Of which in foreign currency', min: 0, max: 100, step: 5, initial: 25 },
      payouts: { label: 'Payouts and transfers / month', min: 0, max: 500, step: 5, initial: 60 },
      cards: { label: 'Active cards', min: 1, max: 100, step: 1, initial: 12 },
    },
    // Fee model used by the calculator. Edit to match your own pricing.
    bank: { fxRate: 0.03, perTransfer: 25, perCard: 5, monthly: 30 },
    revio: {
      starter: { monthly: 0, fxRate: 0.01, perTransfer: 1, perCard: 0, maxCards: 3 },
      growth: { monthly: 49, fxRate: 0.005, perTransfer: 0, perCard: 0, maxCards: Infinity },
      scale: { monthly: 149, fxRate: 0.0025, perTransfer: 0, perCard: 0, maxCards: Infinity },
    },
    cashbackRate: 0.0075,
    note: 'Estimates only. Bank fees use typical published rates: 3% FX markup, $25 per wire, $5 per card a month and a $30 account fee.',
    labels: {
      results: 'Your estimated monthly cost',
      bank: 'Traditional bank',
      revio: 'Revio',
      save: 'You save',
      perMonth: 'per month',
      perYear: 'a year',
      cashback: 'plus cashback',
      recommended: 'Recommended plan',
      choose: 'Choose',
    },
  },
  compare: {
    eyebrow: 'Compare plans',
    title: 'Every feature, side by side',
    caption: 'Feature comparison of the Starter, Growth and Scale plans',
    feature: 'Feature',
    pick: 'Show plan',
    included: 'Included',
    notIncluded: 'Not included',
    groups: [
      {
        name: 'Accounts',
        rows: [
          { label: 'Business accounts', values: ['1', '5', 'Unlimited'] },
          { label: 'Currencies held', values: ['USD', '38', '38'] },
          { label: 'FDIC insurance', values: ['$250K', '$3M', '$5M'], hint: 'Through our partner-bank sweep network' },
          { label: 'Interest on balances', values: [false, '2.1% APY', '3.4% APY'] },
        ],
      },
      {
        name: 'Cards',
        rows: [
          { label: 'Virtual cards', values: ['3', 'Unlimited', 'Unlimited'] },
          { label: 'Physical cards', values: ['1', '25', 'Unlimited'] },
          { label: 'Spend limits and category blocks', values: [true, true, true] },
          { label: 'Single-use cards', values: [false, true, true] },
          { label: 'Cashback', values: ['0.5%', '0.75%', '1%'] },
        ],
      },
      {
        name: 'Payments',
        rows: [
          { label: 'ACH and domestic wires', values: ['$1 each', 'Free', 'Free'] },
          { label: 'International payouts', values: ['1% FX', '0.5% FX', '0.25% FX'] },
          { label: 'Batch payouts', values: [false, true, true] },
          { label: 'Automated invoicing', values: [false, true, true] },
        ],
      },
      {
        name: 'Finance ops',
        rows: [
          { label: 'Spend analytics', values: ['Basic', 'Full', 'Full + exports'] },
          { label: 'Accounting sync', values: ['CSV', 'QuickBooks, Xero', 'All, incl. NetSuite'] },
          { label: 'Approval workflows', values: [false, false, true] },
          { label: 'Custom roles and SSO', values: [false, false, true] },
          { label: 'Support', values: ['Email', 'Priority chat', 'Dedicated manager'] },
        ],
      },
    ] as { name: string; rows: { label: string; values: (string | boolean)[]; hint?: string }[] }[],
  },
  faq: [
    { q: 'Are there fees on card transactions?', a: 'No. Card spend is free on every plan; we earn interchange from the networks, which is also how we fund cashback.' },
    { q: 'Can I switch plans later?', a: 'Yes, upgrade or downgrade any time from Settings. Changes are prorated to the day.' },
    { q: 'Do you offer discounts for startups and non-profits?', a: 'Companies in partner accelerators and registered non-profits get Growth at the Starter price for 12 months. Contact sales to apply.' },
  ],
  faqHeading: { eyebrow: 'FAQ', title: 'Pricing questions' },
  cta: {
    title: 'Start free, upgrade when it pays for itself',
    body: 'Open an account in ten minutes. Switch plans any time, prorated to the day.',
    primary: { label: 'Get Started for Free', href: '/signup' },
    secondary: { label: 'Talk to sales', href: '/contact?topic=sales' },
  },
}

export const featuresPage = {
  eyebrow: 'Features',
  title: 'Everything your money does, in one place',
  body: 'Cards, payouts, invoicing and analytics share one ledger, so every dollar is categorised, approved and reconciled the moment it moves.',
  sections: [
    {
      id: 'cards',
      label: 'Cards',
      eyebrow: 'Corporate cards',
      title: 'A card for every person, vendor and project',
      body: 'Issue virtual cards in a click and physical cards in days. Each one carries its own limit, merchant rules and owner, so the right spend never needs a reimbursement.',
      points: ['Unlimited virtual cards on Growth', 'Per-card limits, categories and expiry', 'Receipts matched by the time you pocket the card', 'Freeze from the app in one tap'],
      stat: { value: '4 sec', label: 'from request to usable card' },
    },
    {
      id: 'payouts',
      label: 'Payouts',
      eyebrow: 'Global payouts',
      title: 'Pay anyone, anywhere, at mid-market rates',
      body: 'Send ACH, wires and local transfers in 38 currencies from one balance. Batch a whole contractor run from a CSV and approve it once.',
      points: ['Same-day ACH and free domestic wires', 'Local rails in 38 currencies', 'Batch payouts with one approval', 'Live status for every transfer'],
      stat: { value: '0.25%', label: 'FX on Scale, no hidden spread' },
    },
    {
      id: 'invoicing',
      label: 'Invoicing',
      eyebrow: 'Invoicing',
      title: 'Invoices that get paid, then reconcile themselves',
      body: 'Send branded invoices with card, ACH and bank-transfer options built in. Revio nudges late payers and matches each payment to its invoice automatically.',
      points: ['Branded invoices in under a minute', 'Card, ACH and wire on one link', 'Automatic reminders on your schedule', 'Paid invoices post straight to your books'],
      stat: { value: '11 days', label: 'faster average payment' },
    },
    {
      id: 'analytics',
      label: 'Analytics',
      eyebrow: 'Spend analytics',
      title: 'Know where every dollar went, as it goes',
      body: 'Live dashboards break spend down by team, vendor and budget. Set alerts on any line and export anything to your accounting stack.',
      points: ['Real-time spend by team and vendor', 'Budgets with threshold alerts', 'Recurring-vendor detection', 'One-click exports and accounting sync'],
      stat: { value: '4 days', label: 'faster month-end close' },
    },
  ],
  mocks: {
    cardHolders: [
      { name: 'Design team', theme: 'violet' as const, last: '4512', limit: '$5,000' },
      { name: 'AWS', theme: 'graphite' as const, last: '8830', limit: '$12,000' },
      { name: 'Offsite 2026', theme: 'pearl' as const, last: '2207', limit: '$3,500' },
    ],
    payouts: [
      { name: 'Ana Ruiz', country: 'Spain', amount: '€2,400.00', rail: 'SEPA' },
      { name: 'Kenji Mori', country: 'Japan', amount: '¥310,000', rail: 'Zengin' },
      { name: 'Priya Nair', country: 'India', amount: '₹1,85,000', rail: 'IMPS' },
      { name: 'Tom Walsh', country: 'UK', amount: '£1,950.00', rail: 'FPS' },
    ],
    invoice: {
      number: 'INV-2041',
      client: 'Northwind Studio',
      lines: [
        { item: 'Brand identity system', qty: 1, amount: 2400 },
        { item: 'Landing page design', qty: 1, amount: 780 },
        { item: 'Revisions (hours)', qty: 3, amount: 100 },
      ],
      statuses: ['Draft', 'Sent', 'Viewed', 'Paid'],
    },
    analytics: {
      periods: [
        { id: 'week', label: 'Week', total: 18420.12, change: '−4.1%', bars: [42, 58, 36, 72, 64, 30, 22], labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] },
        { id: 'month', label: 'Month', total: 84210.5, change: '−12.4%', bars: [52, 61, 48, 70, 66, 82, 74, 92, 66, 78, 88, 96], labels: ['1', '', '', '', '', '', '', '', '', '', '', '30'] },
        { id: 'quarter', label: 'Quarter', total: 241890.0, change: '+3.2%', bars: [68, 74, 80], labels: ['Aug', 'Sep', 'Oct'] },
      ],
      categories: [
        { name: 'Software', share: 38, color: '#6d55ff' },
        { name: 'Infrastructure', share: 27, color: '#c58ef0' },
        { name: 'Travel', share: 19, color: '#ff5a36' },
        { name: 'Other', share: 16, color: '#4ade80' },
      ],
    },
  },
  // Labels inside the animated product mocks on /features.
  ui: {
    subnav: 'Feature sections',
    cards: {
      label: 'Animated preview: a stack of corporate cards',
      issue: 'Issue card',
      active: 'Active',
      limit: 'Limit',
      validFrom: '01/25',
      validThru: '01/30',
      issued: [
        { name: 'Marketing', limit: '$8,000' },
        { name: 'Contractors', limit: '$15,000' },
        { name: 'Travel', limit: '$4,000' },
        { name: 'Hardware', limit: '$6,500' },
      ],
    },
    payouts: {
      label: 'Animated preview: a batch of international payouts',
      from: 'USD balance',
      balance: '$48,210.40',
      batch: 'Contractor run',
      pending: 'Pending',
      sending: 'Sending',
      sent: 'Sent',
    },
    invoice: {
      label: 'Animated preview: an invoice moving from draft to paid',
      billTo: 'Bill to',
      total: 'Total',
      due: 'Due Nov 30',
      replay: 'Replay invoice animation',
      paid: 'Paid',
    },
    analytics: {
      label: 'Animated preview: spend analytics dashboard',
      spend: 'Total spend',
      vsPrev: 'vs last period',
      byCategory: 'By category',
      period: 'Period',
    },
  },
  cta: { title: 'See it with your own numbers', body: 'Open an account in ten minutes. No minimum balance, no card fees.', primary: { label: 'Get Started for Free', href: '/signup' }, secondary: { label: 'Talk to sales', href: '/contact?topic=sales' } },
}

export const company = {
  eyebrow: 'Company',
  title: 'We build the finance team every startup wishes it had',
  body: 'Revio started in 2021 when three operators got tired of reconciling receipts at midnight. Today 12,000 companies run their money on it.',
  story: {
    eyebrow: 'Our story',
    title: 'From a spreadsheet to $4.2B a year',
    milestones: [
      { year: '2021', title: 'Founded in Brooklyn', body: 'Three ex-operators ship virtual cards to 40 friendly startups.' },
      { year: '2022', title: 'Seed and first 1,000 customers', body: 'Spend controls and receipt matching become the product.' },
      { year: '2023', title: 'Multi-currency accounts', body: 'Local details in USD, EUR and GBP; payouts in 38 currencies.' },
      { year: '2024', title: 'Series B', body: 'Invoicing and accounting sync; the team grows to 120 across four cities.' },
      { year: '2026', title: '12,000 businesses', body: '$4.2B processed a year and a close that takes days, not weeks.' },
    ],
  },
  stats: [
    { value: 12000, suffix: '+', label: 'Businesses' },
    { value: 140, suffix: '', label: 'People on the team' },
    { value: 4, suffix: '', label: 'Offices' },
    { value: 72, suffix: '', label: 'NPS' },
  ],
  values: {
    eyebrow: 'Values',
    title: 'What we hold ourselves to',
    items: [
      { icon: 'shield', title: 'Trust is the product', body: 'We move other people’s money. Security reviews ship before features do.' },
      { icon: 'zap', title: 'Speed is a feature', body: 'A card in four seconds, a payout the same day, a page that loads instantly.' },
      { icon: 'eye', title: 'No hidden fees', body: 'If we would be embarrassed to explain a fee on a call, we do not charge it.' },
      { icon: 'users', title: 'Operators first', body: 'Everyone here has closed books, chased receipts or run payroll. It shows.' },
    ],
  },
  team: {
    eyebrow: 'Team',
    title: 'The people behind Revio',
    people: [
      { name: 'Hana Brooks', role: 'Co-founder & CEO' },
      { name: 'Marcus Lee', role: 'Co-founder & CTO' },
      { name: 'Isabel Ortega', role: 'Co-founder & COO' },
      { name: 'Jonah Fischer', role: 'Head of Risk' },
      { name: 'Amara Diallo', role: 'Head of Design' },
      { name: 'Ravi Shah', role: 'Head of Engineering' },
      { name: 'Clara Novak', role: 'Head of Finance' },
      { name: 'Theo Park', role: 'Head of Support' },
    ],
  },
  careers: {
    eyebrow: 'Careers',
    title: 'Open roles',
    body: 'We hire across New York, London, Lisbon and remote within two hours of those time zones.',
    departments: ['All', 'Engineering', 'Design', 'Operations', 'Legal'],
    roles: [
      { title: 'Senior Backend Engineer, Ledger', department: 'Engineering', location: 'New York or remote', type: 'Full-time' },
      { title: 'Frontend Engineer, Cards', department: 'Engineering', location: 'London', type: 'Full-time' },
      { title: 'Staff Engineer, Payments Infra', department: 'Engineering', location: 'Remote (US/EU)', type: 'Full-time' },
      { title: 'Product Designer, Growth', department: 'Design', location: 'Lisbon', type: 'Full-time' },
      { title: 'Risk Operations Analyst', department: 'Operations', location: 'New York', type: 'Full-time' },
      { title: 'Customer Success Manager', department: 'Operations', location: 'London', type: 'Full-time' },
    ],
    applyHref: '/contact?topic=careers',
    empty: { title: 'No open roles here right now', body: 'We still read every application. Tell us what you would build at Revio.' },
  },
}

export type PostBlock = { type: 'p'; text: string } | { type: 'h2'; text: string } | { type: 'quote'; text: string; cite?: string } | { type: 'list'; items: string[] }

export type Post = {
  slug: string
  tag: string
  title: string
  excerpt: string
  date: string
  read: string
  author: { name: string; role: string }
  featured?: boolean
  body: PostBlock[]
}

export const blogPage = {
  eyebrow: 'Blog',
  title: 'Notes on running a lean finance stack',
  body: 'Guides, product news and the occasional spreadsheet confession from the Revio team.',
  searchPlaceholder: 'Search articles',
  empty: { title: 'No articles match', body: 'Try a different word or clear the filters.' },
  subscribe: { title: 'Get one email a month', body: 'The best of the blog plus product updates. No spam, unsubscribe in one click.' },
}

export const posts: Post[] = [
  {
    slug: 'card-limits-people-respect',
    tag: 'Guide',
    title: 'How to set card limits that people actually respect',
    excerpt: 'Limits fail when they feel arbitrary. Here is the framework we use with 12,000 customers to set ones that stick.',
    date: 'Oct 28, 2026',
    read: '6 min',
    author: { name: 'Clara Novak', role: 'Head of Finance' },
    featured: true,
    body: [
      { type: 'p', text: 'Every finance lead has lived this: you hand out cards, set a round-number limit, and within a month someone is asking for an exception. A week later there are five exceptions, and the limit means nothing.' },
      { type: 'p', text: 'Limits fail when they feel arbitrary. The good news is that a limit people respect is not stricter, it is better explained. Here is the framework we use with customers.' },
      { type: 'h2', text: '1. Start from the job, not the person' },
      { type: 'p', text: 'Issue cards per purpose rather than per employee. A card for “AWS”, one for “Design tools” and one for “Team offsite” each have an obvious ceiling, and nobody takes a declined offsite card personally.' },
      { type: 'h2', text: '2. Use last quarter as the baseline' },
      { type: 'p', text: 'Pull ninety days of spend for the category and set the limit at the monthly peak plus 20%. It is high enough that normal months never hit it and low enough that a surprise invoice gets a second look.' },
      { type: 'quote', text: 'The best limit is one nobody notices until it saves you money.', cite: 'Maya Chen, CFO at Northwind' },
      { type: 'h2', text: '3. Make the exception path fast' },
      { type: 'p', text: 'A limit with a two-day approval process trains people to route around it. Approvals in Revio land in Slack and take one tap, so asking is cheaper than working around.' },
      { type: 'list', items: ['Per-purpose cards with a named owner', 'Limits at peak plus 20%, reviewed quarterly', 'Category blocks for anything that should never happen', 'One-tap approvals for everything else'] },
      { type: 'p', text: 'Run this for a quarter and the exceptions become a signal instead of noise: each one points at a budget that genuinely needs to grow.' },
    ],
  },
  {
    slug: 'approval-workflows',
    tag: 'Product',
    title: 'Introducing approval workflows for Scale teams',
    excerpt: 'Multi-step approvals for cards, payouts and bills, with rules by amount, team and vendor.',
    date: 'Oct 14, 2026',
    read: '3 min',
    author: { name: 'Ravi Shah', role: 'Head of Engineering' },
    body: [
      { type: 'p', text: 'Starting today, Scale teams can route card requests, payouts and bills through approval chains built from simple rules.' },
      { type: 'h2', text: 'Rules, not forms' },
      { type: 'p', text: 'Set a rule like “payouts over $10,000 need the CFO” once, and every matching request follows it. Approvers act from email, Slack or the app.' },
      { type: 'list', items: ['Chains by amount, team, vendor and currency', 'Parallel or sequential approvers', 'A full audit trail exported with each transaction'] },
    ],
  },
  {
    slug: 'month-end-close-checklist',
    tag: 'Finance',
    title: 'A month-end close checklist for teams under 50',
    excerpt: 'The twelve steps we see the fastest-closing small teams follow, in the order they do them.',
    date: 'Sep 30, 2026',
    read: '8 min',
    author: { name: 'Clara Novak', role: 'Head of Finance' },
    body: [
      { type: 'p', text: 'Small teams do not need a 40-tab close workbook. They need a short list done in the same order every month.' },
      { type: 'list', items: ['Lock card spend categories', 'Chase missing receipts', 'Reconcile bank and card feeds', 'Review accruals and prepaid', 'Post payroll', 'Review the P&L against budget'] },
      { type: 'p', text: 'With receipts matched at the swipe, the first three steps mostly disappear.' },
    ],
  },
  {
    slug: 'fx-without-the-spread',
    tag: 'Guide',
    title: 'Paying international contractors without losing 3% to FX',
    excerpt: 'Where the hidden spread lives in a typical wire, and how local rails remove it.',
    date: 'Sep 12, 2026',
    read: '5 min',
    author: { name: 'Jonah Fischer', role: 'Head of Risk' },
    body: [
      { type: 'p', text: 'A “free” international wire usually costs 2–4% in the exchange rate. Over a year of contractor payouts that is real money.' },
      { type: 'h2', text: 'Use local rails' },
      { type: 'p', text: 'Paying through SEPA, FPS or IMPS lands money as a domestic transfer. Revio converts at mid-market and shows the fee before you send.' },
    ],
  },
  {
    slug: 'security-at-revio',
    tag: 'Security',
    title: 'How we keep your money safe, in plain English',
    excerpt: 'Partner banks, encryption, card tokenisation and the people who watch it all at 3am.',
    date: 'Aug 21, 2026',
    read: '4 min',
    author: { name: 'Marcus Lee', role: 'Co-founder & CTO' },
    body: [
      { type: 'p', text: 'Deposits sit with FDIC-insured partner banks. Card numbers are tokenised and never touch our application servers.' },
      { type: 'p', text: 'Every login needs a second factor, and a risk team watches for unusual activity around the clock.' },
    ],
  },
  {
    slug: 'series-b',
    tag: 'Company',
    title: 'Our Series B, and what we are building next',
    excerpt: 'New money, the same mission: give every small company the finance team of a big one.',
    date: 'Jul 9, 2026',
    read: '3 min',
    author: { name: 'Hana Brooks', role: 'Co-founder & CEO' },
    body: [
      { type: 'p', text: 'We raised our Series B to bring invoicing, payouts and accounting into the same ledger as cards.' },
      { type: 'p', text: 'Thank you to the 12,000 companies who trust us with their money. We are hiring; see the careers page.' },
    ],
  },
]

export const contact = {
  eyebrow: 'Contact',
  title: 'Talk to a human at Revio',
  body: 'Questions about plans, a migration or a role? Send a note and we reply within one business day.',
  topics: [
    { value: 'sales', label: 'Sales and pricing' },
    { value: 'support', label: 'Help with my account' },
    { value: 'partnerships', label: 'Partnerships' },
    { value: 'careers', label: 'Careers' },
    { value: 'press', label: 'Press' },
  ],
  channels: [
    { icon: 'mail', title: 'Email', body: 'hello@revio.example', href: 'mailto:hello@revio.example' },
    { icon: 'message', title: 'Live chat', body: 'Weekdays, 8am–8pm ET', href: '/contact#form' },
    { icon: 'map', title: 'Office', body: '200 Water St, Brooklyn, NY', href: '/company' },
  ],
  form: {
    name: 'Full name',
    email: 'Work email',
    company: 'Company',
    topic: 'What can we help with?',
    message: 'Message',
    messageHint: 'At least 20 characters.',
    submit: 'Send message',
    success: { title: 'Demo complete', body: 'Thanks, {name}. Your message was validated but was not saved or sent. Demo reference: {ref}.' },
    again: 'Send another message',
    footnote: 'We reply within one business day. No sales sequences.',
    topicPlaceholder: 'Choose a topic',
  },
  stat: { label: 'Average first reply', value: '2h 14m', note: 'Across all topics, last 30 days' },
}

export const auth = {
  demoNote: 'Demo screen: nothing is sent or stored, and no account is created.',
  signup: {
    title: 'Create your Revio account',
    body: 'Free to start. Cards in your wallet in minutes.',
    submit: 'Create account',
    terms: 'I agree to the Terms of Service and Privacy Policy.',
    switch: { text: 'Already have an account?', label: 'Log in', href: '/login' },
    success: { title: 'Demo account ready', body: 'In a real build this would create {email} and send a verification link. Nothing was sent.' },
  },
  login: {
    title: 'Welcome back',
    body: 'Log in to manage cards, payouts and invoices.',
    submit: 'Log in',
    remember: 'Keep me signed in on this device',
    forgot: 'Forgot password?',
    forgotSent: 'Demo: a reset link would be sent to {email}.',
    switch: { text: 'New to Revio?', label: 'Create an account', href: '/signup' },
    // Demo rule so the error state is reachable: this password is "wrong".
    wrongPassword: 'wrong-password',
    error: 'That email and password do not match. (Demo: use any password except “wrong-password”.)',
    success: { title: 'Signed in (demo)', body: 'In a real build you would now land on your dashboard.' },
  },
  panel: {
    quote: 'Revio replaced two banks, an expense tool and a spreadsheet. Setup took an afternoon.',
    name: 'Sofia Martins',
    role: 'Finance Lead, Arcadia',
  },
}

export const notFound = {
  code: '404',
  title: 'This page took an unplanned expense',
  body: 'The page you are looking for has moved or never existed. Your balance is fine.',
  links: [
    { label: 'Home', href: '/' },
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
}
