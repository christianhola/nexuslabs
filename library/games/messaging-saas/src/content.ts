/*
  Every string and all seed data for the Relaytext site lives here. Change the
  brand, the copy, the plans or the posts in this one file.
*/

/*
  All photography and renders route through this map. Swap a path for your own
  photo (same aspect ratio) and every page that shows it updates.
*/
export const images = {
  hero: '/images/hero.webp',
  machine: '/images/machine.webp',
  caseSkincare: '/images/case-skincare.webp',
  caseCoffee: '/images/case-coffee.webp',
  caseApparel: '/images/case-apparel.webp',
  blogAi: '/images/blog-ai.webp',
  blogCompliance: '/images/blog-compliance.webp',
  blogFlows: '/images/blog-flows.webp',
  person1: '/images/person-1.webp',
  person2: '/images/person-2.webp',
  person3: '/images/person-3.webp',
} as const

export const brand = {
  name: 'Relaytext',
  domain: 'relaytext.com',
  tagline: 'Text marketing that talks back.',
  description:
    'Relaytext is two-way SMS for ecommerce: text-to-buy, shopper-specific AI recommendations and a shared inbox, with a 20% revenue lift guarantee.',
  email: 'hello@relaytext.com',
}

export type NavItem = { label: string; href: string }

export const nav: NavItem[] = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
]

export const navActions = {
  login: { label: 'Login', href: '/login' },
  start: { label: 'Get started', href: '/signup' },
}

export const hero = {
  titleLines: ['20% More Revenue', 'Per Campaign.', 'Guaranteed.'],
  body: 'Incremental. It’s why we exist. See why the most innovative brands in ecommerce add text to buy, shopper-specific recommendations and two-way texting on top of conventional SMS marketing. You won’t go back.',
  inputLabel: 'Your brand’s website',
  placeholder: 'Enter your brand’s URL',
  cta: 'Test our AI',
}

export const proof = {
  quote: '“Incredible”',
  name: 'Marco Bellini',
  role: 'Founder of Haven Coffee Co.',
  avatar: images.person1,
}

/** Fictional customer wordmarks for the logo marquee; `style` picks the type treatment. */
export const logos: { name: string; style: 'heavy' | 'stack' | 'serif-caps' | 'asterisk' | 'italic' | 'mono' | 'dot' }[] = [
  { name: 'loam', style: 'heavy' },
  { name: 'kindred goods', style: 'stack' },
  { name: 'Saltwork', style: 'serif-caps' },
  { name: 'fernhaus', style: 'asterisk' },
  { name: 'Haven', style: 'italic' },
  { name: 'ODA/SUPPLY', style: 'mono' },
  { name: 'pebble', style: 'dot' },
  { name: 'Northpine', style: 'serif-caps' },
]

export type Pillar = { id: string; eyebrow: string; title: string; body: string; points: string[] }

export const pillars: Pillar[] = [
  {
    id: 'text-to-buy',
    eyebrow: 'Text to buy',
    title: 'Checkout in one reply.',
    body: 'Shoppers answer YES and the order is placed on their saved card. No links to tap, no carts to rebuild, no passwords.',
    points: ['Saved-card checkout in the thread', 'Size, colour and quantity by reply', 'Order confirmations that sell the next item'],
  },
  {
    id: 'recommendations',
    eyebrow: 'AI recommendations',
    title: 'One shopper, one message.',
    body: 'Our model reads browsing, order history and replies to pick the product each person is most likely to buy next, then writes the text in your voice.',
    points: ['Per-shopper product picks', 'Brand-voice copy, approved by you', 'Learns from every reply and order'],
  },
  {
    id: 'two-way',
    eyebrow: 'Two-way texting',
    title: 'Every reply gets answered.',
    body: 'Questions about sizing, shipping or ingredients land in one shared inbox. The AI drafts the answer; your team sends, edits or hands off.',
    points: ['Shared inbox with assignments', 'Drafted answers in under 2 seconds', 'Escalation rules for VIPs'],
  },
]

export const stats = [
  { value: 20, suffix: '%', prefix: '+', label: 'Revenue per campaign, guaranteed over conventional SMS' },
  { value: 38, suffix: '%', label: 'Average reply rate on conversational campaigns' },
  { value: 4.6, suffix: 'x', decimals: 1, label: 'Median return on message spend in the first 90 days' },
  { value: 1.8, suffix: 's', decimals: 1, label: 'Median time to a drafted, on-brand reply' },
]

/* ---------- Conversation demo (home) ---------- */

