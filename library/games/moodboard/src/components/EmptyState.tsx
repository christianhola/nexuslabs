import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** Centered icon, line of copy and an optional action, for empty boards and lists. */
export function EmptyState({ icon, title, body, action, className, heading }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode; className?: string; heading?: boolean }) {
  const Title = heading ? 'h1' : 'p'
  return (
    <div className={cx('flex flex-col items-center px-6 text-center', className)}>
      {icon && <div className="mb-4 flex size-12 items-center justify-center rounded-[12px] bg-surface text-ink-2 shadow-[var(--shadow-float)]">{icon}</div>}
      <Title className="text-[17px] font-medium tracking-[-0.015em] text-ink">{title}</Title>
      {body && <p className="mt-1 max-w-[340px] text-[14px] leading-[1.45] text-muted">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
