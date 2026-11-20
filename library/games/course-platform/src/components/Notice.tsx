import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* An inline message for form results. `role` makes it announce. */
export function Notice({ tone = 'info', title, children, className }: { tone?: 'info' | 'ok' | 'bad'; title?: string; children?: ReactNode; className?: string }) {
  const Icon = tone === 'ok' ? CircleCheck : tone === 'bad' ? CircleAlert : Info
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx(
        'flex gap-3 rounded-[var(--radius-card-sm)] p-4 text-[14px] leading-relaxed',
        tone === 'info' && 'bg-azure-soft text-indigo-ink',
        tone === 'ok' && 'bg-ok-soft text-ok',
        tone === 'bad' && 'bg-bad-soft text-bad',
        className,
      )}
    >
      <Icon className="mt-0.5 size-[18px] shrink-0" aria-hidden />
      <div>
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={title ? 'mt-0.5' : ''}>{children}</div> : null}
      </div>
    </div>
  )
}
