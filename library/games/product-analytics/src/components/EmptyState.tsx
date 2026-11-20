import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* What a list shows when there is nothing in it, with a way out. */
export function EmptyState({ icon, title, body, action, className }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center gap-3 rounded-[var(--radius-card-sm)] border border-dashed border-line-strong bg-card/60 px-6 py-10 text-center', className)}>
      {icon ? <span className="round grid size-11 place-items-center rounded-full bg-lime-soft text-leaf [&_svg]:size-5">{icon}</span> : null}
      <p className="font-display text-[16px] font-semibold text-ink">{title}</p>
      {body ? <p className="max-w-[340px] text-[14px] leading-relaxed text-muted">{body}</p> : null}
      {action}
    </div>
  )
}
