// Every string, price and piece of seed data on the site lives here.
// Swap the copy, the team and the projects for your own studio's.

/**
 * All photography goes through this map. Replace a file in public/images (or
 * point a key at a CDN URL) to use your own photographs; nothing else changes.
 */
export const IMAGES = {
  hero: '/images/hero.webp',
  house: '/images/house.webp',
  hall: '/images/hall.webp',
  kitchen: '/images/kitchen.webp',
  dining: '/images/dining.webp',
  bedroom: '/images/bedroom.webp',
  bath: '/images/bath.webp',
  study: '/images/study.webp',
  stair: '/images/stair.webp',
  ceramics: '/images/ceramics.webp',
  samples: '/images/samples.webp',
  before: '/images/before.webp',
  after: '/images/after.webp',
  portraitEdith: '/images/p1.webp',
  portraitTomas: '/images/p2.webp',
  portraitAnaya: '/images/p3.webp',
} as const

export type ImageKey = keyof typeof IMAGES

export const BRAND = {
  name: 'Linen & Oak',
  wordmark: 'linen&oak',
  short: 'L&O',
  founded: 2016,
  year: 2026,
  tagline: 'Designing calm, lasting rooms with clarity, warmth and intention',
  email: 'studio@linenandoak.example',
  phone: '+44 20 7946 0321',
  address: ['14 Cooper Yard', 'London E2 8DD'],
  hours: 'Tuesday to Saturday, 9:30 to 18:00',
}

export const NAV = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Services', to: '/services' },
  { label: 'Process', to: '/process' },
  { label: 'Style quiz', to: '/style-quiz' },
  { label: 'The studio', to: '/studio' },
] as const

export const HOME = {
  metaLeft: `Work from ${BRAND.founded}`,
  metaRight: `(${BRAND.year})`,
  introLabel: 'Intro',
  intro: 'We design refined homes room by room, balancing architecture, interior design and the way you actually live',
  servicesLabel: 'Services',
  servicesTitle: 'Three ways to work with us',
  servicesBody: 'Start with a two-hour consultation, design one room at a time, or hand us the whole house. Every package is a fixed fee agreed before we begin.',
  roomsLabel: 'Room by room',
  roomsTitle: 'Recent rooms',
  processLabel: 'Process',
  processTitle: 'Five calm steps from first visit to the final cushion',
  quizLabel: 'Style quiz',
  quizTitle: 'Not sure what your style is called?',
  quizBody: 'Six quick questions, a named style profile, a palette and the package that fits. Your answers come with you to the consultation.',
  quizCta: 'Take the quiz',
  highlightsLabel: 'Studio highlights',
  highlightsTitle: 'Designed for calm and collaboration',
  highlightsBody:
    'Our studio holds to the same principles we bring into every home: quiet atmosphere, honest materials, natural light and decisions you can live with for twenty years.',
  stats: [
    { value: '140+', label: 'Homes completed' },
    { value: '9', label: 'Designers and makers' },
    { value: '4.9', label: 'Average client rating' },
    { value: '96%', label: 'Projects on budget' },
  ],
}

// --- Services and packages -------------------------------------------------

export type PackageId = 'consult' | 'room' | 'home'

export type Package = {
  id: PackageId
  number: string
  name: string
  summary: string
  price: number
  unit: string
  from: boolean
  duration: string
  image: ImageKey
  includes: string[]
}

export const PACKAGES: Package[] = [
  {
    id: 'consult',
    number: '01',
    name: 'Design consultation',
    summary: 'Two hours in your home with a senior designer, and a written plan you can carry out yourself.',
    price: 350,
    unit: 'per visit',
    from: false,
    duration: '2 hours, report in 5 days',
    image: 'samples',
    includes: ['Walk-through of up to three rooms', 'Layout and lighting advice', 'Paint and material direction', 'Written action plan with sources'],
  },
  {
    id: 'room',
    number: '02',
    name: 'Room design',
    summary: 'A complete design for one room: layout, palette, joinery, lighting and a shoppable furniture schedule.',
    price: 2400,
    unit: 'per room',
    from: true,
    duration: '4 to 6 weeks per room',
    image: 'bedroom',
    includes: ['Measured survey', 'Two concept boards', 'Scaled layout and elevations', 'Lighting and electrical plan', 'Furniture and finish schedule', 'Trade pricing on everything'],
  },
  {
    id: 'home',
    number: '03',
    name: 'Full home',
    summary: 'Whole-house design with project management, from strip-out to styling, delivered by our own trades.',
    price: 12000,
    unit: 'per project',
    from: true,
    duration: '4 to 9 months',
    image: 'house',
    includes: ['Everything in Room design', 'Architectural and joinery drawings', 'Contractor tender and site management', 'Procurement and delivery', 'Installation and styling day', 'Twelve-month aftercare'],
  },
]

