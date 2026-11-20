import { useMemo } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Chip } from '../components/Chip'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { images, people, posts } from '../content'
import type { Post } from '../content'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'

/* The blog index: a featured post, a tag filter (persisted) and the rest. */
export function BlogPage() {
  const tags = useMemo(() => ['All', ...new Set(posts.map((p) => p.tag))], [])
  const [tag, setTag] = useStored<string>('blog-tag', 'All')
  const list = posts.filter((p) => tag === 'All' || p.tag === tag)
  const [lead, ...rest] = list
  return (
    <section className="pb-24 pt-10 lg:pt-16">
      <Container>
        <SectionHeading as="h1" eyebrow="Blog" title="Notes for Course Businesses" lead="Pricing, production, teaching and selling, from creators who do it for a living." />
        <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by topic">
          {tags.map((t) => (
            <Chip key={t} active={tag === t} onClick={() => setTag(t)}>
              {t}
            </Chip>
          ))}
        </div>
        {lead ? (
          <Reveal className="mt-12">
            <PostCard post={lead} featured />
          </Reveal>
        ) : null}
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {rest.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={i * 0.05}>
                <PostCard post={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

export function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  const a = people[post.author]
  return (
    <Link href={`/blog/${post.slug}`} className={`group block overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-card transition-shadow hover:shadow-float focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-strong ${featured ? 'md:grid md:grid-cols-[1.2fr_1fr]' : ''}`}>
      <div className="overflow-hidden">
        <img src={images.covers[post.cover]} alt="" className={`w-full object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.03] ${featured ? 'aspect-[16/10] md:h-full' : 'aspect-[3/2]'}`} loading="lazy" />
      </div>
      <div className={featured ? 'flex flex-col justify-center p-7 sm:p-10' : 'p-5'}>
        <div className="flex items-center gap-2 text-[13px] text-muted">
          <Badge tone="flame">{post.tag}</Badge>
          <span>{post.minutes} min read</span>
        </div>
        <h2 className={`mt-3 font-display font-medium tracking-[-0.02em] text-ink ${featured ? 'text-[30px] leading-tight' : 'text-[19px] leading-snug'}`}>{post.title}</h2>
        <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-5 flex items-center gap-2.5 text-[13.5px] text-muted">
          <Avatar src={a.src} name={a.name} size={28} ring={false} />
          <span className="text-ink">{a.name}</span>
          <span>{post.date}</span>
        </p>
      </div>
    </Link>
  )
}
