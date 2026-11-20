/*
  Every string, number and seed record in the template lives here. Change the
  brand, copy, plans or demo data in this file; the components only render it.
*/

export const brand = {
  name: 'Inkwell',
  tagline: 'Newsletters, podcasts and community on one platform',
  domain: 'inkwell.press',
  support: 'hello@inkwell.press',
}

/*
  Every image on the site goes through this one map. Swap a path for your own
  photography (same aspect ratio) and every screen picks it up.
*/
export const images = {
  aurora: '/images/tpl-aurora.webp',
  indigo: '/images/tpl-indigo.webp',
  desk: '/images/issue-desk.webp',
  travel: '/images/tpl-travel.webp',
  food: '/images/tpl-food.webp',
  markets: '/images/tpl-markets.webp',
  studio: '/images/podcast-studio.webp',
  tech: '/images/tpl-tech.webp',
} as const
export type ImageKey = keyof typeof images

export const productMenu = [
  { href: '/editor', label: 'Editor', body: 'Write and design issues in one canvas' },
  { href: '/templates', label: 'Templates', body: 'Start from a layout readers already love' },
  { href: '/analytics', label: 'Analytics', body: 'Opens, clicks, growth and revenue' },
  { href: '/monetize', label: 'Monetization', body: 'Ads, boosts and paid subscriptions' },
]