export const COMPARE = {
  title: 'Compare packages',
  rows: [
    { label: 'Senior designer', values: [true, true, true] },
    { label: 'Measured survey', values: [false, true, true] },
    { label: 'Concept boards', values: ['Verbal', '2 per room', '2 per room'] },
    { label: '3D visuals', values: [false, 'Add-on', true] },
    { label: 'Joinery drawings', values: [false, true, true] },
    { label: 'Trade pricing', values: [false, true, true] },
    { label: 'Site management', values: [false, false, true] },
    { label: 'Styling day', values: [false, 'Add-on', true] },
  ] as { label: string; values: (boolean | string)[] }[],
}

export const ADDONS = [
  { id: 'visuals', name: '3D visuals', price: 600, note: 'Two photoreal views per room' },
  { id: 'styling', name: 'Styling day', price: 450, note: 'We place art, books and accessories' },
  { id: 'art', name: 'Art sourcing', price: 300, note: 'A shortlist from galleries and makers' },
  { id: 'lighting', name: 'Lighting scheme', price: 380, note: 'Scenes, dimming and fittings' },
] as const

export const SERVICES_PAGE = {
  label: 'Services',
  title: 'Services and packages',
  intro: 'Fixed fees, agreed before we begin. Furniture and building work are billed at trade cost with no mark-up, so the fee is the only thing we earn.',
  estimatorTitle: 'Estimate your fee',
  estimatorBody: 'Choose a package, the number of rooms and any extras. The estimate is the design fee only.',
  faqTitle: 'Questions',
  faq: [
    { q: 'Do you work outside London?', a: 'Yes. Consultations are London and the home counties; Room design and Full home run across the UK, with travel at cost.' },
    { q: 'Can I start with one room and add more?', a: 'Yes. Most clients start with one room. Your fee for the first room is deducted if you move up to Full home within six months.' },
    { q: 'Who buys the furniture?', a: 'You can buy from our schedule yourself, or we order, receive and install it. Either way you get our trade price.' },
    { q: 'What if I don’t like the first concept?', a: 'Every package includes a second concept and two rounds of revisions. We rarely need them, but they are there.' },
  ],
}

// --- Portfolio: projects and their rooms -------------------------------

export const ROOM_TYPES = ['Living', 'Kitchen', 'Dining', 'Bedroom', 'Bathroom', 'Study', 'Hallway'] as const
export type RoomType = (typeof ROOM_TYPES)[number]

export type StyleId = 'warm-minimal' | 'nordic-light' | 'collected' | 'earthy'

export type Room = {
  id: string
  project: string
  type: RoomType
  name: string
  image: ImageKey
  body: string
  materials: string[]
  styles: StyleId[]
}

