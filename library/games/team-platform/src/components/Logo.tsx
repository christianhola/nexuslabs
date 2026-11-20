import { cx } from '../lib/cx'
import { brand } from '../content'

/* The Branchwork mark: a stem that splits into two branches. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cx('size-7', className)} aria-hidden>
      <path d="M5 24.5c4.6-1.2 7.6-4.9 8.6-10.6l.6-3.4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M14.2 10.5 22.6 4M14.2 10.5 7.4 5.3" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="22.6" cy="4" r="2.6" className="fill-mint" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-ink', className)}>
      <LogoMark />
      <span className="font-display text-[21px] font-semibold tracking-[-0.03em]">{brand.name}</span>
    </span>
  )
}
