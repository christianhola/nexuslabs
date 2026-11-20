import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  The dark panel every product surface sits on: a 1px line, a faint top
  highlight and a deep drop shadow. `tone="raised"` is one step lighter for
  cards on cards; `interactive` adds a hover lift for clickable cards.
*/
export function Card({
  children,
  className,
  tone = 'base',
  interactive,
  ...rest
}: { children: ReactNode; className?: string; tone?: 'base' | 'raised' | 'flat'; interactive?: boolean } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'relative rounded-[var(--radius-card)] border',
        tone === 'base' && 'border-line bg-panel shadow-[var(--shadow-card)]',
        tone === 'raised' && 'border-line-strong bg-panel-2',
        tone === 'flat' && 'border-line bg-night-2',
        interactive && 'transition-[transform,border-color] duration-300 ease-[var(--ease-brand)] hover:-translate-y-0.5 hover:border-line-strong',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

/* Title row used at the top of panel cards: "Analytics", "Monetization". */
export function CardHeader({ title, action, className }: { title: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex min-h-[52px] items-center justify-between gap-3 border-b border-line px-4 sm:px-5', className)}>
      <h3 className="text-[15px] font-medium text-ink">{title}</h3>
      {action}
    </div>
  )
}
