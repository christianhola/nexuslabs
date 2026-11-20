/*
  Every string, price and piece of seed data in the Branchwork template.
  Edit here first: pages and components only lay this out.
*/

export const brand = {
  name: 'Branchwork',
  domain: 'branchwork.app',
  tagline: 'The employee app for every team',
  email: 'hello@branchwork.app',
  sales: 'sales@branchwork.app',
  description: 'Branchwork is the branded employee app for news, chat, tasks, shifts and people, built for desk and frontline teams alike.',
}

/*
  Images. Every photograph on the site is routed through this one map, so
  swapping in your own photography is a one-line change per image. The
  current files are generated placeholders of fictional people.
  `portraits` is a 4×4 sprite of 16 headshots; `face` indexes into it.
*/
export const images = {
  portraits: '/images/portraits.webp',
  frontline: '/images/frontline.webp',
  aboutTeam: '/images/about-team.webp',
  caseLogistics: '/images/case-logistics.webp',
  caseCare: '/images/case-care.webp',
  caseHospitality: '/images/case-hospitality.webp',
  caseRetail: '/images/case-retail.webp',
}

export type NavLink = { label: string; href: string }
export type ProductLink = NavLink & { description: string; icon: IconName }

export type IconName =
  | 'news'
  | 'chat'
  | 'tasks'
  | 'shifts'
  | 'people'
  | 'surveys'
  | 'shield'
  | 'globe'
  | 'bolt'
  | 'phone'
  | 'chart'
  | 'plug'

export const productMenu: ProductLink[] = [
  { label: 'Org chart', href: '/product#org-chart', description: 'A live map of who reports to whom', icon: 'people' },
  { label: 'Team directory', href: '/product#directory', description: 'Find anyone by team, skill or place', icon: 'globe' },
  { label: 'News feed', href: '/product#news', description: 'Announcements everyone actually reads', icon: 'news' },
  { label: 'Chat', href: '/product#chat', description: 'Groups for every team and shift', icon: 'chat' },
  { label: 'Tasks and shifts', href: '/product#tasks', description: 'Checklists that close the loop', icon: 'tasks' },
  { label: 'Pulse surveys', href: '/product#surveys', description: 'Hear from everyone in a tap', icon: 'surveys' },
]

export const navLinks: NavLink[] = [
  { label: 'Why us', href: '/why-us' },
  { label: 'Customers', href: '/customers' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
]

/* ---------- Languages (hero, nav and cookie banner) ---------- */

export type Lang = 'en' | 'de' | 'fr' | 'es'

export type Strings = {
  product: string
  nav: Record<string, string>
  bookDemo: string
  heroBefore: string
  heroAccent: string
  heroAfter: string
  heroBody: string
  emailPlaceholder: string
  stat1: string
  stat2: string
  rating: string
  cookieTitle: string
  cookieBody: string
  cookieLink: string
  accept: string
  reject: string
}

export const languages: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
]

export const strings: Record<Lang, Strings> = {
  en: {
    product: 'Product',
    nav: { '/why-us': 'Why us', '/customers': 'Customers', '/integrations': 'Integrations', '/pricing': 'Pricing' },
    bookDemo: 'Book a demo',
    heroBefore: 'Bring',
    heroAccent: 'everyone',
    heroAfter: 'in',
    heroBody: 'Fast, friendly and simple. Bring news, chat and shifts into one branded app that every employee actually opens.',
    emailPlaceholder: 'Enter work email',
    stat1: 'Weekly active staff',
    stat2: 'Daily active people',
    rating: 'Average app store rating',
    cookieTitle: 'Cookie check',
    cookieBody: 'We use cookies to keep the site working and to see what helps. Read more in our',
    cookieLink: 'Cookie policy',
    accept: 'Accept',
    reject: 'Reject',
  },
  de: {
    product: 'Produkt',
    nav: { '/why-us': 'Warum wir', '/customers': 'Kunden', '/integrations': 'Integrationen', '/pricing': 'Preise' },
    bookDemo: 'Demo buchen',
    heroBefore: '',
    heroAccent: 'Alle',
    heroAfter: 'an Bord',
    heroBody: 'Einfach, schnell und freundlich. News, Chat, Schichten und das ganze Organigramm in einer App mit Ihrer Marke, für Büro und Fläche.',
    emailPlaceholder: 'Geschäftliche E-Mail',
    stat1: 'Wöchentlich aktive Mitarbeitende',
    stat2: 'Menschen täglich auf Branchwork',
    rating: 'Durchschnittliche App-Bewertung',
    cookieTitle: 'Cookie-Check',
    cookieBody: 'Wir nutzen Cookies, damit die Seite funktioniert und wir sehen, was hilft. Mehr in unserer',
    cookieLink: 'Cookie-Richtlinie',
    accept: 'Akzeptieren',
    reject: 'Ablehnen',
  },
  fr: {
    product: 'Produit',
    nav: { '/why-us': 'Pourquoi nous', '/customers': 'Clients', '/integrations': 'Intégrations', '/pricing': 'Tarifs' },
    bookDemo: 'Réserver une démo',
    heroBefore: 'Tout le',
    heroAccent: 'monde',
    heroAfter: 'à bord',
    heroBody: 'Simple, rapide et chaleureux. Actualités, messagerie, plannings et tout votre organigramme dans une app à vos couleurs, au bureau comme sur le terrain.',
    emailPlaceholder: 'E-mail professionnel',
    stat1: 'Salariés actifs chaque semaine',
    stat2: 'Personnes sur Branchwork chaque jour',
    rating: 'Note moyenne sur les stores',
    cookieTitle: 'Cookies',
    cookieBody: 'Nous utilisons des cookies pour faire fonctionner le site et comprendre ce qui aide. En savoir plus dans notre',
    cookieLink: 'Politique cookies',
    accept: 'Accepter',
    reject: 'Refuser',
  },
  es: {
    product: 'Producto',
    nav: { '/why-us': 'Por qué', '/customers': 'Clientes', '/integrations': 'Integraciones', '/pricing': 'Precios' },
    bookDemo: 'Reservar demo',
    heroBefore: '',
    heroAccent: 'Todos',
    heroAfter: 'a bordo',
    heroBody: 'Simple, rápida y cercana. Noticias, chat, turnos y todo tu organigrama en una app con tu marca, en la oficina o en planta.',
    emailPlaceholder: 'Email de trabajo',
    stat1: 'Empleados activos cada semana',
    stat2: 'Personas en Branchwork cada día',
    rating: 'Valoración media en las tiendas',
    cookieTitle: 'Cookies',
    cookieBody: 'Usamos cookies para que la web funcione y para ver qué ayuda. Más en nuestra',
    cookieLink: 'Política de cookies',
    accept: 'Aceptar',
    reject: 'Rechazar',
  },
}

