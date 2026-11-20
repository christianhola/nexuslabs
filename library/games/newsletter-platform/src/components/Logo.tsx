import { cx } from '../lib/cx'
import { brand } from '../content'

/* The Inkwell mark: an ink drop with a nib slit. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx('size-7', className)} aria-hidden>
      <defs>
        <linearGradient id="ink-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f3d8ee" />
        </linearGradient>
      </defs>
      <path d="M16 2.5S5 14.2 5 20.6a11 11 0 0 0 22 0C27 14.2 16 2.5 16 2.5z" fill="url(#ink-g)" />
      <path d="M16 14.5v8.2" stroke="#0a0811" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="16" cy="24.6" r="2" fill="#0a0811" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-2 text-white', className)}>
      <LogoMark />
      <span className="font-display text-[25px] font-extrabold leading-none tracking-[-0.045em]">{brand.name.toLowerCase()}</span>
    </span>
  )
}
