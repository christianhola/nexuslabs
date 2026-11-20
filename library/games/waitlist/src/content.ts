// Every string on the page lives here. Change the product name, copy and
// launch date in one place.

export const brand = {
  name: 'Flowdesk',
}

export const hero = {
  eyebrow: 'Coming Soon.',
  title: 'Join the waitlist.',
  body: 'Flowdesk is the all-in-one workspace that brings your projects, docs, and team communication together. Stop switching between apps — manage everything from a single, beautifully simple dashboard.',
  note: "We're launching soon. Drop your email below and be the first to get early access, plus exclusive perks for founding members.",
}

export const form = {
  label: 'Get early access',
  placeholder: 'Enter your email',
  submit: 'Notify me',
  submitting: 'Joining…',
  invalid: 'Enter a valid email address.',
  offline: "We couldn't reach the server. Check your connection and try again.",
  waitingOne: 'person already waiting',
  waitingMany: 'people already waiting',
}

export const success = {
  joinedTitle: "You're on the list.",
  existsTitle: "You're already on the list.",
  positionLabel: 'Your spot',
  joinedBody: "We'll email you the moment Flowdesk opens. Share your link to move up the queue.",
  existsBody: 'No need to sign up twice — your spot is saved. Share your link to move up the queue.',
  copy: 'Copy link',
  copied: 'Copied',
  shareText: "I just joined the Flowdesk waitlist — the all-in-one workspace for projects, docs and chat.",
  another: 'Use a different email',
  status: 'See your rank',
  ownLink: 'This is your share link.',
  ownLinkCta: 'See your rank',
  invited: 'A friend invited you. Join to give them a boost.',
}

/**
 * Launch moment for the countdown. When it passes, the countdown is replaced
 * by `launch.live`. Set `at` to your real date (ISO with a timezone).
 */
export const launch = {
  at: '2027-03-02T17:00:00Z',
  prefix: 'Launching in',
  live: 'Launching any day now',
  units: { d: 'd', h: 'h', m: 'm', s: 's' },
}

/** Text on the laptop's bottom bezel. Keep it generic (no trademarks). */
export const deviceLabel = 'Laptop'

/** Footer and the small header on inner pages. */
export const site = {
  footerNote: 'Made for teams who are tired of tab-hopping.',
  links: [
    { label: 'Features', href: '/#features' },
    { label: 'Move up the list', href: '/#referrals' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Email preview', href: '/email-preview' },
    { label: 'Style guide', href: '/styleguide' },
  ],
  headerCta: 'Join the waitlist',
}

/** Press / social proof strip under the fold. Names are placeholders. */
export const press = {
  label: 'As featured in',
  outlets: ['The Launchpad', 'Product Weekly', 'Makers Daily', 'Stackline', 'Remote Review'],
  quote: '“The calmest project tool we have tried this year.”',
  quoteSource: 'Product Weekly',
}

/** Features preview: one card per animated mock in FeatureMocks.tsx. */
export const features = {
  eyebrow: 'A first look',
  title: 'Everything your team juggles, in one calm place.',
  body: 'A peek at what founding members get on day one. Each piece works on its own and better together.',
  items: [
    { mock: 'board', title: 'Projects that move', body: 'Boards, lists and timelines that stay in sync. Drag a card and everyone sees it land.' },
    { mock: 'docs', title: 'Docs next to the work', body: 'Write specs and notes right beside the tasks they describe. No more lost links.' },
    { mock: 'chat', title: 'Chat with context', body: 'Threads live on the project, so decisions stay with the work they changed.' },
    { mock: 'dashboard', title: 'One simple dashboard', body: 'See progress across every team at a glance, without building a report.' },
  ],
} as const

/** "Move up the list": the referral mechanic. BOOST lives in src/worker/rank.ts. */
export const referrals = {
  eyebrow: 'Move up the list',
  title: 'Invite friends, skip the line.',
  body: 'Every friend who joins with your link moves you up the waitlist. The top of the list gets in first.',
  steps: [
    { title: 'Join the waitlist', body: 'Drop your email above to get your own share link.' },
    { title: 'Share your link', body: 'Send it to a teammate or a friend who juggles too many apps.' },
    { title: 'Jump ahead', body: 'Each friend who joins moves you up {boost} places.' },
  ],
  leaderboardTitle: 'Top referrers',
  leaderboardEmpty: 'No referrals yet. Share your link and take the top spot.',
  leaderboardError: "The leaderboard couldn't load right now.",
  cta: 'Get your link',
}

export const founder = {
  eyebrow: 'A note from the founder',
  paragraphs: [
    'We built Flowdesk because our own team was spread across nine apps and still missed the one message that mattered.',
    "So we started again with one rule: the work, the docs and the conversation belong in the same place. We're letting people in slowly so we can listen to every one of you.",
  ],
  name: 'Maya Lindqvist',
  role: 'Co-founder, Flowdesk',
  initials: 'ML',
}

export const faq = {
  eyebrow: 'Questions',
  title: 'Frequently asked',
  items: [
    { q: 'When does Flowdesk launch?', a: 'We open to the first wave on the date in the countdown, then let more people in every week, starting from the top of the list.' },
    { q: 'How do I move up the list?', a: 'Share your personal link. Each friend who joins with it moves you up a few places. Your status page shows your current spot and referrals.' },
    { q: 'Is it free?', a: 'Founding members get Flowdesk free during early access and keep a founding discount when paid plans arrive.' },
    { q: 'What do you do with my email?', a: 'We only use it to tell you when your spot opens and to send launch news. No spam, and you can leave the list at any time by replying to any email.' },
    { q: 'Can I bring my whole team?', a: 'Yes. When your spot opens you can invite your team straight away, and they skip the line with you.' },
  ],
}

export const statusPage = {
  title: 'Your spot',
  lead: 'Every friend who joins with your link moves you up {boost} places.',
  startedAt: 'You joined at #{n}.',
  movedUp: 'Referrals moved you up {n} places.',
  referralsLabel: 'Friends joined',
  aheadLabel: 'People ahead of you',
  shareTitle: 'Share your link',
  notFoundTitle: "We couldn't find that spot.",
  notFoundBody: 'The link may be mistyped, or the list was reset. Join again to get a fresh link.',
}

export const emailPreview = {
  title: 'Confirmation email',
  lead: 'The design of the email people get after joining. This template never sends it: wire it to your email provider when you are ready.',
  subject: "You're on the Flowdesk waitlist",
  preheader: 'Your spot is saved. Share your link to move up.',
}

export const notFound = {
  title: "This page isn't on the list.",
  body: "The page you're looking for doesn't exist or has moved.",
  cta: 'Back to the waitlist',
}
