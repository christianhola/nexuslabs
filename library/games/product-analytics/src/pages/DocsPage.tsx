import { ArrowLeft, ArrowRight, BookOpen, Search, SearchX, ThumbsDown, ThumbsUp } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { control } from '../components/Field'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { docs } from '../content'
import type { Doc } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'

const groups = [...new Set(docs.map((d) => d.group))]

function useDocSearch() {
  const [q, setQ] = useState('')
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return docs
    return docs.filter((d) => [d.title, d.summary, ...d.blocks.map((b) => ('text' in b ? b.text : b.code))].join(' ').toLowerCase().includes(t))
  }, [q])
  return { q, setQ, hits }
}

function SearchBox({ q, setQ, id }: { q: string; setQ: (v: string) => void; id: string }) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        Search the docs
      </label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
      <input id={id} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the docs" className={cx(control, 'h-11 pl-10')} />
    </div>
  )
}

export function DocsPage({ slug }: { slug?: string }) {
  const doc = slug ? docs.find((d) => d.slug === slug) : undefined
  return doc ? <Article doc={doc} /> : <DocsIndex />
}

function DocsIndex() {
  const { q, setQ, hits } = useDocSearch()
  return (
    <>
      <PageHeader eyebrow="Docs" title="Build with Pulseboard" lede="Install the SDK, name your events and wire signals into the tools your team already lives in.">
        <div className="mx-auto mt-8 max-w-[480px]">
          <SearchBox q={q} setQ={setQ} id="docs-search-index" />
        </div>
      </PageHeader>
      <Container className="pb-24">
        <Card tone="dark" className="mb-10 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-[20px] font-bold tracking-[-0.025em] text-white">New here? Start with the quickstart</p>
            <p className="mt-1 text-[15px] text-white/75">From an empty workspace to your first funnel in about ten minutes.</p>
          </div>
          <Button href="/docs/quickstart" arrow>
            Open quickstart
          </Button>
        </Card>
        {hits.length ? (
          groups.map((g) => {
            const items = hits.filter((d) => d.group === g)
            if (!items.length) return null
            return (
              <section key={g} aria-labelledby={`g-${g}`} className="mb-10">
                <h2 id={`g-${g}`} className="font-display text-[15px] font-semibold text-muted">
                  {g}
                </h2>
                <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/docs/${d.slug}`} className="group flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-raised focus-visible:outline-2 focus-visible:outline-leaf">
                        <BookOpen className="size-5 text-leaf" aria-hidden />
                        <span className="font-display text-[17px] font-bold tracking-[-0.02em] text-ink">{d.title}</span>
                        <span className="text-[14.5px] leading-relaxed text-muted">{d.summary}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })
        ) : (
          <EmptyState
            icon={<SearchX aria-hidden />}
            title={`Nothing matches “${q}”`}
            body="Try a shorter word, like “identify” or “export”."
            action={
              <Button variant="dark" size="sm" onClick={() => setQ('')}>
                Clear search
              </Button>
            }
          />
        )}
      </Container>
    </>
  )
}

function Article({ doc }: { doc: Doc }) {
  const { q, setQ, hits } = useDocSearch()
  const [votes, setVotes] = useStored<Record<string, 'up' | 'down'>>('doc-votes', {})
  const i = docs.indexOf(doc)
  const prev = docs[i - 1]
  const next = docs[i + 1]
  const toc = doc.blocks.filter((b): b is Extract<Doc['blocks'][number], { type: 'h2' }> => b.type === 'h2')
  const vote = votes[doc.slug]

  return (
    <Container className="pb-24 pt-28 sm:pt-32">
      <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)_180px]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <SearchBox q={q} setQ={setQ} id="docs-search-side" />
          <nav aria-label="Docs" className="mt-5 max-lg:hidden">
            {groups.map((g) => {
              const items = hits.filter((d) => d.group === g)
              if (!items.length) return null
              return (
                <div key={g} className="mb-5">
                  <p className="px-3 font-display text-[12.5px] font-semibold text-faint">{g}</p>
                  <ul className="mt-1.5">
                    {items.map((d) => (
                      <li key={d.slug}>
                        <Link
                          href={`/docs/${d.slug}`}
                          aria-current={d.slug === doc.slug ? 'page' : undefined}
                          className="flex min-h-9 items-center rounded-[10px] px-3 text-[14px] text-body hover:bg-wash-2 aria-[current=page]:bg-lime-soft aria-[current=page]:font-semibold aria-[current=page]:text-leaf-deep focus-visible:outline-2 focus-visible:outline-leaf"
                        >
                          {d.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
            {!hits.length ? <p className="px-3 text-[14px] text-muted">No pages match.</p> : null}
          </nav>
          {q && hits.length ? (
            <ul className="mt-3 flex flex-col gap-1 lg:hidden">
              {hits.map((d) => (
                <li key={d.slug}>
                  <Link href={`/docs/${d.slug}`} className="flex min-h-10 items-center rounded-[10px] px-3 text-[14.5px] text-ink hover:bg-wash-2">
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </aside>

        <article className="min-w-0">
          <p className="text-[13.5px] text-faint">
            <Link href="/docs" className="rounded hover:text-ink focus-visible:outline-2 focus-visible:outline-leaf">
              Docs
            </Link>{' '}
            <span aria-hidden>/</span> {doc.group}
          </p>
          <h1 className="mt-3 font-display text-[36px] font-bold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">{doc.title}</h1>
          <p className="mt-3 text-[17px] leading-relaxed text-muted">{doc.summary}</p>
          <div className="prose-docs mt-6 text-[15.5px] text-body">
            {doc.blocks.map((b, k) =>
              b.type === 'p' ? (
                <p key={k}>{renderInline(b.text)}</p>
              ) : b.type === 'h2' ? (
                <h2 key={k} id={b.id} className="mt-10 scroll-mt-24 font-display text-[22px] font-bold tracking-[-0.03em] text-ink">
                  {b.text}
                </h2>
              ) : b.type === 'code' ? (
                <CodeBlock key={k} code={b.code} lang={b.lang} className="mt-4" />
              ) : (
                <Notice key={k} className="mt-5">
                  {renderInline(b.text)}
                </Notice>
              ),
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3 rounded-[var(--radius-card-sm)] bg-wash px-5 py-4">
            <p className="flex-1 font-display text-[15px] font-semibold text-ink" id="helpful">
              {vote ? 'Thanks for the feedback.' : 'Was this page helpful?'}
            </p>
            <div className="flex gap-2" role="group" aria-labelledby="helpful">
              {(['up', 'down'] as const).map((v) => (
                <Button
                  key={v}
                  variant={vote === v ? 'dark' : 'outline'}
                  size="sm"
                  aria-pressed={vote === v}
                  onClick={() => setVotes((all) => ({ ...all, [doc.slug]: v }))}
                  icon={v === 'up' ? <ThumbsUp className="size-4" aria-hidden /> : <ThumbsDown className="size-4" aria-hidden />}
                >
                  {v === 'up' ? 'Yes' : 'No'}
                </Button>
              ))}
            </div>
          </div>

          <nav aria-label="Previous and next page" className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/docs/${prev.slug}`} className="flex flex-col gap-1 rounded-[var(--radius-card-sm)] border border-line bg-card p-4 hover:border-line-strong focus-visible:outline-2 focus-visible:outline-leaf">
                <span className="inline-flex items-center gap-1 text-[13px] text-faint">
                  <ArrowLeft className="size-3.5" aria-hidden /> Previous
                </span>
                <span className="font-display font-semibold text-ink">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/docs/${next.slug}`} className="flex flex-col items-end gap-1 rounded-[var(--radius-card-sm)] border border-line bg-card p-4 text-right hover:border-line-strong focus-visible:outline-2 focus-visible:outline-leaf">
                <span className="inline-flex items-center gap-1 text-[13px] text-faint">
                  Next <ArrowRight className="size-3.5" aria-hidden />
                </span>
                <span className="font-display font-semibold text-ink">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </article>

        {toc.length ? (
          <nav aria-label="On this page" className="max-lg:hidden lg:sticky lg:top-24 lg:self-start">
            <p className="font-display text-[12.5px] font-semibold text-faint">On this page</p>
            <ul className="mt-2 border-l border-line">
              {toc.map((t) => (
                <li key={t.id}>
                  <Link href={`#${t.id}`} className="-ml-px flex min-h-8 items-center border-l border-transparent pl-3 text-[13.5px] text-muted hover:border-leaf hover:text-ink focus-visible:outline-2 focus-visible:outline-leaf">
                    {t.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </Container>
  )
}

/* `code` spans in prose. */
function renderInline(text: string) {
  return text.split(/(`[^`]+`)/).map((part, i) => (part.startsWith('`') ? <code key={i}>{part.slice(1, -1)}</code> : part))
}
