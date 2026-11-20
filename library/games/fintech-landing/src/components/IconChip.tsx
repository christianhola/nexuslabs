import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** A lucide icon in a small squircle tile. `tone="violet"` for emphasis. */
export function IconChip({
  children,
  tone = 'neutral',
  size = 'md',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'violet' | 'up'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  return (
    <span
      aria-hidden
      className={cx(
        'depth relative grid shrink-0 place-items-center',
        size === 'sm' && 'size-9 rounded-[10px] [&_svg]:size-4',
        size === 'md' && 'size-11 rounded-[13px] [&_svg]:size-5',
        size === 'lg' && 'size-14 rounded-[16px] [&_svg]:size-6',
        tone === 'neutral' && 'bg-white/[0.05] text-white',
        tone === 'violet' && 'bg-violet/20 text-violet-text [--depth-edge:rgb(109_85_255/0.35)]',
        tone === 'up' && 'bg-up/15 text-[#4ade80]',
        className,
      )}
    >
      {children}
    </span>
  )
}
