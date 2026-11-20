import { brand } from '../content'
import { cx } from '../lib/cx'

/** The Tidewell mark: a plasma ring around a bright core. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx('size-7', className)} aria-hidden>
      <defs>
        <linearGradient id="tw-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dce7ff" />
          <stop offset="1" stopColor="#4f9dff" />
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="16" rx="13" ry="6.5" fill="none" stroke="url(#tw-ring)" strokeWidth="2.6" transform="rotate(-18 16 16)" />
      <ellipse cx="16" cy="16" rx="13" ry="6.5" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" transform="rotate(42 16 16)" />
      <circle cx="16" cy="16" r="3.4" fill="#fff" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">{brand.short}</span>
    </span>
  )
}