export type Project = {
  slug: string
  name: string
  location: string
  year: number
  size: string
  duration: string
  package: PackageId
  cover: ImageKey
  summary: string
  brief: string
  palette: { name: string; hex: string }[]
  beforeAfter?: { before: ImageKey; after: ImageKey; caption: string }
  rooms: Room[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'fen-street',
    name: 'Fen Street House',
    location: 'Hackney, London',
    year: 2026,
    size: '186 m²',
    duration: '7 months',
    package: 'home',
    cover: 'hero',
    summary: 'A Victorian terrace opened up into one long, warm living floor, with joinery doing the quiet work.',
    brief: 'Two architects with a large book collection wanted a house that felt calm without hiding the things they love. We built the storage first, then let the art and the light decide everything else.',
    palette: [
      { name: 'Limewash', hex: '#e8e1d5' },
      { name: 'Oak', hex: '#b08a5e' },
      { name: 'Olive', hex: '#4b5636' },
      { name: 'Rust', hex: '#b9572a' },
    ],
    rooms: [
      { id: 'fen-living', project: 'fen-street', type: 'Living', name: 'Living room', image: 'hero', body: 'A single painting set the palette; oak shelving runs wall to wall so nothing else needs to.', materials: ['Fumed oak', 'Boucle', 'Lime plaster'], styles: ['warm-minimal', 'collected'] },
      { id: 'fen-study', project: 'fen-street', type: 'Study', name: 'Library study', image: 'study', body: 'The book wall became a room of its own, with a desk under the garden window.', materials: ['Oiled oak', 'Leather', 'Wool rug'], styles: ['collected', 'earthy'] },
      { id: 'fen-bedroom', project: 'fen-street', type: 'Bedroom', name: 'Main bedroom', image: 'bedroom', body: 'Low, soft and dark-framed by the tree outside. Linen everywhere you touch.', materials: ['Washed linen', 'Oak', 'Brass'], styles: ['warm-minimal', 'earthy'] },
    ],
  },
  {
    slug: 'alder-house',
    name: 'Alder House',
    location: 'Bath, Somerset',
    year: 2025,
    size: '142 m²',
    duration: '5 months',
    package: 'home',
    cover: 'dining',
    summary: 'A tired 1980s family house turned into a light, sociable home around a long oak table.',
    brief: 'A family of five wanted to eat together again. We moved the kitchen to the garden side, built a banquette for the children and stripped back decades of pattern.',
    palette: [
      { name: 'Chalk', hex: '#efebe3' },
      { name: 'Travertine', hex: '#d8c8ad' },
      { name: 'Moss', hex: '#5d6b45' },
      { name: 'Clay', hex: '#a9573a' },
    ],
    beforeAfter: { before: 'before', after: 'after', caption: 'The sitting room, before and after. Same walls, same window.' },
    rooms: [
      { id: 'alder-living', project: 'alder-house', type: 'Living', name: 'Sitting room', image: 'after', body: 'Carpet up, oak down, and a travertine table low enough for the children to draw on.', materials: ['Travertine', 'Linen', 'Oak'], styles: ['warm-minimal', 'nordic-light'] },
      { id: 'alder-kitchen', project: 'alder-house', type: 'Kitchen', name: 'Kitchen', image: 'kitchen', body: 'One honed island, oak fronts and an open shelf for the plates they actually use.', materials: ['Honed travertine', 'Oak veneer', 'Plaster'], styles: ['warm-minimal', 'nordic-light'] },
      { id: 'alder-dining', project: 'alder-house', type: 'Dining', name: 'Dining room', image: 'dining', body: 'A long table and an olive banquette that seats six children or eight adults.', materials: ['Solid oak', 'Mohair', 'Paper'], styles: ['earthy', 'collected'] },
    ],
  },
  {
    slug: 'quarry-hall',
    name: 'Quarry Hall',
    location: 'Surrey Hills',
    year: 2025,
    size: '310 m²',
    duration: '9 months',
    package: 'home',
    cover: 'house',
    summary: 'A new-build in charred timber and board-formed concrete, softened from the inside with oak and stone.',
    brief: 'The architecture was strong; the interior needed to be quieter. We worked with the architect from planning so every finish meets the concrete cleanly.',
    palette: [
      { name: 'Concrete', hex: '#c9c4bb' },
      { name: 'White plaster', hex: '#f4f2ee' },
      { name: 'Smoked oak', hex: '#6e5139' },
      { name: 'Eucalyptus', hex: '#8a9a7b' },
    ],
    rooms: [
      { id: 'quarry-hall', project: 'quarry-hall', type: 'Hallway', name: 'Entrance hall', image: 'hall', body: 'Double height, concrete and an olive tree. The bench is the only furniture it needs.', materials: ['Board-formed concrete', 'Oak', 'Leather'], styles: ['earthy', 'warm-minimal'] },
      { id: 'quarry-stair', project: 'quarry-hall', type: 'Hallway', name: 'Stair', image: 'stair', body: 'Cantilevered treads in smoked oak against white plaster, lit only from the window.', materials: ['Smoked oak', 'Plaster'], styles: ['nordic-light', 'warm-minimal'] },
      { id: 'quarry-bath', project: 'quarry-hall', type: 'Bathroom', name: 'Bathroom', image: 'bath', body: 'Microcement walls under a skylight, a stone bath and an oak vanity built in.', materials: ['Microcement', 'Limestone', 'Oak'], styles: ['nordic-light', 'earthy'] },
    ],
  },
]

