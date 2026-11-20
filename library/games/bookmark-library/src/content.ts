/*
  Every string, plan, FAQ answer and seed bookmark lives here. Change the
  brand in BRAND, swap photography in IMAGES (files in public/images/), and
  edit the demo shelf in SEED_ITEMS / SEED_COLLECTIONS.
*/

export const BRAND = {
  name: 'Keepsake',
  tagline: 'bookmarks with memory',
  badge: 'Bookmarks with memory',
  email: 'hello@keepsake.example',
}

/** Every photograph in the template goes through this map. */
export const IMAGES = {
  woodType: '/images/wood-type.webp',
  phone: '/images/phone.webp',
  ceramics: '/images/ceramics.webp',
  concrete: '/images/concrete.webp',
  swatches: '/images/swatches.webp',
  plant: '/images/plant.webp',
  desk: '/images/desk.webp',
  gradient: '/images/gradient.webp',
  chair: '/images/chair.webp',
  map: '/images/map.webp',
} as const

export type ImageKey = keyof typeof IMAGES
export type Swatch = 'sand' | 'lilac' | 'sky' | 'sage' | 'blush'
export type Kind = 'article' | 'image' | 'video' | 'product' | 'font' | 'tool'

export const KINDS: Record<Kind, string> = {
  article: 'Article',
  image: 'Image',
  video: 'Video',
  product: 'Product',
  font: 'Typeface',
  tool: 'Tool',
}

