// Design tokens as data, for the style guide and for motion code. The CSS
// source of truth is the @theme block in src/styles.css; keep both in step.

export const colorTokens = [
  { group: 'Canvas', items: [
    { name: 'bg', hex: '#000000', use: 'Page background' },
    { name: 'surface', hex: '#0c0c0d', use: 'Cards, tiles' },
    { name: 'surface-2', hex: '#141415', use: 'Hovered / open cards' },
    { name: 'raised', hex: '#1b1b1d', use: 'Nav pill, dark buttons' },
  ] },
  { group: 'Text', items: [
    { name: 'fg', hex: '#ffffff', use: 'Headings, primary text' },
    { name: 'soft', hex: '#d4d4d8', use: 'Labels, list text' },
    { name: 'muted', hex: '#a1a1a8', use: 'Body copy, captions' },
    { name: 'faint', hex: '#86868e', use: 'Meta text (AA on black)' },
    { name: 'ink', hex: '#0b0b10', use: 'Text on white cards' },
  ] },
  { group: 'Accent', items: [
    { name: 'violet', hex: '#5b3df6', use: 'Primary actions, selection' },
    { name: 'violet-hover', hex: '#6b50ff', use: 'Primary hover' },
    { name: 'violet-text', hex: '#7760ff', use: 'Active nav, links, focus ring' },
    { name: 'violet-soft', hex: '#c9a7f2', use: 'Badges, app icon' },
    { name: 'lilac', hex: '#f5ecfd', use: 'Balance card header' },
  ] },
  { group: 'Signal', items: [
    { name: 'up', hex: '#16a34a', use: 'Money in, success' },
    { name: 'up-soft', hex: '#d9f7e3', use: 'Delta chip on white' },
    { name: 'coin', hex: '#ff5a36', use: 'Coin rim, over-limit, errors' },
  ] },
]

export const typeScale = [
  { name: 'Display XL', cls: 'font-display text-[78px] font-semibold tracking-[-0.038em] leading-[1.04]', spec: 'Inter Tight 600 · 78/81 · −3.8%', sample: 'Revio Landing Page' },
  { name: 'Display L', cls: 'font-display text-[72px] font-semibold tracking-[-0.038em] leading-[1.04]', spec: 'Inter Tight 600 · 72/75 · page h1', sample: 'Pricing that scales' },
  { name: 'Display M', cls: 'font-display text-[52px] font-semibold tracking-[-0.035em] leading-[1.05]', spec: 'Inter Tight 600 · 52/55 · section h2', sample: 'Simple plans' },
  { name: 'Stat', cls: 'font-display text-[44px] font-semibold tracking-[-0.04em]', spec: 'Inter Tight 600 · 44 · tabular', sample: '$4.2B' },
  { name: 'Title', cls: 'font-display text-[28px] font-semibold tracking-[-0.035em]', spec: 'Inter Tight 600 · 28', sample: 'Card settings' },
  { name: 'Card title', cls: 'font-display text-[22px] font-semibold tracking-[-0.03em]', spec: 'Inter Tight 600 · 22', sample: 'Virtual cards in one click' },
  { name: 'Lead', cls: 'text-[19px] leading-relaxed text-muted', spec: 'Inter 400 · 19/1.625', sample: 'Open a business account in minutes.' },
  { name: 'Nav / button', cls: 'text-[17px] font-medium tracking-[-0.01em]', spec: 'Inter 500 · 17', sample: 'Get Started for Free' },
  { name: 'Body', cls: 'text-[15px] leading-relaxed text-muted', spec: 'Inter 400 · 15/1.625', sample: 'Every card swipe lands on the dashboard instantly.' },
  { name: 'Label', cls: 'text-[14px] font-medium text-soft', spec: 'Inter 500 · 14', sample: 'Monthly limit' },
  { name: 'Caption', cls: 'text-[13px] text-muted', spec: 'Inter 400 · 13', sample: 'Oct 28 · 6 min read' },
  { name: 'Micro', cls: 'text-[12px] font-medium', spec: 'Inter 500 · 12 · badges', sample: 'Most popular' },
]

export const spacing = [4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 112]

export const radii = [
  { name: 'button', value: '10px', cls: 'rounded-button' },
  { name: 'control', value: '14px', cls: 'rounded-control' },
  { name: 'card-sm', value: '20px', cls: 'rounded-card-sm' },
  { name: 'card', value: '26px', cls: 'rounded-card' },
  { name: 'full (.round)', value: '9999px', cls: 'rounded-full round' },
]

export const shadows = [
  { name: 'depth', note: 'Inset 1px edge + top highlight. Every bordered surface.', cls: 'depth bg-surface' },
  { name: 'glow-primary', note: 'Primary button lift.', cls: 'bg-violet shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_30px_-12px_rgb(91_61_246/0.9)]' },
  { name: 'card-float', note: 'Payment card over the canvas.', cls: 'bg-raised shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),0_0_0_1px_rgb(255_255_255/0.06)]' },
  { name: 'lilac-float', note: 'White balance card.', cls: 'bg-white shadow-[0_30px_70px_-30px_rgb(140_90_240/0.45)]' },
  { name: 'featured', note: 'Violet edge for the featured plan.', cls: 'depth bg-[linear-gradient(180deg,#1d1640_0%,#0f0d1c_60%)] [--depth-edge:rgb(109_85_255/0.45)]' },
]

export const ease = {
  brand: [0.22, 1, 0.36, 1] as const,
  count: [0.16, 1, 0.3, 1] as const,
  swing: [0.65, 0, 0.35, 1] as const,
}

export const motionTokens = [
  { name: 'fast', duration: 0.2, ease: 'brand', use: 'Hover colour, press scale, tab pill' },
  { name: 'base', duration: 0.3, ease: 'brand', use: 'Accordion, tooltip, notice' },
  { name: 'reveal', duration: 0.7, ease: 'brand', use: 'Scroll reveal, page header' },
  { name: 'hero', duration: 1.1, ease: 'brand', use: 'Hero card and balance fly-in' },
  { name: 'count', duration: 1.6, ease: 'count', use: 'CountUp numbers' },
  { name: 'draw', duration: 1.4, ease: 'swing', use: 'Sparkline and timeline draw' },
] as const

export const springs = [
  { name: 'pill', config: 'stiffness 420 · damping 34', use: 'Nav underline, segmented thumb' },
  { name: 'toggle', config: 'stiffness 600 · damping 34', use: 'Switch knob' },
  { name: 'pop', config: 'stiffness 300 · damping 18', use: 'Success icons, status dots' },
]

export const keyframes = [
  { name: 'float', cls: 'animate-float', note: '7s ease-in-out, ∞' },
  { name: 'coin-spin', cls: 'animate-coin-spin', note: '12s swing, rests 62%' },
  { name: 'sheen', cls: 'animate-sheen', note: '7s light pass on cards' },
  { name: 'pulse-dot', cls: 'animate-pulse-dot', note: '2.2s live indicator' },
  { name: 'marquee', cls: 'animate-marquee', note: '38s logo strip' },
]
