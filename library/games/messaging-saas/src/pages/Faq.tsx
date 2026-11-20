import { Search, X } from 'lucide-react'
import { useState } from 'react'

import { Accordion } from '../components/Accordion'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { TextField } from '../components/Field'
import { SegmentedControl } from '../components/SegmentedControl'
import { PageHeader, Section } from '../components/Section'
import { faqPage as f, faqs } from '../content'

const CATS = ['All', 'Getting started', 'Billing', 'AI', 'Compliance'] as const
type Cat = (typeof CATS)[number]

export function Faq() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Cat>('All')
  const needle = q.trim().toLowerCase()
  const list = faqs.filter((x) => (cat === 'All' || x.category === cat) && (!needle || `${x.q} ${x.a}`.toLowerCase().includes(needle)))
  return (
    <>
      <PageHeader eyebrow={f.eyebrow} title={f.title} body={f.body}>
        <div className="mt-10 grid max-w-[640px] gap-5">
          <div className="relative">
            <TextField
              label={f.searchLabel}
              hideLabel
              type="search"
              placeholder="Search, e.g. quiet hours"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              prefix={<Search aria-hidden className="ml-2 size-[18px] text-faint" />}
            />
            {q ? (
              <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="absolute right-1 top-1 grid size-10 place-items-center rounded-[6px] text-muted hover:text-white">
                <X aria-hidden className="size-4" />
              </button>
            ) : null}
          </div>
          <SegmentedControl className="max-w-full overflow-x-auto" label="Filter by topic" value={cat} onChange={setCat} options={CATS.map((c) => ({ value: c, label: c }))} />
        </div>
      </PageHeader>
      <Section aria-label="Questions" className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="mb-4 text-[14px] text-faint" aria-live="polite">
              {list.length} {list.length === 1 ? 'question' : 'questions'}
            </p>
            {list.length ? (
              <Accordion key={`${cat}-${needle}`} items={list.map((x) => ({ id: x.q, title: x.q, body: x.a }))} />
            ) : (
              <EmptyState
                title={f.empty.title}
                body={f.empty.body}
                action={
                  <Button variant="subtle" onClick={() => { setQ(''); setCat('All') }}>
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>
          <Card className="grid content-start gap-4 self-start p-7 lg:sticky lg:top-28">
            <h2 className="font-display text-[22px] font-medium text-white">Still have a question?</h2>
            <p className="text-[15px] leading-[1.6] text-muted">A retention strategist will answer by text or email within one business day.</p>
            <Button href="/contact" arrow>
              Talk to sales
            </Button>
          </Card>
        </div>
      </Section>
    </>
  )
}
