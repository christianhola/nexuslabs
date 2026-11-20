import { useId } from 'react'

import type { Palette } from './wallpaper-palettes'

/*
  The device wallpaper: a layered SVG mountain range under a sky gradient
  with wispy clouds, a horizon glow and stars. Geometry is generated once from
  fixed seeds, so every render (and both devices) show the same range. Colours
  come from a palette and cross-fade via CSS when the palette changes.
*/

const W = 1600
const H = 1000

function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Midpoint-displacement ridge line: 2^levels + 1 heights across the width. */
function ridgeHeights(seed: number, amp: number, rough: number, levels = 7): number[] {
  const rand = rng(seed)
  const n = 2 ** levels
  const h = new Array<number>(n + 1).fill(0)
  h[0] = (rand() - 0.5) * amp
  h[n] = (rand() - 0.5) * amp
  let step = n
  let scale = amp
  while (step > 1) {
    const half = step / 2
    for (let i = half; i < n; i += step) {
      h[i] = (h[i - half] + h[i + half]) / 2 + (rand() - 0.5) * scale
    }
    step = half
    scale *= rough
  }
  // Fine crag noise so silhouettes read as rock, not hills.
  for (let i = 0; i <= n; i++) h[i] += (rand() - 0.5) * amp * 0.09
  return h
}

function ridgePath(base: (x: number) => number, heights: number[]): string {
  const n = heights.length - 1
  let d = `M0 ${H} `
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W
    d += `L${x.toFixed(1)} ${(base(x) + heights[i]).toFixed(1)} `
  }
  return `${d}L${W} ${H} Z`
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16))
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16))
  return `#${pa.map((v, i) => Math.round(lerp(v, pb[i], t)).toString(16).padStart(2, '0')).join('')}`
}

const bump = (x: number, c: number, w: number) => Math.exp(-(((x - c) / w) ** 2))

// Back to front: a jagged hazy horizon, then bigger, warmer, darker masses.
const RIDGES = [
  { seed: 11, base: (x: number) => 495 - 20 * bump(x, 1250, 260), amp: 80, rough: 0.64 },
  { seed: 23, base: (x: number) => 580 - 45 * bump(x, 300, 200) - 40 * bump(x, 1000, 250), amp: 120, rough: 0.6 },
  { seed: 37, base: (x: number) => 665 - 60 * bump(x, 450, 200) - 45 * bump(x, 900, 160) - 40 * bump(x, 1400, 200), amp: 110, rough: 0.6 },
  { seed: 41, base: (x: number) => 770 - 125 * bump(x, 690, 170) - 75 * bump(x, 930, 140) - 60 * bump(x, 1350, 200), amp: 80, rough: 0.6 },
  { seed: 59, base: (x: number) => 860 - 75 * bump(x, 830, 160) - 70 * bump(x, 1450, 200), amp: 70, rough: 0.6 },
].map((r) => ({ d: ridgePath(r.base, ridgeHeights(r.seed, r.amp, r.rough, 9)), top: r.base(W / 2) - r.amp }))

// Near rock: a slope falling from the left, and a ridge rising bottom right.
const ROCK_LEFT = ridgePath(
  (x) => (x < 600 ? lerp(690, 990, x / 600) : 1080) - 25 * bump(x, 160, 120),
  ridgeHeights(71, 80, 0.64, 9),
)
const ROCK_RIGHT = ridgePath(
  (x) => (x < 430 ? 1090 : lerp(1010, 850, Math.min(1, (x - 430) / 720))) - 25 * bump(x, 1080, 90),
  ridgeHeights(83, 70, 0.64, 9),
)

const CLOUDS = (() => {
  const rand = rng(97)
  return Array.from({ length: 22 }, () => ({
    cx: rand() * W * 1.2 - W * 0.1,
    cy: 40 + rand() * 300,
    rx: 160 + rand() * 340,
    ry: 8 + rand() * 26,
    o: 0.35 + rand() * 0.6,
  }))
})()

