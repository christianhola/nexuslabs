import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'teal' | 'success' | 'warning' | 'danger' | 'navy'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-mist text-ink-2',
  teal: 'bg-teal-50 text-teal-deep',
  success: 'bg-success-50 text-success',
  warning: 'bg-warning-50 text-warning',
  danger: 'bg-danger-50 text-danger',
  navy: 'bg-navy text-white',
}

export function Badge({ tone = 'neutral', children, dot, className }: { tone?: BadgeTone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cx('inline-flex h-6 items-center gap-1.5 rounded-[8px] px-2 text-[12px] font-medium', tones[tone], className)}>
      {dot && <span aria-hidden className="round size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
