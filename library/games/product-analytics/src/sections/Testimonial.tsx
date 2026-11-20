import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { sources, testimonial } from '../content'

export function Testimonial() {
  return (
    <section aria-label="What customers say" className="pb-24 sm:pb-32">
      <Container>
        <Reveal>
          <figure className="grid gap-10 rounded-[28px] border border-line bg-[linear-gradient(135deg,#eef6e6,#f7f9f4_55%,#e9f1f5)] p-8 sm:p-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <svg viewBox="0 0 32 24" className="h-6 w-8 text-leaf" aria-hidden>
                <path fill="currentColor" d="M0 24V14C0 6 4 1 12 0l1 4C8 5 6 8 6 12h6v12H0Zm19 0V14c0-8 4-13 12-14l1 4c-5 1-7 4-7 8h6v12H19Z" />
              </svg>
              <blockquote className="mt-6 text-balance font-display text-[24px] font-semibold leading-[1.3] tracking-[-0.025em] text-ink sm:text-[30px]">{testimonial.quote}</blockquote>
              <figcaption className="mt-8 flex items-center gap-3">
                <Avatar name={testimonial.name} hue="#f3c9a6" size={44} />
                <span>
                  <span className="block font-display text-[15px] font-semibold text-ink">{testimonial.name}</span>
                  <span className="block text-[14px] text-muted">{testimonial.role}</span>
                </span>
              </figcaption>
            </div>
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {testimonial.stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-[var(--radius-card-sm)] bg-card p-5 shadow-card">
                  <dt className="text-[14px] text-muted">{s.label}</dt>
                  <dd className="font-display text-[30px] font-bold tracking-[-0.04em] text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </figure>
        </Reveal>

        <div className="mt-16 text-center">
          <p className="font-display text-[15px] font-semibold text-ink">Connects to what you already run</p>
          <ul className="mx-auto mt-5 flex max-w-[760px] flex-wrap justify-center gap-2" aria-label="Integrations">
            {sources.map((s) => (
              <li key={s}>
                <Badge tone="outline" size="lg">
                  {s}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
