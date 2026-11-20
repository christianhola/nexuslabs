import { useId } from 'react'

import { cx } from '../lib/cx'

/*
  The reactor render, drawn in SVG: a dark machined frame (flange, struts,
  clamps) around a vacuum vessel full of blue plasma. `glow` adds the soft
  light it throws on its surroundings. The core breathes unless the visitor
  prefers reduced motion. Pass label="" when it is decorative.
*/
export function Reactor({ className, glow = true, label = 'Illustration of the Tidewell reactor: a blue plasma chamber inside a dark steel frame' }: { className?: string; glow?: boolean; label?: string }) {
  const id = useId().replace(/:/g, '')
  const g = (n: string) => `${id}-${n}`
  return (
    <svg viewBox="0 0 400 380" className={cx('block', className)} {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}>
      <defs>
        <radialGradient id={g('halo')} cx="0.5" cy="0.58" r="0.5">
          <stop offset="0" stopColor="#8fc2ff" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="#3f7fe8" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1a3a8a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('vessel')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#06112e" />
          <stop offset="0.2" stopColor="#1c4fc2" />
          <stop offset="0.42" stopColor="#8cc4ff" />
          <stop offset="0.5" stopColor="#eef6ff" />
          <stop offset="0.58" stopColor="#8cc4ff" />
          <stop offset="0.8" stopColor="#1c4fc2" />
          <stop offset="1" stopColor="#06112e" />
        </linearGradient>
        <radialGradient id={g('mouth')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#9fd0ff" />
          <stop offset="1" stopColor="#1d4fb8" />
        </radialGradient>
        <linearGradient id={g('steel')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#07080b" />
          <stop offset="0.45" stopColor="#2b303b" />
          <stop offset="0.55" stopColor="#434a58" />
          <stop offset="1" stopColor="#07080b" />
        </linearGradient>
        <linearGradient id={g('flange')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5160" />
          <stop offset="0.3" stopColor="#1b1e25" />
          <stop offset="1" stopColor="#0a0b0e" />
        </linearGradient>
        <linearGradient id={g('clamp')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1f3f7" />
          <stop offset="1" stopColor="#9aa1ae" />
        </linearGradient>
        <filter id={g('blur')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={g('soft')} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {glow ? <ellipse cx="200" cy="230" rx="200" ry="150" fill={`url(#${g('halo')})`} /> : null}

      {/* Back of the lower ring */}
      <path d="M78 300 A122 34 0 0 1 322 300" fill="none" stroke="#0c0e13" strokeWidth="16" />

      {/* Vacuum vessel */}
      <path d="M112 150 L112 300 A88 28 0 0 0 288 300 L288 150 Z" fill={`url(#${g('vessel')})`} />
      <g className="origin-[200px_230px] animate-plasma">
        <ellipse cx="200" cy="232" rx="46" ry="92" fill="#ffffff" opacity="0.75" filter={`url(#${g('blur')})`} />
        {[175, 205, 235, 265, 292].map((y, i) => (
          <ellipse key={y} cx="200" cy={y} rx={78 - i * 2} ry="15" fill="none" stroke="#e6f3ff" strokeOpacity={0.5 - i * 0.06} strokeWidth="2" filter={`url(#${g('soft')})`} />
        ))}
      </g>

      {/* Front of the lower ring */}
      <path d="M78 300 A122 34 0 0 0 322 300" fill="none" stroke={`url(#${g('steel')})`} strokeWidth="18" />

      {/* Side struts */}
      <rect x="92" y="138" width="26" height="176" rx="5" fill={`url(#${g('steel')})`} />
      <rect x="282" y="138" width="26" height="176" rx="5" fill={`url(#${g('steel')})`} />
      <rect x="132" y="150" width="16" height="170" rx="4" fill={`url(#${g('steel')})`} opacity="0.9" />
      <rect x="252" y="150" width="16" height="170" rx="4" fill={`url(#${g('steel')})`} opacity="0.9" />

      {/* Upper flange with the glowing mouth of the vessel */}
      <ellipse cx="200" cy="146" rx="132" ry="38" fill={`url(#${g('flange')})`} />
      <ellipse cx="200" cy="146" rx="132" ry="38" fill="none" stroke="#6b7384" strokeOpacity="0.55" strokeWidth="1.5" />
      <ellipse cx="200" cy="148" rx="94" ry="24" fill={`url(#${g('mouth')})`} />
      <ellipse cx="200" cy="148" rx="94" ry="24" fill="none" stroke="#0b0d12" strokeWidth="5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return <circle key={i} cx={200 + Math.cos(a) * 114} cy={146 + Math.sin(a) * 31} r="3" fill="#5a6272" />
      })}

      {/* Centre post and front strut */}
      <rect x="186" y="150" width="28" height="200" rx="6" fill={`url(#${g('steel')})`} />
      <rect x="182" y="96" width="36" height="58" rx="7" fill={`url(#${g('steel')})`} />
      <ellipse cx="200" cy="97" rx="18" ry="6" fill="#4a5160" />

      {/* Clamps */}
      <rect x="70" y="142" width="40" height="24" rx="5" fill={`url(#${g('clamp')})`} />
      <rect x="290" y="142" width="40" height="24" rx="5" fill={`url(#${g('clamp')})`} />
      <rect x="196" y="180" width="8" height="140" rx="3" fill="#0a0b0e" opacity="0.6" />
    </svg>
  )
}
