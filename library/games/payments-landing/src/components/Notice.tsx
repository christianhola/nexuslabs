import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'

import { cx } from '../lib/cx'

export type NoticeTone = 'info' | 'success' | 'warning' | 'danger'

const map = {
  info: { cls: 'border-teal-100 bg-teal-50 text-teal-deep', Icon: Info },
  success: { cls: 'border-[#bfe3d0] bg-success-50 text-success', Icon: CircleCheck },
  warning: { cls: 'border-[#f1dca6] bg-warning-50 text-warning', Icon: TriangleAlert },
  danger: { cls: 'border-[#f3c6c1] bg-danger-50 text-danger', Icon: CircleAlert },
}

export function Notice({ tone = 'info', title, children, className, live = true }: { tone?: NoticeTone; title?: ReactNode; children?: ReactNode; className?: string; live?: boolean }) {
  const { cls, Icon } = map[tone]
  return (
    <div role={live ? (tone === 'danger' ? 'alert' : 'status') : undefined} className={cx('flex gap-3 rounded-control border p-3.5 text-[14px] leading-[1.5]', cls, className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cx(!!title && 'mt-0.5')}>{children}</div>}
      </div>
    </div>
  )
}
