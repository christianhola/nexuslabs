// Every string and all seed data for the Clipwise template lives here.
// Swap the copy, the recordings and the images without touching components.

/**
 * All photography goes through this one constant. The files in
 * public/images are generated placeholders: replace them with your own
 * footage stills and keep the keys.
 */
export const IMAGES = {
  presenterHero: '/images/presenter-hero.webp',
  presenterTheo: '/images/presenter-2.webp',
  presenterRuth: '/images/presenter-3.webp',
  desk: '/images/desk.webp',
} as const

export const BRAND = {
  name: 'Clipwise',
  tagline: 'Screen recording for busy teams',
  workspace: 'lumen',
  domain: 'clipwise.app',
}

export type NavItem = { label: string; to: string }

export const NAV: NavItem[] = [
  { label: 'Product', to: '/#product' },
  { label: 'Made for', to: '/#teams' },
  { label: 'Customers', to: '/#customers' },
  { label: 'Agents', to: '/#agents' },
  { label: 'Pricing', to: '/pricing' },
]

export const RESOURCES: Array<NavItem & { blurb: string }> = [
  { label: 'Integrations', to: '/integrations', blurb: 'Send clips to the tools you already use' },
  { label: 'Download', to: '/download', blurb: 'Mac, Windows, iPhone and the browser' },
  { label: 'Open the app', to: '/app', blurb: 'Your library of recordings' },
  { label: 'Style guide', to: '/styleguide', blurb: 'Tokens and components' },
]

export const HERO = {
  title: `${BRAND.name} is how teams explain work better.`,
  sub: ['Fast and polished screen recording for busy people.', 'Video shows the work, agents move it forward.'],
  trusted: { pre: 'Trusted by', teams: ['product', 'sales', 'support'], post: 'teams at...' },
  primary: 'Get started free',
  secondary: 'Talk to us',
}

/** Invented partner marks for the logo marquee. Each one is drawn in SVG/CSS. */
export const LOGOS = ['loopkit', 'hearth', 'paperplane', 'quarry', 'stackhouse', 'mintline', 'orbitly'] as const
export type LogoId = (typeof LOGOS)[number]

export const AGENT_TERMINAL = {
  app: 'Kestrel Code',
  version: 'v3.2.14',
  model: 'Kite 4 with low effort · Team plan',
  cwd: '~/work/clipwise/web',
  prompt: 'Get me the latest bug reports and create tracker tickets',
  lines: [
    { kind: 'say', text: 'Let me fetch transcripts for the bug-related recordings in parallel.' },
    { kind: 'tool', text: 'Called clipwise 3 times (ctrl+o to expand)' },
    { kind: 'say', text: 'Got clear details from two of the three. The third ("Quick bug + fix") is too vague to use. Let me create tickets for the two actionable ones now.' },
    { kind: 'tool', text: 'Called trackline 2 times (ctrl+o to expand)' },
    { kind: 'say', text: 'Created two High priority tickets in the Clipwise team:' },
    { kind: 'item', text: 'WEB-3483  Mention dropdown won’t scroll in comments' },
    { kind: 'item', text: 'WEB-3484  Project picker loses focus after search' },
  ] as Array<{ kind: 'say' | 'tool' | 'item'; text: string }>,
}

export const FEATURES = {
  eyebrow: 'Product',
  title: 'Record it once. Everyone gets it.',
  sub: 'Show the work instead of writing about it. A clip is ready to share the moment you stop.',
  items: [
    {
      id: 'record',
      title: 'One-click capture',
      body: 'Screen, camera or both, in 4K. Blur notifications, draw on screen, and trim before anyone sees it.',
      points: ['4K at 60 fps', 'Camera bubble', 'Instant trim'],
    },
    {
      id: 'share',
      title: 'Feedback on the frame',
      body: 'Viewers comment at the exact second they mean. Replies, reactions and resolves keep reviews short.',
      points: ['Timestamped comments', 'Reactions', 'View insights'],
    },
    {
      id: 'agents',
      title: 'Agents take it from there',
      body: 'Every clip comes with a transcript, chapters and action items that your agents can read and act on.',
      points: ['Transcripts', 'Chapters', 'MCP server'],
    },
  ],
}

