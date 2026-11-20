import { Avatar } from '../components/Avatar'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { testimonials } from '../content'

export function Testimonials() {
  return (
    <section aria-label="What writers say" className="py-16 lg:py-24">
      <Container className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-panel p-6">
              <blockquote className="flex-1 font-serif text-[20px] leading-[1.45] text-ink">“{t.quote}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar initials={t.initials} hue={t.hue} />
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{t.name}</span>
                  <span className="block text-[13px] text-muted">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </Container>
    </section>
  )
}
