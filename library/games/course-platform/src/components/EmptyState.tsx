import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* What a list shows when there is nothing in it, with a way forward. */
export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-wash px-6 py-12 text-center', className)}>
      <span className="round grid size-12 place-items-center rounded-full bg-card text-flame-ink shadow-card [&_svg]:size-5">{icon}</span>
      <p className="font-display text-[17px] font-medium text-ink">{title}</p>
      {body ? <p className="max-w-[360px] text-[14px] text-muted">{body}</p> : null}
      {action}
    </div>
  )
}
