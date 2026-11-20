import type { ReactNode } from 'react'

import { cn } from '../lib/cn'

export function EmptyState({ icon, title, body, action, className }: { icon: ReactNode; title: string; body?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('grid justify-items-center gap-2 rounded-sm border border-dashed border-line px-6 py-10 text-center', className)}>
      <span aria-hidden className="mb-1 grid size-10 place-items-center rounded-md bg-subtle text-muted [&>svg]:size-5">
        {icon}
      </span>
      <p className="text-sm font-semibold text-fg">{title}</p>
      {body && <p className="max-w-xs text-xs text-muted">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden className={cn('block rounded-sm skeleton', className)} />
}
