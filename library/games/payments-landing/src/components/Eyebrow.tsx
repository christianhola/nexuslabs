import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Eyebrow({ children, className, tone = 'teal' }: { children: ReactNode; className?: string; tone?: 'teal' | 'on-navy' }) {
  return (
    <p className={cx('text-[12px] font-semibold tracking-[0.06em]', tone === 'teal' ? 'text-teal-ink' : 'text-teal-100', className)}>{children}</p>
  )
}
