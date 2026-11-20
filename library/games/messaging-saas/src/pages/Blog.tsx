import { useState } from 'react'

import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { PostCard } from '../components/PostCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { PageHeader, Section } from '../components/Section'
import { blogPage as b, posts } from '../content'
import { Newsletter } from '../sections/Footer'

type Cat = (typeof b.categories)[number]

export function Blog() {
  const [cat, setCat] = useState<Cat>('All')
  const list = posts.filter((p) => cat === 'All' || p.category === cat)
  const [featured, ...rest] = list
  return (
    <>
      <PageHeader eyebrow={b.eyebrow} title={b.title} body={b.body}>
        <SegmentedControl className="mt-10 max-w-full overflow-x-auto" label="Filter by category" value={cat} onChange={setCat} options={b.categories.map((c) => ({ value: c, label: c }))} />
      </PageHeader>
      <Section aria-label="Posts" className="pt-0 sm:pt-0">
        {featured ? (
          <>
            <PostCard post={featured} featured />
            <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          </>
        ) : (
          <EmptyState title="Nothing here yet" body="No posts in this category. Try another." />
        )}
      </Section>
      <Section aria-labelledby="nl-title" className="pt-0 sm:pt-0">
        <Card className="grid gap-6 p-8 sm:p-12 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <h2 id="nl-title" className="font-display text-[30px] font-medium tracking-[-0.02em] text-white">
              {b.newsletter.title}
            </h2>
            <p className="mt-2 text-[15px] text-muted">{b.newsletter.body}</p>
          </div>
          <Newsletter id="blog-newsletter" />
        </Card>
      </Section>
    </>
  )
}