export const TEAMS = {
  eyebrow: 'Made for',
  title: 'Built for the teams who explain the most.',
  tabs: [
    {
      id: 'product',
      label: 'Product',
      title: 'Walk through a spec in four minutes, not a forty-minute meeting.',
      body: 'Record the flow, let reviewers pin comments to the frame, and turn the agreed changes into tickets.',
      stat: { value: '3.1×', label: 'faster design reviews' },
      clip: 'rec-homepage',
    },
    {
      id: 'sales',
      label: 'Sales',
      title: 'Send a personal demo that buyers actually finish.',
      body: 'See who watched and where they replayed. Your CRM gets a summary the moment the prospect is done.',
      stat: { value: '68%', label: 'average completion' },
      clip: 'rec-pricing',
    },
    {
      id: 'support',
      label: 'Support',
      title: 'Answer the ticket with the fix, on screen.',
      body: 'Reply with a clip instead of ten steps. Customers record bugs in the browser with no install.',
      stat: { value: '41%', label: 'fewer follow-up replies' },
      clip: 'rec-bug',
    },
    {
      id: 'eng',
      label: 'Engineering',
      title: 'Show the diff, explain the why.',
      body: 'Code walkthroughs with chapters. Agents read the transcript and open the follow-up issues for you.',
      stat: { value: '2 h', label: 'saved per engineer each week' },
      clip: 'rec-stack',
    },
  ],
}

export const AGENTS = {
  eyebrow: 'Agents',
  title: 'Every recording becomes context your agents can use.',
  sub: 'Clipwise ships an MCP server and a plain REST API. Agents fetch transcripts, chapters and comments, then file tickets, update docs or draft the reply.',
  bullets: [
    { title: 'Transcripts and chapters', body: 'Word-level timing, speaker labels and chapter titles on every clip.' },
    { title: 'Action items', body: 'Decisions and to-dos pulled out with the timestamp they came from.' },
    { title: 'Scoped access', body: 'Agents see only the playlists you grant, and every call is logged.' },
  ],
  code: [
    'GET /v1/clips/rec-bug/transcript',
    '',
    '{',
    '  "title": "Quick bug + fix",',
    '  "chapters": [{ "t": 0, "title": "Repro" }],',
    '  "actions": [',
    '    { "t": 74, "text": "Dropdown clips at 6 items" }',
    '  ]',
    '}',
  ],
}

export const CUSTOMERS = {
  eyebrow: 'Customers',
  title: 'Teams that switched stopped scheduling the explainer meeting.',
  stats: [
    { value: '12M+', label: 'clips recorded' },
    { value: '38k', label: 'teams' },
    { value: '4.8', label: 'average rating' },
  ],
  quotes: [
    {
      body: 'Our design reviews went async in a week. People comment on the frame, the agent writes the tickets, and Monday syncs are gone.',
      name: 'Priya Natarajan',
      role: 'Head of Design, Loopkit',
      presenter: 'ruth',
    },
    {
      body: 'Prospects finish a three-minute Clipwise demo. They never finished our forty-slide deck.',
      name: 'Daniel Okafor',
      role: 'VP Sales, Quarry',
      presenter: 'theo',
    },
    {
      body: 'Support replies with a clip and the ticket closes. Our reopen rate dropped by a third.',
      name: 'Mei Lin',
      role: 'Support Lead, Hearth',
      presenter: 'maya',
    },
  ] as Array<{ body: string; name: string; role: string; presenter: PresenterId }>,
}

export const CTA = {
  title: 'Show the work. Skip the meeting.',
  sub: 'Free for up to 25 clips. No credit card.',
  placeholder: 'you@company.com',
  button: 'Get started free',
  success: 'You’re in. Check your inbox for the download link.',
}

