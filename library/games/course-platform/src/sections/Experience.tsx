import { Award, TrendingUp } from 'lucide-react'

import { Container } from '../components/Container'
import { DashboardMock } from '../components/DashboardMock'
import { Reveal } from '../components/Reveal'
import { ScaledFrame } from '../components/ScaledFrame'
import { SectionHeading } from '../components/SectionHeading'
import { experience } from '../content'
import { cx } from '../lib/cx'

export function Experience() {
  return (
    <section id="features" aria-labelledby="experience-title" className="py-16 lg:py-24">
      <Container>
        <Reveal>
          <SectionHeading id="experience-title" title={experience.title} lead={experience.lead} />
        </Reveal>
        <Reveal delay={0.08}>
          <div className="mt-14 grid grid-cols-1 gap-5 rounded-[var(--radius-panel)] border border-line bg-card p-4 shadow-card sm:p-6 lg:grid-cols-[1.75fr_1fr_1fr] lg:p-12">
            <div className="overflow-hidden rounded-[18px] bg-flame-soft px-5 pt-8 sm:px-8 lg:pt-14">
              <ScaledFrame width={620} height={360} label="Creator dashboard preview" interactiveFrom={420}>
                <DashboardMock />
              </ScaledFrame>
            </div>
            {experience.cards.map((c, i) => (
              <div key={c.title} className="flex flex-col items-center rounded-[18px] border border-line px-6 py-10 text-center">
                <span className={cx('round grid size-14 place-items-center rounded-full', i === 0 ? 'bg-flame-soft text-flame-ink' : 'bg-wash-2 text-ink')}>
                  {i === 0 ? <TrendingUp className="size-6" aria-hidden /> : <Award className="size-6" aria-hidden />}
                </span>
                <h3 className="mt-7 font-display text-[19px] font-medium tracking-[-0.015em] text-ink">{c.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
