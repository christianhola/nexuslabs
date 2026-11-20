import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'cobalt' | 'cherry' | 'saffron' | 'mint'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.07] text-soft border-white/10',
  cobalt: 'bg-cobalt-soft text-cobalt-text border-cobalt/30',
  cherry: 'bg-cherry/15 text-cherry-text border-cherry/30',
  saffron: 'bg-saffron/15 text-saffron border-saffron/30',
  mint: 'bg-mint/15 text-mint-text border-mint/30',
}

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: BadgeTone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cx('inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 text-[12px] font-semibold', tones[tone], className)}>
      {dot ? <span aria-hidden className={cx('size-1.5 rounded-full bg-current', tone === 'mint' && 'animate-pulse-ring')} /> : null}
      {children}
    </span>
  )
}
