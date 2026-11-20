import { useId } from 'react'

import { cx } from '../lib/cx'

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const skins = ['#f3d2b8', '#e8b48f', '#c98b62', '#a86b45', '#7a4a2e', '#f6dcc8']
const hairs = ['#1d1a19', '#3b2416', '#6b3d1f', '#b7814a', '#d9c2a0', '#2b2b33', '#8c2f1c']

/*
  Illustrated avatar drawn in SVG, derived from `name` so the same person
  always gets the same face: background hue, skin tone, hair colour and one of
  four hair styles. `hue` overrides the background. Swap for a photo by
  passing `src`.
*/
export function Avatar({
  name,
  size = 44,
  hue,
  src,
  className,
}: {
  name: string
  size?: number
  hue?: number
  src?: string
  className?: string
}) {
  const id = useId()
  const h = hash(name)
  const bg = hue ?? h % 360
  const skin = skins[h % skins.length]
  const hair = hairs[(h >> 3) % hairs.length]
  const style = (h >> 6) % 4
  const shirt = `hsl(${(bg + 180) % 360} 30% 22%)`

  if (src) {
    return <img src={src} alt={name} width={size} height={size} className={cx('shrink-0 rounded-full object-cover round', className)} />
  }

  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label={name} className={cx('shrink-0 rounded-full round', className)}>
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${bg} 75% 68%)`} />
          <stop offset="1" stopColor={`hsl(${(bg + 40) % 360} 65% 38%)`} />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}c)`}>
        <rect width="64" height="64" fill={`url(#${id}bg)`} />
        {/* long hair sits behind the head */}
        {style === 2 && <path d="M15 30c0-12 7-19 17-19s17 7 17 19v20H15z" fill={hair} />}
        <path d="M8 66c2-12 11-18 24-18s22 6 24 18z" fill={shirt} />
        <rect x="27" y="38" width="10" height="11" rx="4" fill={skin} />
        <ellipse cx="32" cy="30" rx="11.5" ry="13" fill={skin} />
        {style === 0 && <path d="M20 28c0-9 5-14 12-14s12 5 12 14c-3-5-7-7-12-7s-9 2-12 7z" fill={hair} />}
        {style === 1 && <path d="M20 27c1-9 6-13 13-13 6 0 11 4 11 11-6 0-12-2-16-6-2 4-5 7-8 8z" fill={hair} />}
        {style === 2 && <path d="M20 29c0-9 5-15 12-15s12 6 12 15c-4-6-8-8-12-8-5 0-9 3-12 8z" fill={hair} />}
        {style === 3 && (
          <>
            <circle cx="32" cy="12" r="6" fill={hair} />
            <path d="M20 27c0-8 5-13 12-13s12 5 12 13c-3-4-7-6-12-6s-9 2-12 6z" fill={hair} />
          </>
        )}
        <circle cx="27.5" cy="31" r="1.4" fill="#1b1b1f" />
        <circle cx="36.5" cy="31" r="1.4" fill="#1b1b1f" />
        <path d="M28.5 36.5c2 1.6 5 1.6 7 0" fill="none" stroke="#1b1b1f" strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  )
}
