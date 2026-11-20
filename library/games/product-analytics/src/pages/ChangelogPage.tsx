import { Check } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Segmented } from '../components/Segmented'
import { changelog } from '../content'
import type { ChangeTag } from '../content'
import { useStored } from '../lib/storage'
import { SubscribeForm } from '../sections/SubscribeForm'

const tagTone: Record<ChangeTag, 'lime' | 'neutral' | 'warn'> = { New: 'lime', Improved: 'neutral', Fixed: 'warn' }

export function ChangelogPage() {
  const [tag, setTag] = useStored<'all' | ChangeTag>('changelog-filter', 'all')
  const items = changelog.filter((c) => tag === 'all' || c.tags.includes(tag))
  return (
    <>
      <PageHeader eyebrow="Changelog" title="What’s new in Pulseboard" lede="We ship every week. Here is what changed, why, and what it means for your data.">
        <div className="mx-auto mt-8 max-w-[440px] text-left">
          <SubscribeForm source="changelog" label="Get the changelog by email" />
        </div>
      </PageHeader>
      <Container className="pb-24">
        <div className="mx-auto max-w-[820px]">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-[15px] font-semibold text-ink" aria-live="polite">
              {items.length} {items.length === 1 ? 'release' : 'releases'}
            </p>
            <Segmented
              size="sm"
              tone="dark"
              label="Show releases with"
              value={tag}
              onChange={setTag}
              options={[
                { value: 'all', label: 'All' },
                { value: 'New', label: 'New' },
                { value: 'Improved', label: 'Improved' },
                { value: 'Fixed', label: 'Fixed' },
              ]}
            />
          </div>
          {items.length ? (
            <ol className="relative flex flex-col gap-12 border-l border-line pl-6 sm:pl-10">
              {items.map((c) => (
                <li key={c.id} id={c.id} className="relative scroll-mt-24">
                  <span className="round absolute -left-[31px] top-1.5 size-3.5 rounded-full bg-lime ring-4 ring-paper sm:-left-[47px]" aria-hidden />
                  <Reveal>
                    <p className="text-[13.5px] text-faint">
                      <time dateTime={c.id}>{c.date}</time>, version {c.version}
                    </p>
                    <h2 className="mt-1.5 font-display text-[24px] font-bold tracking-[-0.035em] text-ink sm:text-[28px]">{c.title}</h2>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.tags.map((t) => (
                        <Badge key={t} tone={tagTone[t]}>
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-4 text-[15.5px] leading-relaxed text-body">{c.body}</p>
                    <ul className="mt-4 flex flex-col gap-2 rounded-[var(--radius-card-sm)] border border-line bg-card p-5">
                      {c.items.map((it) => (
                        <li key={it} className="flex gap-2.5 text-[14.5px] text-body">
                          <Check className="mt-0.5 size-4 shrink-0 text-leaf" strokeWidth={3} aria-hidden />
                          {it}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="No releases with this tag" body="Pick another tag or show all releases." />
          )}
        </div>
      </Container>
    </>
  )
}