export const FOOTER = {
  blurb: 'Fast, polished screen recording for busy teams. Agents move it forward.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Open the app', to: '/app' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'Download', to: '/download' },
        { label: 'Integrations', to: '/integrations' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Features', to: '/#product' },
        { label: 'Agents', to: '/#agents' },
        { label: 'Customers', to: '/#customers' },
        { label: 'Sample clip', to: '/v/rec-homepage' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Style guide', to: '/styleguide' },
        { label: 'Made for teams', to: '/#teams' },
      ],
    },
  ],
  legal: `© 2026 ${BRAND.name}. Demo template: all names, logos and people are invented.`,
}

// ---------------------------------------------------------------------------
// App data
// ---------------------------------------------------------------------------

export type PresenterId = 'maya' | 'theo' | 'ruth'
export const PRESENTERS: Record<PresenterId, { name: string; image: string; initials: string }> = {
  maya: { name: 'Mei Lin', image: IMAGES.presenterHero, initials: 'ML' },
  theo: { name: 'Theo Marsh', image: IMAGES.presenterTheo, initials: 'TM' },
  ruth: { name: 'Ruth Adler', image: IMAGES.presenterRuth, initials: 'RA' },
}

export const ME = { id: 'me', name: 'You', initials: 'YO' }

export type Scene = 'site' | 'dashboard' | 'code' | 'doc' | 'board' | 'deck'

export type Segment = { t: number; text: string }
export type Chapter = { t: number; title: string }

export type Recording = {
  id: string
  title: string
  duration: number // seconds
  createdAt: string // ISO
  presenter: PresenterId
  scene: Scene
  playlistId: string | null
  views: number
  watched: boolean
  archived?: boolean
  summary: string
  chapters: Chapter[]
  transcript: Segment[]
}

export type Comment = {
  id: string
  recId: string
  t: number
  author: string
  initials: string
  body: string
  createdAt: string
  resolved?: boolean
  reactions?: Record<string, number>
  mine?: boolean
}

export type Playlist = { id: string; name: string }

export const PLAYLISTS: Playlist[] = [
  { id: 'pl-founder', name: 'Founder Updates' },
  { id: 'pl-design', name: 'Design Reviews' },
  { id: 'pl-sales', name: 'Sales Calls' },
  { id: 'pl-bugs', name: 'Bug Reports' },
  { id: 'pl-demos', name: 'Product Demos' },
  { id: 'pl-stories', name: 'Customer Stories' },
  { id: 'pl-onboarding', name: 'Onboarding' },
  { id: 'pl-launches', name: 'Launches' },
  { id: 'pl-eng', name: 'Engineering Syncs' },
  { id: 'pl-offsite', name: 'Offsite Notes' },
]

const H = 3600_000
const D = 24 * H
/** Seed dates are relative to the first load, so "10h ago" stays true in a fresh install. */
export const ago = (ms: number) => new Date(Date.now() - ms).toISOString()

