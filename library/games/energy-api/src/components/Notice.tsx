import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info } from 'lucide-react'

import { cx } from '../lib/cx'

export type NoticeTone = 'info' | 'success' | 'error'

const tones: Record<NoticeTone, { cls: string; Icon: typeof Info }> = {
  info: { cls: 'bg-paper text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line)]', Icon: Info },
  success: { cls: 'bg-success-50 text-success', Icon: CircleCheck },
  error: { cls: 'bg-danger-50 text-danger', Icon: CircleAlert },
}

export function Notice({ tone = 'info', title, children, className }: { tone?: NoticeTone; title?: ReactNode; children?: ReactNode; className?: string }) {
  const { cls, Icon } = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-control px-4 py-3 text-[14px] leading-6', cls, className)}>
      <Icon className="mt-[3px] size-[18px] shrink-0" aria-hidden />
      <div>
        {title && <p className="font-medium">{title}</p>}
        {children && <div className={cx(title ? 'opacity-90' : undefined)}>{children}</div>}
      </div>
    </div>
  )
}
