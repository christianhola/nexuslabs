import { Gauge, LibraryBig, Play, Plug, ShieldCheck, Sparkles } from 'lucide-react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { FEATURES } from '../content'

const icons = { sparkles: Sparkles, shield: ShieldCheck, play: Play, library: LibraryBig, gauge: Gauge, plug: Plug }

export function Features() {
  return (
    <section className="relative py-24 sm:py-28">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10" />
      <Container>
        <SectionHeading eyebrow={FEATURES.eyebrow} title={FEATURES.title} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.items.map((f, i) => {
            const Icon = icons[f.icon as keyof typeof icons]
            return (
              <Reveal key={f.title} delay={i * 60}>
                <Card className="h-full p-6 transition-colors hover:bg-surface-2">
                  <span className="grid size-11 place-items-center rounded-[12px] bg-brand/10 text-brand-text ring-1 ring-inset ring-brand/20">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <h3 className="mt-5 text-[19px] font-medium tracking-[-0.01em]">{f.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{f.body}</p>
                </Card>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
