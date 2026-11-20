import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ArrowLeft, Check, Link2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { coverFor, PostCard, PostCover } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { posts } from '../content'
import type { PostBlock } from '../content'
import { Link } from '../lib/router'
import { NotFound } from './NotFound'
import { useReducedMotion } from '../lib/useReducedMotion'

const ease = [0.22, 1, 0.36, 1] as const

/** Thin violet bar pinned to the top edge that fills as you read. */
function ReadingProgress() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  if (reduce) return null
  return <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-[3px] origin-left bg-violet-text" style={{ scaleX }} />
}

function CopyLink() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  useEffect(() => {
    if (state === 'idle') return
    const t = setTimeout(() => setState('idle'), 2000)
    return () => clearTimeout(t)
  }, [state])

  async function copy() {
    const url = window.location.href
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        // Fallback for insecure contexts: a hidden textarea and execCommand.
        const ta = document.createElement('textarea')
        ta.value = url
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        ta.remove()
        if (!ok) throw new Error('copy failed')
      }
      setState('copied')
    } catch {
      setState('failed')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15 }}
          className="grid place-items-center"
        >
          {state === 'copied' ? <Check className="size-4 text-[#4ade80]" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        </motion.span>
      </AnimatePresence>
      {state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy link'}
    </Button>
  )
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-12 font-display text-[26px] font-semibold leading-tight tracking-[-0.03em] text-balance sm:text-[30px]">{block.text}</h2>
    case 'quote':
      return (
        <figure className="relative my-10 rounded-card-sm border-l-[3px] border-violet-text bg-white/[0.03] py-6 pr-6 pl-7">
          <blockquote className="font-display text-[22px] font-medium leading-snug tracking-[-0.025em] text-balance sm:text-[26px]">“{block.text}”</blockquote>
          {block.cite ? <figcaption className="mt-4 text-[14px] text-muted">— {block.cite}</figcaption> : null}
        </figure>
      )
    case 'list':
      return (
        <ul className="mt-6 flex flex-col gap-3">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-[17px] leading-relaxed text-soft">
              <span className="mt-[5px] grid size-5 shrink-0 place-items-center rounded-full bg-violet round">
                <Check className="size-3" strokeWidth={3} aria-hidden />
              </span>
              {item}
            </li>
          ))}
        </ul>
      )
    default:
      return <p className="mt-6 text-[17px] leading-[1.75] text-soft text-pretty sm:text-[18px]">{block.text}</p>
  }
}

export function BlogPost({ slug }: { slug?: string }) {
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <NotFound />
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <>
      <ReadingProgress />
      <article>
        <header className="relative overflow-hidden pt-[128px] sm:pt-[160px]">
          <div aria-hidden className="dots pointer-events-none absolute inset-0" />
          <Container className="relative">
            <div className="mx-auto max-w-[760px]">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="flex flex-wrap items-center gap-3">
                <Link
                  href="/blog"
                  className="group inline-flex min-h-10 items-center gap-2 rounded-[10px] pr-2 text-[14px] text-muted transition-colors hover:text-white"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                  All articles
                </Link>
                <Badge tone="violet">{post.tag}</Badge>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.08, ease }}
                className="mt-6 font-display text-[38px] font-semibold leading-[1.06] tracking-[-0.038em] text-balance sm:text-[52px]"
              >
                {post.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="mt-5 text-[18px] leading-relaxed text-muted text-pretty"
              >
                {post.excerpt}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={post.author.name} size={44} />
                  <div className="leading-tight">
                    <div className="text-[15px] font-medium">{post.author.name}</div>
                    <div className="mt-0.5 text-[13px] text-muted">
                      {post.author.role} · <time>{post.date}</time> · {post.read} read
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  <CopyLink />
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, delay: 0.35, ease }}
              className="mx-auto mt-12 max-w-[1040px]"
            >
              <PostCover background={coverFor(post.slug, posts)} className="depth h-[220px] rounded-card sm:h-[380px]" />
            </motion.div>
          </Container>
        </header>

        <Container>
          <div className="mx-auto max-w-[680px] pt-8 pb-8">
            {post.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
            <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-white/[0.06] pt-8">
              <Avatar name={post.author.name} size={52} />
              <div className="leading-tight">
                <div className="text-[13px] text-muted">Written by</div>
                <div className="mt-1 text-[16px] font-medium">{post.author.name}</div>
                <div className="mt-0.5 text-[13px] text-muted">{post.author.role}</div>
              </div>
              <div className="ml-auto">
                <CopyLink />
              </div>
            </div>
          </div>
        </Container>
      </article>

      <Section label="Keep reading">
        <Reveal className="mx-auto flex max-w-[1120px] items-end justify-between gap-4">
          <h2 className="font-display text-[30px] font-semibold tracking-[-0.035em] sm:text-[36px]">Keep reading</h2>
          <Button href="/blog" variant="ghost" size="sm" className="text-[15px]">
            All articles
          </Button>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-[1120px] gap-4 md:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08} className="h-full">
              <PostCard post={p} cover={coverFor(p.slug, posts)} excerpt />
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  )
}
