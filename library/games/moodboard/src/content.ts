import type { Board, Item } from './lib/types'

/**
 * Every built-in picture, by key. Items reference these as `lib:<key>`.
 * Swap a `src` for your own photography (put the file in public/images/) and
 * every board, the landing page and the style guide pick it up.
 */
export const IMAGES = {
  peony: { src: '/images/art/peony.svg', alt: 'Painted pink peony on a rose ground', w: 800, h: 800 },
  nocturne: { src: '/images/nocturne.jpg', alt: 'Dark marbled swirls of violet and teal', w: 1152, h: 864 },
  sitters: { src: '/images/art/sitters.svg', alt: 'Painting of two cats in sunglasses at a green table', w: 760, h: 1000 },
  vase: { src: '/images/vase.jpg', alt: 'Terracotta vase on a warm cream backdrop', w: 864, h: 1152 },
  kite: { src: '/images/kite.jpg', alt: 'Orange rain jacket on a green wall', w: 1152, h: 864 },
  florals: { src: '/images/art/florals.svg', alt: 'Dark floral tapestry with a black cat peeking up', w: 1000, h: 700 },
  portrait: { src: '/images/portrait.jpg', alt: 'Portrait of a person in a dark sweater in warm light', w: 864, h: 1152 },
  profile: { src: '/images/art/profile.svg', alt: 'Abstract split-face portrait in ochre, terracotta and blue', w: 800, h: 1000 },
  dusk: { src: '/images/art/dusk.svg', alt: 'Soft gradient of peach, lilac and butter yellow', w: 1000, h: 800 },
  halcyon: { src: '/images/halcyon.jpg', alt: 'Sunlit plaster interior with a curved bench', w: 1152, h: 864 },
  aurora: { src: '/images/aurora.jpg', alt: 'Translucent iridescent petals', w: 1152, h: 864 },
  fold: { src: '/images/fold.jpg', alt: 'Close-up of embossed black serif letters', w: 1152, h: 864 },
  lookbook: { src: '/images/lookbook.jpg', alt: 'Bench, lamp and throw in a calm living room', w: 1152, h: 864 },
  hero: { src: '/images/hero.jpg', alt: 'Ceramic jugs and cups on linen in soft shadow', w: 1280, h: 720 },
  carafe: { src: '/images/carafe.jpg', alt: 'Cream ceramic carafe', w: 864, h: 1152 },
  lamp: { src: '/images/lamp.jpg', alt: 'Linen lamp with a brass base', w: 864, h: 1152 },
  mugs: { src: '/images/mugs.jpg', alt: 'Two speckled stoneware mugs', w: 864, h: 1152 },
} as const

export type ImageKey = keyof typeof IMAGES

export const COPY = {
  brand: 'Inspo',
  tagline: 'Your visual thinking space.',
  cta: 'Get Started',
  title: 'Inspo — Your visual thinking space',
  boardsTitle: 'Your boards',
  boardsSubtitle: 'Every board saves to this browser as you work.',
  emptyBoards: 'No boards yet. Start one and drop in anything that catches your eye.',
  emptyCanvas: 'Drop, paste or add images to start this board',
  newBoardName: 'Untitled board',
} as const

const img = (id: string, key: ImageKey, x: number, y: number, w: number, h: number, rotation = 0): Item => ({
  id,
  kind: 'image',
  src: `lib:${key}`,
  alt: IMAGES[key].alt,
  x,
  y,
  w,
  h,
  rotation,
})

/*
  The landing composition, laid out in a 1440×900 frame and shifted so the
  frame's centre is world (0, 0). The first board starts as an exact copy, so
  "Get Started" keeps every card where it was.
*/
const F = (x: number, y: number) => ({ x: x - 720, y: y - 450 })
const at = (id: string, key: ImageKey, fx: number, fy: number, w: number, h: number, rotation = 0) => {
  const p = F(fx, fy)
  return img(id, key, p.x, p.y, w, h, rotation)
}

export const LANDING_ITEMS: Item[] = [
  at('peony', 'peony', -116, 65, 293, 293),
  at('nocturne', 'nocturne', 278, -64, 362, 329),
  at('sitters', 'sitters', 808, -34, 357, 491),
  at('vase', 'vase', 1258, 86, 330, 505),
  at('kite', 'kite', -44, 503, 347, 344),
  at('florals', 'florals', 492, 713, 375, 282),
  at('portrait', 'portrait', 1071, 664, 263, 351),
  // Outside the 1440×900 frame: seen on tall screens and when you pan.
  at('dusk', 'dusk', 330, -400, 300, 240),
  at('aurora', 'aurora', 900, -420, 320, 240),
  at('lookbook', 'lookbook', 1240, -340, 340, 255),
  at('profile', 'profile', 40, 930, 240, 300),
  at('hero', 'hero', 420, 1050, 400, 225),
  at('halcyon', 'halcyon', 900, 1080, 360, 270),
  at('mugs', 'mugs', 1310, 1000, 220, 293),
]

/** The item that shows the selection box on the landing page. */
export const LANDING_SELECTED = ['peony']

/** The hero card position in the 1440×900 frame: centred, 30px below the middle. */
export const HERO_OFFSET_Y = 30

const now = Date.now()

