/*
  Every string, price and piece of seed data in Coursekit lives here. Edit
  this file to make the template yours; components only lay it out.
*/

export const brand = {
  name: 'Coursekit',
  domain: 'coursekit.app',
  tagline: 'The course platform for creators and teams',
  description: 'Coursekit is the all-in-one platform to build, sell and run online courses: a drag-and-drop course builder, live quizzes, community spaces, a branded storefront and revenue analytics.',
}

/*
  Images. Every photograph in the template is routed through this object.
  They are generated placeholders: swap in your own photography by replacing
  the files in public/images/ or pointing these paths elsewhere.
*/
export const images = {
  avatars: ['/images/avatar-1.webp', '/images/avatar-2.webp', '/images/avatar-3.webp', '/images/avatar-4.webp', '/images/avatar-5.webp'],
  covers: {
    design: '/images/cover-design.webp',
    ceramics: '/images/cover-ceramics.webp',
    photo: '/images/cover-photo.webp',
    code: '/images/cover-code.webp',
    baking: '/images/cover-baking.webp',
  },
  creatorStudio: '/images/creator-studio.webp',
  teamWorkshop: '/images/team-workshop.webp',
} as const

export type CoverKey = keyof typeof images.covers

export const people = [
  { name: 'Amara Osei', role: 'Founder, Studio Fernhill', src: images.avatars[0] },
  { name: 'Tomas Lindqvist', role: 'Head of Enablement, Northbeam', src: images.avatars[1] },
  { name: 'Mei Tanaka', role: 'Illustrator and course creator', src: images.avatars[2] },
  { name: 'Ravi Desai', role: 'Data coach, 14k learners', src: images.avatars[3] },
  { name: 'Helen Marsh', role: 'L&D Director, Calder Health', src: images.avatars[4] },
] as const

export type NavItem = { label: string; href: string; children?: readonly { label: string; href: string; description: string }[] }

export const featureLinks = [
  { label: 'Course builder', href: '/builder', description: 'Drag lessons into shape, add quizzes and drip schedules.' },
  { label: 'Analytics', href: '/analytics', description: 'Revenue, completion and where learners drop off.' },
  { label: 'Storefront', href: '/storefront', description: 'A branded shop for your courses, with checkout.' },
  { label: 'Integrations', href: '/integrations', description: 'Connect payments, email, video and your CRM.' },
] as const

export const nav: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/builder', children: featureLinks },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
]

export const hero = {
  badge: { tag: 'New', text: 'Live cohort quizzes', href: '/builder#quizzes' },
  titleLight: 'Build and Sell',
  titleStrong: 'Courses That Stick',
  lead: 'Coursekit gives creators and companies one place to build courses, run live quizzes and community, sell from a branded storefront and see what is working.',
  primary: { label: 'Get Started', href: '/signup' },
  secondary: { label: 'Learn More', href: '#features' },
  rating: { value: '4.9', reviews: '10k+ reviews' },
}

export type Level = 'Beginner' | 'Expert'

export const heroCourses = [
  { id: 'brand', name: 'Brand Identity Basics', icon: 'pen', done: 12, total: 15, level: 'Beginner' as Level, category: 'Design' },
  { id: 'python', name: 'Python for Analysts', icon: 'code', done: 8, total: 12, level: 'Expert' as Level, category: 'Code' },
  { id: 'ceramics', name: 'Wheel-Thrown Ceramics', icon: 'cup', done: 5, total: 10, level: 'Expert' as Level, category: 'Craft' },
  { id: 'photo', name: 'Product Photography', icon: 'camera', done: 3, total: 8, level: 'Beginner' as Level, category: 'Media' },
  { id: 'sourdough', name: 'Sourdough at Home', icon: 'wheat', done: 3, total: 15, level: 'Beginner' as Level, category: 'Food' },
] as const

export const heroQuiz = {
  title: 'Quiz code',
  heading: 'Join a Live Quiz',
  body: 'Enter the code your instructor shared to join the session.',
  hint: 'Try the demo code 7Q4K2M',
  cta: 'Join the quiz',
}

export const heroActivity = {
  active: '4 learners active now',
  score: { got: 15, of: 20, label: 'code quiz' },
  medals: ['60 points', '#21 rank', 'Gold medal'],
  lessons: [
    { title: 'Color Systems', meta: ['10 lessons', '10 minutes'] },
    { title: 'Type Pairing', meta: ['6 lessons', '5 minutes'] },
  ],
}

