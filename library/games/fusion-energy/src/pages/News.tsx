import { useState } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Chip, EmptyState } from '../components/Controls'
import { Newsletter } from '../components/Newsletter'
import { PageHeader } from '../components/PageHeader'
import { PostCard } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { newsCategories, posts } from '../content'
import type { NewsCategory } from '../content'

export function News() {
  const [cat, setCat] = useState<NewsCategory | 'all'>('all')
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date))
  const list = cat === 'all' ? sorted : sorted.filter((p) => p.category === cat)
  const [featured, ...rest] = list

  return (
    <>
      <PageHeader eyebrow="News" title="Notes from the build" body="Milestones, research and press from the Tidewell team." />
      <section aria-label="Posts" className="pb-20">
        <Container size="xl">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <Chip selected={cat === 'all'} onClick={() => setCat('all')} count={posts.length}>
              All
            </Chip>
            {newsCategories.map((c) => (
              <Chip key={c} selected={cat === c} onClick={() => setCat(c)} count={posts.filter((p) => p.category === c).length}>
                {c}
              </Chip>
            ))}
          </div>
          {!featured ? (
            <EmptyState
              className="mt-10"
              title="Nothing here yet"
              body="No posts in this category so far."
              action={
                <Button variant="secondary" onClick={() => setCat('all')} className="mt-2">
                  Show all posts
                </Button>
              }
            />
          ) : (
            <>
              <div className="mt-10">
                <Reveal>
                  <PostCard post={featured} featured />
                </Reveal>
              </div>
              {rest.length ? (
                <ul className="mt-16 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <Reveal as="li" key={p.slug} delay={(i % 3) * 0.05}>
                      <PostCard post={p} />
                    </Reveal>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </Container>
      </section>
      <section aria-labelledby="updates-title" className="pb-24">
        <Container size="xl">
          <Card tone="ocean" className="grid gap-8 p-7 sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
            <div>
              <h2 id="updates-title" className="display text-[34px] sm:text-[44px]">
                Follow the build
              </h2>
              <p className="mt-3 max-w-[440px] text-[17px] text-white/80">A short monthly note on what we built, what broke and what we learned. Unsubscribe any time.</p>
            </div>
            <Newsletter label="Email address" compact />
          </Card>
        </Container>
      </section>
    </>
  )
}
