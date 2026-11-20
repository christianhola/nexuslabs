import { useState } from 'react'
import type { ComponentType } from 'react'
import { Check } from 'lucide-react'

import { ChallengeMock, InterviewMock, ReportMock } from '../components/Mocks'
import { Container } from '../components/Container'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs, tabPanelProps } from '../components/Tabs'
import { ButtonLink } from '../components/Button'
import { SOLUTIONS } from '../content'

type Id = 'screen' | 'interview' | 'report'
const mocks: Record<Id, ComponentType> = { screen: ChallengeMock, interview: InterviewMock, report: ReportMock }
const links: Record<Id, { label: string; href: string }> = {
  screen: { label: 'Try the challenge', href: '/demo' },
  interview: { label: 'Browse questions', href: '/library' },
  report: { label: 'Open a sample report', href: '/reports/c-amara' },
}

export function Solutions() {
  const [tab, setTab] = useState<Id>('screen')
  const t = SOLUTIONS.tabs.find((x) => x.id === tab)!
  const Mock = mocks[tab]
  return (
    <section id="solutions" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={SOLUTIONS.eyebrow} title={SOLUTIONS.title} sub={SOLUTIONS.sub} />
        <div className="mt-10 flex justify-center">
          <Tabs idBase="solutions" label="Products" items={SOLUTIONS.tabs.map((x) => ({ id: x.id as Id, label: x.label }))} value={tab} onChange={setTab} />
        </div>
        <div {...tabPanelProps('solutions', tab)} className="mt-10 grid grid-cols-[minmax(0,1fr)] items-center gap-10 rounded-card lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
          <div key={tab} className="animate-pop">
            <h3 className="text-[28px] leading-tight font-normal tracking-[-0.02em] text-fg sm:text-[32px]">{t.title}</h3>
            <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{t.body}</p>
            <ul className="mt-6 grid gap-3">
              {t.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15.5px] text-fg">
                  <span className="round mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-text">
                    <Check aria-hidden className="size-3" strokeWidth={3} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href={links[tab].href} variant="secondary" className="mt-8">
              {links[tab].label}
            </ButtonLink>
          </div>
          <div className="relative">
            <div aria-hidden className="absolute inset-x-0 -inset-y-10 -z-10 xl:-inset-x-10 bg-[radial-gradient(ellipse_at_center,rgb(31_220_138/0.14),transparent_65%)]" />
            <Mock />
          </div>
        </div>
      </Container>
    </section>
  )
}
