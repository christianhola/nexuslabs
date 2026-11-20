import { BRAND } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/** The mark: a chevron prompt and a cursor block. Replace with your own logo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cx('size-7', className)}>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="#0f1c1f" stroke="rgb(190 255 230 / 0.16)" />
      <path d="M12.5 10.5 7.5 16l5 5.5" fill="none" stroke="#1fdc8a" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="16" y="18.5" width="9" height="3.4" rx="1.2" fill="#1fdc8a" className="animate-caret" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cx('inline-flex min-h-10 items-center gap-2.5 rounded-lg text-[23px] font-bold tracking-[-0.02em] text-white', className)} aria-label={`${BRAND.name} home`}>
      <LogoMark />
      <span>{BRAND.name}</span>
    </Link>
  )
}