export const nav = [
  { href: '/templates', label: 'Templates' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/monetize', label: 'Ad network' },
  { href: '/pricing', label: 'Pricing' },
]

export const hero = {
  lines: ['Newsletters.', 'Podcasts.', 'Community.'],
  accent: 'One platform.',
  body: 'One home for independent writers to publish, grow their list and get paid. Launch in minutes.',
  rating: { score: '4.9/5', count: '28,400', label: 'writers' },
  primary: { label: 'Start your newsletter', href: '/signup' },
  secondary: { label: 'Sign up with email', href: '/signup?method=email' },
  note: 'Free up to 2,500 subscribers. No card needed.',
}

export const heroMock = {
  templates: { title: 'Newsletter templates', newLabel: 'New template', newBody: 'Start from a blank layout', cursor: 'You' },
  monetization: { title: 'Monetization', label: 'Last month’s earnings', value: 2563, payoutLabel: 'Payout on', payoutDate: 'Dec 1', adsLabel: 'Ads run', ads: 14, action: 'Withdraw earnings' },
  analytics: {
    title: 'Analytics',
    recipients: { label: 'Recipients', value: 372096, rows: [['Delivered', '366,001'], ['Delivery rate', '98.36%']] },
    open: { label: 'Open rate', value: 39.19, rows: [['Unique', '84,674'], ['Total', '111,448']] },
    series: [18, 26, 22, 31, 28, 24, 30, 36, 29, 41, 34, 46, 39, 52],
  },
}

export const trusted = 'Trusted by independent publishers, creators and brands'

export type Publisher = { name: string; style: 'pin' | 'mono' | 'script' | 'block' | 'stack' | 'loud' | 'courier' | 'badge' | 'kestrel' }
export const publishers: Publisher[] = [
  { name: 'Quillcast', style: 'pin' },
  { name: 'Harbor Post Media', style: 'mono' },
  { name: 'The Daily Margin', style: 'script' },
  { name: 'Signal Noise', style: 'block' },
  { name: 'Fernwood', style: 'stack' },
  { name: 'Loud', style: 'loud' },
  { name: 'The Prairie Courier', style: 'courier' },
  { name: 'Open Bench Press', style: 'badge' },
  { name: 'Kestrel', style: 'kestrel' },
]

export const sections = {
  newsletter: {
    eyebrow: 'Newsletter',
    title: 'Stand out in the inbox',
    body: 'The Inkwell editor lets you design and style your newsletter as you write, so what you see is what lands in every inbox.',
    cta: { label: 'Start writing', href: '/editor' },
    points: [
      { title: 'Blocks, not boxes', body: 'Headings, images, quotes and buttons you can reorder with a keystroke.' },
      { title: 'Brand once', body: 'Pick an accent and fonts once; every issue follows them.' },
      { title: 'Preview anywhere', body: 'Flip between desktop, phone and plain-text before you send.' },
    ],
  },
  grow: {
    eyebrow: 'Grow',
    title: 'Every reader brings the next',
    body: 'Referral rewards, recommendations from other writers and sign-up forms that live wherever your readers already are.',
    stats: [
      { value: '3.1x', label: 'faster growth with referral rewards turned on' },
      { value: '41%', label: 'of new readers arrive through recommendations' },
      { value: '12 min', label: 'median time to publish a sign-up page' },
    ],
  },
  podcast: {
    eyebrow: 'Podcasts',
    title: 'Your show, next to your words',
    body: 'Host episodes, publish show notes as an issue and give paid subscribers a private feed, all from the same dashboard.',
    cta: { label: 'See templates', href: '/templates?category=Podcast' },
  },
  earn: {
    eyebrow: 'Monetize',
    title: 'Get paid from issue one',
    body: 'Run sponsor placements from the Inkwell ad network, recommend other writers for a fee, or turn on paid tiers. Payouts land monthly.',
    cta: { label: 'Explore monetization', href: '/monetize' },
  },
  analytics: {
    eyebrow: 'Analytics',
    title: 'Know what every issue did',
    body: 'Opens, clicks, unsubscribes and revenue per post, with the sources that brought each reader in.',
    cta: { label: 'Open the dashboard', href: '/analytics' },
  },
}

export const testimonials = [
  { quote: 'We moved 140,000 readers over a weekend and our open rate went up the next Monday.', name: 'Marisol Avery', role: 'Editor, The Daily Margin', initials: 'MA', hue: 312 },
  { quote: 'The ad network paid for my rent in month three. I didn’t sell a single placement myself.', name: 'Theo Lindqvist', role: 'Writer, Signal Noise', initials: 'TL', hue: 256 },
  { quote: 'The editor is the first one that makes my newsletter look like my newsletter.', name: 'Ada Okafor', role: 'Founder, Fernwood', initials: 'AO', hue: 28 },
]

export const closing = {
  title: 'Your readers are waiting',
  body: 'Start free, import your list in minutes and send your first issue today.',
  primary: { label: 'Sign up for free', href: '/signup' },
  secondary: { label: 'Get a demo', href: '/demo' },
}

/* ---------------- Editor ---------------- */

export type BlockType = 'heading' | 'paragraph' | 'image' | 'quote' | 'button' | 'divider'
export type Block = { id: string; type: BlockType; text?: string; image?: ImageKey; href?: string }
export type Issue = { title: string; subtitle: string; accent: string; font: 'serif' | 'sans'; blocks: Block[] }

export const blockLabels: Record<BlockType, string> = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  image: 'Image',
  quote: 'Quote',
  button: 'Button',
  divider: 'Divider',
}

export const accents = [
  { name: 'Pink', value: '#c42f9f' },
  { name: 'Ink', value: '#3038d6' },
  { name: 'Forest', value: '#1f7a4d' },
  { name: 'Ember', value: '#c2410c' },
  { name: 'Graphite', value: '#2b2833' },
]

export const defaultIssue: Issue = {
  title: 'The quiet hour',
  subtitle: 'Issue 48: why the best ideas show up before breakfast',
  accent: '#c42f9f',
  font: 'serif',
  blocks: [
    { id: 'b1', type: 'image', image: 'desk' },
    { id: 'b2', type: 'paragraph', text: 'Good morning. This week I tried something simple: one hour before the inbox, the news or the group chat. Just a notebook, a coffee and whatever I was curious about.' },
    { id: 'b3', type: 'heading', text: 'What changed' },
    { id: 'b4', type: 'paragraph', text: 'By Wednesday I had more drafts than I usually write in a month. Most were bad. Three were not, and one of them is the essay below.' },
    { id: 'b5', type: 'quote', text: 'Attention is the rarest and purest form of generosity.' },
    { id: 'b6', type: 'divider' },
    { id: 'b7', type: 'button', text: 'Read the full essay', href: 'https://example.com/essay' },
  ],
}

