import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Eyebrow({ children, className, tone = 'ink' }: { children: ReactNode; className?: string; tone?: 'ink' | 'forest' }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[14px] font-medium', tone === 'forest' ? 'text-on-forest-muted' : 'text-muted', className)}>
      <span className="round size-[7px] rounded-full bg-volt-2" aria-hidden />
      {children}
    </p>
  )
}
