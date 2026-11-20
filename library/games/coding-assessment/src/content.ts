/*
  Every string on the site lives here: brand, navigation, landing sections,
  plans, FAQ and form copy. Seed data (challenges, questions, candidates) is in
  data.ts. Every image goes through IMAGES so you can swap in your own files
  in public/images/ from one place.
*/

export const BRAND = {
  name: 'Codetrial',
  tagline: 'Coding assessments for engineers who build with AI',
  email: 'hello@codetrial.example',
}

export const IMAGES = {
  hero: { src: '/images/hero.webp', alt: 'A figure conducting arcs of green light over rows of developers at laptops' },
  community: { src: '/images/community.webp', alt: 'Developers working together at a long table late at night' },
  arcs: { src: '/images/arcs.webp', alt: '' },
}

export type NavItem = { label: string; href: string; description?: string }

export const PRODUCT_MENU: NavItem[] = [
  { label: 'Live challenge', href: '/demo', description: 'Try the candidate experience: editor, tests and assistant' },
  { label: 'Question library', href: '/library', description: '900 vetted questions across 40 skills' },
  { label: 'Assessment builder', href: '/assessments', description: 'Pick questions, set a time limit, invite candidates' },
  { label: 'Candidate reports', href: '/reports', description: 'Scores, code playback and AI usage in one view' },
]

export const NAV: NavItem[] = [
  { label: 'Solutions', href: '/#solutions' },
  { label: 'Resources', href: '/developers' },
  { label: 'Pricing', href: '/pricing' },
]

export const NAV_ACTIONS = {
  developers: { label: 'For developers', href: '/developers' },
  demo: { label: 'Request demo', href: '/request-demo' },
  signup: { label: 'Sign up', href: '/signup' },
}

export const HERO = {
  lineOne: 'Hiring for how engineers build',
  lead: 'with',
  human: 'human',
  ai: 'AI',
  sub: 'Run real coding challenges, see how candidates work alongside AI, and hire on evidence instead of résumés.',
  cta: { label: 'Try a sample challenge', href: '/demo' },
}

export const LOGOS = ['Lumen Labs', 'Parcelpath', 'Quarry', 'Helix Health', 'Brightwire', 'Orbitly', 'Tessel', 'Fernway']

export const LOGO_CAPTION = 'Engineering teams at 2,400 companies hire with Codetrial'

export const SOLUTIONS = {
  eyebrow: 'One platform, every stage',
  title: 'From first screen to final offer',
  sub: 'Three products share one question bank, one rubric and one report, so every interviewer judges the same evidence.',
  tabs: [
    {
      id: 'screen',
      label: 'Screen',
      title: 'Async challenges that feel like real work',
      body: 'Candidates solve in a full editor with tests they can run and an assistant they may use. You get the code, the runs and every prompt.',
      points: ['Hidden tests catch hard-coded answers', 'Time limits that pause for accessibility needs', 'Runs in the browser, nothing to install'],
    },
    {
      id: 'interview',
      label: 'Interview',
      title: 'Pair live in the same editor',
      body: 'Share a room link, code together with two cursors, run the tests and leave notes against the rubric while you talk.',
      points: ['Shared editor, terminal and whiteboard', 'Interviewer notes stay private', 'Replays for anyone who missed it'],
    },
    {
      id: 'report',
      label: 'Report',
      title: 'Decide on evidence, together',
      body: 'Every attempt becomes a report: score by skill, tests passed, a keystroke replay and an honest account of AI usage.',
      points: ['Skill scores against your rubric', 'Code playback at any speed', 'Integrity signals, never auto-rejection'],
    },
  ],
}