export const seedRecordings = (): Recording[] => [
  {
    id: 'rec-homepage',
    title: 'Homepage Walkthrough',
    duration: 184,
    createdAt: ago(10 * H),
    presenter: 'maya',
    scene: 'site',
    playlistId: 'pl-design',
    views: 14,
    watched: true,
    summary: 'Mei walks through the new homepage: the shorter hero line, the product shot that fades into the page, and the partner strip. She asks for a decision on the secondary button by Friday.',
    chapters: [
      { t: 0, title: 'Why we changed the hero' },
      { t: 46, title: 'Product composition' },
      { t: 102, title: 'Partner strip' },
      { t: 151, title: 'Open questions' },
    ],
    transcript: [
      { t: 0, text: 'Hey team, quick walkthrough of the new homepage before Friday.' },
      { t: 12, text: 'The hero line is down to one sentence. We tested three and this one read fastest.' },
      { t: 31, text: 'Notice the subtitle splits into two short lines so it never wraps awkwardly.' },
      { t: 46, text: 'Below the buttons, the product shot shows the library, a clip and an agent at once.' },
      { t: 74, text: 'It fades into the page at the bottom, so there is no hard edge on smaller screens.' },
      { t: 102, text: 'The partner strip scrolls slowly and pauses when you hover it.' },
      { t: 128, text: 'All of those logos need sign-off from partnerships before launch.' },
      { t: 151, text: 'Open question: do we keep "Talk to us" as the second button, or swap in a demo?' },
      { t: 170, text: 'Leave a comment on the frame if you have a view. Thanks!' },
    ],
  },
  {
    id: 'rec-stack',
    title: 'Stack Visibility & Sharing',
    duration: 52,
    createdAt: ago(14 * D),
    presenter: 'theo',
    scene: 'code',
    playlistId: 'pl-eng',
    views: 1,
    watched: true,
    summary: 'Theo shows how playlist visibility now follows the workspace setting, and where the share check lives in the code.',
    chapters: [
      { t: 0, title: 'The bug' },
      { t: 22, title: 'The fix' },
    ],
    transcript: [
      { t: 0, text: 'So visibility on stacks was ignoring the workspace default.' },
      { t: 11, text: 'If you shared a playlist, new clips in it stayed private.' },
      { t: 22, text: 'The check now reads the playlist first, then the workspace.' },
      { t: 38, text: 'Tests cover both paths. Merging after one review.' },
    ],
  },
  {
    id: 'rec-bug',
    title: 'Mention dropdown won’t scroll',
    duration: 96,
    createdAt: ago(3 * H),
    presenter: 'ruth',
    scene: 'board',
    playlistId: 'pl-bugs',
    views: 6,
    watched: false,
    summary: 'Repro of the mention dropdown in comments: past six people it clips and the list cannot scroll. Ruth suggests a max height with overflow.',
    chapters: [
      { t: 0, title: 'Repro' },
      { t: 48, title: 'Expected' },
      { t: 74, title: 'Suggested fix' },
    ],
    transcript: [
      { t: 0, text: 'Opening a clip and typing an at sign in the comment box.' },
      { t: 18, text: 'With six or fewer people it looks fine.' },
      { t: 31, text: 'Add a seventh and the list clips at the bottom of the panel.' },
      { t: 48, text: 'I’d expect it to scroll, or to open above the input.' },
      { t: 74, text: 'Suggested fix: cap the height and let it scroll.' },
    ],
  },
  {
    id: 'rec-pricing',
    title: 'Pricing page tour for Quarry',
    duration: 228,
    createdAt: ago(2 * D),
    presenter: 'theo',
    scene: 'deck',
    playlistId: 'pl-sales',
    views: 23,
    watched: true,
    summary: 'A personal demo for the Quarry team: seats, the Business plan’s agent access, and how annual billing works.',
    chapters: [
      { t: 0, title: 'Hello, Quarry' },
      { t: 40, title: 'Plans' },
      { t: 120, title: 'Agent access' },
      { t: 190, title: 'Next steps' },
    ],
    transcript: [
      { t: 0, text: 'Hi Quarry team, thanks for the call on Tuesday.' },
      { t: 20, text: 'I recorded this so the rest of your team can catch up.' },
      { t: 40, text: 'You’d start on Business: unlimited clips and the agent API.' },
      { t: 88, text: 'Seats are per creator. Viewers are always free.' },
      { t: 120, text: 'Agent access is scoped per playlist, so support only sees support clips.' },
      { t: 190, text: 'If this looks right, reply here and I’ll send the order form.' },
    ],
  },
  {
    id: 'rec-founder-oct',
    title: 'Founder update — October',
    duration: 312,
    createdAt: ago(5 * D),
    presenter: 'ruth',
    scene: 'dashboard',
    playlistId: 'pl-founder',
    views: 58,
    watched: true,
    summary: 'Ruth covers October: revenue up 14%, the agent API launch, two key hires and the plan for Q1.',
    chapters: [
      { t: 0, title: 'Numbers' },
      { t: 95, title: 'Agent API launch' },
      { t: 180, title: 'Team' },
      { t: 250, title: 'Q1 plan' },
    ],
    transcript: [
      { t: 0, text: 'Morning everyone. October in five minutes.' },
      { t: 24, text: 'Revenue grew fourteen percent, mostly from teams moving to Business.' },
      { t: 95, text: 'The agent API launched on the twelfth. Four hundred teams connected in week one.' },
      { t: 180, text: 'Two hires: a staff engineer for the recorder and our first designer in Lisbon.' },
      { t: 250, text: 'For Q1 we focus on Windows quality and comments on mobile.' },
    ],
  },
  {
    id: 'rec-onboarding',
    title: 'Your first week at Lumen',
    duration: 421,
    createdAt: ago(9 * D),
    presenter: 'maya',
    scene: 'doc',
    playlistId: 'pl-onboarding',
    views: 31,
    watched: false,
    summary: 'Where things live, who to ask, and the three rituals every new hire should know.',
    chapters: [
      { t: 0, title: 'Welcome' },
      { t: 60, title: 'Where things live' },
      { t: 210, title: 'Rituals' },
    ],
    transcript: [
      { t: 0, text: 'Welcome to Lumen! This is the video I wish I had on day one.' },
      { t: 60, text: 'Docs live in the handbook, decisions live in clips.' },
      { t: 210, text: 'Three rituals: Monday plan, Thursday demo, Friday notes.' },
    ],
  },
  {
    id: 'rec-launch',
    title: 'Launch checklist: Windows beta',
    duration: 143,
    createdAt: ago(26 * H),
    presenter: 'theo',
    scene: 'board',
    playlistId: 'pl-launches',
    views: 9,
    watched: false,
    summary: 'The Windows beta checklist: installer signing, crash reporting and the support macro.',
    chapters: [
      { t: 0, title: 'Checklist' },
      { t: 90, title: 'Owners' },
    ],
    transcript: [
      { t: 0, text: 'Five things left before the Windows beta goes out.' },
      { t: 45, text: 'Installer signing is done. Crash reporting is in review.' },
      { t: 90, text: 'Owners are on the board. Shout if yours looks wrong.' },
    ],
  },
  {
    id: 'rec-story-hearth',
    title: 'How Hearth cut reopen rates',
    duration: 267,
    createdAt: ago(20 * D),
    presenter: 'maya',
    scene: 'dashboard',
    playlistId: 'pl-stories',
    views: 44,
    watched: true,
    summary: 'Hearth’s support team replies with clips. Reopened tickets fell by a third in six weeks.',
    chapters: [
      { t: 0, title: 'Before' },
      { t: 120, title: 'After' },
    ],
    transcript: [
      { t: 0, text: 'Hearth handles about four thousand tickets a month.' },
      { t: 120, text: 'Six weeks after switching to clip replies, reopens fell by a third.' },
    ],
  },
  {
    id: 'rec-demo-agents',
    title: 'Demo: agents that file tickets',
    duration: 118,
    createdAt: ago(4 * D),
    presenter: 'theo',
    scene: 'code',
    playlistId: 'pl-demos',
    views: 72,
    watched: true,
    summary: 'An agent reads three bug clips, skips the vague one, and files two tickets with repro steps.',
    chapters: [
      { t: 0, title: 'The prompt' },
      { t: 40, title: 'Tool calls' },
      { t: 88, title: 'The tickets' },
    ],
    transcript: [
      { t: 0, text: 'I ask the agent for the latest bug reports.' },
      { t: 40, text: 'It fetches the transcripts in parallel through the MCP server.' },
      { t: 88, text: 'And here are the two tickets, with timestamps back to the clip.' },
    ],
  },
  {
    id: 'rec-design-nav',
    title: 'Nav and footer review',
    duration: 76,
    createdAt: ago(6 * D),
    presenter: 'ruth',
    scene: 'site',
    playlistId: 'pl-design',
    views: 5,
    watched: false,
    summary: 'Ruth suggests folding Integrations and Download into a Resources menu.',
    chapters: [{ t: 0, title: 'Nav' }],
    transcript: [
      { t: 0, text: 'Six top-level links is one too many.' },
      { t: 30, text: 'Let’s fold Integrations and Download under Resources.' },
    ],
  },
  {
    id: 'rec-offsite',
    title: 'Offsite thoughts',
    duration: 205,
    createdAt: ago(40 * D),
    presenter: 'ruth',
    scene: 'deck',
    playlistId: 'pl-offsite',
    views: 17,
    watched: true,
    summary: 'Three themes from the offsite: fewer meetings, clearer owners, ship smaller.',
    chapters: [{ t: 0, title: 'Themes' }],
    transcript: [
      { t: 0, text: 'Three things came up again and again at the offsite.' },
      { t: 70, text: 'Fewer meetings, clearer owners, and shipping smaller.' },
    ],
  },
  {
    id: 'rec-eng-sync',
    title: 'Recorder perf sync',
    duration: 164,
    createdAt: ago(8 * D),
    presenter: 'theo',
    scene: 'dashboard',
    playlistId: 'pl-eng',
    views: 8,
    watched: false,
    summary: 'Encoder CPU is down 22% on Apple silicon; Windows is next.',
    chapters: [{ t: 0, title: 'Numbers' }],
    transcript: [
      { t: 0, text: 'Encoder CPU is down twenty-two percent on Apple silicon.' },
      { t: 80, text: 'Windows is next. Same approach, different API.' },
    ],
  },
]