export type ChatMessage = { from: 'brand' | 'shopper'; text: string; product?: { name: string; price: string; tone: 'cobalt' | 'cherry' | 'saffron' } }

export type DemoStep = { shopper: string; replies: ChatMessage[] }

export const conversationDemo = {
  eyebrow: 'Try it',
  title: 'A campaign that answers back.',
  body: 'Tap a reply to see how Relaytext handles it. Every response here is the kind of message the AI drafts, checks against your rules and sends in under two seconds.',
  contact: 'Haven Coffee',
  opener: [
    { from: 'brand', text: 'Hi Jess, your Ethiopia Guji is almost gone. Want the same 340g bag again, ground for pour-over?' },
  ] as ChatMessage[],
  steps: [
    {
      shopper: 'YES',
      replies: [
        { from: 'brand', text: 'Done. Charged $19.00 to your Visa ending 4242. It ships tomorrow.' },
        { from: 'brand', text: 'People who love Guji also reorder this. Add a bag for $16?', product: { name: 'Kenya Nyeri, 340g', price: '$16.00', tone: 'cherry' } },
      ],
    },
    {
      shopper: 'Something less fruity?',
      replies: [
        { from: 'brand', text: 'Try our Colombia Huila: chocolate and caramel, low acidity. Same grind?', product: { name: 'Colombia Huila, 340g', price: '$17.50', tone: 'saffron' } },
      ],
    },
    {
      shopper: 'When does it arrive?',
      replies: [{ from: 'brand', text: 'Ordered today, it arrives Thursday with free shipping. Reply YES to reorder.' }],
    },
  ] as DemoStep[],
  stop: 'STOP',
  stopReply: 'You’re unsubscribed from Haven Coffee texts. Reply START to rejoin.',
}

/* ---------- Product mocks ---------- */

export type InboxThread = {
  id: string
  name: string
  initials: string
  tone: 'cobalt' | 'cherry' | 'saffron' | 'mint'
  preview: string
  time: string
  tag: 'Sizing' | 'Shipping' | 'Order' | 'VIP'
  unread: boolean
  ltv: string
  orders: number
  messages: { from: 'brand' | 'shopper'; text: string; time: string }[]
  suggestion: string
}

export const inboxThreads: InboxThread[] = [
  {
    id: 't1',
    name: 'Priya Raman',
    initials: 'PR',
    tone: 'cherry',
    preview: 'Does the Field knit run small?',
    time: '2m',
    tag: 'Sizing',
    unread: true,
    ltv: '$412',
    orders: 5,
    messages: [
      { from: 'brand', text: 'New drop: the Field knit in tomato red. Reply SIZE for your fit.', time: '10:02' },
      { from: 'shopper', text: 'Does the Field knit run small? I’m usually a M.', time: '10:04' },
    ],
    suggestion: 'It runs true to size. Based on your last two orders, M is right. Reply YES and I’ll send a M in tomato red.',
  },
  {
    id: 't2',
    name: 'Tom Ashby',
    initials: 'TA',
    tone: 'cobalt',
    preview: 'Can it arrive before Friday?',
    time: '8m',
    tag: 'Shipping',
    unread: true,
    ltv: '$96',
    orders: 1,
    messages: [{ from: 'shopper', text: 'Can it arrive before Friday? It’s a gift.', time: '09:58' }],
    suggestion: 'Yes. Order before 3pm today and express shipping gets it to you Thursday, on us since it’s a gift.',
  },
  {
    id: 't3',
    name: 'Lena Fischer',
    initials: 'LF',
    tone: 'saffron',
    preview: 'Reordered, thanks!',
    time: '21m',
    tag: 'Order',
    unread: false,
    ltv: '$1,280',
    orders: 14,
    messages: [
      { from: 'brand', text: 'Your Daily Serum is running low. Same again?', time: '09:30' },
      { from: 'shopper', text: 'YES', time: '09:31' },
      { from: 'brand', text: 'Done. It ships today.', time: '09:31' },
      { from: 'shopper', text: 'Reordered, thanks!', time: '09:33' },
    ],
    suggestion: 'Our pleasure, Lena. Your 15th order unlocks free shipping for a year, and it’s already applied.',
  },
  {
    id: 't4',
    name: 'Marcus Webb',
    initials: 'MW',
    tone: 'mint',
    preview: 'Is there a bundle discount?',
    time: '1h',
    tag: 'VIP',
    unread: false,
    ltv: '$2,040',
    orders: 22,
    messages: [{ from: 'shopper', text: 'Is there a bundle discount if I get all three?', time: '08:47' }],
    suggestion: 'For you, yes: all three for $96 instead of $114. Reply YES and I’ll check out on your saved card.',
  },
]