export function seedBoards(): Board[] {
  return [
    {
      id: 'spring',
      name: 'Spring campaign',
      createdAt: now - 86400000 * 3,
      updatedAt: now - 3600000,
      camera: { cx: 0, cy: 0, zoom: 1 },
      items: [
        ...LANDING_ITEMS.map((i) => ({ ...i })),
        {
          id: 'spring-note',
          kind: 'note',
          x: 950,
          y: -300,
          w: 220,
          h: 200,
          rotation: -2,
          color: 'butter',
          text: 'Mood: romantic, a little absurd. Painted florals next to glossy fashion. Keep the pink.',
        },
        {
          id: 'spring-title',
          kind: 'text',
          x: 950,
          y: -420,
          w: 420,
          h: 70,
          rotation: 0,
          fontSize: 48,
          text: 'Spring / Summer',
        },
        {
          id: 'spring-swatch',
          kind: 'swatch',
          x: 1200,
          y: -300,
          w: 300,
          h: 104,
          rotation: 0,
          colors: ['#d9878f', '#b3263f', '#3e9c80', '#e9c27a', '#1d1d1f'],
        },
      ],
    },
    {
      id: 'interiors',
      name: 'Studio interiors',
      createdAt: now - 86400000 * 9,
      updatedAt: now - 86400000 * 2,
      camera: { cx: 260, cy: 140, zoom: 0.8 },
      items: [
        img('int-1', 'halcyon', -200, -160, 480, 360),
        img('int-2', 'lamp', 320, -220, 240, 320),
        img('int-3', 'carafe', 600, -120, 220, 293),
        img('int-4', 'lookbook', 320, 140, 420, 315),
        img('int-5', 'hero', -200, 240, 480, 270),
        img('int-6', 'mugs', 780, 220, 220, 293),
        {
          id: 'int-note',
          kind: 'note',
          x: 860,
          y: -220,
          w: 200,
          h: 180,
          rotation: 3,
          color: 'mint',
          text: 'Limewash walls, oak, linen. Nothing glossy.',
        },
        {
          id: 'int-swatch',
          kind: 'swatch',
          x: -200,
          y: 560,
          w: 300,
          h: 104,
          rotation: 0,
          colors: ['#efe6da', '#d8c4ab', '#a07c5a', '#6d6a5f', '#2e2b27'],
        },
      ],
    },
    {
      id: 'type',
      name: 'Type & colour',
      createdAt: now - 86400000 * 20,
      updatedAt: now - 86400000 * 6,
      camera: { cx: 200, cy: 120, zoom: 0.85 },
      items: [
        img('type-1', 'fold', -180, -140, 440, 330),
        img('type-2', 'profile', 300, -200, 300, 375),
        img('type-3', 'dusk', 640, -120, 400, 320),
        img('type-4', 'aurora', -180, 230, 400, 300),
        {
          id: 'type-text',
          kind: 'text',
          x: 300,
          y: 220,
          w: 520,
          h: 70,
          rotation: 0,
          fontSize: 44,
          text: 'Soft colour, hard type.',
        },
        {
          id: 'type-note',
          kind: 'note',
          x: 300,
          y: 320,
          w: 220,
          h: 170,
          rotation: -3,
          color: 'lilac',
          text: 'Pair a heavy serif with pastel gradients. Try the dusk palette on the cover.',
        },
      ],
    },
  ]
}

export const NOTE_COLORS: { id: import('./lib/types').NoteColor; label: string; hex: string }[] = [
  { id: 'butter', label: 'Butter', hex: '#fff1a8' },
  { id: 'blush', label: 'Blush', hex: '#ffd6dc' },
  { id: 'sky', label: 'Sky', hex: '#d4e6ff' },
  { id: 'mint', label: 'Mint', hex: '#d2f2df' },
  { id: 'lilac', label: 'Lilac', hex: '#e6dcff' },
  { id: 'paper', label: 'Paper', hex: '#ffffff' },
]

export const SHORTCUTS: { group: string; items: { keys: string[]; label: string }[] }[] = [
  {
    group: 'Tools',
    items: [
      { keys: ['V'], label: 'Select' },
      { keys: ['H'], label: 'Hand (pan)' },
      { keys: ['Space', 'drag'], label: 'Pan while held' },
      { keys: ['I'], label: 'Add images' },
      { keys: ['N'], label: 'Sticky note' },
      { keys: ['T'], label: 'Text' },
    ],
  },
  {
    group: 'Edit',
    items: [
      { keys: ['Mod', 'Z'], label: 'Undo' },
      { keys: ['Mod', 'Shift', 'Z'], label: 'Redo' },
      { keys: ['Mod', 'D'], label: 'Duplicate' },
      { keys: ['Mod', 'C'], label: 'Copy' },
      { keys: ['Mod', 'V'], label: 'Paste items or images' },
      { keys: ['Mod', 'A'], label: 'Select all' },
      { keys: ['Delete'], label: 'Delete selection' },
      { keys: ['Arrows'], label: 'Nudge (Shift for 10)' },
      { keys: [']'], label: 'Bring forward' },
      { keys: ['['], label: 'Send backward' },
      { keys: ['Shift', ']'], label: 'Bring to front' },
      { keys: ['Shift', '['], label: 'Send to back' },
      { keys: ['Shift', 'drag'], label: 'Add to selection / free resize' },
      { keys: ['Mod', 'drag'], label: 'Move without snapping' },
    ],
  },
  {
    group: 'View',
    items: [
      { keys: ['Mod', '+'], label: 'Zoom in' },
      { keys: ['Mod', '−'], label: 'Zoom out' },
      { keys: ['Shift', '0'], label: 'Zoom to 100%' },
      { keys: ['Shift', '1'], label: 'Zoom to fit' },
      { keys: ['M'], label: 'Toggle minimap' },
      { keys: ['P'], label: 'Present' },
      { keys: ['Mod', 'E'], label: 'Export PNG' },
      { keys: ['?'], label: 'This sheet' },
      { keys: ['Esc'], label: 'Deselect / close' },
      { keys: ['Enter'], label: 'Select first item (canvas focused)' },
      { keys: ['Tab'], label: 'Next item while one is selected' },
    ],
  },
]
