import { forwardRef, type HTMLAttributes } from 'react'

import { cx } from '../lib/cx'

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  /** frost: translucent white with backdrop blur (the hero card, floating bars). solid: plain white. */
  tone?: 'frost' | 'solid'
  radius?: 'card' | 'panel'
}

/** The white rounded surface everything floats on. */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { tone = 'frost', radius = 'panel', className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cx(
        tone === 'frost' ? 'frost' : 'bg-surface',
        radius === 'panel' ? 'rounded-[var(--radius-panel)]' : 'rounded-[var(--radius-card)]',
        'shadow-[var(--shadow-float)]',
        className,
      )}
      {...rest}
    />
  )
})

/** A horizontal bar of IconButtons inside a frosted Panel. */
export function Toolbar({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <Panel role="toolbar" className={cx('flex items-center gap-0.5 p-1', className)} {...rest} />
}

export function ToolbarDivider() {
  return <span aria-hidden className="mx-1 h-5 w-px shrink-0 bg-line-strong" />
}
