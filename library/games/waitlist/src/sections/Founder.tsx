import { Reveal } from '../components/Reveal'
import { Avatar, Container, Eyebrow } from '../components/ui'
import { founder } from '../content'

/** Hand-drawn style signature, drawn once when it scrolls in. */
function Signature() {
  return (
    <svg viewBox="0 0 160 48" className="h-10 w-auto text-ink" fill="none" aria-hidden="true">
      <path
        d="M4 34c8-14 14-26 18-26 3 0-2 22 1 22 4 0 9-18 13-18 3 0 0 14 3 14s6-8 9-8-1 8 2 8 5-6 8-6c4 0-1 7 3 7 6 0 12-12 18-12 4 0-3 12 2 12 6 0 13-9 20-9 5 0 1 6 6 6 8 0 18-6 28-10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Founder() {
  return (
    <section aria-labelledby="founder-title" className="bg-stage py-20 lg:py-28">
      <Container>
        <Reveal className="mx-auto max-w-[680px]">
          <Eyebrow>
            <span id="founder-title">{founder.eyebrow}</span>
          </Eyebrow>
          <div className="mt-5 space-y-5 text-[20px] leading-[1.5] tracking-[-0.015em] text-ink sm:text-[22px]">
            {founder.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <Avatar initials={founder.initials} size="lg" tone="ink" />
            <div>
              <Signature />
              <p className="text-[15px] font-semibold text-ink">{founder.name}</p>
              <p className="text-small text-muted">{founder.role}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
