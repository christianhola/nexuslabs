import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Mail, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Field, Input } from '../components/Field'
import { IconChip } from '../components/IconChip'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { coverFor, PostCard, PostCover } from '../components/PostCard'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SegmentedControl } from '../components/SegmentedControl'
import { blogPage, posts } from '../content'
import type { Post } from '../content'
import { Link } from '../lib/router'
import { useSubscribe } from '../lib/useSubscribe'

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Reveal>
      <Link
        href={`/blog/${post.slug}`}
        className="depth group relative grid overflow-hidden rounded-card bg-surface transition-colors duration-300 hover:bg-surface-2 md:grid-cols-[1.1fr_1fr]"
      >
        <PostCover background={coverFor(post.slug, posts)} tag={post.tag} className="h-[240px] md:h-full md:min-h-[360px]" />
        <div className="flex flex-col p-7 sm:p-10">
          <Badge tone="violet" className="self-start">
            Featured
          </Badge>
          <h2 className="mt-5 font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.035em] text-balance sm:text-[36px]">{post.title}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-muted text-pretty">{post.excerpt}</p>
          <div className="mt-auto flex items-center gap-3 pt-8">
            <Avatar name={post.author.name} size={40} />
            <div className="leading-tight">
              <div className="text-[14px] font-medium">{post.author.name}</div>
              <div className="mt-0.5 text-[13px] text-muted">
                {post.date} · {post.read} read
              </div>
            </div>
            <ArrowRight className="ml-auto size-5 text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

function Subscribe() {
  const { email, setEmail, state, error, submit } = useSubscribe()

  return (
    <Reveal>
      <Card variant="featured" padding="lg" className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <IconChip tone="violet">
            <Mail />
          </IconChip>
          <h2 className="mt-5 font-display text-[28px] font-semibold tracking-[-0.035em] text-balance">{blogPage.subscribe.title}</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-muted">{blogPage.subscribe.body}</p>
        </div>
        {state === 'done' ? (
          <Notice tone="success" title="You are subscribed">
            Look out for the next issue at {email}.
          </Notice>
        ) : (
          <form onSubmit={submit} noValidate className="flex flex-col gap-3">
            <Field label="Email address" error={state === 'error' ? error : undefined}>
              {(p) => (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input
                    {...p}
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    className="sm:flex-1"
                  />
                  <Button type="submit" size="lg" loading={state === 'loading'}>
                    Subscribe
                  </Button>
                </div>
              )}
            </Field>
          </form>
        )}
      </Card>
    </Reveal>
  )
}

export function BlogIndex() {
  const featured = posts.find((p) => p.featured) ?? posts[0]
  const rest = posts.filter((p) => p !== featured)
  const tags = useMemo(() => ['All', ...Array.from(new Set(posts.map((p) => p.tag)))], [])
  const [tag, setTag] = useState('All')
  const [query, setQuery] = useState('')
  const filtering = tag !== 'All' || query.trim() !== ''

  const q = query.trim().toLowerCase()
  // While filtering, search every post (the featured one included).
  const results = (filtering ? posts : rest).filter(
    (p) =>
      (tag === 'All' || p.tag === tag) &&
      (!q || [p.title, p.excerpt, p.tag, p.author.name].some((s) => s.toLowerCase().includes(q))),
  )

  const clear = () => {
    setTag('All')
    setQuery('')
  }

  return (
    <>
      <PageHeader eyebrow={blogPage.eyebrow} title={blogPage.title} body={blogPage.body} />

      <Section className="!pt-0">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-12">
          {!filtering && <FeaturedPost post={featured} />}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="-mx-4 max-w-[calc(100%+2rem)] overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:max-w-full md:px-0">
              <SegmentedControl label="Filter by topic" size="sm" value={tag} onChange={setTag} options={tags.map((t) => ({ value: t, label: t }))} />
            </div>
            <div className="relative w-full md:w-[320px]">
              <label htmlFor="blog-search" className="sr-only">
                {blogPage.searchPlaceholder}
              </label>
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <Input
                id="blog-search"
                type="search"
                placeholder={blogPage.searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="!h-11 pl-11 [&::-webkit-search-cancel-button]:hidden"
                trailing={
                  query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                      className="grid size-10 place-items-center rounded-[10px] text-muted transition-colors hover:bg-white/[0.06] hover:text-white"
                    >
                      <X className="size-4" aria-hidden />
                    </button>
                  ) : undefined
                }
              />
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {filtering ? `${results.length} article${results.length === 1 ? '' : 's'} found` : ''}
          </p>

          {results.length ? (
            <motion.ul layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout" initial={false}>
                {results.map((p) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                  >
                    <PostCard post={p} cover={coverFor(p.slug, posts)} excerpt />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <EmptyState
              icon={<Search />}
              title={blogPage.empty.title}
              body={blogPage.empty.body}
              action={
                <Button variant="outline" size="sm" onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          )}

          <Subscribe />
        </div>
      </Section>
    </>
  )
}