export const FEATURES = {
  eyebrow: 'Built for the AI era',
  title: 'Measure judgement, not memorisation',
  items: [
    { icon: 'sparkles', title: 'AI is allowed, and measured', body: 'Candidates can ask the built-in assistant. We score whether they checked its answers, not whether they used it.' },
    { icon: 'shield', title: 'Fair by default', body: 'Structured rubrics, anonymised review and the same hidden tests for everyone who takes the challenge.' },
    { icon: 'play', title: 'Watch the work', body: 'Replay how a solution took shape: the first attempt, the failed run and the fix.' },
    { icon: 'library', title: '900 vetted questions', body: 'Written by working engineers, calibrated on thousands of attempts, refreshed when they leak.' },
    { icon: 'gauge', title: 'Faster loops', body: 'Teams cut time to first interview from nine days to three with async screens.' },
    { icon: 'plug', title: 'Fits your ATS', body: 'Send invites and receive scores in the tracker you already use. Single sign-on included on Growth.' },
  ],
}

export const STATS = [
  { value: 4.1, suffix: 'M', label: 'Challenges completed', decimals: 1 },
  { value: 62, suffix: '%', label: 'Less interviewer time per hire', decimals: 0 },
  { value: 3, suffix: ' days', label: 'Median time to first interview', decimals: 0 },
  { value: 96, suffix: '%', label: 'Candidates rate the experience fair', decimals: 0 },
]

export const COMMUNITY = {
  eyebrow: 'For developers',
  title: 'A community of 11 million engineers',
  body: 'Practise on the same challenges companies use, climb the weekly board and get invited to roles that match what you can actually do.',
  cta: { label: 'Explore practice challenges', href: '/developers' },
}

export const TESTIMONIALS = [
  { quote: 'We stopped arguing about résumés. The report shows the run that failed and the fix that followed, and that ends the debate.', name: 'Priya Raman', role: 'Engineering manager, Parcelpath' },
  { quote: 'Letting candidates use the assistant was scary. Now it is the most useful signal we have: who reads the answer and who pastes it.', name: 'Tomás Ibarra', role: 'Head of platform, Brightwire' },
  { quote: 'Our time to first interview dropped from eleven days to four. Candidates tell us it is the fairest test they have taken.', name: 'Grace Achieng', role: 'Talent lead, Helix Health' },
]

export const CTA = {
  title: 'See your next great engineer at work',
  sub: 'Take the sample challenge yourself, then read the report your team would get.',
  primary: { label: 'Try a sample challenge', href: '/demo' },
  secondary: { label: 'Request demo', href: '/request-demo' },
}

export const FOOTER = {
  blurb: 'Coding assessments, live interviews and candidate reports for teams who hire engineers.',
  columns: [
    { title: 'Product', links: [{ label: 'Live challenge', href: '/demo' }, { label: 'Question library', href: '/library' }, { label: 'Assessment builder', href: '/assessments' }, { label: 'Candidate reports', href: '/reports' }] },
    { title: 'Company', links: [{ label: 'Pricing', href: '/pricing' }, { label: 'Request demo', href: '/request-demo' }, { label: 'Sign up', href: '/signup' }] },
    { title: 'Resources', links: [{ label: 'For developers', href: '/developers' }, { label: 'Style guide', href: '/styleguide' }, { label: 'Contact', href: `mailto:${'hello@codetrial.example'}` }] },
  ],
  newsletter: { title: 'Hiring notes, monthly', placeholder: 'Work email', button: 'Subscribe', done: 'Subscribed. The next issue lands on the first Tuesday.' },
  legal: '© 2026 Codetrial. A template brand; replace with your own.',
}

