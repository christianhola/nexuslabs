import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'lime' | 'neutral' | 'dark' | 'ok' | 'warn' | 'bad' | 'outline'

/* Small labels: tags on records, plan names, status. Never all caps. */
export function Badge({ tone = 'neutral', size = 'sm', children, className, dot }: { tone?: BadgeTone; size?: 'sm' | 'lg'; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-medium leading-none',
        size === 'sm' ? 'h-6 rounded-[7px] px-2 text-[12px]' : 'round h-9 rounded-full px-4 text-[13.5px]',
        tone === 'lime' && 'bg-lime text-ink',
        tone === 'neutral' && 'bg-wash-2 text-body',
        tone === 'dark' && 'bg-night text-on-dark',
        tone === 'ok' && 'bg-ok-soft text-ok',
        tone === 'warn' && 'bg-warn-soft text-warn',
        tone === 'bad' && 'bg-bad-soft text-bad',
        tone === 'outline' && 'bg-card text-body ring-1 ring-inset ring-line-strong',
        className,
      )}
    >
      {dot ? <span className="round size-1.5 rounded-full bg-current" aria-hidden /> : null}
      {children}
    </span>
  )
}

/* Section eyebrow: a lime dot and a short label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-2 font-display text-[13px] font-semibold tracking-[-0.005em] text-leaf', className)}>
      <span className="round size-2 rounded-full bg-lime ring-2 ring-lime-soft" aria-hidden />
      {children}
    </p>
  )
}
