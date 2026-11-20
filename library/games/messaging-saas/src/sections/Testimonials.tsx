import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Card } from '../components/Card'
import { Reveal } from '../components/Reveal'
import { Section, SectionHeading } from '../components/Section'
import { testimonials } from '../content'
import { Link } from '../lib/router'

export function Testimonials() {
  return (
    <Section aria-labelledby="t-title">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading eyebrow="Customers" title={<span id="t-title">Brands that won’t go back.</span>} />
        <Link href="/customers" className="inline-flex min-h-10 items-center text-[15px] font-semibold text-cobalt-text hover:text-white">
          Read the case studies <span aria-hidden>→</span>
        </Link>
      </div>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 90}>
            <Card className="flex h-full flex-col gap-8 p-7">
              <Badge tone="mint" className="self-start">
                {t.metric}
              </Badge>
              <blockquote className="flex-1 font-display text-[21px] font-normal leading-[1.4] tracking-[-0.01em] text-white">“{t.quote}”</blockquote>
              <div className="flex items-center gap-3 border-t border-line pt-5">
                <Avatar src={t.avatar} name={t.name} size={44} />
                <div className="text-[14px] leading-tight">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-faint">{t.role}</p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
