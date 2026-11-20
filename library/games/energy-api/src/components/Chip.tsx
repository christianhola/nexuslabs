import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

import { cx } from '../lib/cx'
import type { ForceState } from './Button'

/** A toggle pill for filters and multi-select choices (aria-pressed). */
export function Chip({
  pressed,
  onClick,
  children,
  count,
  force,
  disabled,
  check,
}: {
  pressed: boolean
  onClick: () => void
  children: ReactNode
  count?: number
  force?: ForceState
  disabled?: boolean
  check?: boolean
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      data-force={force}
      disabled={disabled}
      className={cx(
        'round inline-flex h-10 items-center gap-1.5 rounded-pill px-4 text-[14px] font-medium transition-[background-color,color,box-shadow] duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-45 data-[force=pressed]:scale-[0.98]',
        pressed
          ? 'bg-ink text-mint hover:bg-ink-2 data-[force=hover]:bg-ink-2'
          : 'bg-paper text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:text-ink data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
      )}
    >
      {check && pressed && <Check className="size-3.5" aria-hidden />}
      {children}
      {count != null && <span className={cx('tabular text-[12.5px]', pressed ? 'text-mint/70' : 'text-muted')}>{count}</span>}
    </button>
  )
}
