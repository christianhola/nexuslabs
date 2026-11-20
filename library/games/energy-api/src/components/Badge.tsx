import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'live' | 'beta' | 'soon' | 'danger' | 'forest'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-mint-2 text-ink-2',
  live: 'bg-success-50 text-success',
  beta: 'bg-warning-50 text-warning',
  soon: 'bg-paper text-muted shadow-[inset_0_0_0_1px_var(--color-line)]',
  danger: 'bg-danger-50 text-danger',
  forest: 'bg-forest-3 text-on-forest',
}

export function Badge({ children, tone = 'neutral', dot, className }: { children: ReactNode; tone?: BadgeTone; dot?: boolean; className?: string }) {
  return (
    <span className={cx('round inline-flex h-6 items-center gap-1.5 rounded-pill px-2.5 text-[12.5px] font-medium', tones[tone], className)}>
      {dot && <span className={cx('round size-1.5 rounded-full bg-current', tone === 'live' && 'animate-pulse-dot')} aria-hidden />}
      {children}
    </span>
  )
}
