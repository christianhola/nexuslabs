import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* A centred (or left) section title with an optional eyebrow and lead. */
export function SectionHeading({ eyebrow, title, lead, align = 'center', as: H = 'h2', className, id }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; align?: 'center' | 'left'; as?: 'h1' | 'h2'; className?: string; id?: string }) {
  return (
    <div className={cx('flex flex-col gap-3', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <H id={id} className={cx('text-balance font-display font-medium tracking-[-0.025em] text-ink', H === 'h1' ? 'text-[40px] leading-[1.05] sm:text-[52px]' : 'text-[30px] leading-[1.12] sm:text-[38px]')}>
        {title}
      </H>
      {lead ? <p className={cx('max-w-[620px] text-[15.5px] leading-relaxed text-muted', align === 'center' && 'mx-auto')}>{lead}</p> : null}
    </div>
  )
}

/* Small flame label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cx('inline-flex items-center gap-2 font-display text-[13.5px] font-medium text-flame-ink', className)}>{children}</p>
}