export const editorCopy = {
  title: 'Editor',
  intro: 'A working editor: edit any block, add and reorder blocks, brand it and preview it. Your draft saves in this browser.',
  saved: 'Saved',
  saving: 'Saving…',
  sendTest: 'Send a test',
  publish: 'Schedule issue',
}

/* ---------------- Templates ---------------- */

export const templateCategories = ['All', 'Newsletter', 'Digest', 'Podcast', 'Curation', 'Paid'] as const
export type TemplateCategory = Exclude<(typeof templateCategories)[number], 'All'>

export type Template = {
  id: string
  name: string
  category: TemplateCategory
  description: string
  image: ImageKey
  accent: string
  font: 'serif' | 'sans'
  uses: number
  issue: Omit<Issue, 'accent' | 'font'>
}

const t = (id: string, text: string) => ({ id, type: 'paragraph' as const, text })

export const templates: Template[] = [
  {
    id: 'morning-note',
    name: 'Morning note',
    category: 'Newsletter',
    description: 'A personal letter with one cover photo, a short essay and a single link.',
    image: 'desk',
    accent: '#c42f9f',
    font: 'serif',
    uses: 12840,
    issue: defaultIssue,
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'Newsletter',
    description: 'Bold cover art, a big serif headline and generous spacing for long reads.',
    image: 'aurora',
    accent: '#a21caf',
    font: 'serif',
    uses: 9314,
    issue: {
      title: 'Notes from the edge of the map',
      subtitle: 'A long read on why small places make big ideas',
      blocks: [
        { id: 'a1', type: 'image', image: 'aurora' },
        t('a2', 'There is a particular kind of quiet you only find where the roads run out. This month I went looking for it.'),
        { id: 'a3', type: 'heading', text: 'Part one: leaving' },
        t('a4', 'Every trip starts with a list, and every list is a small lie about how much you can carry.'),
        { id: 'a5', type: 'button', text: 'Keep reading', href: 'https://example.com/aurora' },
      ],
    },
  },
  {
    id: 'weekly-digest',
    name: 'Weekly digest',
    category: 'Digest',
    description: 'Five links, one line each. Built for readers who skim on the train.',
    image: 'indigo',
    accent: '#3038d6',
    font: 'sans',
    uses: 15022,
    issue: {
      title: 'Five things worth your Friday',
      subtitle: 'The week in links, curated for people with somewhere to be',
      blocks: [
        { id: 'w1', type: 'heading', text: '1. A city that paints its roofs white' },
        t('w2', 'Cooler streets, lower bills and a surprisingly beautiful skyline.'),
        { id: 'w3', type: 'heading', text: '2. The return of the paper map' },
        t('w4', 'Why a growing number of hikers are leaving the phone in the bag.'),
        { id: 'w5', type: 'divider' },
        { id: 'w6', type: 'button', text: 'See all five', href: 'https://example.com/digest' },
      ],
    },
  },
  {
    id: 'markets-brief',
    name: 'Markets brief',
    category: 'Paid',
    description: 'A paywalled analysis layout with a free preview and an upgrade button.',
    image: 'markets',
    accent: '#7c3aed',
    font: 'sans',
    uses: 6107,
    issue: {
      title: 'The week in numbers',
      subtitle: 'What moved, what didn’t, and what we’re watching next',
      blocks: [
        { id: 'm1', type: 'image', image: 'markets' },
        t('m2', 'Three charts explain most of this week. The fourth explains why the next one might look different.'),
        { id: 'm3', type: 'quote', text: 'The free preview ends here. Paid readers get the full breakdown.' },
        { id: 'm4', type: 'button', text: 'Upgrade to read on', href: 'https://example.com/upgrade' },
      ],
    },
  },
  {
    id: 'show-notes',
    name: 'Show notes',
    category: 'Podcast',
    description: 'Episode art, timestamps and guest links that sit under your player.',
    image: 'studio',
    accent: '#be185d',
    font: 'sans',
    uses: 4388,
    issue: {
      title: 'Episode 112: building in public',
      subtitle: 'With a designer who shipped one tiny product every week for a year',
      blocks: [
        { id: 's1', type: 'image', image: 'studio' },
        { id: 's2', type: 'heading', text: 'In this episode' },
        t('s3', '02:10 Why weekly beats perfect. 18:45 The product nobody bought. 33:20 What the fiftieth launch taught her.'),
        { id: 's4', type: 'button', text: 'Listen now', href: 'https://example.com/episode-112' },
      ],
    },
  },
  {
    id: 'field-guide',
    name: 'Field guide',
    category: 'Curation',
    description: 'A travel-style roundup with big photos and short captions.',
    image: 'travel',
    accent: '#c2410c',
    font: 'serif',
    uses: 7751,
    issue: {
      title: 'Six roads worth the detour',
      subtitle: 'Our readers’ favourite drives, from cliff edges to pine forests',
      blocks: [
        { id: 'f1', type: 'image', image: 'travel' },
        { id: 'f2', type: 'heading', text: 'The coast road at dusk' },
        t('f3', 'Leave an hour before sunset and stop at every pull-out. You will not regret it.'),
        { id: 'f4', type: 'button', text: 'See the full guide', href: 'https://example.com/roads' },
      ],
    },
  },
  {
    id: 'kitchen-table',
    name: 'Kitchen table',
    category: 'Curation',
    description: 'One recipe, one story, one shopping list. Warm and readable.',
    image: 'food',
    accent: '#15803d',
    font: 'serif',
    uses: 5263,
    issue: {
      title: 'A bowl for busy Tuesdays',
      subtitle: 'Ten minutes, one pan and whatever is left in the fridge',
      blocks: [
        { id: 'k1', type: 'image', image: 'food' },
        t('k2', 'This is the dinner I make when I have no plan. It has never once let me down.'),
        { id: 'k3', type: 'heading', text: 'You will need' },
        t('k4', 'A cup of cooked grains, any greens, a lemon, a handful of herbs and something crunchy.'),
      ],
    },
  },
  {
    id: 'changelog',
    name: 'Product update',
    category: 'Digest',
    description: 'Release notes for your customers with a screenshot and a clear next step.',
    image: 'tech',
    accent: '#6d28d9',
    font: 'sans',
    uses: 3920,
    issue: {
      title: 'What shipped in November',
      subtitle: 'Three new features and the fixes you asked for',
      blocks: [
        { id: 'c1', type: 'image', image: 'tech' },
        { id: 'c2', type: 'heading', text: 'Faster everything' },
        t('c3', 'Pages now load in half the time. We rewrote the slowest part of the app so you would never notice.'),
        { id: 'c4', type: 'button', text: 'Read the changelog', href: 'https://example.com/changelog' },
      ],
    },
  },
  {
    id: 'members-letter',
    name: 'Members letter',
    category: 'Paid',
    description: 'A thank-you note for paying readers with a private link and a perk.',
    image: 'indigo',
    accent: '#4338ca',
    font: 'serif',
    uses: 2871,
    issue: {
      title: 'For members only',
      subtitle: 'A thank-you, a bonus essay and something we’ve never shared before',
      blocks: [
        t('p1', 'You make this newsletter possible. Here is a small thing in return.'),
        { id: 'p2', type: 'quote', text: 'Members get every issue a day early, forever.' },
        { id: 'p3', type: 'button', text: 'Open your bonus', href: 'https://example.com/members' },
      ],
    },
  },
]