export const heroStats = {
  active: { value: 81.4, suffix: '%', decimals: 1 },
  daily: { prefix: '~', value: 34, suffix: 'k', decimals: 0 },
  rating: 4.6,
}

/* ---------- Home ---------- */

export const trustedBy = ['Nordhavn', 'Linden Care', 'Halvard Hotels', 'Fieldmark', 'Oakridge Foods', 'Kestrel Air', 'Mirala']

export const modules: { id: string; icon: IconName; title: string; body: string; href: string }[] = [
  { id: 'news', icon: 'news', title: 'News that lands', body: 'Post once and reach every team, site and language. See who read it, and nudge who did not.', href: '/product#news' },
  { id: 'chat', icon: 'chat', title: 'Chat for every shift', body: 'Groups that build themselves from your HR data, so the night crew is never left out of the loop.', href: '/product#chat' },
  { id: 'tasks', icon: 'tasks', title: 'Tasks and checklists', body: 'Opening routines, safety rounds and launches with photo proof and a live completion rate.', href: '/product#tasks' },
  { id: 'people', icon: 'people', title: 'Org chart and directory', body: 'A living map of your company. Find the right person by team, skill or location in seconds.', href: '/product#org-chart' },
  { id: 'surveys', icon: 'surveys', title: 'Pulse surveys', body: 'One-tap questions with instant results, so you hear from the floor and not only the office.', href: '/product#surveys' },
  { id: 'shifts', icon: 'shifts', title: 'Shifts and swaps', body: 'Rotas from your scheduling tool, with swap requests your managers approve on the go.', href: '/product#tasks' },
]

export const frontline = {
  eyebrow: 'Built for the 80%',
  title: 'Reach the people who never sit at a desk',
  body: 'Most of your workforce has no company email and no laptop. Branchwork lives on the phone they already carry, signs them in with a code from their manager, and works on patchy warehouse Wi-Fi.',
  points: [
    'Sign in with an employee number, no email needed',
    'Automatic translation into 40 languages',
    'Works offline and syncs when back in range',
    'Your logo, colours and name in the app stores',
  ],
  stat: { value: '3.2×', label: 'more frontline staff reached than with email' },
}

export const showcaseTabs = [
  { id: 'feed', label: 'News feed', title: 'One feed, every site', body: 'Target posts by team, site or role. Read receipts show where a message stalled.' },
  { id: 'chat', label: 'Chat', title: 'Groups that run themselves', body: 'Members join and leave as your HR system changes. No more ex-employees in the group.' },
  { id: 'tasks', label: 'Tasks', title: 'Checklists with proof', body: 'Assign a routine to every store and watch completion climb in real time.' },
  { id: 'people', label: 'People', title: 'Everyone, one tap away', body: 'Profiles, skills and shift status for every colleague, synced from your directory.' },
] as const

export const testimonial = {
  quote: 'We went from a laminated notice by the time clock to 92% of our warehouse reading the weekly update by Tuesday. People feel like they work for one company now.',
  name: 'Amara Okafor',
  role: 'Head of Operations, Nordhavn Logistics',
  face: 5,
}