export const seedComments = (): Comment[] => [
  { id: 'c1', recId: 'rec-homepage', t: 14, author: 'Theo Marsh', initials: 'TM', body: 'One sentence reads so much better. Ship it.', createdAt: ago(8 * H), reactions: { '👍': 3 } },
  { id: 'c2', recId: 'rec-homepage', t: 52, author: 'Ruth Adler', initials: 'RA', body: 'Can the product shot crop tighter on mobile? The terminal gets lost.', createdAt: ago(7 * H) },
  { id: 'c3', recId: 'rec-homepage', t: 130, author: 'Ana Silva', initials: 'AS', body: 'Partnerships signed off on all but one logo — I’ll send the list.', createdAt: ago(5 * H), reactions: { '🙏': 1 } },
  { id: 'c4', recId: 'rec-homepage', t: 158, author: 'Theo Marsh', initials: 'TM', body: 'Keep “Talk to us”. Demo lives one click away in the nav.', createdAt: ago(4 * H), resolved: true },
  { id: 'c5', recId: 'rec-bug', t: 33, author: 'Theo Marsh', initials: 'TM', body: 'Repro’d on Safari too.', createdAt: ago(2 * H) },
  { id: 'c6', recId: 'rec-bug', t: 76, author: 'Kestrel agent', initials: 'KA', body: 'Filed WEB-3483 with these repro steps.', createdAt: ago(1 * H), reactions: { '🎉': 2 } },
  { id: 'c7', recId: 'rec-pricing', t: 92, author: 'Jordan (Quarry)', initials: 'JQ', body: 'Viewers free is great. Do guests need an account?', createdAt: ago(30 * H) },
  { id: 'c8', recId: 'rec-founder-oct', t: 101, author: 'Ana Silva', initials: 'AS', body: '400 teams in week one 🔥', createdAt: ago(4 * D), reactions: { '🔥': 9 } },
  { id: 'c9', recId: 'rec-launch', t: 50, author: 'Ruth Adler', initials: 'RA', body: 'Crash reporting is approved now.', createdAt: ago(20 * H) },
]

