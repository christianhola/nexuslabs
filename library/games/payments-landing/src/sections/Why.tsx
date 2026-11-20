import { Quote } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { why } from '../content'

export function Why() {
  return (
    <section aria-labelledby="why-title" className="bg-mist-2 py-20 sm:py-28">
      <Container>
        <SectionHeading id="why-title" align="center" eyebrow={why.eyebrow} title={why.title} />
        <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_1fr_1fr]">
          {why.reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06} className="rounded-card bg-white p-7 shadow-card">
              <span className="text-[13px] font-semibold text-teal-ink">0{i + 1}</span>
              <h3 className="mt-4 text-[19px] font-medium tracking-[-0.02em] text-ink">{r.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.65] text-muted">{r.body}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-5">
          <figure className="relative overflow-hidden rounded-card bg-teal-ink p-8 text-white sm:p-12">
            <Quote aria-hidden className="size-8 text-teal-100" />
            <blockquote className="mt-5 max-w-[820px] text-balance text-[24px] font-medium leading-[1.35] tracking-[-0.02em] sm:text-[30px]">
              {why.quote.text}
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
              <Avatar initials={why.quote.initials} className="bg-white text-teal-deep" />
              <span>
                <span className="block text-[15px] font-medium">{why.quote.name}</span>
                <span className="block text-[13.5px] text-white/85">{why.quote.role}</span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  )
}