export const integrationsTeaser = {
  title: 'Plugs into the tools you already run',
  body: 'Branchwork syncs people from your HR system, signs them in with your identity provider and sends shifts from your scheduling tool. Set up in an afternoon.',
}

export const homeCta = {
  title: 'See Branchwork with your own org chart',
  body: 'A 30-minute walkthrough with a product specialist. Bring your questions; we bring a demo app in your colours.',
}

/* ---------- Product ---------- */

export type Dept = 'Leadership' | 'Operations' | 'People' | 'Engineering' | 'Finance' | 'Support'
export type Presence = 'online' | 'away' | 'on-shift' | 'off'

export type Person = {
  id: string
  name: string
  role: string
  dept: Dept
  location: string
  managerId: string | null
  face: number
  presence: Presence
  since: string
  skills: string[]
  pronouns?: string
}

export const departments: Dept[] = ['Leadership', 'Operations', 'People', 'Engineering', 'Finance', 'Support']
export const locations = ['Lisbon', 'Berlin', 'Oslo', 'Austin', 'Remote']

export const people: Person[] = [
  { id: 'maren', name: 'Maren Holt', role: 'Chief Executive', dept: 'Leadership', location: 'Oslo', managerId: null, face: 10, presence: 'online', since: '2017', skills: ['Strategy', 'Board relations'], pronouns: 'she/her' },
  { id: 'theo', name: 'Theo Lindqvist', role: 'Chief Operating Officer', dept: 'Leadership', location: 'Oslo', managerId: 'maren', face: 4, presence: 'away', since: '2018', skills: ['Operations', 'Lean'] },
  { id: 'hana', name: 'Hana Sato', role: 'Chief People Officer', dept: 'People', location: 'Berlin', managerId: 'maren', face: 7, presence: 'online', since: '2019', skills: ['Culture', 'Org design'], pronouns: 'she/her' },
  { id: 'sam', name: 'Sam Carter', role: 'Chief Technology Officer', dept: 'Engineering', location: 'Austin', managerId: 'maren', face: 2, presence: 'online', since: '2018', skills: ['Platform', 'Security'] },
  { id: 'ruth', name: 'Ruth Mbeki', role: 'Chief Financial Officer', dept: 'Finance', location: 'Lisbon', managerId: 'maren', face: 15, presence: 'off', since: '2020', skills: ['Planning', 'Audit'] },
  { id: 'amara', name: 'Amara Okafor', role: 'Head of Operations', dept: 'Operations', location: 'Lisbon', managerId: 'theo', face: 5, presence: 'on-shift', since: '2019', skills: ['Logistics', 'Safety'], pronouns: 'she/her' },
  { id: 'diego', name: 'Diego Ramos', role: 'Warehouse Shift Lead', dept: 'Operations', location: 'Lisbon', managerId: 'amara', face: 6, presence: 'on-shift', since: '2021', skills: ['Forklift', 'Rota planning'] },
  { id: 'priya', name: 'Priya Nair', role: 'Store Manager', dept: 'Operations', location: 'Berlin', managerId: 'amara', face: 3, presence: 'on-shift', since: '2020', skills: ['Retail', 'Coaching'] },
  { id: 'mateo', name: 'Mateo Silva', role: 'Support Lead', dept: 'Support', location: 'Remote', managerId: 'theo', face: 14, presence: 'online', since: '2022', skills: ['Zendesk', 'Portuguese'] },
  { id: 'jonas', name: 'Arjun Mehta', role: 'People Partner', dept: 'People', location: 'Berlin', managerId: 'hana', face: 9, presence: 'online', since: '2021', skills: ['Employee relations', 'Hindi'] },
  { id: 'lea', name: 'Léa Dubois', role: 'Internal Comms Lead', dept: 'People', location: 'Remote', managerId: 'hana', face: 1, presence: 'away', since: '2022', skills: ['Writing', 'French'] },
  { id: 'nora', name: 'Nora Becker', role: 'Talent Partner', dept: 'People', location: 'Austin', managerId: 'hana', face: 13, presence: 'online', since: '2023', skills: ['Recruiting', 'German'] },
  { id: 'ines', name: 'Inês Moreau', role: 'Engineering Manager', dept: 'Engineering', location: 'Lisbon', managerId: 'sam', face: 8, presence: 'online', since: '2020', skills: ['Mobile', 'Hiring'] },
  { id: 'kofi', name: 'Kofi Mensah', role: 'Senior Engineer', dept: 'Engineering', location: 'Remote', managerId: 'ines', face: 12, presence: 'online', since: '2021', skills: ['React Native', 'Offline sync'] },
  { id: 'yara', name: 'Kenji Ito', role: 'Product Designer', dept: 'Engineering', location: 'Berlin', managerId: 'ines', face: 0, presence: 'away', since: '2023', skills: ['Design systems', 'Japanese'] },
  { id: 'oskar', name: 'Minh Tran', role: 'Finance Analyst', dept: 'Finance', location: 'Oslo', managerId: 'ruth', face: 11, presence: 'off', since: '2024', skills: ['Forecasting', 'Vietnamese'] },
]