export const ROOMS: Room[] = PROJECTS.flatMap((p) => p.rooms)

export const PORTFOLIO_PAGE = {
  label: 'Portfolio',
  title: 'Room by room',
  intro: 'We think in rooms. Filter by the one you are planning, save the ones you love to your ideas board and bring it to your consultation.',
  savedOnly: 'Saved only',
  empty: 'No rooms match. Clear the filter or save a few rooms first.',
}

// --- Process --------------------------------------------------------------

export const PROCESS = [
  {
    number: '01',
    name: 'Consultation',
    duration: 'Week 1',
    body: 'We visit, listen and look at how you use each room. You leave with honest advice and a fixed fee proposal.',
    youGet: ['Fixed fee proposal', 'First impressions in writing'],
    weNeed: ['An hour of your time', 'Photos of rooms you love'],
    image: 'samples' as ImageKey,
  },
  {
    number: '02',
    name: 'Survey and brief',
    duration: 'Weeks 2 to 3',
    body: 'A measured survey and a written brief, room by room, so every decision after this has something to answer to.',
    youGet: ['Measured drawings', 'Signed-off brief'],
    weNeed: ['Access for half a day', 'Your budget range'],
    image: 'hall' as ImageKey,
  },
  {
    number: '03',
    name: 'Concept',
    duration: 'Weeks 4 to 6',
    body: 'Two concepts per room with layouts, palettes and real samples you can hold in your own light.',
    youGet: ['Two concept boards', 'Sample box delivered'],
    weNeed: ['One review meeting', 'Honest reactions'],
    image: 'ceramics' as ImageKey,
  },
  {
    number: '04',
    name: 'Detailed design',
    duration: 'Weeks 7 to 10',
    body: 'Drawings, lighting, joinery and a costed schedule of everything, priced at trade with no mark-up.',
    youGet: ['Drawing pack', 'Costed schedule'],
    weNeed: ['Approval on the schedule'],
    image: 'kitchen' as ImageKey,
  },
  {
    number: '05',
    name: 'Delivery and styling',
    duration: 'From week 11',
    body: 'We manage trades, deliveries and installation, then spend a day placing art, books and the final cushion.',
    youGet: ['Site management', 'Styling day', 'Twelve-month aftercare'],
    weNeed: ['The keys', 'Patience with dust'],
    image: 'after' as ImageKey,
  },
]

export const PROCESS_PAGE = {
  label: 'Process',
  title: 'How a project runs',
  intro: 'Five phases, the same for one room or a whole house. You always know what happens next, what it costs and what we need from you.',
  youGet: 'You get',
  weNeed: 'We need',
}

// --- Style quiz -------------------------------------------------------------

export type StyleProfile = {
  id: StyleId
  name: string
  summary: string
  palette: string[]
  materials: string[]
  package: PackageId
}

export const STYLES: Record<StyleId, StyleProfile> = {
  'warm-minimal': {
    id: 'warm-minimal',
    name: 'Warm minimal',
    summary: 'Few things, chosen well. Pale oak, limewash and linen, with one strong piece of art doing the talking.',
    palette: ['#ece6db', '#c9b493', '#8c6a46', '#2b2a27'],
    materials: ['Limewash', 'Pale oak', 'Linen', 'Travertine'],
    package: 'room',
  },
  'nordic-light': {
    id: 'nordic-light',
    name: 'Nordic light',
    summary: 'Bright, airy and practical. White plaster, soft greys and clever storage that keeps surfaces clear.',
    palette: ['#f4f2ee', '#d6d3cc', '#9aa394', '#53584c'],
    materials: ['White plaster', 'Ash', 'Wool', 'Microcement'],
    package: 'consult',
  },
  collected: {
    id: 'collected',
    name: 'Collected modern',
    summary: 'Books, art and things with stories, held in calm joinery so it reads as a collection, not clutter.',
    palette: ['#e7dfd2', '#b9572a', '#4b5636', '#1d1c1a'],
    materials: ['Fumed oak', 'Leather', 'Wool rugs', 'Brass'],
    package: 'home',
  },
  earthy: {
    id: 'earthy',
    name: 'Earthy organic',
    summary: 'Clay, stone and moss green. Rounded forms, textured walls and plants as part of the architecture.',
    palette: ['#e3d9c8', '#a9573a', '#5d6b45', '#6e5139'],
    materials: ['Clay plaster', 'Stone', 'Mohair', 'Rattan'],
    package: 'room',
  },
}