/* ---------------- Analytics ---------------- */

export const analyticsCopy = {
  title: 'Analytics',
  intro: 'Demo data for a 372k-reader publication, served by the Worker at /api/analytics.',
  ranges: [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
  ],
  metrics: [
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'opens', label: 'Open rate' },
    { id: 'clicks', label: 'Click rate' },
    { id: 'revenue', label: 'Revenue' },
  ],
  error: 'We couldn’t load your numbers.',
}

/* ---------------- Monetization ---------------- */

export const monetizeCopy = {
  title: 'Monetization',
  intro: 'Sponsors, boosts and paid tiers in one place. Offers and payouts here are demo data kept in this browser.',
  balanceLabel: 'Available balance',
  nextPayout: 'Next payout Dec 1',
}

export type AdOffer = { id: string; sponsor: string; category: string; cpm: number; placement: string; est: number; brief: string; hue: number }
export const adOffers: AdOffer[] = [
  { id: 'o1', sponsor: 'Northbeam Notebooks', category: 'Stationery', cpm: 38, placement: 'Primary', est: 1420, brief: 'Hand-bound notebooks for people who still write things down.', hue: 312 },
  { id: 'o2', sponsor: 'Cedar & Pine Coffee', category: 'Food & drink', cpm: 31, placement: 'Secondary', est: 960, brief: 'Small-batch roasts delivered on the day they are roasted.', hue: 28 },
  { id: 'o3', sponsor: 'Lattice Learning', category: 'Education', cpm: 44, placement: 'Primary', est: 1680, brief: 'Short courses on writing, design and data from working pros.', hue: 256 },
  { id: 'o4', sponsor: 'Driftwood Travel', category: 'Travel', cpm: 27, placement: 'Footer', est: 610, brief: 'Slow trips by train with one booking for the whole route.', hue: 190 },
]