export const PRICING = {
  title: 'Plans that grow with your hiring',
  sub: 'Every plan includes the full question library, the browser editor and candidate reports.',
  annualNote: 'Two months free',
  plans: [
    { id: 'starter', name: 'Starter', monthly: 0, annual: 0, blurb: 'For founders hiring their first engineers.', cta: 'Start free', features: ['5 assessments a month', '1 interviewer seat', 'Coding questions', 'Candidate reports'] },
    { id: 'team', name: 'Team', monthly: 249, annual: 207, blurb: 'For teams running a steady hiring loop.', cta: 'Start 14-day trial', featured: true, features: ['60 assessments a month', '5 interviewer seats', 'Live interviews with replay', 'AI-assisted questions', 'ATS integrations'] },
    { id: 'enterprise', name: 'Enterprise', monthly: null, annual: null, blurb: 'For organisations hiring at volume.', cta: 'Talk to sales', features: ['Unlimited assessments', 'Unlimited seats', 'Custom questions and rubrics', 'Single sign-on and audit log', 'Dedicated success manager'] },
  ],
  compare: {
    columns: ['Starter', 'Team', 'Enterprise'],
    rows: [
      { label: 'Assessments per month', values: ['5', '60', 'Unlimited'] },
      { label: 'Interviewer seats', values: ['1', '5', 'Unlimited'] },
      { label: 'Question library', values: [true, true, true] },
      { label: 'Live interviews', values: [false, true, true] },
      { label: 'Code playback', values: [true, true, true] },
      { label: 'AI usage scoring', values: [false, true, true] },
      { label: 'Custom rubrics', values: [false, false, true] },
      { label: 'Single sign-on', values: [false, false, true] },
      { label: 'Support', values: ['Email', 'Priority email', 'Named manager'] },
    ],
  },
  faq: [
    { q: 'What counts as an assessment?', a: 'One candidate taking one assessment. Retakes and practice runs by your own team are free.' },
    { q: 'Can candidates really use AI?', a: 'If you allow it. Each question sets whether the assistant is on, and the report shows every prompt and what the candidate did with the answer.' },
    { q: 'Which languages are supported?', a: 'Over 40, from Python and TypeScript to Rust and SQL. The sample challenge on this site runs JavaScript in your browser.' },
    { q: 'Do you store candidate code?', a: 'For as long as you choose, from 30 days to 3 years, in the region you pick. Candidates can ask for deletion at any time.' },
  ],
}

export const DEMO_REQUEST = {
  title: 'See Codetrial with your own roles',
  sub: 'A 30-minute call with an engineer on our team. Bring a job description and we will build the assessment together.',
  points: ['A tailored assessment for one open role', 'A walkthrough of the candidate report', 'Pricing for your hiring volume'],
  sizes: ['1–10 engineers', '11–50 engineers', '51–200 engineers', '201–1,000 engineers', 'Over 1,000 engineers'],
  done: { title: 'Request received', body: 'We will email you within one working day to pick a time.' },
}

export const SIGNUP = {
  title: 'Create your workspace',
  sub: 'Free for your first five assessments. No card needed.',
  done: 'Workspace created. Opening your assessments…',
}

export const DEVELOPERS = {
  title: 'Practise on real hiring challenges',
  sub: 'The same problems companies send candidates, with tests you can run and hints when you are stuck.',
}

export const ASSISTANT = {
  name: 'Pair assistant',
  intro: 'I can explain the problem, suggest an approach or review your idea. I will not write the solution for you, and everything you ask appears in the report.',
  suggestions: ['Give me a hint', 'What edge cases matter?', 'What complexity should I aim for?', 'Just write the solution'],
  refuse: 'I cannot write the solution in an assessment, but I can get you unstuck. Tell me what you have tried, or ask for a hint.',
  edge: (labels: string[]) => `The visible tests cover: ${labels.join(', ')}. Hidden tests check the same rules on inputs you have not seen, so think about empty input, boundaries and values that repeat.`,
  explain: (fn: string) => `You are writing ${fn}. Start from the examples: work one through by hand, then write the loop that does what your hand did.`,
  noMore: 'That is all the hints I have. Run the tests and read the first failure closely; it usually points at the bug.',
  placeholder: 'Ask about the problem',
}

export const DEMO = {
  intro: {
    eyebrow: 'Sample challenge',
    title: 'Take the challenge your candidates would see',
    sub: 'A real editor, tests that run in your browser and an assistant you are allowed to use. When you submit, you get the report a hiring team would read.',
    rules: ['Your code runs in this browser tab, never on a server', 'Visible tests show their input; hidden tests do not', 'The assistant is allowed; every prompt is shown in the report', 'Progress saves as you type, so a reload is safe'],
    consent: 'I agree that my code, test runs and assistant prompts are recorded for this sample report.',
    start: 'Start challenge',
  },
  submitTitle: 'Submit your solution?',
  submitBody: (passed: number, total: number) => `Your last run passed ${passed} of ${total} visible tests. Hidden tests run when you submit, and you cannot edit afterwards.`,
}