export type Campaign = { id: string; name: string; audience: string; sent: string; revenue: string; lift: number; live: boolean }

export const campaigns: Campaign[] = [
  { id: 'c1', name: 'Reorder reminder', audience: 'Bought 30 to 45 days ago', sent: '18,420', revenue: '$64,210', lift: 27, live: true },
  { id: 'c2', name: 'Abandoned cart', audience: 'Cart over $40, no order', sent: '6,105', revenue: '$31,880', lift: 22, live: true },
  { id: 'c3', name: 'New drop: Field knit', audience: 'Viewed knitwear twice', sent: '24,900', revenue: '$48,345', lift: 19, live: false },
  { id: 'c4', name: 'Win-back', audience: 'No order in 120 days', sent: '9,760', revenue: '$12,090', lift: 31, live: true },
]

/** Revenue per day (thousands) for the dashboard chart, by range. `base` is conventional SMS. */
export const revenueSeries: Record<'7d' | '30d' | '90d', { label: string; relay: number[]; base: number[] }> = {
  '7d': { label: 'Last 7 days', relay: [18, 22, 19, 27, 31, 29, 36], base: [15, 17, 16, 21, 24, 23, 28] },
  '30d': {
    label: 'Last 30 days',
    relay: [14, 16, 15, 19, 18, 22, 21, 24, 23, 27, 26, 25, 29, 31, 28, 33, 32, 30, 35, 34, 38, 36, 40, 39, 37, 42, 41, 44, 43, 47],
    base: [13, 14, 13, 16, 15, 18, 17, 19, 18, 21, 20, 20, 23, 24, 22, 26, 25, 24, 27, 27, 29, 28, 31, 30, 29, 32, 31, 34, 33, 36],
  },
  '90d': {
    label: 'Last 90 days',
    relay: [10, 12, 11, 14, 15, 17, 16, 19, 21, 22, 24, 23, 26, 28, 27, 30, 32, 31, 34, 36, 35, 38, 40, 42, 41, 44],
    base: [10, 11, 10, 12, 13, 14, 13, 15, 16, 17, 18, 17, 19, 21, 20, 22, 23, 23, 25, 26, 25, 27, 29, 30, 29, 31],
  },
}

export type FlowNode = { id: string; kind: 'trigger' | 'wait' | 'message' | 'branch' | 'action'; title: string; detail: string; settings: { label: string; value: string }[] }

export const flowNodes: FlowNode[] = [
  { id: 'n1', kind: 'trigger', title: 'Cart abandoned', detail: 'Cart over $40, signed-in shopper', settings: [{ label: 'Minimum cart', value: '$40' }, { label: 'Audience', value: 'SMS subscribers' }, { label: 'Exclude', value: 'Ordered in last 24 h' }] },
  { id: 'n2', kind: 'wait', title: 'Wait 30 minutes', detail: 'Respects quiet hours, 9pm to 9am', settings: [{ label: 'Delay', value: '30 minutes' }, { label: 'Quiet hours', value: '9pm to 9am local' }] },
  { id: 'n3', kind: 'message', title: 'AI message', detail: 'Mentions the item, offers checkout', settings: [{ label: 'Voice', value: 'Friendly, short' }, { label: 'Offer', value: 'Free shipping' }, { label: 'Max length', value: '1 segment' }] },
  { id: 'n4', kind: 'branch', title: 'Replied YES?', detail: 'Otherwise follow up once', settings: [{ label: 'Yes', value: 'Text-to-buy checkout' }, { label: 'Question', value: 'Route to inbox' }, { label: 'No reply', value: 'Follow up in 24 h' }] },
  { id: 'n5', kind: 'action', title: 'Checkout on saved card', detail: 'Confirmation plus one pick', settings: [{ label: 'Payment', value: 'Saved card' }, { label: 'Upsell', value: 'AI pick, max 1' }] },
]

export const productTabs = [
  { id: 'campaigns', label: 'Campaigns', title: 'See the lift, not just the clicks.', body: 'Every campaign is measured against a holdout running conventional SMS, so the revenue you see is revenue you wouldn’t have had.' },
  { id: 'inbox', label: 'Inbox', title: 'One inbox for every reply.', body: 'Replies arrive tagged and prioritised. The AI drafts an answer with the shopper’s history in view; your team sends it with one click.' },
  { id: 'flows', label: 'Flows', title: 'Automations that hold a conversation.', body: 'Build reorder, cart and win-back flows that branch on what people actually reply, with quiet hours and consent built in.' },
] as const