export const presenceLabel: Record<Presence, string> = { online: 'Online', away: 'Away', 'on-shift': 'On shift', off: 'Off today' }

export const productPage = {
  eyebrow: 'Product',
  title: 'Everything your people need, in one app',
  body: 'Six modules that share one profile, one feed and one brand. Try each of them below: these are working previews, not screenshots.',
  sections: {
    orgChart: { eyebrow: 'Org chart', title: 'A living map of your company', body: 'Synced nightly from your HR system. Expand a team, search for a name, open a profile. Changes in Workday or Personio show up here by morning.' },
    directory: { eyebrow: 'Team directory', title: 'Find the right person in seconds', body: 'Filter by department or location, search by skill or language, and see who is on shift right now.' },
    news: { eyebrow: 'News feed', title: 'Announcements people actually read', body: 'Write a post, choose who sees it and publish. Reactions and read receipts tell you it landed.' },
    chat: { eyebrow: 'Chat', title: 'Groups for every team and shift', body: 'Send a message to the Lisbon floor. Replies arrive as they would in the app.' },
    tasks: { eyebrow: 'Tasks and shifts', title: 'Checklists that close the loop', body: 'Tick off the opening routine and watch the store completion rate move. Swap a shift with one tap.' },
    surveys: { eyebrow: 'Pulse surveys', title: 'Hear from everyone in a tap', body: 'Answer this week’s pulse question and see results update for the whole company.' },
  },
  security: [
    { icon: 'shield' as IconName, title: 'SOC 2 Type II and ISO 27001', body: 'Audited every year. Data hosted in the EU or US, your choice.' },
    { icon: 'globe' as IconName, title: 'SSO and SCIM', body: 'Okta, Entra ID and Google Workspace sign-in, with automatic provisioning.' },
    { icon: 'phone' as IconName, title: 'Your own app', body: 'Published under your name in the App Store and Google Play.' },
  ],
}

export type FeedPost = { id: string; authorId: string; audience: string; time: string; body: string; reactions: number; reads: number; reached: number; mine?: boolean }

export const audiences = ['Everyone', 'Operations', 'Lisbon warehouse', 'Berlin store', 'People team']

export const seedPosts: FeedPost[] = [
  { id: 'p1', authorId: 'lea', audience: 'Everyone', time: '2 h', body: 'Summer party is on Friday 27 June at the Lisbon site. Shuttle buses leave Berlin and Oslo offices at 15:00. Bring your family!', reactions: 148, reads: 1932, reached: 2140 },
  { id: 'p2', authorId: 'amara', audience: 'Lisbon warehouse', time: 'Yesterday', body: 'New loading-bay rota starts Monday. Check your shifts tab and swap by Sunday night if you need to.', reactions: 41, reads: 266, reached: 288 },
]

export type ChatMessage = { id: string; authorId: string | 'me'; body: string; time: string }

export const chatChannels = [
  { id: 'lisbon', name: 'Lisbon floor', members: 42 },
  { id: 'leads', name: 'Shift leads', members: 9 },
  { id: 'social', name: 'Lunch club', members: 118 },
]

export const seedChat: Record<string, ChatMessage[]> = {
  lisbon: [
    { id: 'c1', authorId: 'diego', body: 'Truck from Porto is 20 minutes late. Bay 3 stays open.', time: '06:42' },
    { id: 'c2', authorId: 'amara', body: 'Thanks Diego. Breakfast is in the canteen for the early crew.', time: '06:45' },
  ],
  leads: [{ id: 'c3', authorId: 'priya', body: 'Can someone cover Saturday close in Berlin?', time: '09:10' }],
  social: [{ id: 'c4', authorId: 'kofi', body: 'Ramen place on Rua Augusta at 12:30, who is in?', time: '11:58' }],
}

export const chatReplies = [
  { authorId: 'diego', body: 'Got it, thanks!' },
  { authorId: 'amara', body: 'Perfect, I will share it at the 7am huddle.' },
  { authorId: 'priya', body: 'Noted for Berlin too.' },
]

export type Task = { id: string; title: string; done: boolean }

export const seedTasks: Task[] = [
  { id: 't1', title: 'Unlock doors and disarm alarm', done: true },
  { id: 't2', title: 'Check cold room temperature', done: true },
  { id: 't3', title: 'Count the till float', done: false },
  { id: 't4', title: 'Photograph promo display', done: false },
  { id: 't5', title: 'Read today’s briefing to the team', done: false },
]

