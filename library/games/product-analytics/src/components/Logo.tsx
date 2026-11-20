import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/* The Pulseboard mark: a lime squircle with a heartbeat line. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx('size-7', className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="var(--color-lime)" />
      <path d="M6 18h5l3-7 4 12 3-7h5" fill="none" stroke="var(--color-ink)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, mark = false, tone = 'ink' }: { className?: string; mark?: boolean; tone?: 'ink' | 'white' }) {
  return (
    <Link href="/" className={cx('round inline-flex items-center gap-2 rounded-[10px] py-1 font-display text-[21px] font-bold tracking-[-0.045em]', tone === 'white' ? 'text-white' : 'text-ink', className)} aria-label="Pulseboard home">
      {mark ? <LogoMark className="size-6" /> : null}
      pulseboard
    </Link>
  )
}