/* ---------- Testimonials ---------- */

export const testimonials = [
  {
    quote: 'We turned off two other SMS tools in the first month. Text-to-buy alone paid for Relaytext three times over.',
    name: 'Marco Bellini',
    role: 'Founder, Haven Coffee Co.',
    avatar: images.person1,
    metric: '+31% revenue per send',
  },
  {
    quote: 'Our customers ask real questions over text. Now every one gets a good answer in seconds, in a voice that sounds like us.',
    name: 'Dana Okafor',
    role: 'CEO, Fieldnote Skincare',
    avatar: images.person2,
    metric: '42% reply rate',
  },
  {
    quote: 'The holdout reporting settled every argument about attribution. The lift is real and we can see it per campaign.',
    name: 'Mei Tanaka',
    role: 'Head of Retention, Kindred Goods',
    avatar: images.person3,
    metric: '5.2x return on spend',
  },
]

export const guarantee = {
  eyebrow: 'The guarantee',
  title: 'Beat your current SMS by 20%, or pay nothing.',
  body: 'We run Relaytext against a holdout on your existing SMS program for 90 days. If revenue per campaign isn’t at least 20% higher, we refund every platform fee.',
  points: ['Measured on a randomised holdout you can audit', 'No message fees during the first 14 days', 'Cancel any time, keep your subscriber list'],
}

export const integrations = [
  { name: 'Storefronts', body: 'Products, carts and orders sync both ways.', abbr: 'ST' },
  { name: 'Payments', body: 'Saved-card checkout inside the thread.', abbr: 'PA' },
  { name: 'Helpdesk', body: 'Hand off threads with full history.', abbr: 'HD' },
  { name: 'Email', body: 'Shared segments and suppression lists.', abbr: 'EM' },
  { name: 'Reviews', body: 'Ask for a review after delivery.', abbr: 'RV' },
  { name: 'Loyalty', body: 'Points and tiers in every message.', abbr: 'LY' },
  { name: 'Analytics', body: 'Holdout results to your warehouse.', abbr: 'AN' },
  { name: 'Webhooks', body: 'Every reply and order as an event.', abbr: 'WH' },
]

/* ---------- Features page ---------- */

export const featuresPage = {
  eyebrow: 'Features',
  title: 'Everything conventional SMS does, plus a conversation.',
  body: 'Relaytext keeps the broadcast tools you know and adds the parts that make texting feel like a store clerk who remembers you.',
  sections: [
    { id: 'text-to-buy', label: 'Text to buy' },
    { id: 'recommendations', label: 'AI picks' },
    { id: 'inbox', label: 'Inbox' },
    { id: 'flows', label: 'Flows' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'integrations', label: 'Integrations' },
  ],
  picks: [
    { name: 'Daily Serum', price: '$38', tone: 'saffron' as const, score: 0.82, reason: 'Reordered every 6 weeks' },
    { name: 'Night Balm', price: '$44', tone: 'cherry' as const, score: 0.64, reason: 'Viewed twice this week' },
    { name: 'SPF Fluid', price: '$29', tone: 'cobalt' as const, score: 0.41, reason: 'Similar shoppers bought' },
  ],
  compliance: [
    { title: 'Consent log', body: 'Every opt-in is stored with source, timestamp and the exact wording shown.' },
    { title: 'Quiet hours', body: 'Sends wait for 9am in the shopper’s own time zone. No exceptions.' },
    { title: 'STOP in any form', body: '“stop”, “unsubscribe”, “no more” and 40 other phrasings opt out instantly.' },
    { title: 'Approval rules', body: 'Block claims, discounts or words you never want the AI to use.' },
    { title: 'Number registration', body: 'We register and verify your toll-free or short code numbers for you.' },
    { title: 'Audit trail', body: 'Export every message, draft, edit and approval for review.' },
  ],
}

/* ---------- Pricing ---------- */

export type Plan = {
  id: 'launch' | 'growth' | 'scale'
  name: string
  blurb: string
  monthly: number | null
  perMessage: number
  included: number
  cta: string
  href: string
  featured?: boolean
  features: string[]
}

