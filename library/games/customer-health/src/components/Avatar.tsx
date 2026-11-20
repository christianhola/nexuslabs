import { cx } from '../lib/cx'

/** Initials in a hairline circle. */
export function Avatar({ name, size = 28, className }: { name: string; size?: number; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return (
    <span
      aria-hidden="true"
      className={cx('inline-grid shrink-0 place-items-center rounded-full border border-line bg-raised font-mono text-fg', className)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials}
    </span>
  )
}