export type QuizOption = { id: string; label: string; image?: ImageKey; swatches?: string[]; scores: Partial<Record<StyleId, number>> }
export type QuizQuestion = { id: string; prompt: string; kind: 'image' | 'swatch' | 'text'; options: QuizOption[] }

export const QUIZ: QuizQuestion[] = [
  {
    id: 'room',
    prompt: 'Which room would you walk into first?',
    kind: 'image',
    options: [
      { id: 'a', label: 'The one with the painting', image: 'hero', scores: { collected: 2, 'warm-minimal': 1 } },
      { id: 'b', label: 'The bright stair', image: 'stair', scores: { 'nordic-light': 2 } },
      { id: 'c', label: 'The stone bathroom', image: 'bath', scores: { earthy: 2, 'nordic-light': 1 } },
      { id: 'd', label: 'The oak kitchen', image: 'kitchen', scores: { 'warm-minimal': 2 } },
    ],
  },
  {
    id: 'palette',
    prompt: 'Pick the palette you would live with',
    kind: 'swatch',
    options: [
      { id: 'a', label: 'Limewash and oak', swatches: STYLES['warm-minimal'].palette, scores: { 'warm-minimal': 2 } },
      { id: 'b', label: 'Chalk and sage', swatches: STYLES['nordic-light'].palette, scores: { 'nordic-light': 2 } },
      { id: 'c', label: 'Rust and olive', swatches: STYLES.collected.palette, scores: { collected: 2 } },
      { id: 'd', label: 'Clay and moss', swatches: STYLES.earthy.palette, scores: { earthy: 2 } },
    ],
  },
  {
    id: 'materials',
    prompt: 'Which materials do you reach out to touch?',
    kind: 'text',
    options: [
      { id: 'a', label: 'Linen and pale oak', scores: { 'warm-minimal': 2, 'nordic-light': 1 } },
      { id: 'b', label: 'Stone and clay plaster', scores: { earthy: 2 } },
      { id: 'c', label: 'Leather and dark wood', scores: { collected: 2 } },
      { id: 'd', label: 'White ash and wool', scores: { 'nordic-light': 2 } },
    ],
  },
  {
    id: 'living',
    prompt: 'How does your home get used?',
    kind: 'text',
    options: [
      { id: 'a', label: 'Quiet evenings, mostly us', scores: { 'warm-minimal': 2 } },
      { id: 'b', label: 'Always people round', scores: { earthy: 1, collected: 1 } },
      { id: 'c', label: 'Children, dogs, chaos', scores: { 'nordic-light': 2 } },
      { id: 'd', label: 'Work from home every day', scores: { collected: 1, 'nordic-light': 1 } },
    ],
  },
  {
    id: 'light',
    prompt: 'What light feels like home?',
    kind: 'image',
    options: [
      { id: 'a', label: 'Bright and even', image: 'stair', scores: { 'nordic-light': 2 } },
      { id: 'b', label: 'Low golden evening', image: 'study', scores: { collected: 2 } },
      { id: 'c', label: 'Soft and overcast', image: 'bedroom', scores: { 'warm-minimal': 2 } },
      { id: 'd', label: 'Dappled through leaves', image: 'hall', scores: { earthy: 2 } },
    ],
  },
  {
    id: 'things',
    prompt: 'And your things?',
    kind: 'text',
    options: [
      { id: 'a', label: 'Hidden away, surfaces clear', scores: { 'nordic-light': 1, 'warm-minimal': 1 } },
      { id: 'b', label: 'A few, carefully placed', scores: { 'warm-minimal': 2 } },
      { id: 'c', label: 'On show, I love them', scores: { collected: 2 } },
      { id: 'd', label: 'Plants count as things', scores: { earthy: 2 } },
    ],
  },
]

