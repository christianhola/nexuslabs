import { useId } from 'react'

import { cx } from '../lib/cx'

/*
  Holographic side views of the vessels Tidewell powers, drawn in SVG: an ice
  blue hull with lit edges, and a warm glow where the reactor sits. Variants:
  `cargo` (container ship), `frigate`, `platform` (offshore rig).
*/
export type ShipKind = 'cargo' | 'frigate' | 'platform'

const labels: Record<ShipKind, string> = {
  cargo: 'Illustration of a container ship',
  frigate: 'Illustration of a naval frigate',
  platform: 'Illustration of an offshore platform',
}

export function Ship({ kind, className, decorative = false }: { kind: ShipKind; className?: string; decorative?: boolean }) {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}-${n}`
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': labels[kind] }
  return (
    <svg viewBox="0 0 240 110" className={cx('block', className)} {...a11y}>
      <defs>
        <linearGradient id={g('hull')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe9ff" />
          <stop offset="0.5" stopColor="#6fa6ff" />
          <stop offset="1" stopColor="#1f4fae" />
        </linearGradient>
        <linearGradient id={g('box')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bcd6ff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#3c74da" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id={g('core')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe1c4" />
          <stop offset="0.4" stopColor="#ff7a3d" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ff4d1a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={g('halo')} cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#5b9bff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#5b9bff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="70" rx="118" ry="36" fill={`url(#${g('halo')})`} />
      {kind === 'cargo' ? <Cargo g={g} /> : kind === 'frigate' ? <Frigate g={g} /> : <Platform g={g} />}
      <path d="M8 92 H232" stroke="#9fc3ff" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  )
}

function Cargo({ g }: { g: (n: string) => string }) {
  const cols = 11
  return (
    <g>
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: 3 }, (_, r) => (
          <rect
            key={`${c}-${r}`}
            x={40 + c * 13.2}
            y={46 - r * 8}
            width="12"
            height="7.2"
            fill={`url(#${g('box')})`}
            stroke="#e6f0ff"
            strokeOpacity="0.6"
            strokeWidth="0.5"
            opacity={r === 2 && (c === 3 || c === 8) ? 0.25 : 1}
          />
        )),
      )}
      <path d="M190 54 V26 H204 V20 H212 V54 Z" fill={`url(#${g('box')})`} stroke="#e6f0ff" strokeOpacity="0.7" strokeWidth="0.6" />
      <rect x="195" y="30" width="14" height="3" fill="#f4f8ff" opacity="0.8" />
      <path d="M14 54 H226 L216 82 H34 Q22 82 18 72 Z" fill={`url(#${g('hull')})`} stroke="#eef5ff" strokeOpacity="0.8" strokeWidth="0.8" />
      <ellipse cx="112" cy="68" rx="30" ry="12" fill={`url(#${g('core')})`} />
      <path d="M20 60 H222" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.6" />
    </g>
  )
}

function Frigate({ g }: { g: (n: string) => string }) {
  return (
    <g>
      <path d="M118 22 L122 22 L123 40 L117 40 Z" fill="#cfe2ff" />
      <path d="M108 30 H132" stroke="#cfe2ff" strokeWidth="1" />
      <path d="M92 58 L98 40 H146 L156 58 Z" fill={`url(#${g('box')})`} stroke="#e6f0ff" strokeOpacity="0.7" strokeWidth="0.6" />
      <path d="M104 40 L108 32 H136 L140 40 Z" fill={`url(#${g('box')})`} stroke="#e6f0ff" strokeOpacity="0.7" strokeWidth="0.6" />
      <rect x="112" y="44" width="22" height="3" fill="#f4f8ff" opacity="0.85" />
      <path d="M164 58 L170 50 H184 L188 58 Z" fill={`url(#${g('box')})`} />
      <path d="M50 58 H62 V52 H78 V58" fill={`url(#${g('box')})`} />
      <path d="M40 54 H70" stroke="#e6f0ff" strokeOpacity="0.8" strokeWidth="1.2" />
      <path d="M10 58 H224 L208 80 H40 Q24 78 10 58 Z" fill={`url(#${g('hull')})`} stroke="#eef5ff" strokeOpacity="0.8" strokeWidth="0.8" />
      <ellipse cx="126" cy="68" rx="24" ry="10" fill={`url(#${g('core')})`} />
    </g>
  )
}

function Platform({ g }: { g: (n: string) => string }) {
  return (
    <g>
      {[60, 100, 140, 180].map((x) => (
        <rect key={x} x={x - 4} y="50" width="8" height="42" fill={`url(#${g('hull')})`} opacity="0.85" />
      ))}
      <path d="M50 46 H190 V56 H50 Z" fill={`url(#${g('hull')})`} stroke="#eef5ff" strokeOpacity="0.8" strokeWidth="0.8" />
      <path d="M70 46 V26 H120 V46" fill={`url(#${g('box')})`} stroke="#e6f0ff" strokeOpacity="0.7" strokeWidth="0.6" />
      <path d="M150 46 L156 8 L162 46" fill="none" stroke="#cfe2ff" strokeWidth="1.4" />
      <path d="M156 12 L196 30" stroke="#cfe2ff" strokeWidth="1" />
      <rect x="128" y="34" width="18" height="12" fill={`url(#${g('box')})`} />
      <ellipse cx="96" cy="40" rx="22" ry="9" fill={`url(#${g('core')})`} />
    </g>
  )
}
