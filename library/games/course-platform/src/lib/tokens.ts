// Design tokens as data, for the style guide. The CSS source of truth is the
// @theme block in src/styles.css; keep both in step.

export const colorTokens = [
  {
    group: 'Canvas',
    items: [
      { name: 'paper', hex: '#ffffff', use: 'Page background, cards' },
      { name: 'canvas', hex: '#f6f6f7', use: 'Alternate section bands, app background' },
      { name: 'wash', hex: '#f7f7f8', use: 'Nested panels, footer' },
      { name: 'wash-2', hex: '#efeff1', use: 'Tracks, segmented background' },
      { name: 'line', hex: '#ececef', use: 'Hairlines' },
      { name: 'line-strong', hex: '#d9d9de', use: 'Input and outline-button borders' },
    ],
  },
  {
    group: 'Text',
    items: [
      { name: 'ink', hex: '#121214', use: 'Headings, primary text' },
      { name: 'body', hex: '#3f3f46', use: 'Body copy' },
      { name: 'muted', hex: '#5b5b66', use: 'Secondary copy (6.7:1 on white)' },
      { name: 'faint', hex: '#6a6a75', use: 'Meta text (4.65:1 on wash-2)' },
    ],
  },
  {
    group: 'Brand',
    items: [
      { name: 'flame', hex: '#f15a24', use: 'Brand fills, glows, bars, display accents' },
      { name: 'flame-strong', hex: '#d14710', use: 'Primary buttons with white text (4.55:1), focus ring' },
      { name: 'flame-hover', hex: '#bf3f0c', use: 'Primary hover' },
      { name: 'flame-press', hex: '#a9370a', use: 'Primary pressed' },
      { name: 'flame-ink', hex: '#b23c0b', use: 'Orange text on white (5.9:1) and on flame-soft' },
      { name: 'flame-soft', hex: '#fff1ea', use: 'Tinted panels, chips, the New pill' },
      { name: 'flame-tint', hex: '#ffe0d1', use: 'Secondary bars, soft hover' },
      { name: 'violet', hex: '#6d28d9', use: 'Collaborator cursor, quiz lessons' },
      { name: 'azure', hex: '#1d4ed8', use: 'Collaborator cursor' },
      { name: 'indigo-ink', hex: '#3f48c8', use: 'Beginner badge text, step pills' },
      { name: 'night', hex: '#18181b', use: 'Dark buttons, the teams band, toasts' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'ok', hex: '#146c34', use: 'Published, gains (with icon)' },
      { name: 'ok-soft', hex: '#e7f6ec', use: 'Success backgrounds' },
      { name: 'warn', hex: '#8a5306', use: 'Draft, low completion' },
      { name: 'warn-soft', hex: '#fdf4dc', use: 'Warning backgrounds' },
      { name: 'bad', hex: '#b91c1c', use: 'Errors, destructive actions' },
      { name: 'bad-soft', hex: '#fde8e8', use: 'Error backgrounds' },
    ],
  },
] as const

export const typeScale = [
  { name: 'Display', cls: 'font-display text-[62px] font-light leading-[1.08] tracking-[-0.03em] text-ink', sample: 'Build and Sell', spec: 'Outfit 300, 62/67, −3%' },
  { name: 'Display strong', cls: 'font-display text-[62px] font-medium leading-[1.08] tracking-[-0.03em] text-ink', sample: 'Courses That Stick', spec: 'Outfit 500, 62/67, −3%' },
  { name: 'H1', cls: 'font-display text-[44px] font-medium leading-[1.1] tracking-[-0.025em] text-ink', sample: 'Simple plans', spec: 'Outfit 500, 44, −2.5%' },
  { name: 'H2', cls: 'font-display text-[38px] font-medium tracking-[-0.025em] text-ink', sample: 'Smart features', spec: 'Outfit 500, 38, −2.5%' },
  { name: 'H3', cls: 'font-display text-[19px] font-medium tracking-[-0.015em] text-ink', sample: 'Interactive quizzes', spec: 'Outfit 500, 19, −1.5%' },
  { name: 'Lead', cls: 'text-[17px] leading-[1.6] text-muted', sample: 'Stay on top of every course.', spec: 'Figtree 400, 17/27' },
  { name: 'Body', cls: 'text-[15px] leading-relaxed text-body', sample: 'Learners who finish buy again.', spec: 'Figtree 400, 15/24' },
  { name: 'Small', cls: 'text-[13px] text-muted', sample: '12 lessons, 4.5 hours', spec: 'Figtree 400, 13' },
  { name: 'Mono', cls: 'font-mono text-[13px] text-ink', sample: '7Q4K2M', spec: 'JetBrains Mono 400, 13' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 112]

export const radii = [
  { name: 'control', value: '10px', use: 'Buttons, inputs, chips' },
  { name: 'card-sm', value: '14px', use: 'Mock cards, notices' },
  { name: 'card', value: '18px', use: 'Cards' },
  { name: 'panel', value: '24px', use: 'Large panels, photos, dialogs' },
  { name: 'full', value: '999px', use: 'Pills, avatars, dots (.round)' },
]

export const shadows = [
  { name: 'card', cls: 'shadow-card', use: 'Resting cards' },
  { name: 'float', cls: 'shadow-float', use: 'Hero mock cards, dialogs, featured plan' },
  { name: 'pop', cls: 'shadow-pop', use: 'Menus, toasts, dragged rows' },
  { name: 'glow', cls: 'shadow-glow', use: 'Primary button' },
]

export const motionTokens = [
  { name: 'ease-brand', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, reveals, the hero cards rising' },
  { name: 'ease-soft', value: 'cubic-bezier(0.33, 1, 0.68, 1)', use: 'Small state changes' },
  { name: 'rise', value: '800 ms, y 24 → 0, staggered 150 / 400 / 550 ms', use: 'Hero mock cards' },
  { name: 'reveal', value: '700 ms, y 18 → 0', use: 'Sections on scroll' },
  { name: 'float', value: '6 s ease-in-out, ±6 px', use: 'Collaborator cursors drifting' },
  { name: 'reorder', value: 'layout spring', use: 'Lessons sliding as you drag' },
  { name: 'shimmer', value: '1.4 s linear, infinite', use: 'Loading skeletons' },
]
