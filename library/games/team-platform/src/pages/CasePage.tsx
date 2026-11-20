import { ArrowLeft } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { byId } from '../components/ProfileCard'
import { cases, images } from '../content'
import { Link } from '../lib/router'
import { NotFound } from './NotFound'
import { CaseCard } from './CustomersPage'

export function CasePage({ slug }: { slug?: string }) {
  const i = cases.findIndex((c) => c.slug === slug)
  if (i < 0) return <NotFound />
  const c = cases[i]
  const next = cases[(i + 1) % cases.length]
  const who = byId(c.quote.personId)
  return (
    <article>
      <Container className="pt-10 sm:pt-14">
        <Link href="/customers" className="inline-flex h-10 items-center gap-1.5 rounded-[8px] pr-2 text-[14.5px] font-medium text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-ink">
          <ArrowLeft className="size-4" aria-hidden />
          All customers
        </Link>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="flex flex-wrap gap-2">
              <Badge tone="mint">{c.industry}</Badge>
              <Badge tone="outline">{c.size}</Badge>
              <Badge tone="outline">{c.region}</Badge>
            </p>
            <h1 className="mt-5 text-balance font-display text-[38px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[54px]">{c.headline}</h1>
            <p className="mt-5 max-w-[52ch] text-[18px] leading-relaxed text-muted">{c.summary}</p>
          </div>
          <dl className="grid grid-cols-3 gap-4 rounded-[var(--radius-card)] border-[1.5px] border-ink p-5 sm:p-6">
            {c.metrics.map((m) => (
              <div key={m.label} className="flex flex-col-reverse">
                <dt className="mt-1.5 text-[13.5px] leading-snug text-muted">{m.label}</dt>
                <dd className="font-display text-[28px] font-semibold tracking-[-0.035em] text-ink sm:text-[34px]">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <img src={images[c.image]} alt={c.imageAlt} width={1536} height={1024} className="mt-12 aspect-[16/8] w-full rounded-[28px] object-cover" />
      </Container>
      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_340px] lg:gap-20">
        <div className="max-w-[64ch] space-y-10">
          {[
            ['The challenge', c.challenge],
            ['What they did', c.solution],
            ['The results', c.results],
          ].map(([h, t]) => (
            <section key={h}>
              <h2 className="font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">{h}</h2>
              <p className="mt-3 text-[17px] leading-[1.75] text-body">{t}</p>
            </section>
          ))}
          <figure className="rounded-[var(--radius-card)] bg-mist p-7">
            <blockquote className="font-display text-[24px] font-medium leading-snug tracking-[-0.025em] text-ink">“{c.quote.text}”</blockquote>
            {who ? (
              <figcaption className="mt-5 flex items-center gap-3">
                <Avatar name={who.name} face={who.face} size={44} />
                <span>
                  <span className="block text-[15px] font-semibold text-ink">{who.name}</span>
                  <span className="block text-[14px] text-muted">
                    {c.quote.role}, {c.company}
                  </span>
                </span>
              </figcaption>
            ) : null}
          </figure>
        </div>
        <aside className="h-fit space-y-6 rounded-[var(--radius-card)] border border-line p-6 lg:sticky lg:top-28">
          <div>
            <h2 className="text-[13.5px] font-medium text-faint">Modules used</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.modules.map((m) => (
                <li key={m}>
                  <Badge>{m}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-line pt-6">
            <p className="font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">Get results like {c.company.split(' ')[0]}</p>
            <p className="mt-1.5 text-[14.5px] text-muted">See the modules they use in a 30-minute demo.</p>
            <Button href="/demo" className="mt-4 w-full">
              Book a demo
            </Button>
          </div>
        </aside>
      </Container>
      <Container>
        <h2 className="font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">Next story</h2>
        <div className="mt-6 max-w-[560px]">
          <CaseCard c={next} />
        </div>
      </Container>
    </article>
  )
}