export const shifts = [
  { id: 's1', day: 'Mon 16', time: '06:00–14:00', site: 'Lisbon warehouse', swappable: false },
  { id: 's2', day: 'Wed 18', time: '14:00–22:00', site: 'Lisbon warehouse', swappable: true },
  { id: 's3', day: 'Sat 21', time: '08:00–16:00', site: 'Lisbon warehouse', swappable: true },
]

export const pulse = {
  question: 'How supported did you feel by your manager this week?',
  options: [
    { id: 'a', label: 'Very', votes: 412 },
    { id: 'b', label: 'Mostly', votes: 538 },
    { id: 'c', label: 'A little', votes: 131 },
    { id: 'd', label: 'Not at all', votes: 37 },
  ],
}

/* ---------- Why us ---------- */

export const whyUs = {
  eyebrow: 'Why Branchwork',
  title: 'An intranet nobody opens is an expensive notice board',
  body: 'Teams switch to Branchwork from a mix of email lists, group chats on private phones and an intranet built for the head office. Here is what changes.',
  reasons: [
    { stat: '81%', title: 'Weekly active, not just installed', body: 'Median weekly active rate across customers after six months, including frontline staff with no company email.' },
    { stat: '4 h', title: 'Saved per manager each week', body: 'Fewer repeat questions, no printed rotas and no chasing who has read the safety update.' },
    { stat: '−23%', title: 'Lower first-year turnover', body: 'New starters who use the onboarding journeys stay longer. Measured across 40 retail and logistics customers.' },
  ],
  compare: {
    columns: ['Branchwork', 'Classic intranet', 'Email and group chats'],
    rows: [
      { label: 'Reaches staff without company email', values: [true, false, 'partial'] },
      { label: 'Read receipts and reach analytics', values: [true, 'partial', false] },
      { label: 'Org chart synced from HR', values: [true, true, false] },
      { label: 'Shifts, swaps and tasks', values: [true, false, false] },
      { label: 'Automatic translation', values: [true, false, false] },
      { label: 'Leavers lose access automatically', values: [true, true, false] },
      { label: 'Your brand in the app stores', values: [true, false, false] },
    ] as { label: string; values: (boolean | 'partial')[] }[],
  },
  roi: {
    title: 'What would it save you?',
    body: 'Move the sliders to match your company. The estimate uses averages from customers of a similar size.',
  },
}

/* ---------- Customers ---------- */

export type Industry = 'Logistics' | 'Healthcare' | 'Hospitality' | 'Retail'

export type CaseStudy = {
  slug: string
  company: string
  industry: Industry
  size: string
  region: string
  image: keyof typeof images
  imageAlt: string
  headline: string
  summary: string
  metrics: { value: string; label: string }[]
  challenge: string
  solution: string
  results: string
  quote: { text: string; personId: string; role: string }
  modules: string[]
}

export const industries: Industry[] = ['Logistics', 'Healthcare', 'Hospitality', 'Retail']