export const REACTIONS = ['👍', '🔥', '🎉', '🙏', '👀'] as const

export const APP_COPY = {
  nav: { mine: 'My Clips', watched: 'Watched', activity: 'Activity', archive: 'Archive', playlists: 'Playlists' },
  sorts: { latest: 'Latest', active: 'Active' },
  empty: {
    search: { title: 'No clips match', body: 'Try a different word, or clear the search.' },
    playlist: { title: 'This playlist is empty', body: 'Move a clip here from its menu, or record a new one.' },
    watched: { title: 'Nothing watched yet', body: 'Clips you open show up here.' },
    archive: { title: 'Archive is empty', body: 'Archived clips stay here until you restore them.' },
    activity: { title: 'No activity yet', body: 'Comments and views on your clips appear here.' },
  },
}

export const RECORDER = {
  modes: [
    { id: 'screen-cam', label: 'Screen + Cam' },
    { id: 'screen', label: 'Screen only' },
    { id: 'cam', label: 'Cam only' },
  ],
  cameras: ['FaceTime HD Camera', 'Desk View Camera', 'No camera'],
  mics: ['Shure MV7', 'MacBook Pro Microphone', 'No microphone'],
  sources: ['Full screen', 'Window: Browser', 'Window: Figma-like editor'],
  quality: ['4K', '1080p', '720p'],
}

