// Mirrors the @theme tokens in src/styles.css for the /styleguide page.
// Change a value there, then here.

export const colorGroups: Array<{ name: string; note: string; colors: Array<[string, string, string?]> }> = [
  {
    name: 'Brand',
    note: '`brand` passes AA for text and buttons on white. `brand-bright` is the wordmark/display orange: large type and decoration only.',
    colors: [
      ['brand', '#d63f0f'],
      ['brand-hover', '#bf370c'],
      ['brand-press', '#a6300a'],
      ['brand-bright', '#f24e1e'],
      ['brand-soft', '#fde7e0', 'Highlight block'],
      ['brand-tint', '#fff4f0'],
    ],
  },
  {
    name: 'Neutrals',
    note: 'Ink for headings, fg for UI text, muted for secondary copy (AA on white and canvas).',
    colors: [
      ['ink', '#0b1020'],
      ['fg', '#111827'],
      ['body', '#374151'],
      ['muted', '#626977'],
      ['faint', '#687080'],
      ['line', '#e5e7eb'],
      ['line-soft', '#eef0f3'],
      ['subtle', '#f3f4f6'],
      ['canvas', '#fafafb'],
      ['surface', '#ffffff'],
      ['navy', '#0a0e1c'],
      ['navy-2', '#141a2e'],
    ],
  },
  {
    name: 'Status & resources',
    note: 'Each resource kind has a tone: desks brand, rooms teal, parking slate, lockers amber.',
    colors: [
      ['free', '#10a37f'],
      ['free-soft', '#e3f6f0'],
      ['busy', '#9aa1ad'],
      ['busy-soft', '#eef0f3'],
      ['teal', '#149e93'],
      ['teal-soft', '#e5f6f4'],
      ['slate', '#475569'],
      ['slate-soft', '#edf1f6'],
      ['amber', '#8f5600'],
      ['amber-icon', '#f0a320'],
      ['amber-soft', '#fef3dc'],
      ['violet', '#6d4fd8'],
      ['violet-soft', '#efebfd'],
      ['danger', '#b42318'],
      ['danger-soft', '#fdecec'],
    ],
  },
]

export const typeScale: Array<{ token: string; size: number; line: number; weight: number; sample: string }> = [
  { token: 'display (hero, 72 on desktop)', size: 72, line: 88, weight: 700, sample: 'Your office' },
  { token: 'h2', size: 40, line: 48, weight: 700, sample: 'Section title' },
  { token: 'h3', size: 22, line: 30, weight: 700, sample: 'Card or dialog title' },
  { token: 'lead (hero copy, 21 on desktop)', size: 20, line: 32, weight: 400, sample: 'DeskFlow makes it effortless to book desks.' },
  { token: 'app h1', size: 20, line: 28, weight: 700, sample: 'Good morning, Lisa' },
  { token: 'lg', size: 17, line: 26, weight: 600, sample: 'Get started free' },
  { token: 'base', size: 15, line: 24, weight: 400, sample: 'Body copy on the landing page.' },
  { token: 'sm', size: 13, line: 20, weight: 500, sample: 'App UI text, nav items, card titles' },
  { token: 'xs', size: 12, line: 16, weight: 400, sample: 'Meta lines, dates, helper text' },
  { token: '2xs', size: 11, line: 16, weight: 600, sample: 'BADGES AND EYEBROWS' },
]

export const weights = [400, 500, 600, 700, 800]

export const spacing = [4, 6, 8, 10, 12, 14, 16, 20, 24, 32, 40, 56, 96]

export const radii: Array<[string, string]> = [
  ['xs', '3px'],
  ['sm', '5px'],
  ['md', '8px'],
  ['lg', '10px'],
  ['xl', '14px'],
  ['full', '9999px'],
]

export const shadows: Array<[string, string]> = [
  ['card', 'Resting cards'],
  ['soft', 'Soft button, hovered cards'],
  ['button', 'Primary button (md, lg)'],
  ['pop', 'Popovers, dialogs, toasts'],
  ['window', 'The hero app window'],
]
