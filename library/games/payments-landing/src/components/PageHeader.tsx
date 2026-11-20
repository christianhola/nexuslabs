import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Container } from './Container'
import { Eyebrow } from './Eyebrow'
import { Shapes } from './Shapes'

/** The mist header band every inner page opens with. */
export function PageHeader({ eyebrow, title, body, children, className }: { eyebrow?: string; title: ReactNode; body?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <header className={cx('relative overflow-hidden bg-mist pb-14 pt-32 sm:pb-20 sm:pt-40', className)}>
      <Shapes />
      <Container className="relative">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h1 className="max-w-[760px] text-balance text-[40px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[56px]">{title}</h1>
        {body && <p className="mt-5 max-w-[560px] text-[17px] leading-[1.6] text-muted">{body}</p>}
        {children}
      </Container>
    </header>
  )
}
