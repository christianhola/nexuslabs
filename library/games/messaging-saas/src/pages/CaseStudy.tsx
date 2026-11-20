import { ArrowLeft } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { CaseCard } from '../components/CaseCard'
import { Container } from '../components/Container'
import { Section, SectionHeading } from '../components/Section'
import { caseStudies } from '../content'
import { Link } from '../lib/router'
import { Guarantee } from '../sections/Guarantee'
import { NotFound } from './NotFound'

export function CaseStudy({ slug }: { slug?: string }) {
  const s = caseStudies.find((x) => x.slug === slug)
  if (!s) return <NotFound />
  const others = caseStudies.filter((x) => x.slug !== s.slug)
  return (
    <>
      <header className="relative pt-32 sm:pt-40">
        <Container>
          <Link href="/customers" className="inline-flex min-h-10 items-center gap-2 text-[14px] text-muted hover:text-white">
            <ArrowLeft aria-hidden className="size-4" /> All customers
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div className="grid gap-5">
              <div className="flex items-center gap-3">
                <Badge>{s.industry}</Badge>
                <span className="text-[14px] font-semibold uppercase tracking-[0.12em] text-faint">{s.brand}</span>
              </div>
              <h1 className="font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-[56px]">{s.title}</h1>
            </div>
            <p className="text-[17px] leading-[1.6] text-muted">{s.summary}</p>
          </div>
          <img src={s.image} alt={`${s.brand} products`} className="mt-12 aspect-[21/9] w-full rounded-panel border border-line object-cover" />
          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {s.metrics.map((m) => (
              <div key={m.label} className="border-t border-line-strong pt-5">
                <dt className="text-[14px] text-faint">{m.label}</dt>
                <dd className="mt-2 font-display text-[48px] font-medium leading-none tracking-[-0.03em] text-white">{m.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </header>
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_minmax(0,680px)]">
          <figure className="grid content-start gap-6 lg:sticky lg:top-28">
            <blockquote className="font-display text-[28px] font-normal leading-[1.3] tracking-[-0.015em] text-white">“{s.quote.text}”</blockquote>
            <figcaption className="flex items-center gap-3 text-[14px]">
              <Avatar src={s.quote.avatar} name={s.quote.name} size={44} />
              <span>
                <span className="block font-semibold text-white">{s.quote.name}</span>
                <span className="block text-faint">
                  {s.quote.role}, {s.brand}
                </span>
              </span>
            </figcaption>
          </figure>
          <div className="grid gap-10">
            {s.body.map((b) => (
              <div key={b.heading} className="grid gap-3">
                <h2 className="font-display text-[26px] font-medium text-white">{b.heading}</h2>
                <p className="text-[17px] leading-[1.75] text-soft">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section className="border-t border-line">
        <SectionHeading title="More stories" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {others.map((o) => (
            <CaseCard key={o.slug} study={o} />
          ))}
        </div>
      </Section>
      <Guarantee />
    </>
  )
}
