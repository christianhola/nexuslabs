/* Mirrors src/styles.css for the style guide. Keep the two in step. */
export const colorTokens: { group: string; items: { name: string; hex: string; use: string }[] }[] = [
  {
    group: 'Canvas',
    items: [
      { name: 'night', hex: '#0a0811', use: 'Page background' },
      { name: 'night-2', hex: '#0e0c16', use: 'Inputs, sunken areas' },
      { name: 'panel', hex: '#13111b', use: 'Cards and dialogs' },
      { name: 'panel-2', hex: '#1a1724', use: 'Raised rows, chips' },
      { name: 'panel-3', hex: '#221f2d', use: 'Selected segment, tracks' },
      { name: 'line', hex: '#24212e', use: 'Dividers' },
      { name: 'line-strong', hex: '#36323f', use: 'Control borders' },
    ],
  },
  {
    group: 'Text',
    items: [
      { name: 'white', hex: '#ffffff', use: 'Display type' },
      { name: 'ink', hex: '#f6f4fa', use: 'Headings, labels' },
      { name: 'body', hex: '#d9d6e2', use: 'Paragraphs' },
      { name: 'muted', hex: '#9b97a8', use: 'Secondary text' },
      { name: 'faint', hex: '#8a8697', use: 'Captions, meta' },
    ],
  },
  {
    group: 'Accent',
    items: [
      { name: 'pink', hex: '#f06acd', use: 'Display emphasis, fills' },
      { name: 'pink-strong', hex: '#e548bf', use: 'Toggles, pink buttons' },
      { name: 'pink-fill', hex: '#c42f9f', use: 'Pink buttons behind white text' },
      { name: 'pink-text', hex: '#f47fd6', use: 'Eyebrows, links' },
      { name: 'pink-soft', hex: '#f9c9ee', use: 'Gradient start, cursor chip' },
      { name: 'violet', hex: '#8b5cf6', use: 'Charts, glows' },
      { name: 'ink-blue', hex: '#3038d6', use: 'Primary action' },
      { name: 'paper', hex: '#fbfaf7', use: 'Issue canvas' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'ok', hex: '#4ad295', use: 'Positive change, paid' },
      { name: 'warn', hex: '#f2b84b', use: 'Processing, saving' },
      { name: 'bad', hex: '#ff7a7a', use: 'Errors, negative change' },
    ],
  },
]

export const typeScale = [
  { name: 'Display XL', cls: 'display text-[44px] uppercase sm:text-[62px] sm:leading-[66px]', size: 'Archivo 900 / 62 on 66', sample: 'One platform.' },
  { name: 'Display L', cls: 'display text-[40px] uppercase sm:text-[56px]', size: 'Archivo 900 / 56', sample: 'Stand out' },
  { name: 'Display M', cls: 'display text-[34px] uppercase sm:text-[44px]', size: 'Archivo 900 / 44', sample: 'Compare plans' },
  { name: 'Eyebrow', cls: 'text-[19px] font-medium text-pink-text', size: 'DM Sans 500 / 19', sample: 'Newsletter' },
  { name: 'Lede', cls: 'text-[21px] leading-[1.55] text-ink', size: 'DM Sans 400 / 21', sample: 'One home for independent writers.' },
  { name: 'Body', cls: 'text-[16px] leading-relaxed text-body', size: 'DM Sans 400 / 16', sample: 'Write, grow your list and get paid.' },
  { name: 'Small', cls: 'text-[14px] text-muted', size: 'DM Sans 400 / 14', sample: 'Free up to 2,500 subscribers.' },
  { name: 'Metric', cls: 'text-[32px] font-medium tabular-nums tracking-[-0.02em] text-white', size: 'DM Sans 500 / 32', sample: '372,096' },
  { name: 'Issue serif', cls: 'font-serif text-[32px] font-semibold text-ink', size: 'Fraunces 600 / 32', sample: 'The quiet hour' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 56, 80, 104]
export const radii = [
  { name: 'control', value: '8px', use: 'Buttons, inputs' },
  { name: 'card', value: '14px', use: 'Cards, tiles' },
  { name: 'card-lg', value: '20px', use: 'Dialogs, feature frames' },
  { name: 'round', value: '999px', use: 'Avatars, toggles (.round)' },
]
export const shadows = [
  { name: 'card', value: 'var(--shadow-card)' },
  { name: 'pop', value: 'var(--shadow-pop)' },
  { name: 'glow', value: 'var(--shadow-glow)' },
]
export const motionTokens = [
  { name: 'ease-brand', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, hovers' },
  { name: 'reveal', value: '700 ms, 18 px rise', use: 'Sections on scroll' },
  { name: 'hero lines', value: '800 ms, 60 ms stagger', use: 'Headline entrance' },
  { name: 'marquee', value: '38 s linear loop', use: 'Publisher strip' },
  { name: 'dialog', value: '320 ms', use: 'Modal and drawer' },
]