export const plans: Plan[] = [
  {
    id: 'launch',
    name: 'Launch',
    blurb: 'For brands sending their first conversational campaigns.',
    monthly: 49,
    perMessage: 0.0095,
    included: 2000,
    cta: 'Start free trial',
    href: '/signup?plan=launch',
    features: ['Up to 10,000 subscribers', 'Text-to-buy checkout', 'AI replies with approval', 'Shared inbox, 2 seats', 'Email support'],
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'For brands where SMS is a top-three revenue channel.',
    monthly: 399,
    perMessage: 0.0078,
    included: 25000,
    cta: 'Start free trial',
    href: '/signup?plan=growth',
    featured: true,
    features: ['Up to 100,000 subscribers', 'Everything in Launch', 'AI product recommendations', 'Holdout reporting', 'Flows and segments', '10 seats, Slack support'],
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb: 'For high-volume brands with custom data and compliance needs.',
    monthly: null,
    perMessage: 0.0062,
    included: 0,
    cta: 'Talk to sales',
    href: '/contact',
    features: ['Unlimited subscribers', 'Everything in Growth', 'Dedicated short code', 'Warehouse export', 'SSO and audit log', 'Named strategist'],
  },
]

export const pricingPage = {
  eyebrow: 'Pricing',
  title: 'Pay for messages that make money.',
  body: 'A platform fee plus per-message pricing that drops as you grow. Every plan carries the 20% guarantee.',
  annualDiscount: 0.15,
  calculator: {
    title: 'Estimate your monthly bill',
    body: 'Drag to your list size. We assume four campaigns a month, plus replies.',
    min: 1000,
    max: 200000,
    step: 1000,
    initial: 25000,
    campaignsPerMonth: 4,
    replyRate: 0.38,
  },
  compare: {
    columns: ['Launch', 'Growth', 'Scale'],
    rows: [
      { label: 'Subscribers', values: ['10,000', '100,000', 'Unlimited'] },
      { label: 'Text-to-buy checkout', values: [true, true, true] },
      { label: 'AI replies', values: ['With approval', 'Auto + approval', 'Auto + approval'] },
      { label: 'AI product recommendations', values: [false, true, true] },
      { label: 'Holdout reporting', values: [false, true, true] },
      { label: 'Flows', values: ['3', 'Unlimited', 'Unlimited'] },
      { label: 'Seats', values: ['2', '10', 'Unlimited'] },
      { label: 'Dedicated short code', values: [false, false, true] },
      { label: 'SSO and audit log', values: [false, false, true] },
    ] as { label: string; values: (string | boolean)[] }[],
  },
}

/* ---------- Customers ---------- */

export type CaseStudy = {
  slug: string
  brand: string
  industry: 'Food & drink' | 'Beauty' | 'Apparel'
  image: string
  title: string
  summary: string
  metrics: { value: string; label: string }[]
  quote: { text: string; name: string; role: string; avatar: string }
  body: { heading: string; text: string }[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'haven-coffee',
    brand: 'Haven Coffee Co.',
    industry: 'Food & drink',
    image: images.caseCoffee,
    title: 'How Haven Coffee made reorders a one-word reply',
    summary: 'A subscription-shy coffee roaster replaced reorder emails with a single text and grew repeat revenue 31%.',
    metrics: [
      { value: '+31%', label: 'Revenue per send' },
      { value: '46%', label: 'Reply rate' },
      { value: '6.1x', label: 'Return on spend' },
    ],
    quote: { text: 'We turned off two other SMS tools in the first month.', name: 'Marco Bellini', role: 'Founder', avatar: images.person1 },
    body: [
      { heading: 'The problem', text: 'Haven’s customers loved the coffee but hated subscriptions. Reorder emails were opened by a third of buyers and acted on by almost nobody.' },
      { heading: 'What they built', text: 'A reorder flow that texts each buyer when their last bag should be running low, timed from their own order history. A YES places the order on the saved card.' },
      { heading: 'The result', text: 'Against a 10% holdout on their previous SMS tool, revenue per send rose 31% in 90 days. Nearly half of shoppers replied, and most replies were a single word.' },
    ],
  },
  {
    slug: 'fieldnote-skincare',
    brand: 'Fieldnote Skincare',
    industry: 'Beauty',
    image: images.caseSkincare,
    title: 'Fieldnote answers every ingredient question in seconds',
    summary: 'With AI-drafted replies reviewed by two people, a small skincare team answers 3,000 texts a week.',
    metrics: [
      { value: '42%', label: 'Reply rate' },
      { value: '1.6s', label: 'Median draft time' },
      { value: '+24%', label: 'Revenue per campaign' },
    ],
    quote: { text: 'Every question gets a good answer in a voice that sounds like us.', name: 'Dana Okafor', role: 'CEO', avatar: images.person2 },
    body: [
      { heading: 'The problem', text: 'Fieldnote’s launches generated thousands of replies about ingredients, routines and skin types. Two people couldn’t keep up, and unanswered questions became abandoned carts.' },
      { heading: 'What they built', text: 'Approval rules that keep medical claims out, a library of ingredient answers, and an inbox where the AI drafts and a person approves with one key.' },
      { heading: 'The result', text: 'Median time to answer fell from four hours to under a minute. Campaign revenue rose 24% over the holdout, driven by shoppers who asked a question first.' },
    ],
  },
  {
    slug: 'kindred-goods',
    brand: 'Kindred Goods',
    industry: 'Apparel',
    image: images.caseApparel,
    title: 'Kindred Goods sells a new drop by sizing over text',
    summary: 'A knitwear label lets shoppers pick size and colour by reply, turning launch texts into orders.',
    metrics: [
      { value: '5.2x', label: 'Return on spend' },
      { value: '-18%', label: 'Size returns' },
      { value: '+22%', label: 'Revenue per send' },
    ],
    quote: { text: 'The holdout reporting settled every argument about attribution.', name: 'Mei Tanaka', role: 'Head of Retention', avatar: images.person3 },
    body: [
      { heading: 'The problem', text: 'Launch texts drove traffic but shoppers stalled on the size chart. Returns for fit were Kindred’s biggest cost after shipping.' },
      { heading: 'What they built', text: 'Launch campaigns that ask for size and colour in the thread, with the AI recommending a size from each shopper’s past orders and returns.' },
      { heading: 'The result', text: 'Revenue per send rose 22% over the holdout and size-related returns fell 18%, because the recommended size was right more often than the chart.' },
    ],
  },
]