export const trusted = {
  label: 'Trusted by course businesses of every size',
  logos: ['Fernhill', 'northbeam', 'Calder Health', 'kilnworks', 'Brightpath', 'loop&co'] as const,
}

export const experience = {
  title: 'Run Your Course Business Like Never Before',
  lead: 'Build, sell, teach and grow from one calm workspace, so you spend your time on the teaching, not on the tools.',
  dashboard: {
    greeting: 'Hey, Amara',
    sub: 'Here is how your school did this week',
    stats: [
      { label: 'Revenue', value: '$18,420', delta: '+12.4%' },
      { label: 'New learners', value: '642', delta: '+8.1%' },
      { label: 'Completion', value: '71%', delta: '+3.0%' },
    ],
    spark: [12, 14, 13, 17, 16, 19, 22, 21, 25, 27, 26, 31],
  },
  cards: [
    { icon: 'trend', title: 'Revenue that compounds', body: 'Bundles, payment plans, upsells and coupons built into every checkout.' },
    { icon: 'award', title: 'Certificates they share', body: 'Branded certificates issued the moment a learner finishes, with a public link.' },
  ],
}

export const features = {
  eyebrow: 'Features',
  title: 'Smart Features for Better Courses',
  lead: 'Everything your learners touch, and everything you need behind it.',
  items: [
    { key: 'builder', title: 'Drag-and-drop builder', body: 'Lay out modules and lessons, drop in video, text, quizzes and assignments, and reorder in seconds.', href: '/builder' },
    { key: 'quizzes', title: 'Interactive quizzes', body: 'Live quizzes with join codes, points and leaderboards that keep cohorts showing up.', href: '/builder#quizzes' },
    { key: 'community', title: 'Strength in community', body: 'Groups for every course and cohort, so learners share work and help each other.', href: '/storefront' },
    { key: 'analytics', title: 'Insights you can act on', body: 'See revenue, completion and the exact lesson where learners stall.', href: '/analytics' },
  ],
  groups: [
    { name: 'Brand Designers', members: '48 members', tone: 'ink' },
    { name: 'Python Study Hall', members: '54 members', tone: 'azure' },
    { name: 'Weekend Potters', members: '40 members', tone: 'flame' },
  ],
}

export const steps = {
  eyebrow: 'How it works',
  title: 'From First Lesson to First Sale',
  items: [
    { n: 'Step 1', title: 'Build your course', body: 'Start from an outline or import your videos. Drag lessons into order and add quizzes as you go.' },
    { n: 'Step 2', title: 'Price and publish', body: 'Set a one-off price, a payment plan or a membership. Your storefront updates the moment you publish.' },
    { n: 'Step 3', title: 'Grow a community', body: 'Open groups for each cohort, run live quizzes and send learners nudges when they slow down.' },
  ],
}

export const testimonials = [
  { quote: 'We moved four cohort programs onto Coursekit in a weekend. Completion went from 38% to 71% once learners had groups and live quizzes.', person: 0, rating: 5 },
  { quote: 'The analytics showed us that one lesson was losing a third of our learners. We re-shot it and revenue per cohort went up 22%.', person: 1, rating: 5 },
  { quote: 'I sell illustration courses to 9,000 students and I never touch a spreadsheet. The storefront just works.', person: 2, rating: 5 },
  { quote: 'Payment plans alone paid for the Pro plan in the first month. My checkout conversion nearly doubled.', person: 3, rating: 5 },
  { quote: 'Compliance training used to be a slideshow nobody finished. Now our teams actually ask for the next module.', person: 4, rating: 5 },
] as const

export const stats = [
  { value: '4,200+', label: 'course businesses' },
  { value: '$310M', label: 'earned by creators' },
  { value: '2.8M', label: 'active learners' },
  { value: '0%', label: 'fees on Pro and up' },
]

export const cta = {
  title: 'Your next course could be live by Friday',
  lead: 'Start free with no card. Bring your videos, we will handle the rest.',
  primary: { label: 'Start building free', href: '/signup' },
  secondary: { label: 'Book a demo', href: '/contact' },
}

