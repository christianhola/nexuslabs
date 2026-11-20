import { CircleAlert, CircleCheck, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type NoticeTone = 'info' | 'success' | 'error'

const tones = {
  info: { cls: 'border-cobalt/40 bg-cobalt-soft text-soft', Icon: Info, icon: 'text-cobalt-text' },
  success: { cls: 'border-mint/35 bg-mint/10 text-soft', Icon: CircleCheck, icon: 'text-mint-text' },
  error: { cls: 'border-cherry/40 bg-cherry/10 text-soft', Icon: CircleAlert, icon: 'text-cherry-text' },
}

export function Notice({ tone = 'info', title, children, className }: { tone?: NoticeTone; title?: string; children?: ReactNode; className?: string }) {
  const t = tones[tone]
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={cx('flex gap-3 rounded-[12px] border p-4 text-[14px] leading-relaxed', t.cls, className)}>
      <t.Icon aria-hidden className={cx('mt-0.5 size-[18px] shrink-0', t.icon)} />
      <div>
        {title ? <p className="font-semibold text-white">{title}</p> : null}
        {children}
      </div>
    </div>
  )
}
