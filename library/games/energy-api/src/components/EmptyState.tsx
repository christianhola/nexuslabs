import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center rounded-card border border-dashed border-line-strong px-6 py-14 text-center', className)}>
      {icon && <div className="mb-4 grid size-12 place-items-center rounded-control bg-mint-2 text-ink-2">{icon}</div>}
      <p className="text-[18px] font-medium tracking-[-0.02em]">{title}</p>
      {body && <p className="mt-1.5 max-w-[380px] text-[15px] leading-6 text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