export const AGENT_ANSWER_PREFIX = 'From the transcript: '

// ---------------------------------------------------------------------------
// Integrations (all invented)
// ---------------------------------------------------------------------------

export type Integration = {
  id: string
  name: string
  category: 'Agents' | 'Tickets' | 'Chat' | 'Docs' | 'CRM' | 'Automation'
  blurb: string
  color: string
  glyph: 'ring' | 'bolt' | 'stack' | 'leaf' | 'grid' | 'wave' | 'node' | 'spark'
  featured?: boolean
}

export const INTEGRATION_CATEGORIES = ['All', 'Agents', 'Tickets', 'Chat', 'Docs', 'CRM', 'Automation'] as const

export const INTEGRATIONS: Integration[] = [
  { id: 'kestrel', name: 'Kestrel Code', category: 'Agents', blurb: 'Let your coding agent read clips through the Clipwise MCP server.', color: '#e5484d', glyph: 'spark', featured: true },
  { id: 'trackline', name: 'Trackline', category: 'Tickets', blurb: 'Turn a comment or an action item into a ticket with the timestamp attached.', color: '#7c8cff', glyph: 'stack', featured: true },
  { id: 'loopkit', name: 'Loopkit', category: 'Automation', blurb: 'Trigger a workflow when a clip is recorded, watched or commented on.', color: '#ff8a4c', glyph: 'node', featured: true },
  { id: 'hearth', name: 'Hearth Desk', category: 'Tickets', blurb: 'Reply to support tickets with a clip and see when the customer watched.', color: '#f2b84b', glyph: 'ring' },
  { id: 'chatterly', name: 'Chatterly', category: 'Chat', blurb: 'Rich previews that play inline, plus a /clip command.', color: '#4cc27a', glyph: 'wave' },
  { id: 'murmur', name: 'Murmur', category: 'Chat', blurb: 'Post new clips from a playlist to a channel automatically.', color: '#b48cff', glyph: 'bolt' },
  { id: 'pagewise', name: 'Pagewise', category: 'Docs', blurb: 'Embed clips in docs with chapters and a live transcript.', color: '#e9e4d8', glyph: 'grid' },
  { id: 'quarry', name: 'Quarry CRM', category: 'CRM', blurb: 'Log views and replays on the contact and the deal.', color: '#5ab8e6', glyph: 'stack' },
  { id: 'mintline', name: 'Mintline', category: 'CRM', blurb: 'Send personal demo clips from a sequence step.', color: '#5fd3b0', glyph: 'leaf' },
  { id: 'orbitly', name: 'Orbitly Agents', category: 'Agents', blurb: 'Give hosted agents scoped, logged access to selected playlists.', color: '#ff6fa8', glyph: 'ring' },
  { id: 'stackhouse', name: 'Stackhouse', category: 'Docs', blurb: 'Attach clips to pull requests and design files.', color: '#c9a36b', glyph: 'grid' },
  { id: 'relay', name: 'Relaybox', category: 'Automation', blurb: 'Webhooks for every clip event, with retries and signing.', color: '#9aa5b1', glyph: 'bolt' },
]

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

export type Plan = {
  id: string
  name: string
  monthly: number | null // per creator per month; null = custom
  annual: number | null
  blurb: string
  cta: string
  to: string
  highlight?: boolean
  features: string[]
}

