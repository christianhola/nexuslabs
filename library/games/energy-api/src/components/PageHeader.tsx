import type { ReactNode } from 'react'

import { Container } from './Container'
import { DotColumns } from './DotColumns'
import { SectionHeading } from './SectionHeading'

const columns = [
  { left: 1053, top: 20, height: 200, delay: -1 },
  { left: 1116, top: 110, height: 170, delay: -3 },
  { left: 1310, top: 50, height: 230, delay: -2 },
]

/** The top of every inner page: eyebrow, h1, lede and an optional aside, over faint dot columns. */
export function PageHeader({ eyebrow, title, body, aside, children }: { eyebrow?: ReactNode; title: ReactNode; body?: ReactNode; aside?: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative -mt-[58px] overflow-hidden pt-[58px]">
      {!aside && <DotColumns columns={columns} />}
      <Container className="relative pb-12 pt-16 sm:pb-16 sm:pt-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading as="h1" eyebrow={eyebrow} title={title} body={body} />
          {aside && <div className="shrink-0">{aside}</div>}
        </div>
        {children}
      </Container>
    </section>
  )
}
