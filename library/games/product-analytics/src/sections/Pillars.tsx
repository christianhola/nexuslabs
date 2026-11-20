import { ArrowUpRight } from 'lucide-react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { FunnelChart } from '../components/FunnelChart'
import { Reveal } from '../components/Reveal'
import { RetentionGrid } from '../components/RetentionGrid'
import { SectionHeading } from '../components/SectionHeading'
import { SignalFeed } from '../components/SignalFeed'
import { funnels, pillars, retention } from '../content'
import { Link } from '../lib/router'

export function Pillars() {
  const visuals = {
    funnels: <FunnelChart compact steps={funnels.steps.map((s) => ({ label: s.label, value: s.values[0]! }))} />,
    retention: <RetentionGrid compact cohorts={retention.cohorts.slice(0, 5).map((c) => ({ ...c, values: c.values.slice(0, 5) }))} />,
    signals: <SignalFeed rows={3} />,
  } as const
  return (
    <section aria-labelledby="pillars-h" className="py-24 sm:py-32">
      <Container>
        <SectionHeading id="pillars-h" eyebrow={pillars.eyebrow} title={pillars.title} lede={pillars.lede} />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <Card pad="none" className="group flex h-full flex-col overflow-hidden">
                <div className="flex h-[236px] items-center bg-[linear-gradient(180deg,#f2f6ee,#fbfcfa)] px-5 py-6">
                  <div className="w-full">{visuals[p.id as keyof typeof visuals]}</div>
                </div>
                <div className="flex flex-1 flex-col gap-2 border-t border-line p-6">
                  <h3 className="font-display text-[19px] font-bold tracking-[-0.025em] text-ink">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{p.body}</p>
                  <Link href={p.href} className="mt-auto inline-flex min-h-10 items-center gap-1 self-start rounded-[8px] pt-2 font-display text-[14px] font-semibold text-leaf hover:text-leaf-deep focus-visible:outline-2 focus-visible:outline-leaf">
                    Learn more<span className="sr-only"> about {p.title.toLowerCase()}</span>
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