export const PRICING = {
  title: 'Simple pricing. Viewers are always free.',
  sub: 'Pay per creator. Everyone you share with watches, comments and reacts for free.',
  plans: [
    { id: 'starter', name: 'Starter', monthly: 0, annual: 0, blurb: 'For trying it out', cta: 'Start free', to: '/app', features: ['25 clips', '5-minute recordings', '720p', 'Comments and reactions'] },
    { id: 'pro', name: 'Pro', monthly: 15, annual: 12, blurb: 'For people who explain a lot', cta: 'Start 14-day trial', to: '/app', features: ['Unlimited clips', 'Unlimited length', '4K at 60 fps', 'Transcripts and chapters', 'Custom branding'] },
    { id: 'business', name: 'Business', monthly: 24, annual: 20, blurb: 'For teams and their agents', cta: 'Start 14-day trial', to: '/app', highlight: true, features: ['Everything in Pro', 'Agent API and MCP server', 'Shared playlists', 'View insights', 'Integrations'] },
    { id: 'enterprise', name: 'Enterprise', monthly: null, annual: null, blurb: 'For security reviews', cta: 'Talk to us', to: 'contact', features: ['Everything in Business', 'SSO and SCIM', 'Audit log export', 'Data residency', 'Priority support'] },
  ] as Plan[],
  compare: {
    columns: ['Starter', 'Pro', 'Business', 'Enterprise'],
    rows: [
      { label: 'Clips', values: ['25', 'Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Recording length', values: ['5 min', 'Unlimited', 'Unlimited', 'Unlimited'] },
      { label: 'Resolution', values: ['720p', '4K', '4K', '4K'] },
      { label: 'Transcripts', values: [false, true, true, true] },
      { label: 'Agent API and MCP', values: [false, false, true, true] },
      { label: 'View insights', values: [false, false, true, true] },
      { label: 'SSO and SCIM', values: [false, false, false, true] },
    ] as Array<{ label: string; values: Array<string | boolean> }>,
  },
  faq: [
    { q: 'Who counts as a creator?', a: 'Anyone who records. People who only watch, comment or react are free and unlimited.' },
    { q: 'Can I switch plans later?', a: 'Yes. Upgrades apply right away and are prorated. Downgrades apply at the end of the period.' },
    { q: 'What do agents get access to?', a: 'Only the playlists you grant. Every API and MCP call is logged in the workspace audit log.' },
    { q: 'Is there a discount for nonprofits?', a: 'Nonprofits and schools get Business at the Pro price. Write to us from the Enterprise card.' },
  ],
}

// ---------------------------------------------------------------------------
// Download
// ---------------------------------------------------------------------------

export type Platform = { id: 'mac' | 'windows' | 'chrome' | 'ios'; name: string; detail: string; size: string; requirement: string }

export const DOWNLOAD = {
  title: 'Record from anywhere you work.',
  sub: 'The desktop app records in 4K with your camera. The browser extension needs no install for your viewers.',
  platforms: [
    { id: 'mac', name: 'Mac', detail: 'Apple silicon and Intel', size: '74 MB', requirement: 'macOS 13 Ventura or later' },
    { id: 'windows', name: 'Windows', detail: 'x64 and Arm64 (beta)', size: '81 MB', requirement: 'Windows 10 (22H2) or later' },
    { id: 'chrome', name: 'Browser extension', detail: 'Chromium-based browsers', size: '3 MB', requirement: 'Version 120 or later' },
    { id: 'ios', name: 'iPhone and iPad', detail: 'Watch, comment and record', size: '58 MB', requirement: 'iOS 17 or later' },
  ] as Platform[],
  notes: [
    'This template does not ship real installers. The buttons show the flow; point them at your own build files.',
  ],
  changelog: [
    { version: '4.12', date: 'Nov 10', notes: 'Draw on screen while recording. Faster upload on hotel Wi-Fi.' },
    { version: '4.11', date: 'Oct 28', notes: 'Blur notifications automatically. New camera bubble shapes.' },
    { version: '4.10', date: 'Oct 14', notes: 'Windows Arm64 beta. Trim from the stop screen.' },
  ],
}

export const NOT_FOUND = {
  title: 'This clip ended early.',
  body: 'The page you asked for does not exist, or it was moved.',
}
