import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { IconChip } from './IconChip'

/** Shown when a filter or search has nothing to list. */
export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cx('flex flex-col items-center rounded-card border border-dashed border-white/15 px-6 py-14 text-center', className)}>
      <IconChip size="lg">{icon}</IconChip>
      <h3 className="mt-5 font-display text-[20px] font-semibold tracking-[-0.02em]">{title}</h3>
      {body ? <p className="mt-2 max-w-[360px] text-[15px] text-muted text-pretty">{body}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
