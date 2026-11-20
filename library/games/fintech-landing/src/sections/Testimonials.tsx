import { Star } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { testimonials } from '../content'

export function Testimonials() {
  return (
    <Section id="company">
      <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />
      <div className="mx-auto mt-14 grid max-w-[1120px] gap-4 md:grid-cols-2">
        {testimonials.items.map((t, i) => (
          <Reveal key={t.name} delay={(i % 2) * 0.08}>
            <Card as="figure" interactive className="h-full">
              <div className="flex gap-1 text-[#fbbf24]" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, k) => (
                  <Star key={k} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-5 text-[18px] leading-relaxed tracking-[-0.015em] text-pretty">“{t.quote}”</blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <Avatar name={t.name} hue={t.hue} size={44} />
                <div className="leading-tight">
                  <div className="text-[15px] font-medium">{t.name}</div>
                  <div className="mt-0.5 text-[13px] text-muted">{t.role}</div>
                </div>
              </figcaption>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
