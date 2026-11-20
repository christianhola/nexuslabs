import { cx } from '../lib/cx'

export function Avatar({ initials, className, tone = 'teal' }: { initials: string; className?: string; tone?: 'teal' | 'navy' | 'mist' }) {
  const t = { teal: 'bg-teal-50 text-teal-deep', navy: 'bg-navy text-white', mist: 'bg-mist text-ink-2' }[tone]
  return (
    <span aria-hidden className={cx('round inline-grid size-10 shrink-0 place-items-center rounded-full text-[14px] font-semibold', t, className)}>
      {initials}
    </span>
  )
}
