import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Tooltip } from './Tooltip'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Accessible name and tooltip text. */
  label: string
  keys?: string[]
  size?: 'sm' | 'md'
  /** A pressed tool (aria-pressed) gets the ink fill. */
  active?: boolean
  tone?: 'default' | 'danger' | 'dark'
  tooltip?: 'top' | 'bottom' | 'left' | 'right' | false
  children: ReactNode
}

/** Square icon button with a tooltip. Used for tools, zoom and every action bar. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, keys, size = 'md', active, tone = 'default', tooltip = 'top', className, children, type = 'button', ...rest },
  ref,
) {
  const btn = (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      aria-pressed={active ?? undefined}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-[8px] transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.92]',
        'disabled:pointer-events-none disabled:opacity-35',
        size === 'sm' ? 'size-10 sm:size-8' : 'size-10 sm:size-9',
        tone === 'dark'
          ? 'text-white/85 hover:bg-white/12 hover:text-white'
          : active
            ? 'bg-ink text-white'
            : tone === 'danger'
              ? 'text-danger hover:bg-danger/10'
              : 'text-ink-2 hover:bg-black/[0.06] hover:text-ink',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
  if (tooltip === false) return btn
  return (
    <Tooltip label={label} keys={keys} side={tooltip}>
      {btn}
    </Tooltip>
  )
})
