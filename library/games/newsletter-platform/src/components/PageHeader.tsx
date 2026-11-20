import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'
import { Container } from './Container'

/* The top of every inner screen: pink eyebrow, display title, intro, actions. */
export function PageHeader({ eyebrow, title, intro, actions, className }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <Container className={cx('pb-8 pt-12 sm:pt-16', className)}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-[760px]">
          {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
          <h1 className="display text-balance text-[40px] uppercase text-white sm:text-[56px]">{title}</h1>
          {intro ? <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-body sm:text-[18px]">{intro}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </Container>
  )
}
