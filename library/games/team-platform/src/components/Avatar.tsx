import { images } from '../content'
import type { Presence } from '../content'
import { cx } from '../lib/cx'

/*
  A headshot cut from the 4×4 portrait sprite (images.portraits). Pass
  `face` (0–15) to pick one; without it, initials on a mint tile.
*/
const presenceDot: Record<Presence, string> = {
  online: 'bg-mint',
  away: 'bg-[#f4b740]',
  'on-shift': 'bg-[#5b8def]',
  off: 'bg-line-strong',
}

export function Avatar({ name, face, size = 40, presence, className, ring }: { name: string; face?: number; size?: number; presence?: Presence; className?: string; ring?: boolean }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  const col = face != null ? face % 4 : 0
  const row = face != null ? Math.floor(face / 4) : 0
  return (
    <span className={cx('round relative inline-block shrink-0', className)} style={{ width: size, height: size }}>
      {face != null ? (
        <span
          role="img"
          aria-label={name}
          className={cx('round block size-full rounded-full bg-mist-2', ring && 'ring-2 ring-white')}
          style={{ backgroundImage: `url(${images.portraits})`, backgroundSize: '400% 400%', backgroundPosition: `${(col / 3) * 100}% ${(row / 3) * 100}%` }}
        />
      ) : (
        <span role="img" aria-label={name} className={cx('round grid size-full place-items-center rounded-full bg-mint-soft font-display font-semibold text-leaf', ring && 'ring-2 ring-white')} style={{ fontSize: size * 0.38 }}>
          {initials}
        </span>
      )}
      {presence ? <span className={cx('round absolute bottom-0 right-0 rounded-full ring-2 ring-white', presenceDot[presence])} style={{ width: Math.max(8, size * 0.24), height: Math.max(8, size * 0.24) }} aria-hidden /> : null}
    </span>
  )
}

export function AvatarStack({ faces, size = 28, extra }: { faces: { name: string; face: number }[]; size?: number; extra?: number }) {
  return (
    <span className="flex items-center">
      {faces.map((f, i) => (
        <Avatar key={f.name} name={f.name} face={f.face} size={size} ring className={i ? '-ml-2' : ''} />
      ))}
      {extra ? <span className="ml-2 text-[13px] font-medium text-muted">+{extra}</span> : null}
    </span>
  )
}