export const cases: CaseStudy[] = [
  {
    slug: 'nordhavn-logistics',
    company: 'Nordhavn Logistics',
    industry: 'Logistics',
    size: '2,300 employees',
    region: 'Portugal and Spain',
    image: 'caseLogistics',
    imageAlt: 'Three warehouse colleagues in hi-vis vests smile at a phone',
    headline: 'From a notice by the time clock to 92% reach by Tuesday',
    summary: 'Six warehouses, three languages and almost nobody with a company email. Nordhavn replaced printed notices with one feed.',
    metrics: [
      { value: '92%', label: 'read the weekly update' },
      { value: '-31%', label: 'shift no-shows' },
      { value: '6 weeks', label: 'from contract to launch' },
    ],
    challenge: 'Updates were printed and pinned next to the time clock. Night shifts heard about changes days late, if at all, and shift swaps happened in private group chats managers could not see.',
    solution: 'Nordhavn launched Branchwork as "Nordhavn Crew", synced from Personio with sign-in by employee number. Shift leads post in Portuguese; the app translates for Spanish and Ukrainian colleagues.',
    results: 'Within two months 92% of staff read the weekly update by Tuesday. Swap requests moved into the app, and no-shows dropped by almost a third.',
    quote: { text: 'People feel like they work for one company now, not six separate warehouses.', personId: 'amara', role: 'Head of Operations' },
    modules: ['News feed', 'Chat', 'Shifts and swaps'],
  },
  {
    slug: 'linden-care',
    company: 'Linden Care Group',
    industry: 'Healthcare',
    size: '5,800 employees',
    region: 'Germany',
    image: 'caseCare',
    imageAlt: 'Two nurses check a tablet together at a ward station',
    headline: 'Safety updates acknowledged in hours, not weeks',
    summary: 'Linden runs 41 care homes. Compliance needed proof that every nurse read every protocol change.',
    metrics: [
      { value: '98%', label: 'protocol acknowledgement' },
      { value: '4 h', label: 'median time to read' },
      { value: '41', label: 'homes on one feed' },
    ],
    challenge: 'Protocol changes went out by email to home managers, who printed them for a sign-off sheet. Audits meant chasing paper across 41 sites.',
    solution: 'Mandatory posts with a one-tap acknowledgement now go straight to every nurse and carer. Home managers see who is missing and nudge them from the same screen.',
    results: 'Acknowledgement reached 98% with a median read time of four hours, and the last audit took one afternoon instead of three weeks.',
    quote: { text: 'Our auditors asked for the export and we sent it the same day.', personId: 'jonas', role: 'People Partner' },
    modules: ['News feed', 'Pulse surveys', 'Team directory'],
  },
  {
    slug: 'halvard-hotels',
    company: 'Halvard Hotels',
    industry: 'Hospitality',
    size: '1,100 employees',
    region: 'Norway',
    image: 'caseHospitality',
    imageAlt: 'Hotel staff in dark uniforms talk together in a bright lobby',
    headline: 'A morning briefing that reaches the late shift too',
    summary: 'Twelve hotels with seasonal staff who join and leave every few months. Onboarding had to work from day one.',
    metrics: [
      { value: '-23%', label: 'first-year turnover' },
      { value: '3 days', label: 'faster onboarding' },
      { value: '4.8', label: 'staff app rating' },
    ],
    challenge: 'Seasonal staff got a binder on day one and a group chat invite on day three. Many left before they knew who to ask.',
    solution: 'New starters get the app before their first shift, with an onboarding journey, their team in the org chart and the daily briefing in their language.',
    results: 'First-year turnover fell by almost a quarter and new starters were ready to work the floor three days sooner.',
    quote: { text: 'New colleagues know their manager’s face before they walk in the door.', personId: 'hana', role: 'Chief People Officer' },
    modules: ['Org chart', 'News feed', 'Tasks and checklists'],
  },
  {
    slug: 'fieldmark-retail',
    company: 'Fieldmark',
    industry: 'Retail',
    size: '3,400 employees',
    region: 'Germany and Austria',
    image: 'caseRetail',
    imageAlt: 'A retail employee smiles while reading a message on a phone between shelves',
    headline: 'Every store opens the same way, and head office can see it',
    summary: 'Fieldmark rolls out a new promo every week to 180 stores. Now each one comes with a checklist and photo proof.',
    metrics: [
      { value: '180', label: 'stores on one checklist' },
      { value: '96%', label: 'promo on time' },
      { value: '-60%', label: 'calls to head office' },
    ],
    challenge: 'Promo instructions went out as PDFs. Area managers drove between stores to check displays and still found half of them late.',
    solution: 'Each promo is now a Branchwork task with steps and a photo upload. Area managers review photos from the app and comment in the thread.',
    results: 'On-time promos rose to 96% and calls to head office dropped by 60% because the answer is already in the task.',
    quote: { text: 'I can see every store’s display before lunch without leaving Berlin.', personId: 'priya', role: 'Store Manager' },
    modules: ['Tasks and checklists', 'Chat', 'News feed'],
  },
]

/* ---------- Integrations ---------- */

export type IntegrationCategory = 'HR and payroll' | 'Identity' | 'Scheduling' | 'Productivity' | 'Communication' | 'Data and automation'

export type Integration = {
  id: string
  name: string
  category: IntegrationCategory
  description: string
  color: string
  popular?: boolean
  syncs: string[]
}

export const integrationCategories: IntegrationCategory[] = ['HR and payroll', 'Identity', 'Scheduling', 'Productivity', 'Communication', 'Data and automation']

