import { ArrowLeft, Check, Link2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { PostCard, PostCover, formatDate } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { posts } from '../content'
import { Link } from '../lib/router'

export function Article({ slug = '' }: { slug?: string }) {
  const post = posts.find((p) => p.slug === slug)!
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)
  const [copied, setCopied] = useState<'idle' | 'done' | 'error'>('idle')

  useEffect(() => {
    if (copied === 'idle') return
    const t = setTimeout(() => setCopied('idle'), 2200)
    return () => clearTimeout(t)
  }, [copied])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied('done')
    } catch {
      setCopied('error')
    }
  }

  return (
    <>
      <article className="pb-16 pt-28 sm:pt-36">
        <Container size="md">
          <Link href="/news" className="inline-flex min-h-10 items-center gap-2 rounded-[8px] text-[15px] text-muted transition-colors hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            All news
          </Link>
          <Reveal>
            <p className="mt-6 flex gap-3 text-[14px]">
              <span className="font-medium text-plasma-text">{post.category}</span>
              <time dateTime={post.date} className="text-faint">
                {formatDate(post.date)}
              </time>
            </p>
            <h1 className="display mt-3 text-balance text-[40px] sm:text-[56px]">{post.title}</h1>
            <p className="mt-4 text-[19px] leading-[1.55] text-muted">{post.summary}</p>
          </Reveal>
        </Container>
        <Container size="lg" className="mt-10">
          <PostCover post={post} className="aspect-[16/8]" />
        </Container>
        <Container size="md" className="mt-12">
          <div className="flex flex-col gap-6 text-[18px] leading-[1.7] text-soft">
            {post.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">
            <Button variant="secondary" size="sm" onClick={copy}>
              {copied === 'done' ? <Check className="size-4" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
              {copied === 'done' ? 'Link copied' : 'Copy link'}
            </Button>
            <span role="status" className="text-[14px] text-faint">
              {copied === 'error' ? 'Copying is blocked here. Copy the address bar instead.' : ''}
            </span>
          </div>
        </Container>
      </article>
      <section aria-labelledby="more-title" className="pb-24">
        <Container size="xl">
          <h2 id="more-title" className="text-[24px] font-medium tracking-[-0.02em]">
            More from Tidewell
          </h2>
          <ul className="mt-8 grid gap-x-6 gap-y-12 md:grid-cols-3">
            {more.map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  )
}
