import type { HTMLAttributes, ReactNode } from 'react'
import { cx } from '../lib/cx'

/** The base surface: a dark panel with the depth edge. */
export function Card({ children, className, as: As = 'div', ...rest }: HTMLAttributes<HTMLElement> & { children: ReactNode; as?: 'div' | 'section' | 'article' | 'aside' | 'li' }) {
  return (
    <As className={cx('depth relative rounded-card bg-surface', className)} {...rest}>
      {children}
    </As>
  )
}

export function CardHeader({ title, action, sub, className }: { title: ReactNode; action?: ReactNode; sub?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-[17px] font-medium tracking-[-0.01em] text-fg">{title}</h2>
        {sub && <p className="mt-0.5 text-[13.5px] text-muted">{sub}</p>}
      </div>
      {action}
    </div>
  )
}
