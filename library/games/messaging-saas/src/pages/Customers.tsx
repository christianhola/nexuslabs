import { useState } from 'react'

import { CaseCard } from '../components/CaseCard'
import { EmptyState } from '../components/EmptyState'
import { LogoMarquee } from '../components/LogoTile'
import { SegmentedControl } from '../components/SegmentedControl'
import { PageHeader, Section } from '../components/Section'
import { caseStudies, customersPage as c } from '../content'
import { Stats } from '../sections/Stats'
import { Testimonials } from '../sections/Testimonials'

type Filter = (typeof c.filters)[number]

export function Customers() {
  const [filter, setFilter] = useState<Filter>('All')
  const list = caseStudies.filter((s) => filter === 'All' || s.industry === filter)
  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} body={c.body} />
      <div className="pb-6">
        <LogoMarquee className="mask-fade-x" />
      </div>
      <Section aria-label="Case studies">
        <SegmentedControl label="Filter by industry" value={filter} onChange={setFilter} options={c.filters.map((f) => ({ value: f, label: f }))} className="max-w-full overflow-x-auto" />
        {list.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <CaseCard key={s.slug} study={s} />
            ))}
          </div>
        ) : (
          <EmptyState className="mt-10" title="No stories in this industry yet" body="Pick another filter, or be the first." />
        )}
      </Section>
      <Stats />
      <Testimonials />
    </>
  )
}
