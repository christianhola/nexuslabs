import { currency } from '../shared/fx'
import type { CurrencyCode } from '../shared/fx'
import { cx } from '../lib/cx'

/** A coloured disc with the currency symbol, standing in for a flag. */
export function CurrencyBadge({ code, className }: { code: CurrencyCode; className?: string }) {
  const c = currency(code)
  return (
    <span
      aria-hidden
      className={cx('round inline-grid size-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-white', className)}
      style={{ background: c.tint }}
    >
      {c.symbol.replace(/[A-Z]+/, '') || c.symbol}
    </span>
  )
}
