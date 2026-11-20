import { Avatar, Stars } from '../components/Avatar'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { people, stats, testimonials } from '../content'

export function Testimonials() {
  return (
    <section aria-labelledby="love-title" className="bg-canvas py-20 lg:py-28">
      <Container>
        <Reveal>
          <SectionHeading id="love-title" eyebrow="Loved by creators" title="Course Businesses That Grew Up Here" />
        </Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <li key={s.label}>
              <Reveal delay={i * 0.05}>
                <div className="rounded-[var(--radius-card)] border border-line bg-card p-5 text-center shadow-card">
                  <p className="font-display text-[32px] font-medium tracking-[-0.03em] text-ink">{s.value}</p>
                  <p className="text-[14px] text-muted">{s.label}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-5 columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
          {testimonials.map((t, i) => {
            const p = people[t.person]
            return (
              <Reveal key={i} delay={(i % 3) * 0.05} className="break-inside-avoid">
                <figure className="rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card">
                  <Stars value={t.rating} />
                  <blockquote className="mt-3 text-[15.5px] leading-relaxed text-ink">“{t.quote}”</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <Avatar src={p.src} name={p.name} size={40} ring={false} />
                    <span>
                      <span className="block font-display text-[15px] font-medium text-ink">{p.name}</span>
                      <span className="block text-[13px] text-muted">{p.role}</span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
