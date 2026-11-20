import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'

export function SectionHeading({ eyebrow, title, body, align = 'left', className, id, as: H = 'h2' }: { eyebrow?: string; title: ReactNode; body?: ReactNode; align?: 'left' | 'center'; className?: string; id?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cx('flex flex-col gap-4', align === 'center' && 'items-center text-center', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <H id={id} className={cx('text-balance font-display font-semibold tracking-[-0.04em] text-ink', H === 'h1' ? 'text-[40px] leading-[1.04] sm:text-[56px]' : 'text-[32px] leading-[1.08] sm:text-[42px]')}>
        {title}
      </H>
      {body ? <p className={cx('text-pretty text-[17px] leading-[1.65] text-muted sm:text-[18px]', align === 'center' ? 'max-w-[58ch]' : 'max-w-[56ch]')}>{body}</p> : null}
    </div>
  )
}

/* The top of every inner page. */
export function PageHeader({ eyebrow, title, body, children, className }: { eyebrow: string; title: ReactNode; body?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={cx('pb-12 pt-14 sm:pb-16 sm:pt-20', className)}>
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} body={body} />
      {children ? <div className="mt-8">{children}</div> : null}
    </header>
  )
}