export const QUIZ_PAGE = {
  label: 'Style quiz',
  title: 'Find your style',
  intro: 'Six questions, about a minute. We save your answers on this device so you can bring them to your consultation.',
  start: 'Start the quiz',
  resultLabel: 'Your style',
  matching: 'Rooms that match',
  recommended: 'Where we would start',
  retake: 'Retake the quiz',
  book: 'Book with this brief',
}

// --- Studio and team ----------------------------------------------------

export const TEAM = [
  { number: '01', first: 'Edith', last: 'Marlowe', role: 'Founder and creative director', bio: 'Trained as an architect, opened the studio in 2016 and still leads every first visit.', image: 'portraitEdith' as ImageKey },
  { number: '02', first: 'Tomas', last: 'Lindqvist', role: 'Lead architect', bio: 'Contemporary residential architecture shaped by proportion, simplicity and daylight.', image: 'portraitTomas' as ImageKey },
  { number: '03', first: 'Anaya', last: 'Rao', role: 'Senior interior designer', bio: 'Builds the concepts: warm, functional rooms with one surprising decision in each.', image: 'portraitAnaya' as ImageKey },
]

export const STUDIO_PAGE = {
  label: 'The studio',
  title: 'Nine people, one long table',
  intro: 'Designers, an architect and two makers in a former print works in East London. Every project has a named lead from first visit to final cushion.',
  teamLabel: 'Team',
  valuesLabel: 'What we hold to',
  values: [
    { title: 'Rooms before things', body: 'We design how a room works before we choose anything to put in it.' },
    { title: 'No mark-up', body: 'Trade prices go straight to you. The fixed fee is all we earn.' },
    { title: 'Built to last', body: 'Solid materials, repairable furniture, finishes that age well.' },
  ],
}

// --- Booking ------------------------------------------------------------------

export const BOOK = {
  label: 'Book',
  title: 'Book a design consultation',
  intro: 'Pick a package, tell us about the rooms, choose a time. A designer confirms within one working day.',
  steps: ['Package', 'Your project', 'Date and time', 'Your details'],
  propertyTypes: ['Flat', 'Terrace', 'Detached house', 'New build', 'Other'],
  budgets: ['Under £20k', '£20k to £50k', '£50k to £150k', 'Over £150k'],
  formats: [
    { id: 'home', label: 'In your home' },
    { id: 'studio', label: 'At the studio' },
    { id: 'video', label: 'Video call' },
  ],
  noSlots: 'No times left on this day. Try another.',
  closed: 'The studio is closed Sundays and Mondays.',
  attachQuiz: 'Attach my style quiz result',
  attachBoard: 'Attach my ideas board',
  successTitle: 'You are booked in',
  successBody: 'We have sent the details to your email. Your designer will call the day before to confirm.',
  existingTitle: 'Your upcoming consultation',
  cancel: 'Cancel booking',
  cancelConfirm: 'Cancel this consultation? You can book again at any time.',
}

export const SAVED_PAGE = {
  label: 'Ideas board',
  title: 'Your ideas board',
  intro: 'Rooms you saved from the portfolio, kept on this device. Add a note to each so your designer knows what caught your eye.',
  empty: 'Nothing saved yet. Tap the heart on any room in the portfolio.',
  notePlaceholder: 'What do you love about this room?',
  clear: 'Clear board',
  clearConfirm: 'Remove every saved room and note from this device?',
  share: 'Bring this to a consultation',
}

export const FOOTER = {
  newsletterTitle: 'Notes from the studio, four times a year',
  newsletterBody: 'New rooms, the materials we are excited about, and nothing else.',
  columns: [
    { title: 'Studio', links: [{ label: 'Portfolio', to: '/portfolio' }, { label: 'Services', to: '/services' }, { label: 'Process', to: '/process' }, { label: 'The studio', to: '/studio' }] },
    { title: 'Plan', links: [{ label: 'Style quiz', to: '/style-quiz' }, { label: 'Ideas board', to: '/saved' }, { label: 'Book a consultation', to: '/book' }, { label: 'Style guide', to: '/styleguide' }] },
  ],
  legal: `© ${BRAND.year} ${BRAND.name} Interiors Ltd. A demo studio.`,
}

export const NOT_FOUND = {
  title: 'This room is still being designed',
  body: 'The page you were looking for is not here. Try the portfolio, or start again from the front door.',
}
