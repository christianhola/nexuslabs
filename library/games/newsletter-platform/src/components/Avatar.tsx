import { cx } from '../lib/cx'

/* Initials on a tinted disc. `hue` sets the tint so lists look varied. */
export function Avatar({ initials, hue = 312, size = 'md', className }: { initials: string; hue?: number; size?: 'xs' | 'sm' | 'md'; className?: string }) {
  const s = { xs: 'size-6 text-[9px]', sm: 'size-8 text-[11px]', md: 'size-11 text-[14px]' }[size]
  return (
    <span
      aria-hidden
      className={cx('round inline-grid shrink-0 place-items-center rounded-full font-bold text-white ring-2 ring-night', s, className)}
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${(hue + 40) % 360} 60% 38%))` }}
    >
      {size === 'xs' ? initials[0] : initials}
    </span>
  )
}

export function AvatarStack({ people }: { people: { initials: string; hue: number }[] }) {
  return (
    <span className="flex -space-x-1.5">
      {people.map((p) => (
        <Avatar key={p.initials} initials={p.initials} hue={p.hue} size="xs" />
      ))}
    </span>
  )
}

export function Stars({ className }: { className?: string }) {
  return (
    <span className={cx('flex gap-0.5 text-[#f8c74a]', className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 20 20" className="size-4 fill-current">
          <path d="M10 1.5l2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6L1.4 7.7l6-.7z" />
        </svg>
      ))}
    </span>
  )
}
