import { MessageSquareDashed } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function EmptyState({ title, body, action, className }: { title: string; body?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('grid justify-items-center gap-3 rounded-card border border-dashed border-line-strong px-6 py-12 text-center', className)}>
      <span className="grid size-12 place-items-center rounded-full bg-white/[0.06] text-muted">
        <MessageSquareDashed aria-hidden className="size-5" />
      </span>
      <p className="font-display text-[18px] font-medium text-white">{title}</p>
      {body ? <p className="max-w-sm text-[14px] text-muted">{body}</p> : null}
      {action}
    </div>
  )
}
