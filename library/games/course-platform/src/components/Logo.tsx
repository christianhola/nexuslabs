import { brand } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/* The Coursekit wordmark: a flame "Ck" monogram and the name. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx('size-7', className)} aria-hidden>
      <path d="M17.5 7.2a9 9 0 1 0 0 17.6" fill="none" stroke="var(--color-flame)" strokeWidth="4" strokeLinecap="round" />
      <path d="M22 9v14M22 16.2l5.5-6.2M22.8 15.4l5 7.6" fill="none" stroke="var(--color-flame)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'white' }) {
  return (
    <Link href="/" className={cx('inline-flex h-11 items-center gap-2.5 rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-strong', className)} aria-label={`${brand.name} home`}>
      <Mark />
      <span className={cx('font-display text-[21px] font-medium tracking-[-0.02em]', tone === 'ink' ? 'text-ink' : 'text-white')}>{brand.name}</span>
    </Link>
  )
}
