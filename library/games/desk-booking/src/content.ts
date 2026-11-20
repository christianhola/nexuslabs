/*
  Every string on the landing page. App seed data is in src/data.ts.
*/

export const brand = {
  name: 'DeskFlow',
  tagline: 'Your office, organised',
}

export const nav = {
  login: { label: 'Log in', href: '/app' },
  cta: { label: 'Get started free', href: '/app' },
}

export const hero = {
  headline: 'Your office',
  highlight: 'organised',
  sub: "DeskFlow makes it effortless to book desks, meeting rooms, and resources. See who's in the office, coordinate with your team, and never fight over a hot desk again.",
  cta: { label: 'Get started free', href: '/app' },
  mockTitle: 'DeskFlow — Dashboard',
}

export const logos = ['Northwind', 'Lumen & Co', 'Halcyon', 'Fieldnote', 'Brightline', 'Oakridge']

export const stats = [
  { value: '38%', label: 'less desk space needed' },
  { value: '2 clicks', label: 'to book a desk' },
  { value: '1,200+', label: 'offices run on DeskFlow' },
  { value: '4.9/5', label: 'average admin rating' },
]

export const features = {
  eyebrow: 'Everything in one place',
  title: 'Built for the way hybrid teams actually work',
  sub: 'Desks, rooms, parking and lockers share one calendar, so nothing double-books and nobody wanders the floor looking for a seat.',
  items: [
    { icon: 'map', tone: 'brand', title: 'Live floor map', body: 'See every desk and room by availability. Click a green desk, pick a time, done.' },
    { icon: 'door', tone: 'teal', title: 'Meeting rooms', body: 'A day timeline per room. Drag-free booking, clash detection and a clear “now” line.' },
    { icon: 'car', tone: 'slate', title: 'Parking & lockers', body: 'Bays with EV chargers and lockers by floor, booked for the day alongside your desk.' },
    { icon: 'users', tone: 'violet', title: "Who's in today", body: 'Find teammates on the map and pick the days your team overlaps.' },
    { icon: 'calendar', tone: 'amber', title: 'Week planner', body: 'Mark office, remote or off per day and book a desk near your team in one go.' },
    { icon: 'ruler', tone: 'teal', title: 'Floor plan editor', body: 'Admins add and move desks by dragging. Bookings follow the desk.' },
  ],
} as const

export const steps = {
  eyebrow: 'How it works',
  title: 'Up and running before lunch',
  items: [
    { title: 'Draw your office', body: 'Drop desks and rooms onto the plan, or start from our template floors.' },
    { title: 'Invite your team', body: 'Everyone picks an office and a home team, so DeskFlow can seat people together.' },
    { title: 'Book in two clicks', body: 'Desks, rooms, parking. Check in when you arrive; no-shows free up automatically.' },
  ],
}

export const testimonials = {
  title: 'Teams that stopped hunting for desks',
  items: [
    { quote: 'We went from a spreadsheet and a Slack channel to DeskFlow in an afternoon. Monday mornings are calm now.', name: 'Priya Raman', role: 'Head of Workplace, Fieldnote', hue: 18 },
    { quote: 'The floor map is the feature. New joiners find their team on day one without asking anyone.', name: 'Daniel Moreau', role: 'COO, Halcyon', hue: 210 },
    { quote: 'Check-in and auto-release gave us back eight desks a day. We cancelled the extra floor.', name: 'Hannah Schmidt', role: 'Office manager, Brightline', hue: 150 },
  ],
}

export const pricing = {
  title: 'Simple pricing that grows with your office',
  sub: 'Every plan includes the floor map, desk and room booking, and unlimited bookings.',
  plans: [
    {
      name: 'Free',
      monthly: 0,
      yearly: 0,
      blurb: 'For small teams finding their rhythm.',
      cta: 'Start free',
      features: ['Up to 10 people', '1 office, 1 floor', 'Desk and room booking', 'Week planner'],
    },
    {
      name: 'Team',
      monthly: 5,
      yearly: 4,
      blurb: 'For hybrid teams across a few floors.',
      cta: 'Start 14-day trial',
      featured: true,
      features: ['Unlimited people', 'Up to 5 floors', 'Parking & lockers', 'Check-in and auto-release', 'Slack and calendar sync'],
    },
    {
      name: 'Business',
      monthly: 9,
      yearly: 7,
      blurb: 'For companies with several offices.',
      cta: 'Talk to us',
      features: ['Unlimited offices', 'Floor plan editor roles', 'SSO and SCIM', 'Usage analytics', 'Priority support'],
    },
  ],
}

export const faq = {
  title: 'Questions, answered',
  items: [
    { q: 'Do people need an account to see who’s in?', a: 'Everyone in your workspace signs in once; after that the floor map, team view and week planner are one click away on web and mobile.' },
    { q: 'What happens if someone doesn’t show up?', a: 'Desks are held until 30 minutes after the booking starts. If nobody checks in, the desk is released for others and the owner is notified.' },
    { q: 'Can we book rooms from our calendar?', a: 'Yes. On Team and Business, rooms appear as resources in Google Calendar and Outlook and bookings sync both ways.' },
    { q: 'How do we set up our floor plan?', a: 'Start from a template, then drag desks into place in the floor plan editor. Most offices are mapped in under an hour.' },
    { q: 'Is there a long contract?', a: 'No. Pay monthly or yearly, add or remove seats any time, and export your data whenever you like.' },
  ],
}

export const cta = {
  title: 'Bring your team back together',
  sub: 'Free for up to 10 people. No credit card.',
  button: 'Get started free',
}

export const footer = {
  blurb: 'Desk, room and resource booking for hybrid offices.',
  columns: [
    { title: 'Product', links: [{ label: 'Features', href: '#features' }, { label: 'Pricing', href: '#pricing' }, { label: 'Open the app', href: '/app' }] },
    { title: 'Resources', links: [{ label: 'How it works', href: '#how' }, { label: 'FAQ', href: '#faq' }, { label: 'Style guide', href: '/styleguide' }] },
  ],
  newsletter: { title: 'Product updates', sub: 'One short email a month.', placeholder: 'you@company.com', button: 'Subscribe' },
  legal: '© 2026 DeskFlow. A Freebuff starter template.',
}
