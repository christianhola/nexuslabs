import { motion } from 'motion/react'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

const tones = {
  info: { cls: 'bg-white/[0.04] text-soft [--depth-edge:rgb(255_255_255/0.12)]', icon: Info, iconCls: 'text-violet-text' },
  success: { cls: 'bg-up/10 text-[#bbf7d0] [--depth-edge:rgb(74_222_128/0.3)]', icon: CheckCircle2, iconCls: 'text-[#4ade80]' },
  error: { cls: 'bg-coin/10 text-[#ffd2c6] [--depth-edge:rgb(255_123_92/0.35)]', icon: AlertCircle, iconCls: 'text-[#ff8a6b]' },
}

/** Inline message box. `role` is status for info/success and alert for errors. */
export function Notice({
  tone = 'info',
  title,
  children,
  className,
}: {
  tone?: keyof typeof tones
  title?: ReactNode
  children?: ReactNode
  className?: string
}) {
  const t = tones[tone]
  const Icon = t.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx('depth relative flex gap-3 rounded-[16px] px-4 py-3.5 text-[14px] leading-relaxed', t.cls, className)}
    >
      <Icon className={cx('mt-[3px] size-4 shrink-0', t.iconCls)} aria-hidden />
      <div>
        {title ? <div className="font-medium text-white">{title}</div> : null}
        {children}
      </div>
    </motion.div>
  )
}
