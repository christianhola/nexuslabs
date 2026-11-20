import { ArrowLeft } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { PostCard } from '../components/PostCard'
import { Section, SectionHeading } from '../components/Section'
import { posts } from '../content'
import { date } from '../lib/format'
import { Link } from '../lib/router'
import { NotFound } from './NotFound'

export function BlogPost({ slug }: { slug?: string }) {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <NotFound />
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3)
  return (
    <>
      <article>
        <header className="pt-32 sm:pt-40">
          <Container className="max-w-[920px]">
            <Link href="/blog" className="inline-flex min-h-10 items-center gap-2 text-[14px] text-muted hover:text-white">
              <ArrowLeft aria-hidden className="size-4" /> All posts
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-[14px] text-faint">
              <Badge tone={post.category === 'Compliance' ? 'cherry' : post.category === 'Product' ? 'cobalt' : 'saffron'}>{post.category}</Badge>
              {date(post.date)} · {post.readMinutes} min read
            </div>
            <h1 className="mt-5 font-display text-[38px] font-medium leading-[1.1] tracking-[-0.025em] text-white sm:text-[54px]">{post.title}</h1>
            <p className="mt-5 text-[19px] leading-[1.6] text-muted">{post.excerpt}</p>
            <div className="mt-7 flex items-center gap-3 text-[15px] text-soft">
              <Avatar src={post.author.avatar} name={post.author.name} size={40} /> {post.author.name}
            </div>
          </Container>
          <Container className="mt-12 max-w-[1200px]">
            <img src={post.image} alt="" className="aspect-[2/1] w-full rounded-panel border border-line object-cover" />
          </Container>
        </header>
        <Container className="max-w-[720px] py-16">
          <div className="grid gap-8">
            {post.body.map((b, i) => (
              <section key={i} className="grid gap-3">
                {b.heading ? <h2 className="font-display text-[26px] font-medium tracking-[-0.015em] text-white">{b.heading}</h2> : null}
                <p className="text-[18px] leading-[1.8] text-soft">{b.text}</p>
              </section>
            ))}
          </div>
        </Container>
      </article>
      <Section className="border-t border-line">
        <SectionHeading title="Keep reading" />
        <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </Section>
    </>
  )
}
