import { cx } from '../lib/cx'

/* Initials on a soft colour. Size in px; hue is any CSS colour. */
export function Avatar({ name, hue = '#d6ecc4', size = 36, className }: { name: string; hue?: string; size?: number; className?: string }) {
  const initials = name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
  return (
    <span
      className={cx('round inline-grid shrink-0 place-items-center rounded-full font-display font-bold text-ink ring-2 ring-white', className)}
      style={{ width: size, height: size, background: hue, fontSize: Math.round(size * 0.36) }}
      aria-hidden
    >
      {initials}
    </span>
  )
}
