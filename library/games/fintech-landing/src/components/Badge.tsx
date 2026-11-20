import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'violet' | 'up' | 'down' | 'glass' | 'info'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.08] text-soft',
  violet: 'bg-violet text-white',
  up: 'bg-up/15 text-[#4ade80]',
  down: 'bg-coin/15 text-[#ff8a6b]',
  glass: 'bg-black/55 text-white backdrop-blur',
  info: 'bg-[#bfe3ff] text-[#0b2a44]',
}

/** Small pill label: plan flags, post tags, deltas and statuses. */
export function Badge({
  children,
  tone = 'neutral',
  size = 'md',
  icon,
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  size?: 'sm' | 'md'
  icon?: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-medium round',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}
