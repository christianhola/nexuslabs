import { ArrowLeft, Check, Link2 } from 'lucide-react'
import { useState } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { images, people, posts } from '../content'
import { copyText } from '../lib/clipboard'
import { Link } from '../lib/router'
import { PostCard } from './BlogPage'

export function PostPage({ slug }: { slug?: string }) {
  const post = posts.find((p) => p.slug === slug)!
  const a = people[post.author]
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    if (await copyText(window.location.href)) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }
  return (
    <article className="pb-24 pt-8 lg:pt-12">
      <Container className="max-w-[820px]">
        <Link href="/blog" className="inline-flex min-h-10 items-center gap-1.5 rounded-[8px] text-[14px] text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
          <ArrowLeft className="size-4" aria-hidden /> All posts
        </Link>
        <div className="mt-6 flex items-center gap-2 text-[13.5px] text-muted">
          <Badge tone="flame">{post.tag}</Badge>
          <span>{post.date}</span>
          <span>{post.minutes} min read</span>
        </div>
        <h1 className="mt-4 text-balance font-display text-[38px] font-medium leading-[1.1] tracking-[-0.03em] text-ink sm:text-[48px]">{post.title}</h1>
        <p className="mt-4 text-[18px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between gap-4 border-y border-line py-4">
          <span className="flex items-center gap-3">
            <Avatar src={a.src} name={a.name} size={40} ring={false} />
            <span>
              <span className="block font-display text-[15px] font-medium text-ink">{a.name}</span>
              <span className="block text-[13px] text-muted">{a.role}</span>
            </span>
          </span>
          <Button variant="outline" size="sm" onClick={copy} icon={copied ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}>
            {copied ? 'Link copied' : 'Copy link'}
          </Button>
        </div>
      </Container>
      <Container className="mt-8 max-w-[1000px]">
        <img src={images.covers[post.cover]} alt="" className="aspect-[2/1] w-full rounded-[var(--radius-panel)] object-cover" />
      </Container>
      <Container className="prose-post mt-6 max-w-[720px] text-[17px] text-body">
        {post.body.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
        <div className="mt-12 rounded-[var(--radius-card)] bg-flame-soft p-6">
          <p className="font-display text-[19px] font-medium text-ink">Put it into practice</p>
          <p className="mt-1 text-[15px] text-muted">Open the builder and try it on a real course outline. It is free to start.</p>
          <Button href="/builder" className="mt-4" arrow>
            Open the builder
          </Button>
        </div>
      </Container>
      <Container className="mt-16 max-w-[1000px]">
        <h2 className="font-display text-[24px] font-medium text-ink">Keep reading</h2>
        <ul className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
          {more.map((p) => (
            <li key={p.slug}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </Container>
    </article>
  )
}