export const integrations: Integration[] = [
  { id: 'workday', name: 'Workday', category: 'HR and payroll', description: 'Sync people, teams, managers and locations every night.', color: '#f4b740', popular: true, syncs: ['People', 'Org chart', 'Locations'] },
  { id: 'personio', name: 'Personio', category: 'HR and payroll', description: 'Employees, departments and absences flow straight into profiles.', color: '#111111', popular: true, syncs: ['People', 'Absences'] },
  { id: 'bamboohr', name: 'BambooHR', category: 'HR and payroll', description: 'Keep the directory and org chart in step with your HR records.', color: '#73c41d', syncs: ['People', 'Org chart'] },
  { id: 'hibob', name: 'HiBob', category: 'HR and payroll', description: 'Sites, teams and work anniversaries for celebration posts.', color: '#e8417b', syncs: ['People', 'Milestones'] },
  { id: 'successfactors', name: 'SAP SuccessFactors', category: 'HR and payroll', description: 'Enterprise HR sync with custom field mapping.', color: '#1f62b0', syncs: ['People', 'Org chart', 'Custom fields'] },
  { id: 'okta', name: 'Okta', category: 'Identity', description: 'Single sign-on and SCIM provisioning for desk staff.', color: '#1662dd', popular: true, syncs: ['SSO', 'SCIM'] },
  { id: 'entra', name: 'Microsoft Entra ID', category: 'Identity', description: 'Sign in with Microsoft and provision groups automatically.', color: '#0f6cbd', popular: true, syncs: ['SSO', 'Groups'] },
  { id: 'google', name: 'Google Workspace', category: 'Identity', description: 'Google sign-in and directory sync for every domain.', color: '#34a853', syncs: ['SSO', 'Directory'] },
  { id: 'deputy', name: 'Deputy', category: 'Scheduling', description: 'Shifts, swaps and open shifts in the Branchwork shifts tab.', color: '#5a43d6', popular: true, syncs: ['Shifts', 'Swaps'] },
  { id: 'wheniwork', name: 'When I Work', category: 'Scheduling', description: 'Rotas and time-off requests for hourly teams.', color: '#2fa36b', syncs: ['Shifts', 'Time off'] },
  { id: 'quinyx', name: 'Quinyx', category: 'Scheduling', description: 'Workforce management schedules for retail and hospitality.', color: '#ff6b4a', syncs: ['Shifts'] },
  { id: 'sharepoint', name: 'SharePoint', category: 'Productivity', description: 'Surface policies and documents in search and posts.', color: '#026a6e', syncs: ['Documents', 'Search'] },
  { id: 'drive', name: 'Google Drive', category: 'Productivity', description: 'Attach and preview Drive files with live permissions.', color: '#f9ab00', syncs: ['Documents'] },
  { id: 'notion', name: 'Notion', category: 'Productivity', description: 'Link handbooks and wikis into onboarding journeys.', color: '#2f2f2f', syncs: ['Pages'] },
  { id: 'jira', name: 'Jira', category: 'Productivity', description: 'Turn a facility report into a ticket in one tap.', color: '#1868db', syncs: ['Tickets'] },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Cross-post announcements to channels for desk teams.', color: '#611f69', popular: true, syncs: ['Announcements'] },
  { id: 'teams', name: 'Microsoft Teams', category: 'Communication', description: 'Branchwork news and people search inside Teams.', color: '#4b53bc', syncs: ['Announcements', 'Search'] },
  { id: 'zoom', name: 'Zoom', category: 'Communication', description: 'Stream town halls into the feed with replays.', color: '#0b5cff', syncs: ['Events'] },
  { id: 'zapier', name: 'Zapier', category: 'Data and automation', description: 'Trigger posts and tasks from 6,000 other apps.', color: '#ff4f00', syncs: ['Triggers', 'Actions'] },
  { id: 'powerbi', name: 'Power BI', category: 'Data and automation', description: 'Reach, reads and survey results in your own reports.', color: '#d6a400', syncs: ['Analytics'] },
  { id: 'webhooks', name: 'Webhooks', category: 'Data and automation', description: 'Signed events for posts, reads, tasks and people changes.', color: '#3a3a3a', syncs: ['Events'] },
  { id: 'api', name: 'REST API', category: 'Data and automation', description: 'Read and write everything the app can, with scoped keys.', color: '#1f7a2a', syncs: ['Everything'] },
]

/* ---------- Pricing ---------- */

export type Plan = {
  id: string
  name: string
  blurb: string
  monthly: number | null
  minSeats: number
  features: string[]
  cta: string
  featured?: boolean
}

export const plans: Plan[] = [
  {
    id: 'essentials',
    name: 'Essentials',
    blurb: 'News, chat and people for growing teams.',
    monthly: 3,
    minSeats: 25,
    features: ['News feed with read receipts', 'Chat and groups', 'Org chart and directory', 'HR sync for one system', 'Email support'],
    cta: 'Book a demo',
  },
  {
    id: 'growth',
    name: 'Growth',
    blurb: 'Everything frontline teams need to run the day.',
    monthly: 5,
    minSeats: 100,
    features: ['Everything in Essentials', 'Tasks, checklists and shifts', 'Pulse surveys', 'Automatic translation', 'SSO and SCIM', 'Priority support'],
    cta: 'Book a demo',
    featured: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    blurb: 'Your own branded app, at any scale.',
    monthly: null,
    minSeats: 1000,
    features: ['Everything in Growth', 'Branded app in the stores', 'EU or US data residency', 'Custom integrations', 'Dedicated success manager', '99.95% uptime SLA'],
    cta: 'Talk to sales',
  },
]

export const pricingFaq = [
  { q: 'Who counts as a user?', a: 'Anyone who can sign in during the month. People who leave are removed by your HR sync, so you never pay for them.' },
  { q: 'Is there a free trial?', a: 'Yes. After your demo we set up a 30-day pilot with your real org chart for up to 200 people, at no cost.' },
  { q: 'Can frontline staff use it without an email address?', a: 'Yes. They sign in with an employee number and a one-time code from their manager, or a QR code at the site.' },
  { q: 'How long does a rollout take?', a: 'Most customers launch in four to six weeks. The HR sync takes an afternoon; the rest is content and a launch plan we help you write.' },
  { q: 'Do you offer discounts for nonprofits?', a: 'Registered nonprofits and schools get 40% off any plan. Mention it when you book a demo.' },
]

