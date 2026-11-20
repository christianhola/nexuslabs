import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Notice({ tone = 'info', title, children, className, live = true }: { tone?: 'info' | 'ok' | 'bad'; title?: string; children?: ReactNode; className?: string; live?: boolean }) {
  const Icon = tone === 'ok' ? CircleCheck : tone === 'bad' ? CircleAlert : Info
  return (
    <div
      role={live ? (tone === 'bad' ? 'alert' : 'status') : undefined}
      className={cx('flex gap-3 rounded-[var(--radius-card-sm)] border p-4 text-[14.5px]', tone === 'ok' && 'border-mint bg-mint-soft text-ink', tone === 'bad' && 'border-[#f4c7c1] bg-bad-soft text-bad', tone === 'info' && 'border-line bg-mist text-body', className)}
    >
      <Icon className={cx('mt-0.5 size-[18px] shrink-0', tone === 'ok' && 'text-leaf')} aria-hidden />
      <div>
        {title ? <p className="font-medium text-current">{title}</p> : null}
        {children ? <div className={cx(title && 'mt-0.5', tone === 'bad' ? 'text-bad' : 'text-body')}>{children}</div> : null}
      </div>
    </div>
  )
}