const STARS = (() => {
  const rand = rng(131)
  return Array.from({ length: 90 }, () => ({ cx: rand() * W, cy: rand() * 520, r: 0.8 + rand() * 1.8, o: 0.4 + rand() * 0.6 }))
})()

type Props = {
  palette: Palette
  /** `laptop` shows the whole 16:10 scene, `phone` a tall slice of it. */
  variant?: 'laptop' | 'phone'
  className?: string
}

export function Wallpaper({ palette: p, variant = 'laptop', className }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const id = (name: string) => `${name}-${uid}`
  const viewBox = variant === 'phone' ? `150 0 470 ${H}` : `0 0 ${W} ${H}`

  return (
    <svg
      className={`wallpaper block h-full w-full ${className ?? ''}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id('sky')} x1="0" y1="0" x2="0" y2="1">
          {[0, 0.2, 0.38, 0.52, 0.66].map((offset, i) => (
            <stop key={offset} offset={offset} style={{ stopColor: p.sky[i] }} />
          ))}
        </linearGradient>
        <radialGradient id={id('glow')} cx="0.55" cy="0.55" r="0.6">
          <stop offset="0" style={{ stopColor: p.glow, stopOpacity: 1 }} />
          <stop offset="1" style={{ stopColor: p.glow, stopOpacity: 0 }} />
        </radialGradient>
        {RIDGES.map((r, i) => (
          <linearGradient key={i} id={id(`ridge${i}`)} gradientUnits="userSpaceOnUse" x1="0" y1={r.top} x2="0" y2={r.top + 320}>
            <stop offset="0" style={{ stopColor: p.ridges[i] }} />
            <stop offset="1" style={{ stopColor: mix(p.ridges[i], p.haze, 0.5) }} />
          </linearGradient>
        ))}
        <linearGradient id={id('rock')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: p.rockLight }} />
          <stop offset="0.5" style={{ stopColor: p.rock }} />
        </linearGradient>
        <filter id={id('blur')} x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="10 6" />
        </filter>
        {/* Snow and scree: thresholded streaky noise, tinted. */}
        <filter id={id('snow')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.016 0.085" numOctaves="5" seed="7" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -2.75" result="mask" />
          <feFlood style={{ floodColor: p.snow }} result="tint" />
          <feComposite in="tint" in2="mask" operator="in" />
        </filter>
        <clipPath id={id('rockclip')}>
          <path d={ROCK_LEFT} />
          <path d={ROCK_RIGHT} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={`url(#${id('sky')})`} />
      <g style={{ opacity: p.stars }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill="#ffffff" opacity={s.o} />
        ))}
      </g>
      <ellipse cx={W * 0.55} cy={H * 0.5} rx={W * 0.7} ry={H * 0.32} fill={`url(#${id('glow')})`} style={{ opacity: p.glowOpacity }} />
      <g className="wallpaper-clouds" filter={`url(#${id('blur')})`} style={{ opacity: p.cloudOpacity }}>
        {CLOUDS.map((c, i) => (
          <ellipse
            key={i}
            cx={c.cx}
            cy={c.cy}
            rx={c.rx}
            ry={c.ry}
            opacity={c.o}
            transform={`rotate(-4 ${c.cx} ${c.cy})`}
            style={{ fill: p.clouds }}
          />
        ))}
      </g>

      {RIDGES.map((r, i) => (
        <path key={i} d={r.d} fill={`url(#${id(`ridge${i}`)})`} />
      ))}

      <path d={ROCK_LEFT} fill={`url(#${id('rock')})`} />
      <path d={ROCK_RIGHT} fill={`url(#${id('rock')})`} />
      <g clipPath={`url(#${id('rockclip')})`} style={{ opacity: p.snowOpacity }}>
        <rect x={-200} y={-200} width={W + 400} height={H + 400} filter={`url(#${id('snow')})`} transform={`rotate(-14 ${W / 2} ${H / 2})`} />
      </g>
    </svg>
  )
}
