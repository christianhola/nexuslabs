import type { CSSProperties } from 'react'

import { cx } from '../lib/cx'

/*
  A real CSS 3D coin: two faces and a reeded rim built from `segments` thin
  facets around the axis. Rim colour depends on the angle, dark graphite at
  the top fading to a red/orange glow at the bottom, with alternating facets
  lighter so the edge reads as ridged. The inner wrapper spins once every
  12 seconds (see --animate-coin-spin); `pose` sets the resting angle.
*/
export function Coin({
  size = 400,
  thickness = 84,
  segments = 110,
  pose = 'rotateX(6deg) rotateY(-56deg) rotateZ(-8deg)',
  spin = true,
  className,
  style,
}: {
  size?: number
  thickness?: number
  segments?: number
  pose?: string
  spin?: boolean
  className?: string
  style?: CSSProperties
}) {
  const r = size / 2
  const facet = (Math.PI * size) / segments + 1
  const rim = Array.from({ length: segments }, (_, i) => {
    const deg = (i * 360) / segments
    // 0 at the top, 1 at the bottom of the coin.
    const down = (1 - Math.cos((deg * Math.PI) / 180)) / 2
    const ridge = i % 2 === 0
    const warm = Math.min(1, Math.max(0, (down - 0.22) / 0.5))
    const light = ridge ? 70 + warm * 16 : 8 + warm * 46
    const sat = ridge ? warm * 90 : warm * 100
    const color = `hsl(${8 + warm * 6} ${sat}% ${light}%)`
    return (
      <div
        key={i}
        className="absolute backface-hidden"
        style={{
          left: r - facet / 2,
          top: r - thickness / 2,
          width: facet,
          height: thickness,
          background: `linear-gradient(to bottom, rgb(0 0 0 / 0.55), transparent 22%, transparent 78%, rgb(0 0 0 / 0.45)), ${color}`,
          transform: `rotateZ(${deg}deg) translateY(${-r + 0.5}px) rotateX(90deg)`,
        }}
      />
    )
  })

  return (
    <div className={cx('pointer-events-none select-none', className)} style={{ width: size, height: size, perspective: size * 4, ...style }} aria-hidden>
      <div className="preserve-3d relative size-full" style={{ transform: pose }}>
        <div className={cx('preserve-3d relative size-full', spin && 'animate-coin-spin')}>
          {rim}
          <CoinFace size={size} style={{ transform: `translateZ(${thickness / 2}px)` }} />
          <CoinFace size={size} style={{ transform: `rotateY(180deg) translateZ(${thickness / 2}px)` }} />
        </div>
      </div>
    </div>
  )
}

function CoinFace({ size, style }: { size: number; style: CSSProperties }) {
  return (
    <div className="absolute inset-0 rounded-full backface-hidden round" style={style}>
      <svg viewBox="0 0 200 200" width={size} height={size} className="block">
        <defs>
          <radialGradient id="coin-face" cx="38%" cy="32%" r="80%">
            <stop offset="0" stopColor="#d9eef0" />
            <stop offset="0.45" stopColor="#a6c4c8" />
            <stop offset="0.8" stopColor="#7a9aa0" />
            <stop offset="1" stopColor="#5e7c83" />
          </radialGradient>
          <linearGradient id="coin-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#c9fbff" />
            <stop offset="0.5" stopColor="#5fd7e4" />
            <stop offset="1" stopColor="#2e8d99" />
          </linearGradient>
          <linearGradient id="coin-groove" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6d8d93" />
            <stop offset="1" stopColor="#c8e2e5" />
          </linearGradient>
          <linearGradient id="coin-sheen" x1="0" y1="0" x2="1" y2="0.6">
            <stop offset="0.25" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="99" fill="url(#coin-face)" />
        <circle cx="100" cy="100" r="97" fill="none" stroke="url(#coin-edge)" strokeWidth="4" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="url(#coin-groove)" strokeWidth="5" />
        <circle cx="100" cy="100" r="77" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="100" cy="100" r="99" fill="url(#coin-sheen)" />
        <g fontFamily="'Inter Tight', Inter, sans-serif" fontWeight="700" fontSize="112" textAnchor="middle">
          <text x="102.5" y="141.5" fill="#56767c">
            $
          </text>
          <text x="98.5" y="137.5" fill="#e7f7f8">
            $
          </text>
          <text x="100" y="139.5" fill="#a5c3c7">
            $
          </text>
        </g>
      </svg>
    </div>
  )
}
