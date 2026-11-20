import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Card({ children, className, tone = 'plain', as: As = 'div' }: { children: ReactNode; className?: string; tone?: 'plain' | 'mist' | 'line'; as?: 'div' | 'article' | 'li' | 'section' }) {
  return (
    <As
      className={cx(
        'rounded-[var(--radius-card)]',
        tone === 'plain' && 'border border-line bg-card shadow-[var(--shadow-card)]',
        tone === 'mist' && 'bg-mist',
        tone === 'line' && 'line-art',
        className,
      )}
    >
      {children}
    </As>
  )
}
