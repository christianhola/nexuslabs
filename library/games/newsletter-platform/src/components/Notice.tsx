import { CheckCircle2, CircleAlert, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* Inline message for form results and page-level errors. */
export function Notice({ tone = 'info', title, children, action, className }: { tone?: 'info' | 'ok' | 'bad'; title: ReactNode; children?: ReactNode; action?: ReactNode; className?: string }) {
  const Icon = tone === 'ok' ? CheckCircle2 : tone === 'bad' ? CircleAlert : Info
  return (
    <div role={tone === 'bad' ? 'alert' : 'status'} className={cx('flex items-start gap-3 rounded-[12px] border px-4 py-3.5', tone === 'ok' && 'border-ok/30 bg-ok-soft', tone === 'bad' && 'border-bad/30 bg-bad-soft', tone === 'info' && 'border-line-strong bg-panel-2', className)}>
      <Icon className={cx('mt-0.5 size-5 shrink-0', tone === 'ok' && 'text-ok', tone === 'bad' && 'text-bad', tone === 'info' && 'text-pink-text')} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-ink">{title}</p>
        {children ? <div className="mt-0.5 text-[14px] text-body">{children}</div> : null}
      </div>
      {action}
    </div>
  )
}
