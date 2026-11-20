import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'depth relative inline-flex items-center gap-2 rounded-full bg-white/[0.03] px-3.5 py-1.5 text-[13px] font-medium text-soft round',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-violet-text round" />
      {children}
    </span>
  )
}
