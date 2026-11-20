import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: string; body: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center rounded-xl border border-dashed border-line-2 px-6 py-14 text-center', className)}>
      {icon && <span className="mb-4 grid size-12 place-items-center rounded-lg bg-chip text-ink-2">{icon}</span>}
      <p className="text-[17px] font-semibold tracking-[-0.02em]">{title}</p>
      <p className="mt-1.5 max-w-[42ch] text-[15px] text-muted">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
