import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* Inline message. `tone` picks colour and icon; errors are role="alert". */
export function Notice({ tone = 'info', title, children, className, action }: { tone?: 'info' | 'ok' | 'warn' | 'bad'; title?: string; children?: ReactNode; className?: string; action?: ReactNode }) {
  const Icon = tone === 'ok' ? CircleCheck : tone === 'warn' ? TriangleAlert : tone === 'bad' ? CircleAlert : Info
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx(
        'flex items-start gap-3 rounded-[var(--radius-card-sm)] p-4 text-[14px] leading-relaxed',
        tone === 'info' && 'bg-wash text-body',
        tone === 'ok' && 'bg-ok-soft text-ink',
        tone === 'warn' && 'bg-warn-soft text-ink',
        tone === 'bad' && 'bg-bad-soft text-ink',
        className,
      )}
    >
      <Icon className={cx('mt-0.5 size-[18px] shrink-0', tone === 'ok' && 'text-ok', tone === 'warn' && 'text-warn', tone === 'bad' && 'text-bad', tone === 'info' && 'text-leaf')} aria-hidden />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-display font-semibold text-ink">{title}</p> : null}
        {children ? <div className={cx(title && 'mt-0.5')}>{children}</div> : null}
      </div>
      {action}
    </div>
  )
}