export const footer = {
  blurb: 'The course platform for creators and teams who teach for a living.',
  columns: [
    { title: 'Product', links: [{ label: 'Course builder', href: '/builder' }, { label: 'Analytics', href: '/analytics' }, { label: 'Storefront', href: '/storefront' }, { label: 'Integrations', href: '/integrations' }] },
    { title: 'Company', links: [{ label: 'Pricing', href: '/pricing' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/contact' }, { label: 'Start free', href: '/signup' }] },
    { title: 'Resources', links: [{ label: 'Style guide', href: '/styleguide' }, { label: 'Pricing FAQ', href: '/pricing#faq' }, { label: 'Fee calculator', href: '/pricing#calculator' }, { label: 'Request an integration', href: '/integrations#request' }] },
  ],
  newsletter: { title: 'The Creator Notes newsletter', body: 'One practical idea for course businesses, every other Tuesday.' },
  legal: '© 2026 Coursekit. A starter template; replace with your own company details.',
}

/* ---------- Course builder ---------- */

export type LessonType = 'video' | 'text' | 'quiz' | 'assignment'
export type Lesson = { id: string; title: string; type: LessonType; minutes: number; free: boolean; body: string }
export type Module = { id: string; title: string; lessons: Lesson[] }
export type Course = { title: string; subtitle: string; price: number; status: 'draft' | 'published'; publishedAt?: string; modules: Module[] }

export const lessonTypes: readonly { value: LessonType; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'text', label: 'Text' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
]

export const seedCourse: Course = {
  title: 'Brand Identity Basics',
  subtitle: 'Design a logo, palette and type system clients will love',
  price: 149,
  status: 'draft',
  modules: [
    {
      id: 'm1',
      title: 'Foundations',
      lessons: [
        { id: 'l1', title: 'Welcome and how this course works', type: 'video', minutes: 4, free: true, body: 'A quick tour of the course, the project you will build and how to get feedback from the community.' },
        { id: 'l2', title: 'What a brand identity really is', type: 'video', minutes: 12, free: true, body: 'Logos are the tip of it. We look at strategy, voice, colour and type as one system.' },
        { id: 'l3', title: 'Check-in: brand vocabulary', type: 'quiz', minutes: 5, free: false, body: 'Eight quick questions on the terms from this module. Pass mark is 6.' },
      ],
    },
    {
      id: 'm2',
      title: 'Colour and type',
      lessons: [
        { id: 'l4', title: 'Building a colour system', type: 'video', minutes: 18, free: false, body: 'Primary, secondary and neutral ramps, plus how to test them for contrast.' },
        { id: 'l5', title: 'Pairing typefaces', type: 'text', minutes: 9, free: false, body: 'A reading lesson with twelve proven pairings and why they work.' },
        { id: 'l6', title: 'Live quiz: name that pairing', type: 'quiz', minutes: 10, free: false, body: 'Run this one live with your cohort using a join code.' },
      ],
    },
    {
      id: 'm3',
      title: 'Your identity project',
      lessons: [
        { id: 'l7', title: 'Brief and moodboard', type: 'assignment', minutes: 30, free: false, body: 'Pick a fictional client, write a one-page brief and share a moodboard in the group.' },
        { id: 'l8', title: 'Presenting your work', type: 'video', minutes: 14, free: false, body: 'How to walk a client through a brand system without losing the room.' },
      ],
    },
  ],
}

/* ---------- Analytics ---------- */

export const analyticsCourses = [
  { id: 'all', label: 'All courses' },
  { id: 'brand', label: 'Brand Identity Basics' },
  { id: 'python', label: 'Python for Analysts' },
  { id: 'ceramics', label: 'Wheel-Thrown Ceramics' },
  { id: 'kiln', label: 'Kiln Firing 101 (draft)' },
] as const

export type AnalyticsCourseId = (typeof analyticsCourses)[number]['id']

export const topCourses = [
  { id: 'brand', name: 'Brand Identity Basics', cover: 'design' as CoverKey, learners: 3120, revenue: 46480, completion: 74, rating: 4.9 },
  { id: 'python', name: 'Python for Analysts', cover: 'code' as CoverKey, learners: 2480, revenue: 61900, completion: 63, rating: 4.8 },
  { id: 'ceramics', name: 'Wheel-Thrown Ceramics', cover: 'ceramics' as CoverKey, learners: 1290, revenue: 25670, completion: 81, rating: 4.9 },
  { id: 'photo', name: 'Product Photography', cover: 'photo' as CoverKey, learners: 980, revenue: 14600, completion: 58, rating: 4.7 },
  { id: 'sourdough', name: 'Sourdough at Home', cover: 'baking' as CoverKey, learners: 2210, revenue: 19780, completion: 69, rating: 4.8 },
] as const

export const funnel = [
  { label: 'Started lesson 1', value: 100 },
  { label: 'Finished module 1', value: 82 },
  { label: 'Finished module 2', value: 64 },
  { label: 'Submitted project', value: 51 },
  { label: 'Earned certificate', value: 47 },
]

export const recentSales = [
  { who: 'Jonah P.', what: 'Brand Identity Basics', amount: 149, ago: '2 min ago', plan: 'One-off' },
  { who: 'Lucia M.', what: 'Python for Analysts', amount: 99, ago: '18 min ago', plan: '3 payments' },
  { who: 'Calder Health', what: 'Team seats (25)', amount: 2475, ago: '1 h ago', plan: 'Invoice' },
  { who: 'Priya S.', what: 'Wheel-Thrown Ceramics', amount: 199, ago: '3 h ago', plan: 'One-off' },
  { who: 'Ade O.', what: 'Sourdough at Home', amount: 49, ago: '5 h ago', plan: 'Coupon SPRING' },
]

/* ---------- Storefront ---------- */

export const storefrontCourses = [
  { id: 'brand', title: 'Brand Identity Basics', cover: 'design' as CoverKey, price: 149, lessons: 15, hours: 4.5, rating: 4.9, students: 3120, level: 'Beginner' as Level },
  { id: 'ceramics', title: 'Wheel-Thrown Ceramics', cover: 'ceramics' as CoverKey, price: 199, lessons: 10, hours: 6, rating: 4.9, students: 1290, level: 'Expert' as Level },
  { id: 'photo', title: 'Product Photography', cover: 'photo' as CoverKey, price: 89, lessons: 8, hours: 3, rating: 4.7, students: 980, level: 'Beginner' as Level },
  { id: 'code', title: 'Python for Analysts', cover: 'code' as CoverKey, price: 129, lessons: 12, hours: 7.5, rating: 4.8, students: 2480, level: 'Expert' as Level },
  { id: 'baking', title: 'Sourdough at Home', cover: 'baking' as CoverKey, price: 49, lessons: 15, hours: 3.5, rating: 4.8, students: 2210, level: 'Beginner' as Level },
] as const

export type StorefrontCourse = (typeof storefrontCourses)[number]

export const storefrontDefaults = {
  schoolName: 'Studio Fernhill',
  headline: 'Learn to make things people love',
  accent: '#f15a24',
  layout: 'grid' as 'grid' | 'list',
  showReviews: true,
  showInstructor: true,
}

export const accentOptions = [
  { name: 'Flame', hex: '#f15a24', strong: '#d14710' },
  { name: 'Violet', hex: '#7c3aed', strong: '#6d28d9' },
  { name: 'Azure', hex: '#2563eb', strong: '#1d4ed8' },
  { name: 'Forest', hex: '#16a34a', strong: '#15803d' },
  { name: 'Ink', hex: '#27272a', strong: '#18181b' },
] as const

/* ---------- Pricing ---------- */

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    blurb: 'For your first course and first hundred learners.',
    monthly: 0,
    yearly: 0,
    fee: 8,
    cta: 'Start free',
    features: ['1 published course', 'Unlimited learners', 'Quizzes and certificates', 'Coursekit subdomain', '8% transaction fee'],
  },
  {
    id: 'pro',
    name: 'Pro',
    blurb: 'For creators running a real course business.',
    monthly: 59,
    yearly: 49,
    fee: 0,
    cta: 'Start 14-day trial',
    featured: true,
    features: ['Unlimited courses', 'Live quizzes and community', 'Custom domain and branding', 'Payment plans, bundles and coupons', '0% transaction fee'],
  },
  {
    id: 'business',
    name: 'Business',
    blurb: 'For companies training teams and customers.',
    monthly: 199,
    yearly: 166,
    fee: 0,
    cta: 'Book a demo',
    features: ['Everything in Pro', 'Team seats and SSO', 'Learning paths and assignments', 'API, webhooks and SCORM export', 'Priority support and onboarding'],
  },
] as const

export type PlanId = (typeof plans)[number]['id']

export const compare = [
  { group: 'Build', rows: [['Published courses', '1', 'Unlimited', 'Unlimited'], ['Video hosting', '10 hours', 'Unlimited', 'Unlimited'], ['Quizzes and assignments', true, true, true], ['Live quizzes with join codes', false, true, true], ['Drip schedules', false, true, true]] },
  { group: 'Sell', rows: [['Transaction fee', '8%', '0%', '0%'], ['Custom domain', false, true, true], ['Payment plans and bundles', false, true, true], ['Team seats and invoicing', false, false, true]] },
  { group: 'Grow', rows: [['Community groups', '1', 'Unlimited', 'Unlimited'], ['Revenue analytics', 'Basic', 'Full', 'Full + export'], ['SSO and SCIM', false, false, true], ['Support', 'Email', 'Priority email', 'Named manager']] },
] as const

export const pricingFaq = [
  { q: 'Is the Starter plan really free?', a: 'Yes. You can publish one course with unlimited learners and pay nothing until you make a sale; we then take 8% of each sale. Upgrade when the fee costs more than Pro.' },
  { q: 'Who handles payments and tax?', a: 'You connect your own payment account, so money lands with you. Coursekit calculates sales tax and VAT at checkout on every plan.' },
  { q: 'Can I move my courses from another platform?', a: 'Yes. Import videos in bulk, paste an outline and we build the modules. On Business our team migrates learners and progress for you.' },
  { q: 'Do learners need an account?', a: 'They get one at checkout with a magic link, so there is no password to forget. Team seats sign in with your SSO.' },
  { q: 'Can I cancel at any time?', a: 'Yes. Your courses stay online on the Starter plan, and you can export every course, learner and sale as CSV.' },
]

/* ---------- Integrations ---------- */

export const integrationCategories = ['Payments', 'Email', 'Video', 'Community', 'Analytics', 'Automation', 'CRM'] as const
export type IntegrationCategory = (typeof integrationCategories)[number]

export const integrations = [
  { id: 'stripe', name: 'Stripe', category: 'Payments' as IntegrationCategory, color: '#635bff', blurb: 'Take cards, wallets and payment plans with payouts to your account.', popular: true },
  { id: 'paypal', name: 'PayPal', category: 'Payments' as IntegrationCategory, color: '#1f4fa3', blurb: 'Offer PayPal and Pay Later at checkout.' },
  { id: 'mailchimp', name: 'Mailchimp', category: 'Email' as IntegrationCategory, color: '#b8860b', blurb: 'Sync learners to audiences and tag by course and progress.', popular: true },
  { id: 'convertkit', name: 'Kit', category: 'Email' as IntegrationCategory, color: '#e2574c', blurb: 'Trigger sequences when someone enrols, finishes or stalls.' },
  { id: 'vimeo', name: 'Vimeo', category: 'Video' as IntegrationCategory, color: '#1a8fc7', blurb: 'Import a showcase as a course and keep captions in sync.' },
  { id: 'youtube', name: 'YouTube', category: 'Video' as IntegrationCategory, color: '#d22f27', blurb: 'Embed unlisted videos as lessons, with progress tracking.' },
  { id: 'zoom', name: 'Zoom', category: 'Video' as IntegrationCategory, color: '#2d6bd8', blurb: 'Schedule live sessions inside a module; recordings post themselves.', popular: true },
  { id: 'discord', name: 'Discord', category: 'Community' as IntegrationCategory, color: '#5865f2', blurb: 'Give buyers a role in your server automatically.' },
  { id: 'slack', name: 'Slack', category: 'Community' as IntegrationCategory, color: '#4a154b', blurb: 'Post new enrolments and completions to a channel.' },
  { id: 'circle', name: 'Circle', category: 'Community' as IntegrationCategory, color: '#4b5563', blurb: 'Invite learners to a space when they join a cohort.' },
  { id: 'ga4', name: 'Google Analytics', category: 'Analytics' as IntegrationCategory, color: '#e37400', blurb: 'Send storefront and checkout events to your property.' },
  { id: 'meta', name: 'Meta Pixel', category: 'Analytics' as IntegrationCategory, color: '#0866ff', blurb: 'Track purchases from your ads with server-side events.' },
  { id: 'segment', name: 'Segment', category: 'Analytics' as IntegrationCategory, color: '#2e8c6d', blurb: 'Stream every learner event to your warehouse.' },
  { id: 'zapier', name: 'Zapier', category: 'Automation' as IntegrationCategory, color: '#ff4f00', blurb: 'Connect Coursekit to 7,000 apps without code.', popular: true },
  { id: 'make', name: 'Make', category: 'Automation' as IntegrationCategory, color: '#6d00cc', blurb: 'Build multi-step scenarios on enrolments and sales.' },
  { id: 'webhooks', name: 'Webhooks', category: 'Automation' as IntegrationCategory, color: '#27272a', blurb: 'Signed HTTP callbacks for every event. Business plan.' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM' as IntegrationCategory, color: '#ff5c35', blurb: 'Create contacts and deals from team-seat purchases.' },
  { id: 'salesforce', name: 'Salesforce', category: 'CRM' as IntegrationCategory, color: '#0b7cc4', blurb: 'Log course completions against accounts. Business plan.' },
] as const

export type Integration = (typeof integrations)[number]

/* ---------- Blog ---------- */

export const posts = [
  {
    slug: 'price-your-first-course',
    title: 'How to price your first online course',
    excerpt: 'Most first courses are underpriced by half. A simple way to find a number you can defend.',
    cover: 'design' as CoverKey,
    tag: 'Selling',
    date: 'Nov 4, 2026',
    minutes: 6,
    author: 0,
    body: [
      { h: 'Start from the outcome', p: 'Learners do not pay for hours of video; they pay for the thing they can do afterwards. Write that outcome in one sentence, then ask what it is worth to someone who gets it.' },
      { h: 'Anchor with a payment plan', p: 'A $199 course paid in three instalments converts better than a $129 course paid once, and you keep more. Offer both and let the plan do the anchoring.' },
      { h: 'Raise it after your first cohort', p: 'Your first fifty learners are buying a promise. Once you have completion numbers and testimonials, raise the price and let the proof carry it.' },
    ],
  },
  {
    slug: 'completion-rates',
    title: 'Why completion rates matter more than sales',
    excerpt: 'Learners who finish buy again and send their friends. Three changes that lift completion.',
    cover: 'ceramics' as CoverKey,
    tag: 'Teaching',
    date: 'Oct 21, 2026',
    minutes: 5,
    author: 1,
    body: [
      { h: 'Find the lesson that stalls', p: 'In almost every course one lesson loses more learners than any other. The completion funnel in Analytics shows it; re-record or split that lesson first.' },
      { h: 'Make progress social', p: 'Learners in a cohort group finish at nearly twice the rate of solo learners. Open a group per cohort and post a weekly prompt.' },
      { h: 'Use live quizzes as checkpoints', p: 'A ten-minute live quiz at the end of each module gives people a date to show up for, and the leaderboard does the rest.' },
    ],
  },
  {
    slug: 'courses-for-teams',
    title: 'Selling your course to companies',
    excerpt: 'Team seats can double a creator business. What buyers in L&D actually ask for.',
    cover: 'code' as CoverKey,
    tag: 'Business',
    date: 'Oct 8, 2026',
    minutes: 7,
    author: 4,
    body: [
      { h: 'Package seats, not licences', p: 'Buyers want a number of seats, an invoice and a report. Team seats in Coursekit give them all three without you writing a contract.' },
      { h: 'Report on progress, not logins', p: 'Managers care whether their people finished and what they scored. Export completion by learner each month and send it before they ask.' },
      { h: 'Offer a pilot', p: 'Ten seats for a month at a fair price is an easy yes. Most pilots that reach 60% completion turn into an annual order.' },
    ],
  },
  {
    slug: 'film-at-home',
    title: 'A home studio for under $400',
    excerpt: 'The camera, light and microphone setup that looks and sounds professional.',
    cover: 'photo' as CoverKey,
    tag: 'Production',
    date: 'Sep 26, 2026',
    minutes: 4,
    author: 2,
    body: [
      { h: 'Sound first', p: 'Learners forgive soft video but not bad audio. A lavalier microphone and a rug on the floor do more than any camera upgrade.' },
      { h: 'One big soft light', p: 'A single large light just off camera, plus a window behind it, gives you even, flattering light all day.' },
      { h: 'Record in short takes', p: 'Five-minute takes are easier to redo and easier to watch. Coursekit stitches lessons into modules for you.' },
    ],
  },
] as const

export type Post = (typeof posts)[number]

/* ---------- Contact and sign-up ---------- */

export const contactTopics = [
  { value: 'demo', label: 'A product demo' },
  { value: 'migration', label: 'Moving from another platform' },
  { value: 'teams', label: 'Training my team' },
  { value: 'pricing', label: 'Pricing and plans' },
  { value: 'other', label: 'Something else' },
] as const

export const audienceSizes = ['Just starting', 'Under 1,000', '1,000 to 10,000', '10,000 to 100,000', 'Over 100,000'] as const

export const creatorKinds = [
  { value: 'creator', label: 'Independent creator' },
  { value: 'school', label: 'School or academy' },
  { value: 'company', label: 'Company training' },
] as const
