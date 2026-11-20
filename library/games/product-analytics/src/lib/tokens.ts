// Design tokens as data, for the style guide. The CSS source of truth is the
// @theme block in src/styles.css; keep both in step.

export const colorTokens = [
  {
    group: 'Canvas',
    items: [
      { name: 'sky', hex: '#b8d5ec', use: 'Hero sky fill, theme colour' },
      { name: 'haze', hex: '#dfe8ee', use: 'Page-header gradient' },
      { name: 'paper', hex: '#f5f7f2', use: 'Page background' },
      { name: 'card', hex: '#ffffff', use: 'Cards, inputs' },
      { name: 'wash', hex: '#f4f5f3', use: 'Nested surfaces, filter pills' },
      { name: 'wash-2', hex: '#eceeea', use: 'Tracks, segmented background' },
      { name: 'line', hex: '#e3e6e0', use: 'Hairlines' },
      { name: 'line-strong', hex: '#cfd4cc', use: 'Input borders' },
    ],
  },
  {
    group: 'Text',
    items: [
      { name: 'ink', hex: '#121511', use: 'Headings, primary text' },
      { name: 'body', hex: '#2f3530', use: 'Body copy' },
      { name: 'muted', hex: '#586159', use: 'Secondary copy (7.1:1 on white)' },
      { name: 'faint', hex: '#636c64', use: 'Meta text (5.0:1 on wash)' },
      { name: 'on-dark', hex: '#f7f8f5', use: 'Text on night' },
    ],
  },
  {
    group: 'Accent',
    items: [
      { name: 'lime', hex: '#9fe270', use: 'Primary buttons, fills, highlights' },
      { name: 'lime-hover', hex: '#8fd85d', use: 'Primary hover' },
      { name: 'lime-press', hex: '#7fcb4c', use: 'Primary pressed' },
      { name: 'lime-soft', hex: '#e6f8d8', use: 'Tinted chips and icons' },
      { name: 'leaf', hex: '#3b7a1a', use: 'Accent text, links, focus ring' },
      { name: 'leaf-deep', hex: '#2a5a12', use: 'Link hover, text on lime-soft' },
      { name: 'night', hex: '#141714', use: 'Secondary buttons, dark bands' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'ok', hex: '#24722f', use: 'Operational, gains (with icon)' },
      { name: 'ok-soft', hex: '#e3f5e4', use: 'Success backgrounds' },
      { name: 'warn', hex: '#9a6200', use: 'Degraded, spikes (with icon)' },
      { name: 'warn-soft', hex: '#fdf1d9', use: 'Warning backgrounds' },
      { name: 'bad', hex: '#b23224', use: 'Errors, drops (with icon)' },
      { name: 'bad-soft', hex: '#fbe5e1', use: 'Error backgrounds' },
    ],
  },
] as const

export const typeScale = [
  { name: 'Display', cls: 'font-display text-[56px] font-bold leading-[0.99] tracking-[-0.045em]', spec: 'Plus Jakarta Sans 700, 56/55, −4.5%' },
  { name: 'H1', cls: 'font-display text-[44px] font-bold leading-[1.05] tracking-[-0.04em]', spec: 'Plus Jakarta Sans 700, 44/46, −4%' },
  { name: 'H2', cls: 'font-display text-[28px] font-bold tracking-[-0.035em]', spec: 'Plus Jakarta Sans 700, 28, −3.5%' },
  { name: 'H3', cls: 'font-display text-[19px] font-bold tracking-[-0.025em]', spec: 'Plus Jakarta Sans 700, 19, −2.5%' },
  { name: 'Body', cls: 'text-[16px] leading-relaxed', spec: 'Inter 400, 16/26' },
  { name: 'Small', cls: 'text-[14px]', spec: 'Inter 400, 14' },
  { name: 'Mono', cls: 'font-mono text-[13px]', spec: 'JetBrains Mono 400, 13' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 128]

export const radii = [
  { name: 'pill', value: '999px', use: 'Buttons, chips, segmented' },
  { name: 'control', value: '12px', use: 'Inputs' },
  { name: 'card-sm', value: '16px', use: 'Small cards, notices' },
  { name: 'frame', value: '18px', use: 'Product mock' },
  { name: 'card', value: '22px', use: 'Cards' },
]

export const shadows = [
  { name: 'card', cls: 'shadow-card', use: 'Resting cards' },
  { name: 'raised', cls: 'shadow-raised', use: 'Featured plan, auth card' },
  { name: 'mock', cls: 'shadow-mock', use: 'Hero product mock' },
  { name: 'pop', cls: 'shadow-pop', use: 'Menus, tooltips' },
]

export const motionTokens = [
  { name: 'ease-brand', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, reveals, the mock rising' },
  { name: 'ease-soft', value: 'cubic-bezier(0.33, 1, 0.68, 1)', use: 'Small state changes' },
  { name: 'reveal', value: '700 ms, y 18 → 0', use: 'Sections on scroll' },
  { name: 'hero mock', value: '1100 ms, y 60 → 0, delay 250 ms', use: 'Mock rising out of the meadow' },
  { name: 'parallax', value: '0 → 90 px over the hero', use: 'Mock sinks behind the hills as you scroll' },
  { name: 'shimmer', value: '1.4 s linear, infinite', use: 'Loading skeletons' },
  { name: 'signal feed', value: 'new row every 2.8 s', use: 'Pauses on hover; off with reduced motion' },
]
