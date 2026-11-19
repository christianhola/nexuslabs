import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** The small sentence-case eyebrow above sections ("Intro", "Studio highlights"). */
export function Label({ children, number, className, tone = 'dark' }: { children: ReactNode; number?: string; className?: string; tone?: 'dark' | 'light' }) {
  return (
    <p className={cx('label-sm flex items-center gap-3', tone === 'light' ? 'text-snow-muted' : 'text-ink-2', className)}>
      {number && <span className="tabular-nums text-muted">{number}</span>}
      {children}
    </p>
  )
}