export const boosts = [
  { id: 'b1', name: 'The Daily Margin', perSub: 2.4, subs: 18 },
  { id: 'b2', name: 'Signal Noise', perSub: 1.8, subs: 31 },
  { id: 'b3', name: 'Fernwood', perSub: 3.1, subs: 7 },
]

export const payouts = [
  { id: 'p3', date: 'Nov 1', amount: 2563.0, status: 'Paid' },
  { id: 'p2', date: 'Oct 1', amount: 2190.5, status: 'Paid' },
  { id: 'p1', date: 'Sep 1', amount: 1744.25, status: 'Paid' },
]

/* ---------------- Pricing ---------------- */

export const subscriberSteps = [1000, 2500, 5000, 10000, 25000, 50000, 100000]

export type Plan = { id: string; name: string; blurb: string; base: number | null; perK: number; cta: string; href: string; featured?: boolean; features: string[] }
export const plans: Plan[] = [
  { id: 'launch', name: 'Launch', blurb: 'Everything you need to send your first issue.', base: 0, perK: 0, cta: 'Start for free', href: '/signup?plan=launch', features: ['Up to 2,500 subscribers', 'Unlimited issues', 'Editor and templates', 'Custom domain', 'Basic analytics'] },
  { id: 'scale', name: 'Scale', blurb: 'Grow and earn with the ad network and referrals.', base: 39, perK: 4, cta: 'Try Scale free', href: '/signup?plan=scale', featured: true, features: ['Everything in Launch', 'Ad network', 'Referral program', 'Paid subscriptions', 'Recommendations and boosts', 'Full analytics'] },
  { id: 'max', name: 'Max', blurb: 'For teams running several publications.', base: 99, perK: 6, cta: 'Try Max free', href: '/signup?plan=max', features: ['Everything in Scale', 'Up to 10 publications', 'Remove Inkwell branding', 'Priority support', 'Podcast hosting'] },
  { id: 'enterprise', name: 'Enterprise', blurb: 'Custom limits, migration help and an account team.', base: null, perK: 0, cta: 'Get a demo', href: '/demo', features: ['Everything in Max', 'Unlimited publications', 'Dedicated deliverability', 'SSO and audit log', 'Uptime commitment'] },
]

