import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* A line-art phone that holds a live app screen. */
export function PhoneFrame({ children, className, title }: { children: ReactNode; className?: string; title?: string }) {
  return (
    <div className={cx('relative mx-auto w-full max-w-[340px] rounded-[44px] border-[1.5px] border-ink bg-card p-[10px] shadow-[10px_12px_0_var(--color-mist-2)]', className)}>
      <div className="relative flex h-[600px] flex-col overflow-hidden rounded-[34px] border border-line bg-card">
        <div className="flex h-11 shrink-0 items-center justify-between px-6 text-[12px] font-semibold text-ink">
          <span>9:41</span>
          <span className="round absolute left-1/2 top-2.5 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-ink" aria-hidden />
          <span className="flex items-center gap-1" aria-hidden>
            <span className="h-2.5 w-4 rounded-[3px] border border-ink" />
          </span>
        </div>
        {title ? <p className="px-5 pb-2 font-display text-[22px] font-semibold tracking-[-0.03em] text-ink">{title}</p> : null}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
