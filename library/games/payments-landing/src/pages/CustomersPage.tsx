import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Quote } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Segmented } from '../components/Segmented'
import { Stat } from '../components/Stat'
import { customers, images, mission } from '../content'
import type { Story } from '../content'
import { Cta } from '../sections/Cta'

type Filter = (typeof customers.filters)[number]

export function CustomersPage() {
  const [filter, setFilter] = useState<Filter>('All')
  const list = customers.stories.filter((s) => filter === 'All' || s.industry === filter)
  return (
    <>
      <PageHeader eyebrow="Customers" title={customers.title} body={customers.body}>
        <div className="mt-10 grid max-w-[760px] gap-8 sm:grid-cols-3">
          {mission.stats.map((s) => (
            <Stat key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </PageHeader>
      <section aria-labelledby="stories-title" className="py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="stories-title" className="text-[28px] font-medium tracking-[-0.03em] text-ink">
              Stories
            </h2>
            <Segmented label="Filter by industry" value={filter} onChange={setFilter} options={customers.filters.map((f) => ({ id: f, label: f }))} />
          </div>
          <p className="sr-only" role="status">
            {list.length} stories shown
          </p>
          {list.length === 0 ? (
            <EmptyState className="mt-10" title="No stories in this industry yet" body="Pick another filter." />
          ) : (
            <ul className="mt-10 grid gap-6 md:grid-cols-2">
              <AnimatePresence initial={false}>
                {list.map((s) => (
                  <motion.li key={s.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <StoryCard story={s} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Container>
      </section>
      <Cta />
    </>
  )
}

function StoryCard({ story: s }: { story: Story }) {
  const img = images[s.image]
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-card">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img src={img.src} alt={img.alt} loading="lazy" width={1280} height={853} className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <span className="absolute left-4 top-4">
          <Badge className="bg-white/90 text-ink backdrop-blur">{s.industry}</Badge>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7">
        <p className="text-[14px] font-medium text-teal-ink">{s.company}</p>
        <h3 className="mt-2 text-[22px] font-medium leading-snug tracking-[-0.025em] text-ink">{s.headline}</h3>
        <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">{s.body}</p>
        <figure className="mt-6 flex gap-3 border-t border-line pt-5">
          <Quote className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
          <div>
            <blockquote className="text-[15px] leading-[1.55] text-ink-2">{s.quote}</blockquote>
            <figcaption className="mt-1 text-[13px] text-faint">{s.person}</figcaption>
          </div>
        </figure>
        <p className="mt-auto flex items-baseline gap-2 pt-6">
          <span className="tabular text-[32px] font-medium tracking-[-0.04em] text-ink">{s.metric}</span>
          <span className="text-[14px] text-muted">{s.metricLabel}</span>
        </p>
      </div>
    </article>
  )
}
