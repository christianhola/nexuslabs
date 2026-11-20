import { Quote } from 'lucide-react'

import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Avatar } from '../components/Misc'
import { Reveal } from '../components/Reveal'
import { TESTIMONIALS } from '../content'

export function Testimonials() {
  return (
    <section aria-label="What teams say" className="pb-24 sm:pb-32">
      <Container>
        <div className="grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <Card as="article" className="flex h-full flex-col p-6">
                <Quote aria-hidden className="size-6 text-brand-text" />
                <blockquote className="mt-4 flex-1 text-[16.5px] leading-relaxed text-fg">{t.quote}</blockquote>
                <footer className="mt-6 flex items-center gap-3">
                  <Avatar name={t.name} size={38} />
                  <span>
                    <span className="block text-[14.5px] font-medium">{t.name}</span>
                    <span className="block text-[13.5px] text-muted">{t.role}</span>
                  </span>
                </footer>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
