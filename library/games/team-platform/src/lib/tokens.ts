// Mirrors the @theme tokens in src/styles.css for the style guide.
export const colorTokens: { group: string; items: { name: string; hex: string; use: string }[] }[] = [
  {
    group: 'Canvas',
    items: [
      { name: 'page', hex: '#ffffff', use: 'Page background' },
      { name: 'backdrop', hex: '#f4f4f3', use: 'Page edges, tinted bands' },
      { name: 'mist', hex: '#f6f6f5', use: 'Secondary buttons, wells' },
      { name: 'mist-2', hex: '#efefed', use: 'Pressed wells, skeletons' },
      { name: 'line', hex: '#e6e6e3', use: 'Hairlines, card borders' },
      { name: 'line-strong', hex: '#d2d2ce', use: 'Inputs, dividers' },
    ],
  },
  {
    group: 'Text',
    items: [
      { name: 'ink', hex: '#0f0f0f', use: 'Headings, line art' },
      { name: 'body', hex: '#2a2a2a', use: 'Body copy' },
      { name: 'muted', hex: '#525252', use: 'Secondary copy' },
      { name: 'faint', hex: '#666664', use: 'Captions, placeholders (AA)' },
    ],
  },
  {
    group: 'Accent',
    items: [
      { name: 'mint', hex: '#7ee07b', use: 'Primary fill, done states' },
      { name: 'mint-hover', hex: '#6ed76b', use: 'Primary hover' },
      { name: 'mint-press', hex: '#5ecb5b', use: 'Primary pressed' },
      { name: 'mint-soft', hex: '#e6f8e4', use: 'Selected rows, chips' },
      { name: 'leaf', hex: '#1f7a2a', use: 'Green text (AA)' },
      { name: 'night', hex: '#111111', use: 'Dark buttons, tags' },
    ],
  },
  {
    group: 'Status',
    items: [
      { name: 'ok', hex: '#1f7a2a', use: 'Success text' },
      { name: 'warn', hex: '#8a5a00', use: 'Warning text' },
      { name: 'bad', hex: '#b42318', use: 'Errors' },
      { name: 'bad-soft', hex: '#fde8e6', use: 'Error wells' },
    ],
  },
]

export const typeScale = [
  { name: 'Display', cls: 'font-display text-[64px] font-semibold leading-[1.02] tracking-[-0.045em]', sample: 'Bring everyone in', spec: 'Inter Tight 600 · 64/65 · −4.5%' },
  { name: 'H1', cls: 'font-display text-[48px] font-semibold leading-[1.05] tracking-[-0.04em]', sample: 'Everything in one app', spec: 'Inter Tight 600 · 48/50 · −4%' },
  { name: 'H2', cls: 'font-display text-[36px] font-semibold leading-[1.1] tracking-[-0.035em]', sample: 'A living map of your company', spec: 'Inter Tight 600 · 36/40 · −3.5%' },
  { name: 'H3', cls: 'font-display text-[22px] font-semibold leading-[1.25] tracking-[-0.02em]', sample: 'News that lands', spec: 'Inter Tight 600 · 22/28 · −2%' },
  { name: 'Stat', cls: 'font-display text-[42px] font-medium leading-none tracking-[-0.04em]', sample: '81.4%', spec: 'Inter Tight 500 · 42 · −4%' },
  { name: 'Lead', cls: 'text-[19px] leading-[1.65]', sample: 'Simple, fast and friendly.', spec: 'Inter 400 · 19/31' },
  { name: 'Body', cls: 'text-[16px] leading-[1.6]', sample: 'Post once and reach every team.', spec: 'Inter 400 · 16/26' },
  { name: 'Small', cls: 'text-[14px] leading-[1.5]', sample: 'Average app store rating', spec: 'Inter 400 · 14/21' },
  { name: 'Caption', cls: 'text-[12.5px] font-medium leading-[1.4] text-faint', sample: 'Synced 06:00 from Personio', spec: 'Inter 500 · 12.5/17.5' },
]

export const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

export const radii = [
  { name: 'button', px: 9 },
  { name: 'control', px: 10 },
  { name: 'card-sm', px: 14 },
  { name: 'card', px: 20 },
  { name: 'round', px: 999 },
]

export const shadows = [
  { name: 'button', value: 'var(--shadow-button)' },
  { name: 'card', value: 'var(--shadow-card)' },
  { name: 'raised', value: 'var(--shadow-raised)' },
  { name: 'pop', value: 'var(--shadow-pop)' },
]

export const motionTokens = [
  { name: 'ease-brand', value: 'cubic-bezier(0.22, 1, 0.36, 1)', use: 'Entrances, menus, tabs' },
  { name: 'ease-soft', value: 'cubic-bezier(0.33, 1, 0.68, 1)', use: 'Hover and colour changes' },
  { name: 'bob', value: '6s ease-in-out infinite', use: 'Floating hero cards' },
  { name: 'typing', value: '1.2s ease-in-out infinite', use: 'Chat typing dots' },
  { name: 'draw', value: '0.9s ease-brand', use: 'Hand-drawn underline' },
  { name: 'pop-in', value: '0.5s ease-brand', use: 'New feed posts and chat bubbles' },
]