export const customersPage = {
  eyebrow: 'Customers',
  title: 'Brands that text like people.',
  body: 'Independent and fast-growing ecommerce brands use Relaytext to turn a broadcast channel into a conversation.',
  filters: ['All', 'Food & drink', 'Beauty', 'Apparel'] as const,
}

/* ---------- Blog ---------- */

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: 'Playbooks' | 'Product' | 'Compliance'
  date: string
  readMinutes: number
  image: string
  author: { name: string; avatar: string }
  body: { heading?: string; text: string }[]
}

export const posts: Post[] = [
  {
    slug: 'why-two-way-sms-wins',
    title: 'Why two-way SMS beats broadcast, with the numbers',
    excerpt: 'We looked at 1.2 billion messages to find out what replies are actually worth. The short answer: more than the click.',
    category: 'Playbooks',
    date: '2026-10-28',
    readMinutes: 7,
    image: images.blogAi,
    author: { name: 'Mei Tanaka', avatar: images.person3 },
    body: [
      { text: 'Most SMS programs measure the click. That made sense when a text was a link with a coupon. It makes less sense when shoppers can answer back, ask questions and buy in the thread.' },
      { heading: 'Replies predict revenue', text: 'Across the brands we studied, a shopper who replies to a campaign is 3.4 times as likely to order in the following week as one who only clicks. The reply is the signal.' },
      { heading: 'Questions are buying signals', text: 'The most common replies are about size, shipping time and ingredients. Answer them quickly and conversion from a question is higher than from a click.' },
      { heading: 'What to change on Monday', text: 'Ask one question in your next campaign. Make the answer easy: a single word, a size, YES. Then measure revenue per send against a holdout, not clicks.' },
    ],
  },
  {
    slug: 'tcpa-checklist-2027',
    title: 'The SMS compliance checklist for 2027',
    excerpt: 'Consent, quiet hours, opt-out language and number registration: what changed this year and what to do about it.',
    category: 'Compliance',
    date: '2026-10-14',
    readMinutes: 9,
    image: images.blogCompliance,
    author: { name: 'Dana Okafor', avatar: images.person2 },
    body: [
      { text: 'Compliance isn’t the exciting part of texting, but it is the part that decides whether you get to keep doing it. Here is the list we use with every new brand.' },
      { heading: 'Consent you can prove', text: 'Store the source, timestamp and exact wording of every opt-in. If you can’t show what the shopper agreed to, assume they didn’t.' },
      { heading: 'Quiet hours in their time zone', text: 'Send between 9am and 9pm in the recipient’s local time. Area codes are a weak guess; use the shipping address when you have it.' },
      { heading: 'Opt-out in every phrasing', text: 'People don’t always type STOP. Treat “unsubscribe”, “no more texts” and their variants as an opt-out too.' },
    ],
  },
  {
    slug: 'reorder-flows-that-work',
    title: 'Reorder flows that feel like a favour',
    excerpt: 'Timing a reorder text from each shopper’s own history, and the three messages that do most of the work.',
    category: 'Playbooks',
    date: '2026-09-30',
    readMinutes: 6,
    image: images.blogFlows,
    author: { name: 'Marco Bellini', avatar: images.person1 },
    body: [
      { text: 'A good reorder text arrives just before the shopper notices they are running low. Too early is spam; too late and they have bought elsewhere.' },
      { heading: 'Time it per person', text: 'Use each shopper’s gap between orders, not a fixed 30 days. Our median coffee buyer reorders every 26 days; the fastest every 11.' },
      { heading: 'Make yes the easy answer', text: 'Offer the same product, same size, same grind. One word confirms. Everything else is a conversation.' },
    ],
  },
  {
    slug: 'introducing-ai-picks',
    title: 'Introducing AI picks for every shopper',
    excerpt: 'Our recommendation model now chooses a product per person and writes the message in your brand voice.',
    category: 'Product',
    date: '2026-09-16',
    readMinutes: 4,
    image: images.machine,
    author: { name: 'Mei Tanaka', avatar: images.person3 },
    body: [
      { text: 'Today every Growth and Scale customer gets AI picks: one product per shopper, chosen from browsing, orders and replies, with a message written in your voice.' },
      { heading: 'How it chooses', text: 'The model scores every product for every shopper and explains its pick in the campaign preview, so you can see why Jess gets the Kenya and Tom gets the Colombia.' },
      { heading: 'You stay in control', text: 'Approval rules, banned words and a preview of every variant before anything sends.' },
    ],
  },
  {
    slug: 'holdouts-explained',
    title: 'Holdouts, explained without the statistics',
    excerpt: 'How we prove a campaign earned its revenue, and how to read the lift chart in your dashboard.',
    category: 'Product',
    date: '2026-09-02',
    readMinutes: 5,
    image: images.caseSkincare,
    author: { name: 'Dana Okafor', avatar: images.person2 },
    body: [
      { text: 'A holdout is a random slice of your list that gets your old SMS program instead of Relaytext. Compare the two and the difference is the lift.' },
      { heading: 'Why random matters', text: 'If you pick the holdout yourself, you will pick the shoppers you expect to do worst. Random means the only difference is the program.' },
    ],
  },
  {
    slug: 'sizing-over-text',
    title: 'Selling a launch by sizing over text',
    excerpt: 'What apparel brands learn when shoppers can ask “does it run small?” and get an answer in two seconds.',
    category: 'Playbooks',
    date: '2026-08-19',
    readMinutes: 6,
    image: images.caseApparel,
    author: { name: 'Mei Tanaka', avatar: images.person3 },
    body: [
      { text: 'Size charts are where launches go to die. A text thread that knows what fit someone kept last time does better than any chart.' },
      { heading: 'Ask before they ask', text: 'Put the size question in the launch text itself: “Reply with your size and we’ll hold one.”' },
    ],
  },
]

