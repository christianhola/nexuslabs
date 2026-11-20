import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-12 text-center', className)}>
      {icon ? <div className="mb-3 grid size-12 place-items-center rounded-[14px] border-[1.5px] border-ink bg-mint-soft text-ink [&_svg]:size-5">{icon}</div> : null}
      <p className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</p>
      {body ? <p className="mt-1 max-w-[36ch] text-[14.5px] text-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