export const compare: { label: string; values: [string, string, string, string] }[] = [
  { label: 'Subscribers', values: ['2,500', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { label: 'Publications', values: ['1', '3', '10', 'Unlimited'] },
  { label: 'Team seats', values: ['1', '2', '5', 'Custom'] },
  { label: 'Ad network', values: ['', 'yes', 'yes', 'yes'] },
  { label: 'Paid subscriptions', values: ['', 'yes', 'yes', 'yes'] },
  { label: 'Podcast hosting', values: ['', '', 'yes', 'yes'] },
  { label: 'Remove branding', values: ['', '', 'yes', 'yes'] },
  { label: 'SSO', values: ['', '', '', 'yes'] },
]

export const faqs = [
  { q: 'Can I import my list from another platform?', a: 'Yes. Upload a CSV or connect your old account and we bring subscribers, past issues and paid members across. Most imports finish in under ten minutes.' },
  { q: 'Do you take a cut of my paid subscriptions?', a: 'No. Inkwell takes 0% of subscription revenue on every paid plan. Your card processor’s standard fee still applies.' },
  { q: 'How does the ad network pay?', a: 'Sponsors pay per thousand opens. You approve every placement, and earnings land in your balance after the issue sends. Payouts go out on the first of each month.' },
  { q: 'What happens if I go over my subscriber limit?', a: 'Nothing breaks. We email you and keep sending; you have 30 days to upgrade or trim the list.' },
  { q: 'Can I cancel at any time?', a: 'Yes. Plans are month to month, and annual plans are refunded for the unused months.' },
]

/* ---------------- Forms ---------------- */

export const signupCopy = {
  title: 'Start your newsletter',
  body: 'Free up to 2,500 subscribers. We email you a sign-in link, so there is no password to remember.',
  done: (email: string) => `Check ${email} for a link to finish setting up your publication.`,
}
export const loginCopy = {
  title: 'Log in to Inkwell',
  body: 'Enter your email and we’ll send you a sign-in link.',
  done: (email: string) => `If ${email} has an account, a sign-in link is on its way.`,
}
export const demoCopy = {
  title: 'Get a demo',
  body: 'Tell us about your publication and someone from our team will reply within one working day.',
  sizes: ['Under 10k', '10k to 100k', '100k to 1M', 'Over 1M'],
}

/* ---------------- Chat assistant ---------------- */

export const chatCopy = {
  label: 'Ask Inkwell',
  title: 'Inkwell assistant',
  greeting: 'Hi! I can answer questions about pricing, importing a list, the ad network or the editor.',
  suggestions: ['How much does it cost?', 'Can I import my list?', 'How does the ad network pay?'],
  fallback: 'I’m a demo assistant with a few canned answers. For anything else, write to hello@inkwell.press.',
  answers: [
    { keys: ['price', 'cost', 'plan', 'free', 'pay for'], a: 'Launch is free up to 2,500 subscribers. Scale starts at $39 a month and Max at $99. The pricing page has a calculator.' },
    { keys: ['import', 'migrat', 'move', 'csv'], a: 'Yes: upload a CSV or connect your old account. Subscribers, past issues and paid members come across, usually in under ten minutes.' },
    { keys: ['ad', 'sponsor', 'earn', 'money', 'payout'], a: 'Sponsors pay per thousand opens. You approve each placement and payouts land on the first of the month. See the Monetization page.' },
    { keys: ['editor', 'write', 'design', 'template'], a: 'The editor works in blocks: headings, images, quotes, buttons and dividers. Try it on the Editor page, or start from a template.' },
  ],
}

/* ---------------- Footer ---------------- */

export const footer = {
  blurb: 'The newsletter platform for independent writers.',
  columns: [
    { title: 'Product', links: [{ href: '/editor', label: 'Editor' }, { href: '/templates', label: 'Templates' }, { href: '/analytics', label: 'Analytics' }, { href: '/monetize', label: 'Monetization' }] },
    { title: 'Company', links: [{ href: '/pricing', label: 'Pricing' }, { href: '/demo', label: 'Get a demo' }, { href: '/signup', label: 'Sign up' }, { href: '/login', label: 'Log in' }] },
    { title: 'Resources', links: [{ href: '/styleguide', label: 'Style guide' }, { href: `mailto:${'hello@inkwell.press'}`, label: 'Contact' }, { href: '/api/health', label: 'Status' }] },
  ],
  legal: '© 2026 Inkwell. A demo template; every name and number is invented.',
}