export const blogPage = {
  eyebrow: 'Blog',
  title: 'Notes on texting that sells.',
  body: 'Playbooks, product news and compliance, from the team that reads more SMS than anyone should.',
  categories: ['All', 'Playbooks', 'Product', 'Compliance'] as const,
  newsletter: { title: 'One useful text-marketing idea a week', body: 'No spam, unsubscribe in one click.', cta: 'Subscribe', success: 'You’re in. The next issue arrives Tuesday.' },
}

/* ---------- FAQ ---------- */

export type Faq = { q: string; a: string; category: 'Getting started' | 'Billing' | 'AI' | 'Compliance' }

export const faqs: Faq[] = [
  { category: 'Getting started', q: 'How long does setup take?', a: 'Most brands send their first campaign within a day. Connect your store, import or collect subscribers, and we register your number while you build the first flow.' },
  { category: 'Getting started', q: 'Can I keep my current SMS provider while I test?', a: 'Yes, and we recommend it. The guarantee is measured against a holdout on your current program, so both run side by side for 90 days.' },
  { category: 'Getting started', q: 'Do I need to move my subscriber list?', a: 'You can import existing subscribers with their consent records. We check every record and flag any without proof of opt-in.' },
  { category: 'Billing', q: 'How does the 20% guarantee work?', a: 'We split your list randomly. If revenue per campaign on Relaytext isn’t at least 20% higher than the holdout after 90 days, we refund every platform fee you paid.' },
  { category: 'Billing', q: 'What counts as a message?', a: 'One SMS segment of up to 160 characters, sent or received. MMS counts as three. Replies from shoppers are included in your plan’s message volume.' },
  { category: 'Billing', q: 'Is there a free trial?', a: 'Launch and Growth include a 14-day trial with no message fees. You only pay carrier pass-through costs if you send more than 1,000 messages.' },
  { category: 'AI', q: 'Will the AI send messages without my approval?', a: 'Only if you turn that on. By default every AI draft waits for approval. You can allow auto-send per flow once you trust it.' },
  { category: 'AI', q: 'How does it learn my brand voice?', a: 'From your website, past campaigns and a short style guide you write. You can see and edit the voice profile at any time.' },
  { category: 'AI', q: 'What data does the recommendation model use?', a: 'Browsing, orders and replies from your own store. We never use one brand’s data to recommend another brand’s products.' },
  { category: 'Compliance', q: 'How do you handle opt-outs?', a: 'STOP and more than 40 variants opt a shopper out instantly, across every flow and campaign. Opt-outs sync to your other tools.' },
  { category: 'Compliance', q: 'Do you enforce quiet hours?', a: 'Yes. Nothing sends between 9pm and 9am in the shopper’s local time, and there is no override.' },
  { category: 'Compliance', q: 'Who registers my phone number?', a: 'We do. Toll-free verification usually takes three to five business days; short codes take four to eight weeks.' },
]

