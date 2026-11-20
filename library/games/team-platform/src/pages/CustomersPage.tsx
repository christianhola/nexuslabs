import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

import { Chip } from '../components/Badge'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { PageHeader } from '../components/SectionHeading'
import { cases, images, industries } from '../content'
import type { CaseStudy, Industry } from '../content'
import { Link } from '../lib/router'
import { Testimonial } from '../sections/HomeSections'

export function CaseCard({ c }: { c: CaseStudy }) {
  return (
    <Link href={`/customers/${c.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-card transition-[border-color,box-shadow] duration-200 hover:border-ink hover:shadow-[6px_6px_0_var(--color-mint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
      <div className="aspect-[16/10] overflow-hidden bg-mist">
        <img src={images[c.image]} alt={c.imageAlt} width={1536} height={1024} loading="lazy" className="size-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-[13.5px] text-faint">
          {c.company} · {c.industry}
        </p>
        <h2 className="mt-2 text-balance font-display text-[22px] font-semibold leading-snug tracking-[-0.025em] text-ink">{c.headline}</h2>
        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {c.metrics.map((m) => (
            <div key={m.label} className="flex flex-col-reverse">
              <dt className="mt-1 text-[12.5px] leading-snug text-muted">{m.label}</dt>
              <dd className="font-display text-[22px] font-semibold tracking-[-0.03em] text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14.5px] font-medium text-ink">
          Read the story
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}

export function CustomersPage() {
  const [filter, setFilter] = useState<Industry | 'All'>('All')
  const list = filter === 'All' ? cases : cases.filter((c) => c.industry === filter)
  return (
    <>
      <Container>
        <PageHeader eyebrow="Customers" title="Teams that reach everyone, every day" body="From six warehouses to 180 stores, here is how companies use Branchwork to keep their people informed and connected.">
          <div role="group" aria-label="Industry" className="flex flex-wrap gap-2">
            {(['All', ...industries] as const).map((i) => (
              <Chip key={i} active={filter === i} onClick={() => setFilter(i)} count={i === 'All' ? cases.length : cases.filter((c) => c.industry === i).length}>
                {i}
              </Chip>
            ))}
          </div>
        </PageHeader>
        <p className="sr-only" aria-live="polite">
          {list.length} stories
        </p>
        <ul className="grid gap-5 md:grid-cols-2">
          {list.map((c, i) => (
            <li key={c.slug}>
              <Reveal delay={(i % 2) * 0.06} className="h-full">
                <CaseCard c={c} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
      <div className="mt-16">
        <Testimonial />
      </div>
    </>
  )
}
