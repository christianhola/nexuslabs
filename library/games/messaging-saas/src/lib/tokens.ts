// Mirrors the @theme block in styles.css, for the style guide.
export const colorTokens = [
  { group: 'Surfaces', items: [
    { name: 'bg', hex: '#080b17', use: 'Page canvas' },
    { name: 'night', hex: '#0c1230', use: 'Hero glow, feature panels' },
    { name: 'panel', hex: '#1a1d26', use: 'Proof band, cards' },
    { name: 'panel-2', hex: '#21242e', use: 'Raised cards, tooltips' },
    { name: 'tile', hex: '#1d2029', use: 'Logo tiles' },
    { name: 'raised', hex: '#2a2e3a', use: 'Incoming bubbles' },
  ] },
  { group: 'Text', items: [
    { name: 'fg', hex: '#ffffff', use: 'Headings, body on dark' },
    { name: 'soft', hex: '#d7dae3', use: 'Secondary body' },
    { name: 'muted', hex: '#a7acbc', use: 'Descriptions' },
    { name: 'faint', hex: '#8b91a3', use: 'Meta, captions' },
  ] },
  { group: 'Brand', items: [
    { name: 'cobalt', hex: '#2f66e8', use: 'Primary buttons, outgoing bubbles' },
    { name: 'cobalt-hover', hex: '#2456d6', use: 'Primary hover' },
    { name: 'cobalt-text', hex: '#7aa4ff', use: 'Links and eyebrows on dark' },
    { name: 'cherry', hex: '#ef3b2d', use: 'Accent fills' },
    { name: 'cherry-text', hex: '#ff7a6e', use: 'Errors on dark' },
    { name: 'saffron', hex: '#f6b928', use: 'Accent, guarantee' },
    { name: 'mint', hex: '#3ccf91', use: 'Success fills' },
    { name: 'mint-text', hex: '#5fe0a8', use: 'Success text' },
  ] },
]

export const typeScale = [
  { name: 'Display XL', cls: 'font-display text-[70px] font-medium leading-[1.12] tracking-[-0.022em]', spec: 'Red Hat Display 500 · 70/78' },
  { name: 'Display L', cls: 'font-display text-[52px] font-medium leading-[1.08] tracking-[-0.025em]', spec: 'Red Hat Display 500 · 52/56' },
  { name: 'Heading', cls: 'font-display text-[44px] font-medium leading-[1.1] tracking-[-0.025em]', spec: 'Red Hat Display 500 · 44/48' },
  { name: 'Title', cls: 'font-display text-[26px] font-medium tracking-[-0.02em]', spec: 'Red Hat Display 500 · 26' },
  { name: 'Body L', cls: 'text-[17px] leading-[1.6]', spec: 'Red Hat Text 400 · 17/27' },
  { name: 'Body', cls: 'text-[15px] leading-[1.6]', spec: 'Red Hat Text 400 · 15/24' },
  { name: 'Eyebrow', cls: 'text-[13px] font-semibold uppercase tracking-[0.14em]', spec: 'Red Hat Text 600 · 13 · +0.14em' },
  { name: 'Caption', cls: 'text-[12px]', spec: 'Red Hat Text 400 · 12' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 32, 48, 72, 112]

export const radii = [
  { name: 'control', value: '8px' },
  { name: 'bubble', value: '18px / 6px' },
  { name: 'card', value: '20px' },
  { name: 'panel', value: '32px' },
  { name: 'pill', value: '999px' },
]

export const shadows = [
  { name: 'card', cls: 'shadow-card' },
  { name: 'float', cls: 'shadow-float' },
  { name: 'glow', cls: 'shadow-glow' },
]

export const motion = [
  { name: 'rise', cls: 'animate-rise', spec: '700ms · ease-brand · entrances' },
  { name: 'pop', cls: 'animate-pop', spec: '420ms · ease-brand · new messages' },
  { name: 'float', cls: 'animate-float', spec: '8s loop · decorative renders' },
  { name: 'typing', cls: '', spec: '1.2s loop · typing dots' },
  { name: 'marquee', cls: '', spec: '40s linear · logo row' },
]
