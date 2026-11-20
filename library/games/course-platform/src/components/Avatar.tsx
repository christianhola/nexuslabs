import { Star } from 'lucide-react'

import { cx } from '../lib/cx'

/* A photo avatar, or initials on a tint when there is no photo. */
export function Avatar({ src, name, size = 32, className, ring = true }: { src?: string; name: string; size?: number; className?: string; ring?: boolean }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return src ? (
    <img src={src} alt={name} width={size} height={size} loading="lazy" className={cx('round shrink-0 rounded-full object-cover', ring && 'ring-2 ring-white', className)} style={{ width: size, height: size }} />
  ) : (
    <span className={cx('round grid shrink-0 place-items-center rounded-full bg-flame-soft font-display font-medium text-flame-ink', ring && 'ring-2 ring-white', className)} style={{ width: size, height: size, fontSize: size * 0.38 }} aria-label={name} role="img">
      {initials}
    </span>
  )
}

export function AvatarStack({ people, size = 28, label }: { people: readonly { name: string; src?: string }[]; size?: number; label: string }) {
  return (
    <span className="flex items-center" role="group" aria-label={label}>
      {people.map((p, i) => (
        <Avatar key={p.name} src={p.src} name={p.name} size={size} className={i ? '-ml-2' : ''} />
      ))}
    </span>
  )
}

/* Star rating, drawn in flame. `value` out of 5. */
export function Stars({ value = 5, size = 14, className }: { value?: number; size?: number; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-0.5', className)} role="img" aria-label={`${value} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={i < Math.round(value) ? 'fill-[#f5a524] text-[#f5a524]' : 'fill-wash-2 text-wash-2'} style={{ width: size, height: size }} aria-hidden />
      ))}
    </span>
  )
}