export const faqPage = {
  eyebrow: 'FAQ',
  title: 'Questions, answered.',
  body: 'Everything brands ask us before they switch. Can’t find yours? Our team replies by text, naturally.',
  searchLabel: 'Search questions',
  empty: { title: 'No questions match', body: 'Try a different word, or ask us directly.' },
}

/* ---------- Demo ---------- */

export const demoPage = {
  eyebrow: 'Test our AI',
  title: 'See the texts we’d send your shoppers.',
  body: 'Enter your store’s URL. We draft a reorder conversation and estimate the lift, using the same model that runs every campaign.',
  loading: ['Reading your storefront', 'Picking a hero product', 'Writing in your voice'],
  recentTitle: 'Recently tested',
  recentEmpty: 'Brands you test appear here, saved in this browser.',
}

/* ---------- Forms ---------- */

export const contactPage = {
  eyebrow: 'Talk to sales',
  title: 'Book a 20-minute demo.',
  body: 'Tell us about your store. We’ll show you Relaytext on your own products and estimate your lift before the call ends.',
  volumes: ['Under 10,000', '10,000 to 50,000', '50,000 to 250,000', 'Over 250,000'],
  points: ['A live demo on your own catalogue', 'A lift estimate from your current SMS numbers', 'A migration plan if you’re switching'],
  success: { title: 'Thanks, we’ll be in touch.', body: 'A strategist will text and email you within one business day to pick a time.' },
}

export const loginPage = {
  title: 'Log in to Relaytext',
  body: 'We’ll email you a sign-in link. No password needed.',
  success: { title: 'Check your inbox', body: 'We sent a sign-in link to' },
}

export const signupPage = {
  title: 'Start your 14-day trial',
  body: 'No message fees for 14 days. Your 20% guarantee starts the day you send.',
  success: {
    title: 'Your workspace is ready',
    body: 'Here’s what to do first. We’ll keep your progress on this device.',
    steps: ['Connect your store', 'Import subscribers with consent', 'Register your sending number', 'Write your brand voice', 'Send your first conversation'],
  },
}

export const footer = {
  blurb: 'Two-way SMS for ecommerce brands. Text to buy, AI recommendations and a shared inbox, guaranteed to beat your current program by 20%.',
  columns: [
    { title: 'Product', links: [{ label: 'Features', href: '/features' }, { label: 'Pricing', href: '/pricing' }, { label: 'Test our AI', href: '/demo' }, { label: 'Integrations', href: '/features#integrations' }] },
    { title: 'Company', links: [{ label: 'Customers', href: '/customers' }, { label: 'Blog', href: '/blog' }, { label: 'Talk to sales', href: '/contact' }] },
    { title: 'Help', links: [{ label: 'FAQ', href: '/faq' }, { label: 'Log in', href: '/login' }, { label: 'Style guide', href: '/styleguide' }] },
  ],
  legal: '© 2026 Relaytext, Inc. Message and data rates may apply.',
}

export const notFound = {
  title: 'This number isn’t in service.',
  body: 'The page you were looking for has moved or never existed. Reply HOME, or pick a page below.',
}