export const NAV = [
  { label: 'Finding', href: '/#finding' },
  { label: 'Saving', href: '/#saving' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
]

export const HERO = {
  title: ['Everything you saved', 'finally', 'findable'],
  lead: 'Your personal inspiration library that remembers not just what you saved, but why.',
  demoQuery: 'typography I saved about two weeks ago for the redesign',
  cta: 'Join waitlist',
  placeholder: 'Enter your email',
}

export const FINDING = {
  eyebrow: 'Finding',
  title: 'Search the way you remember',
  lead: 'Nobody remembers a URL. You remember roughly when, roughly what, and what it was for. Keepsake reads your sentence and turns it into filters you can see and undo.',
  tries: [
    'fonts from last week',
    'favourite photos for the brand refresh',
    'videos I saved yesterday',
    'ceramics in august',
    'colour palettes for the new pitch',
  ],
  points: [
    { title: 'Plain sentences', body: 'Type the half-memory. Dates, tags, collections and types come out as chips.' },
    { title: 'Filters you can see', body: 'Every chip is a filter. Click one to drop it and widen the search.' },
    { title: 'The why, searchable', body: 'The note you left when saving is indexed alongside the title.' },
  ],
}

export const SAVING = {
  eyebrow: 'Saving',
  title: 'One line of why, and it sticks',
  lead: 'Paste a link, add a sentence about why it caught your eye, and move on. Keepsake files it by date, tag and collection so future you can find it in a sentence.',
  steps: [
    { n: '01', title: 'Paste anything', body: 'Articles, images, videos, products, typefaces and tools. The title and site fill themselves in.' },
    { n: '02', title: 'Say why', body: '"For the pricing page hero." That line is what makes it findable later.' },
    { n: '03', title: 'Tag lightly', body: 'Suggested tags come from what you already use, so your shelf stays tidy.' },
  ],
}

export const STATS = [
  { value: '3 s', label: 'to save a link with a note' },
  { value: '1 line', label: 'of why is all it needs' },
  { value: '0', label: 'folders to maintain' },
]

export const FAQ = [
  { q: 'Is this a read-later app?', a: 'No. Read-later apps want you to finish things. Keepsake is for the things you want to come back to when a project needs them: references, type, colour, products, ideas.' },
  { q: 'How does the search understand me?', a: 'It looks for dates ("two weeks ago", "in August"), your tags, your collection names, content types and favourites, then ranks what is left by your words. Nothing leaves your browser in this demo.' },
  { q: 'Can I import my browser bookmarks?', a: 'Import from an HTML bookmarks file is on the roadmap for launch. Waitlist members get it first.' },
  { q: 'Where is my library stored?', a: 'In this preview your shelf lives in your browser. At launch it syncs across devices, encrypted at rest.' },
  { q: 'What does it cost?', a: 'Free for your first 500 saves. Plus is $6 a month for unlimited saves, sharing and the browser extension.' },
]

export const PLANS = [
  {
    id: 'free',
    name: 'Shelf',
    monthly: 0,
    yearly: 0,
    blurb: 'For collecting on the side.',
    features: ['500 saves', 'Natural-language search', '3 collections', 'Notes on every save'],
    cta: 'Join waitlist',
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: 6,
    yearly: 5,
    blurb: 'For people who save for a living.',
    features: ['Unlimited saves', 'Unlimited collections', 'Browser extension', 'Share a collection by link', 'Full-page snapshots'],
    cta: 'Join waitlist',
    featured: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    monthly: 14,
    yearly: 12,
    blurb: 'For small teams with shared taste.',
    features: ['Everything in Plus', 'Shared team shelves', 'Comments on saves', 'Admin and SSO', 'Priority support'],
    cta: 'Talk to us',
  },
]

export const COMPARE = [
  { feature: 'Saves', values: ['500', 'Unlimited', 'Unlimited'] },
  { feature: 'Collections', values: ['3', 'Unlimited', 'Unlimited'] },
  { feature: 'Natural-language search', values: [true, true, true] },
  { feature: 'Browser extension', values: [false, true, true] },
  { feature: 'Share by link', values: [false, true, true] },
  { feature: 'Full-page snapshots', values: [false, true, true] },
  { feature: 'Team shelves', values: [false, false, true] },
]

export const WAITLIST = {
  title: 'You are on the shelf',
  lead: 'We will email you when your invite is ready. Until then, the full library works in this browser.',
  steps: ['Confirm your email from the message we just sent.', 'Try the library: save a link with a line of why.', 'Search for it next week in your own words.'],
}

export const FOOTER = {
  blurb: 'Bookmarks with memory. Save what caught your eye, and why.',
  columns: [
    { title: 'Product', links: [{ label: 'Library', href: '/app' }, { label: 'Pricing', href: '/pricing' }, { label: 'Join waitlist', href: '/#join' }] },
    { title: 'Learn', links: [{ label: 'Finding', href: '/#finding' }, { label: 'Saving', href: '/#saving' }, { label: 'FAQ', href: '/#faq' }] },
    { title: 'Kit', links: [{ label: 'Style guide', href: '/styleguide' }, { label: 'Contact', href: `mailto:${BRAND.email}` }] },
  ],
}

/* ---------------------------------------------------------------- data -- */

export type Collection = { id: string; name: string; description: string }

export type Item = {
  id: string
  url: string
  title: string
  note: string
  why: string
  tags: string[]
  collectionId: string | null
  savedAt: string
  favourite: boolean
  kind: Kind
  image?: ImageKey
  swatch: Swatch
}

export const SEED_COLLECTIONS: Collection[] = [
  { id: 'website-redesign', name: 'Website redesign', description: 'Type, layout and motion references for the new marketing site.' },
  { id: 'brand-refresh', name: 'Brand refresh', description: 'Colour, texture and photography direction for the identity update.' },
  { id: 'new-pitch', name: 'New pitch', description: 'Anything that might end up in the ceramics studio pitch deck.' },
  { id: 'home', name: 'Home ideas', description: 'Furniture, plants and small things for the flat.' },
]

/** Seed bookmarks. `daysAgo` is resolved against the first visit. */
export const SEED_ITEMS: Array<Omit<Item, 'savedAt'> & { daysAgo: number }> = [
  { id: 'neue-grotesk', daysAgo: 12, url: 'https://type.example/neue-grotesk-specimen', title: 'Neue grotesk specimen', note: 'The weights actually worth licensing', why: 'Body and headline pairing for the redesign. Medium and Bold only.', tags: ['typography', 'specimen'], collectionId: 'website-redesign', favourite: true, kind: 'font', image: 'woodType', swatch: 'sand' },
  { id: 'blocky-display', daysAgo: 15, url: 'https://typeweekly.example/blocky-display-on-phones', title: 'Blocky display type on a phone', note: 'Still readable at the smallest size', why: 'Proof that a heavy display face survives the mobile hero.', tags: ['typography', 'mobile'], collectionId: 'website-redesign', favourite: false, kind: 'article', image: 'phone', swatch: 'lilac' },
  { id: 'type-scale', daysAgo: 17, url: 'https://layout.example/type-scale-for-the-redesign', title: 'Type scale for the redesign', note: 'A 1.25 ratio that stops at six steps', why: 'Copy the step names, not the sizes. We need fewer.', tags: ['typography', 'system'], collectionId: 'website-redesign', favourite: false, kind: 'article', swatch: 'sky' },
  { id: 'tight-tracking', daysAgo: 23, url: 'https://typeweekly.example/when-to-tighten-tracking', title: 'When to tighten tracking', note: 'Negative tracking only above 40px', why: 'Settles the argument about the headline letter-spacing.', tags: ['typography'], collectionId: 'website-redesign', favourite: false, kind: 'article', swatch: 'sage' },
  { id: 'pricing-hero', daysAgo: 4, url: 'https://gallery.example/pricing-pages-with-a-calm-hero', title: 'Pricing pages with a calm hero', note: 'Three plans, one toggle, no confetti', why: 'The pricing page should feel this quiet.', tags: ['layout', 'pricing'], collectionId: 'website-redesign', favourite: true, kind: 'article', swatch: 'sand' },
  { id: 'scroll-motion', daysAgo: 6, url: 'https://motion.example/scroll-linked-reveals', title: 'Scroll-linked reveals that respect reduced motion', note: 'A pattern with a sane fallback', why: 'For the feature section. Check the reduced-motion branch.', tags: ['motion', 'accessibility'], collectionId: 'website-redesign', favourite: false, kind: 'video', swatch: 'lilac' },
  { id: 'lime-palette', daysAgo: 21, url: 'https://palettes.example/lime-and-sage', title: 'Lime, sage and sand palette', note: 'Bright accent, quiet base', why: 'Starting point for the refresh. The lime is louder than we need.', tags: ['colour', 'palette'], collectionId: 'brand-refresh', favourite: true, kind: 'image', image: 'swatches', swatch: 'sage' },
  { id: 'grain-gradient', daysAgo: 25, url: 'https://studio.example/grain-gradients', title: 'Grain gradients without the banding', note: 'Noise layer at 6 percent', why: 'Texture for the brand backgrounds, maybe social tiles.', tags: ['colour', 'texture'], collectionId: 'brand-refresh', favourite: false, kind: 'image', image: 'gradient', swatch: 'sky' },
  { id: 'concrete-light', daysAgo: 33, url: 'https://photo.example/concrete-stairwell', title: 'Concrete stairwell, one shaft of light', note: 'The photography mood we keep describing', why: 'Show this when someone asks what "calm, but not empty" means.', tags: ['photography', 'architecture'], collectionId: 'brand-refresh', favourite: true, kind: 'image', image: 'concrete', swatch: 'sand' },
  { id: 'logo-grid', daysAgo: 40, url: 'https://identity.example/logo-construction-grids', title: 'Logo construction grids, explained', note: 'Optical corrections over geometry', why: 'Before we redraw the mark.', tags: ['identity', 'system'], collectionId: 'brand-refresh', favourite: false, kind: 'article', swatch: 'blush' },
  { id: 'brand-voice', daysAgo: 2, url: 'https://writing.example/brand-voice-in-five-words', title: 'Brand voice in five words', note: 'A worksheet that fits on one page', why: 'Run this with the team on Thursday.', tags: ['writing', 'identity'], collectionId: 'brand-refresh', favourite: false, kind: 'tool', swatch: 'sage' },
  { id: 'stoneware', daysAgo: 70, url: 'https://ceramics.example/sage-glaze-stoneware', title: 'Sage glaze stoneware', note: 'Three vases, one glaze, very still', why: 'Exactly the product photography for the ceramics pitch.', tags: ['photography', 'ceramics'], collectionId: 'new-pitch', favourite: true, kind: 'product', image: 'ceramics', swatch: 'sage' },
  { id: 'pitch-structure', daysAgo: 8, url: 'https://deck.example/a-pitch-in-ten-slides', title: 'A pitch in ten slides', note: 'Problem, proof, plan, price', why: 'Structure for the ceramics studio deck.', tags: ['writing', 'pitch'], collectionId: 'new-pitch', favourite: false, kind: 'article', swatch: 'blush' },
  { id: 'glaze-colours', daysAgo: 9, url: 'https://ceramics.example/glaze-colour-chart', title: 'Glaze colour chart', note: 'Celadon to tenmoku in twelve tiles', why: 'Their palette could come straight from the kiln.', tags: ['colour', 'ceramics', 'palette'], collectionId: 'new-pitch', favourite: false, kind: 'image', swatch: 'sand' },
  { id: 'studio-video', daysAgo: 1, url: 'https://video.example/a-day-in-a-pottery-studio', title: 'A day in a small pottery studio', note: 'Eight minutes, no voiceover', why: 'Tone reference for the pitch film.', tags: ['video', 'ceramics'], collectionId: 'new-pitch', favourite: false, kind: 'video', swatch: 'lilac' },
  { id: 'plywood-chair', daysAgo: 28, url: 'https://shop.example/bent-plywood-lounge-chair', title: 'Bent plywood lounge chair', note: 'Low, warm, fits the corner', why: 'For the reading corner. Wait for the sale.', tags: ['furniture'], collectionId: 'home', favourite: true, kind: 'product', image: 'chair', swatch: 'sand' },
  { id: 'olive-tree', daysAgo: 45, url: 'https://garden.example/olive-trees-indoors', title: 'Keeping an olive tree indoors', note: 'South window, water less than you think', why: 'Before buying the one from the market.', tags: ['plants'], collectionId: 'home', favourite: false, kind: 'article', image: 'plant', swatch: 'sage' },
  { id: 'linen-cloth', daysAgo: 3, url: 'https://shop.example/washed-linen-tablecloth', title: 'Washed linen tablecloth, lilac', note: 'The colour from that café', why: 'Birthday present idea, not for us.', tags: ['gift', 'textiles'], collectionId: 'home', favourite: false, kind: 'product', swatch: 'lilac' },
  { id: 'old-maps', daysAgo: 0, url: 'https://archive.example/hand-drawn-coastal-maps', title: 'Hand-drawn coastal maps', note: 'Pale paper, tiny contour lines', why: 'Illustration style for the travel issue. Saved this morning.', tags: ['illustration', 'travel'], collectionId: null, favourite: false, kind: 'image', image: 'map', swatch: 'sky' },
  { id: 'desk-setup', daysAgo: 0, url: 'https://desks.example/a-desk-with-nothing-on-it', title: 'A desk with nothing on it', note: 'Minimal, but someone works here', why: 'Hero shot idea for the productivity client.', tags: ['photography', 'workspace'], collectionId: null, favourite: false, kind: 'image', image: 'desk', swatch: 'sand' },
  { id: 'kbd-shortcuts', daysAgo: 5, url: 'https://ux.example/designing-keyboard-shortcuts', title: 'Designing keyboard shortcuts people learn', note: 'One key, one verb', why: 'For the app command palette.', tags: ['ux', 'accessibility'], collectionId: null, favourite: false, kind: 'article', swatch: 'sky' },
  { id: 'colour-contrast', daysAgo: 14, url: 'https://tools.example/contrast-checker', title: 'Contrast checker with APCA', note: 'Paste two hexes, get a verdict', why: 'The lime text failed. Use this before every review.', tags: ['colour', 'accessibility', 'tools'], collectionId: null, favourite: true, kind: 'tool', swatch: 'sage' },
  { id: 'serif-revival', daysAgo: 55, url: 'https://type.example/a-quiet-serif-revival', title: 'A quiet serif revival', note: 'Old-style figures done right', why: 'Maybe for the editorial client, not for us.', tags: ['typography'], collectionId: null, favourite: false, kind: 'font', swatch: 'blush' },
  { id: 'empty-states', daysAgo: 19, url: 'https://ux.example/empty-states-that-teach', title: 'Empty states that teach', note: 'Show the first action, not a mascot', why: 'For the library when someone has saved nothing yet.', tags: ['ux', 'writing'], collectionId: 'website-redesign', favourite: false, kind: 'article', swatch: 'lilac' },
]

export const APP = {
  views: { today: 'Today', shelf: 'My shelf', favourites: 'Favourites' },
  searchPlaceholder: 'Search in your own words: “fonts from last week for the redesign”',
  emptyShelf: { title: 'Nothing saved yet', body: 'Paste a link and add a line about why it caught your eye.' },
  emptySearch: { title: 'Nothing matches all of that', body: 'Drop a filter chip to widen the search, or try fewer words.' },
  emptyToday: { title: 'Nothing saved today', body: 'Things you save today show up here until midnight.' },
  emptyFavourites: { title: 'No favourites yet', body: 'Star a save to keep it one click away.' },
  emptyCollection: { title: 'This collection is empty', body: 'Save something into it, or move an item here from its detail page.' },
}
