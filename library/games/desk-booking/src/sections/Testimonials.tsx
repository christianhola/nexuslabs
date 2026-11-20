import { Quote } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Card } from '../components/Card'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { testimonials } from '../content'

export function Testimonials() {
  return (
    <section aria-labelledby="t-title" className="px-4 py-24 sm:px-9 sm:py-28">
      <div id="t-title">
        <SectionHeading title={testimonials.title} />
      </div>
      <ul className="mx-auto mt-14 grid max-w-[1120px] gap-4 md:grid-cols-3">
        {testimonials.items.map((t, i) => (
          <Reveal as="li" key={t.name} delay={i * 0.08} className="h-full">
              <Card rule={i === 1} className="flex h-full flex-col p-6">
                <Quote aria-hidden className="size-5 text-brand-bright" />
                <blockquote className="mt-4 flex-1 text-[16px] leading-7 text-body">“{t.quote}”</blockquote>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar person={{ id: t.name, name: t.name, hue: t.hue, role: t.role, team: '' }} size={38} />
                  <div>
                    <p className="text-sm font-semibold text-fg">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
        ))}
      </ul>
    </section>
  )
}
