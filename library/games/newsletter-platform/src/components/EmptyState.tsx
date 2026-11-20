import type { ReactNode } from 'react'

/* Shown when a list or search has nothing to show. Always offer a way out. */
export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-14 text-center">
      <div className="grid size-12 place-items-center rounded-[12px] bg-panel-2 text-pink-text [&_svg]:size-6">{icon}</div>
      <p className="mt-4 text-[18px] font-semibold text-ink">{title}</p>
      <p className="mt-1.5 max-w-[380px] text-[15px] text-muted">{body}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
