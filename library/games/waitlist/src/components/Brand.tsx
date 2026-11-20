import { brand } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'

/** The app mark (same drawing as public/favicon.svg). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={cx('size-7', className)} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="var(--color-accent)" />
      <path d="M18 44 L30 26 L37 35 L41 30 L48 44 Z" fill="#fff" />
      <circle cx="44" cy="20" r="5" fill="#fff" />
    </svg>
  )
}

/** Mark + wordmark, linking home. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cx('inline-flex h-10 items-center gap-2.5 rounded-control text-[18px] font-bold tracking-[-0.03em] text-ink outline-none is-focus:shadow-focus', className)}
    >
      <LogoMark />
      {brand.name}
    </Link>
  )
}
