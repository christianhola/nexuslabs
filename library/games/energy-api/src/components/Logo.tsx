import { cx } from '../lib/cx'
import { brand } from '../content'

/** The Gridwise mark: two offset hooks that meet like a plug in a socket. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cx('size-[22px]', className)}>
      <path d="M10.5 4.5H6.75A3.75 3.75 0 0 0 3 8.25v0A3.75 3.75 0 0 0 6.75 12H9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M13.5 19.5h3.75A3.75 3.75 0 0 0 21 15.75v0A3.75 3.75 0 0 0 17.25 12H15" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M9 12h6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-[7px] text-[21px] font-semibold tracking-[-0.03em]', className)}>
      <LogoMark />
      {brand.name}
    </span>
  )
}
