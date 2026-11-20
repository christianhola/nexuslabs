// Names of the design tokens in styles.css, for /styleguide. Values are read
// from the live CSS at runtime, so this list only needs the names and notes.

export const colorTokens: Array<{ group: string; tokens: Array<{ name: string; note: string }> }> = [
  {
    group: 'Surfaces',
    tokens: [
      { name: 'page', note: 'Page background, cards' },
      { name: 'stage', note: 'Device stage, alternate sections' },
      { name: 'sunken', note: 'Wells, neutral chips, skeletons' },
    ],
  },
  {
    group: 'Text',
    tokens: [
      { name: 'ink', note: 'Headings, strong text' },
      { name: 'body', note: 'Paragraphs' },
      { name: 'muted', note: 'Secondary text (AA on page and stage)' },
      { name: 'faint', note: 'Placeholders and decoration only' },
    ],
  },
  {
    group: 'Lines',
    tokens: [
      { name: 'line', note: 'Control borders' },
      { name: 'line-strong', note: 'Hovered borders' },
      { name: 'line-soft', note: 'Card borders, dividers' },
    ],
  },
  {
    group: 'Accent',
    tokens: [
      { name: 'accent', note: 'Brand orange: fills, dots, focus ring' },
      { name: 'accent-strong', note: 'Display text, 3:1 on white' },
      { name: 'accent-ink', note: 'Small text and links, 4.5:1' },
      { name: 'accent-fill', note: 'Primary button, white text 4.5:1' },
      { name: 'accent-hover', note: 'Primary hover' },
      { name: 'accent-press', note: 'Primary pressed' },
      { name: 'accent-soft', note: 'Tints, highlighted rows' },
    ],
  },
  {
    group: 'Status',
    tokens: [
      { name: 'success', note: 'Live dot, check' },
      { name: 'success-ink', note: 'Success text' },
      { name: 'success-soft', note: 'Success tint' },
      { name: 'danger', note: 'Errors, invalid fields' },
      { name: 'danger-ink', note: 'Error text on tints' },
      { name: 'danger-soft', note: 'Error tint' },
    ],
  },
]

export const typeScale: Array<{ token: string; className: string; weights: string; use: string }> = [
  { token: 'display', className: 'text-display font-bold', weights: '700', use: 'Hero headline' },
  { token: 'title', className: 'text-title font-bold', weights: '700', use: 'Section and page titles (28px on mobile)' },
  { token: 'heading', className: 'text-heading font-semibold', weights: '600', use: 'Card titles' },
  { token: 'lead', className: 'text-lead', weights: '400, 500', use: 'Intro copy, buttons, inputs' },
  { token: 'copy', className: 'text-copy', weights: '400, 500', use: 'Body text in sections' },
  { token: 'small', className: 'text-small', weights: '400, 500', use: 'Notes, meta, errors' },
  { token: 'micro', className: 'text-micro font-medium', weights: '500', use: 'Badges, captions, table heads' },
]

export const spacing = [4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 80, 112]

export const radii = [
  { name: 'control', note: 'Buttons, inputs (near-square, like the reference)' },
  { name: 'card', note: 'Cards, callouts, mocks' },
  { name: 'full', note: 'Badges, avatars, dots' },
]

export const shadows = [
  { name: 'control', note: 'Resting controls' },
  { name: 'card', note: 'Cards' },
  { name: 'raised', note: 'Hovered cards' },
  { name: 'focus', note: 'Keyboard focus ring' },
  { name: 'focus-danger', note: 'Focus on an invalid field' },
]

export const motionTokens = {
  durations: [
    { name: 'fast', note: 'Hover, press, colour' },
    { name: 'base', note: 'Swaps, accordions' },
    { name: 'slow', note: 'Entrances, reveals' },
  ],
  easings: [
    { name: 'out-expo', note: 'Default for everything that arrives' },
    { name: 'spring', note: 'Overshoot for pops (success check)' },
  ],
}
