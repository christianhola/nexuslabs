import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: ReactNode; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center rounded-card-sm border border-dashed border-line-strong bg-mist-2 px-6 py-10 text-center', className)}>
      {icon && <span className="mb-3 grid size-11 place-items-center rounded-control bg-white text-teal-ink shadow-card">{icon}</span>}
      <p className="text-[15px] font-medium text-ink">{title}</p>
      {body && <p className="mt-1 max-w-[320px] text-[14px] leading-6 text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