export const compareRows: { label: string; values: (boolean | string)[] }[] = [
  { label: 'News feed and read receipts', values: [true, true, true] },
  { label: 'Chat and groups', values: [true, true, true] },
  { label: 'Org chart and directory', values: [true, true, true] },
  { label: 'HR system sync', values: ['1 system', 'Unlimited', 'Unlimited'] },
  { label: 'Tasks and shifts', values: [false, true, true] },
  { label: 'Pulse surveys', values: [false, true, true] },
  { label: 'Automatic translation', values: [false, true, true] },
  { label: 'SSO and SCIM', values: [false, true, true] },
  { label: 'Branded app in the stores', values: [false, false, true] },
  { label: 'Data residency', values: ['EU', 'EU', 'EU or US'] },
  { label: 'Support', values: ['Email', 'Priority', 'Dedicated'] },
]

/* ---------- About ---------- */

export const about = {
  eyebrow: 'About us',
  title: 'We build for the people who keep the lights on',
  body: 'Branchwork started in 2017 in a Lisbon warehouse, where our founders watched a shift lead read the week’s news off a crumpled printout. Today 380 companies use it to reach 1.2 million people.',
  imageAlt: 'The Branchwork team laughing around a long table in a bright office',
  numbers: [
    { value: '380', label: 'customers' },
    { value: '1.2M', label: 'people reached' },
    { value: '40', label: 'languages' },
    { value: '96', label: 'Branchworkers' },
  ],
  values: [
    { title: 'Floor first', body: 'If it does not work for someone on a 12-hour shift with gloves on, it does not ship.' },
    { title: 'Calm by default', body: 'Fewer notifications that matter more. We measure reads, not minutes in the app.' },
    { title: 'Everyone in the room', body: 'Every feature ships in every language on day one.' },
  ],
  timeline: [
    { year: '2017', text: 'First version built for one Lisbon warehouse.' },
    { year: '2019', text: 'Org chart, directory and HR sync. 50 customers.' },
    { year: '2022', text: 'Branded apps in the stores and automatic translation.' },
    { year: '2025', text: 'Tasks, shifts and pulse surveys. 1 million people reached.' },
  ],
  leadership: ['maren', 'theo', 'hana', 'sam'],
  roles: [
    { title: 'Senior Mobile Engineer', team: 'Engineering', place: 'Lisbon or remote (EU)' },
    { title: 'Customer Success Manager, DACH', team: 'Customer success', place: 'Berlin' },
    { title: 'Product Designer, Frontline', team: 'Design', place: 'Remote (EU)' },
    { title: 'Account Executive', team: 'Sales', place: 'Austin' },
  ],
  jobsEmail: 'jobs@branchwork.app',
}

/* ---------- Demo ---------- */

export const demo = {
  eyebrow: 'Book a demo',
  title: 'See it with your own org chart',
  body: 'Thirty minutes with a product specialist. We show the app in your colours, answer security questions and plan a free pilot.',
  expect: [
    'A walkthrough of the modules your teams need',
    'A demo app with your logo and colours',
    'Pricing for your headcount, in writing',
    'A pilot plan for up to 200 people',
  ],
  sizes: ['25–99', '100–499', '500–1,999', '2,000–9,999', '10,000+'],
  roles: ['HR or People', 'Internal comms', 'Operations', 'IT', 'Leadership', 'Other'],
  interests: ['News feed', 'Chat', 'Org chart and directory', 'Tasks and shifts', 'Pulse surveys', 'Branded app'],
  slots: ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00'],
  timezone: 'Central European Time',
}

/* ---------- Footer ---------- */

export const footer = {
  blurb: 'The employee app for news, chat, shifts and people. Made in Lisbon, Berlin and Austin.',
  columns: [
    { title: 'Product', links: [{ label: 'Org chart', href: '/product#org-chart' }, { label: 'Directory', href: '/product#directory' }, { label: 'News feed', href: '/product#news' }, { label: 'Tasks and shifts', href: '/product#tasks' }, { label: 'Integrations', href: '/integrations' }] },
    { title: 'Company', links: [{ label: 'Why us', href: '/why-us' }, { label: 'Customers', href: '/customers' }, { label: 'About us', href: '/about' }, { label: 'Pricing', href: '/pricing' }, { label: 'Book a demo', href: '/demo' }] },
    { title: 'Resources', links: [{ label: 'Cookie policy', href: '/cookies' }, { label: 'Style guide', href: '/styleguide' }, { label: 'Contact', href: 'mailto:hello@branchwork.app' }] },
  ],
  newsletter: { title: 'The Frontline Letter', body: 'One email a month on reaching every employee. No spam.' },
  legal: '© 2026 Branchwork. A template: replace with your own company details.',
}
