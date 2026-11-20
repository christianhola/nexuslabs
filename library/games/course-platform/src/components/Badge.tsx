import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export type BadgeTone = 'neutral' | 'flame' | 'solid' | 'indigo' | 'violet' | 'ok' | 'warn' | 'bad' | 'outline'

/* Small labels: course levels, statuses, plan names. Never all caps. */
export function Badge({ tone = 'neutral', size = 'sm', children, className, dot }: { tone?: BadgeTone; size?: 'xs' | 'sm' | 'md'; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap font-medium leading-none',
        size === 'xs' && 'h-[18px] rounded-[6px] px-1.5 text-[10.5px]',
        size === 'sm' && 'h-6 rounded-[7px] px-2 text-[12px]',
        size === 'md' && 'h-7 rounded-[8px] px-2.5 text-[13px]',
        tone === 'neutral' && 'bg-wash-2 text-body',
        tone === 'flame' && 'bg-flame-soft text-flame-ink',
        tone === 'solid' && 'bg-flame-strong text-white',
        tone === 'indigo' && 'bg-azure-soft text-indigo-ink',
        tone === 'violet' && 'bg-violet-soft text-violet',
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
