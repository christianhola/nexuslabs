import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { KeyCombo } from './Kbd'

/**
 * A CSS-only tooltip shown on hover and keyboard focus. The trigger keeps its
 * own aria-label; the tooltip is decorative (aria-hidden) so nothing is read twice.
 */
export function Tooltip({
  label,
  keys,
  side = 'top',
  children,
  className,
}: {
  label: string
  keys?: string[]
  side?: 'top' | 'bottom' | 'left' | 'right'
  children: ReactNode
  className?: string
}) {
  const pos = {
    top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
    bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
    left: 'right-full top-1/2 mr-2 -translate-y-1/2',
    right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  }[side]
  return (
    <span className={cx('group/tip relative inline-flex', className)}>
      {children}
      <span
        aria-hidden
        className={cx(
          'pointer-events-none absolute z-50 flex items-center gap-2 whitespace-nowrap rounded-[7px] bg-ink px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-lg',
          'transition-opacity duration-150 [transition-delay:0ms] group-hover/tip:opacity-100 group-hover/tip:[transition-delay:350ms] group-has-[:focus-visible]/tip:opacity-100',
          'max-sm:hidden',
          pos,
        )}
      >
        {label}
        {keys && <KeyCombo keys={keys} tone="dark" />}
      </span>
    </span>
  )
}
