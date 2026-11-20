import { brand } from '../content'
import { cx } from '../lib/cx'

/** The Ledgerly mark: a folded ledger page. Edit the path to rebrand. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cx('size-7', className)} aria-hidden>
      <path d="M5 4h12.5A5.5 5.5 0 0 1 23 9.5V12h-6.5A3.5 3.5 0 0 0 13 15.5V24H5z" fill="currentColor" />
      <path d="M16 15h7v9h-7z" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

export function Logo({ className, tone = 'ink' }: { className?: string; tone?: 'ink' | 'white' }) {
  return (
    <span className={cx('inline-flex items-center gap-2', tone === 'white' ? 'text-white' : 'text-ink', className)}>
      <LogoMark className={tone === 'white' ? 'text-white' : 'text-navy'} />
      <span className="text-[23px] font-semibold tracking-[-0.03em]">{brand.name}</span>
    </span>
  )
}
