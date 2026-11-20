import type { ReactNode } from 'react'

import { Container, FrameLines } from '@/components/Frame'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'

/** Marketing page shell: frame lines, nav, a page header and the footer. */
export function MarketingPage({ title, sub, eyebrow, children, aside }: { title: string; sub?: string; eyebrow?: string; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <FrameLines className="h-[420px]" />
      <div className="pointer-events-none absolute top-[300px] left-1/2 h-[260px] w-[110%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(124_36_24/0.28),transparent)]" aria-hidden />
      <SiteNav />
      <main className="relative">
        <Container className="pt-16 pb-12 sm:pt-24">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              {eyebrow && <p className="mb-4 text-[13px] font-medium tracking-[0.02em] text-ember-text">{eyebrow}</p>}
              <h1 className="max-w-[18ch] font-display text-[40px] leading-[1.06] font-medium tracking-[-0.04em] text-cream text-balance sm:text-[56px]">{title}</h1>
              {sub && <p className="mt-5 max-w-[54ch] text-[18px] leading-[1.55] text-muted sm:text-[20px]">{sub}</p>}
            </div>
            {aside}
          </div>
        </Container>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
