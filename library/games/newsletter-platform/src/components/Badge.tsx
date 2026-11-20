import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'pink' | 'ok' | 'warn' | 'bad' | 'violet'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-white/[0.07] text-body',
  pink: 'bg-pink/15 text-pink-text',
  violet: 'bg-violet-soft text-[#c4b2fb]',
  ok: 'bg-ok-soft text-ok',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
}

export function Badge({ children, tone = 'neutral', className, dot }: { children: ReactNode; tone?: BadgeTone; className?: string; dot?: boolean }) {
  return (
    <span className={cx('inline-flex h-6 items-center gap-1.5 rounded-[6px] px-2 text-[12px] font-semibold', tones[tone], className)}>
      {dot ? <span className="round size-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  )
}

/* Pink section label above a display heading: "Newsletter". */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('text-[19px] font-medium text-pink-text', className)}>{children}</p>
}
