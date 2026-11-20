import { cx } from '../lib/cx'

/*
  The port skyline at the foot of the mission panel: pale glassy towers,
  cranes and a moored ship, with one warm window where the reactor lab is.
  Pure SVG, so it recolours with the panel.
*/
export function Skyline({ className }: { className?: string }) {
  const towers = [
    [0, 70, 34, 90],
    [38, 40, 30, 120],
    [72, 86, 40, 74],
    [116, 22, 26, 138],
    [146, 60, 46, 100],
    [196, 96, 34, 64],
    [234, 50, 30, 110],
    [268, 104, 52, 56],
  ]
  return (
    <svg viewBox="0 0 420 160" className={cx('block', className)} aria-hidden>
      <defs>
        <linearGradient id="sky-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f8ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#c9d8f3" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id="sky-warm" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffd2a6" />
          <stop offset="0.5" stopColor="#ff8a3d" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ff6a1a" stopOpacity="0" />
        </radialGradient>
      </defs>
      {towers.map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="url(#sky-glass)" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="0.8" />
          {Array.from({ length: Math.floor(h / 10) }, (_, r) => (
            <path key={r} d={`M${x + 3} ${y + 6 + r * 10} H${x + w - 3}`} stroke="#9fb5dc" strokeOpacity="0.55" strokeWidth="0.6" />
          ))}
        </g>
      ))}
      <ellipse cx="129" cy="120" rx="34" ry="30" fill="url(#sky-warm)" />
      <rect x="121" y="104" width="16" height="22" fill="#ffb27a" opacity="0.9" />
      {/* Cranes */}
      <path d="M330 160 V40 M330 44 H404 M330 44 L350 30 L404 44 M380 44 V70" stroke="#ffffff" strokeWidth="2" fill="none" />
      <path d="M362 160 V70 M362 72 H418" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1.5" fill="none" />
      {/* Moored ship */}
      <path d="M300 140 H420 V160 H306 Z" fill="url(#sky-glass)" stroke="#fff" strokeWidth="0.8" />
      <path d="M396 140 V124 H410 V140" fill="url(#sky-glass)" stroke="#fff" strokeWidth="0.8" />
      <path d="M0 160 H420" stroke="#fff" strokeWidth="1" />
    </svg>
  )
}
