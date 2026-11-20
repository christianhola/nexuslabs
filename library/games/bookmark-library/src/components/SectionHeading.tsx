import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Eyebrow({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center gap-2 rounded-sm bg-chip px-3.5 text-[14px] font-semibold tracking-[-0.01em] text-ink">
      {icon}
      {children}
    </span>
  )
}

export function SectionHeading({ eyebrow, title, lead, align = 'center', id, className }: { eyebrow?: string; title: ReactNode; lead?: string; align?: 'center' | 'left'; id?: string; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-5', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="max-w-[18ch] text-[clamp(36px,5vw,60px)] leading-[1] font-bold tracking-[-0.045em] text-balance">
        {title}
      </h2>
      {lead && <p className={cx('max-w-[60ch] text-[18px] leading-[1.55] text-muted', align === 'center' && 'text-balance')}>{lead}</p>}
    </div>
  )
}
