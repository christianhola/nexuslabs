import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Pencil, SearchX, Star, Trash2 } from 'lucide-react'

import { Button, ButtonLink } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { Field, Select, Textarea } from '../../components/Field'
import { ItemRow } from '../../components/ItemRow'
import { TagInput } from '../../components/TagInput'
import { Thumb } from '../../components/Thumb'
import { useToast } from '../../components/Toast'
import { KINDS } from '../../content'
import { DAY, longDate, relativeDate } from '../../lib/dates'
import { useLibrary } from '../../lib/library'
import { Link, navigate } from '../../lib/router'
import { domain, tagVocabulary } from '../../lib/search'

export function ItemDetailPage({ id }: { id: string }) {
  const lib = useLibrary()
  const toast = useToast()
  const index = lib.items.findIndex((i) => i.id === id)
  const item = lib.items[index]
  const [editing, setEditing] = useState(false)
  const [why, setWhy] = useState('')
  const [whyError, setWhyError] = useState<string>()

  useEffect(() => {
    if (item) document.title = `${item.title} | Keepsake`
  }, [item])
  useEffect(() => setEditing(false), [id])

  const vocab = useMemo(() => tagVocabulary(lib.items), [lib.items])
  const related = useMemo(() => {
    if (!item) return { sameTime: [], sameTag: [] }
    const t = new Date(item.savedAt).getTime()
    const sameTime = lib.items.filter((i) => i.id !== item.id && Math.abs(new Date(i.savedAt).getTime() - t) <= 4 * DAY).slice(0, 4)
    const taken = new Set(sameTime.map((i) => i.id))
    const sameTag = lib.items
      .filter((i) => i.id !== item.id && !taken.has(i.id))
      .map((i) => ({ i, n: i.tags.filter((x) => item.tags.includes(x)).length }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)
      .slice(0, 4)
      .map((x) => x.i)
    return { sameTime, sameTag }
  }, [item, lib.items])

  if (!item)
    return (
      <div className="px-4 py-10 sm:px-8">
        <EmptyState icon={<SearchX aria-hidden className="size-5" />} title="This save is not on your shelf" body="It may have been deleted, or the link came from someone else's library." action={<ButtonLink href="/app" variant="soft">Back to My shelf</ButtonLink>} />
      </div>
    )

  const col = lib.collections.find((c) => c.id === item.collectionId)

  const remove = () => {
    const snapshot = item
    lib.removeItem(item.id)
    navigate(col ? `/app/c/${col.id}` : '/app')
    toast(`Deleted “${snapshot.title}”`, {
      label: 'Undo',
      onClick: () => {
        lib.restoreItem(snapshot, index)
        navigate(`/app/item/${snapshot.id}`)
      },
    })
  }

  const saveWhy = () => {
    if (why.trim().length < 3) {
      setWhyError('Keep at least a few words of why.')
      return
    }
    lib.updateItem(item.id, { why: why.trim() })
    setEditing(false)
    toast('Note updated')
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <Link href={col ? `/app/c/${col.id}` : '/app'} className="-ml-2 inline-flex h-10 items-center gap-1.5 rounded-sm px-2 text-[14px] text-muted hover:bg-chip hover:text-ink">
        <ArrowLeft aria-hidden className="size-4" />
        {col ? col.name : 'My shelf'}
      </Link>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
        <div className="min-w-0">
          <Thumb item={item} eager className="aspect-[16/10] w-full rounded-2xl ring-1 ring-line" />
          <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] tracking-[0.06em] text-subtle uppercase">
            <span>{KINDS[item.kind]}</span>
            <span aria-hidden>·</span>
            <span className="tracking-normal normal-case">Saved {longDate(item.savedAt)}
              {/^\d/.test(relativeDate(item.savedAt)) ? '' : ` (${relativeDate(item.savedAt).toLowerCase()})`}</span>
          </div>
          <h1 className="mt-2 text-[clamp(30px,3.4vw,44px)] leading-[1.05] font-bold tracking-[-0.045em] text-balance">{item.title}</h1>
          <p className="mt-2 text-[18px] text-muted">{item.note}</p>

          <section aria-labelledby="why-h" className="mt-8 rounded-xl bg-paper p-5 ring-1 ring-line sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 id="why-h" className="text-[13px] tracking-[0.08em] text-subtle uppercase">
                Why you saved it
              </h2>
              {!editing && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Pencil aria-hidden className="size-3.5" />}
                  onClick={() => {
                    setWhy(item.why)
                    setWhyError(undefined)
                    setEditing(true)
                  }}
                >
                  Edit
                </Button>
              )}
            </div>
            {editing ? (
              <div className="mt-3 flex flex-col gap-3">
                <Field label="Edit the note" error={whyError}>
                  {({ id: fid, describedBy, invalid }) => (
                    <Textarea
                      id={fid}
                      autoFocus
                      value={why}
                      maxLength={280}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      onChange={(e) => {
                        setWhy(e.target.value)
                        setWhyError(undefined)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveWhy()
                        if (e.key === 'Escape') setEditing(false)
                      }}
                    />
                  )}
                </Field>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" variant="dark" onClick={saveWhy}>
                    Save note
                  </Button>
                </div>
              </div>
            ) : (
              <blockquote className="mt-3 border-l-2 border-lime pl-4 text-[19px] leading-[1.5] tracking-[-0.01em] text-ink">“{item.why}”</blockquote>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-ink px-4.5 text-[15px] font-medium text-paper hover:bg-ink-2">
              Open {domain(item.url)}
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <Button variant={item.favourite ? 'lime' : 'soft'} aria-pressed={item.favourite} className="shadow-none" icon={<Star aria-hidden className={item.favourite ? 'size-4 fill-ink' : 'size-4'} />} onClick={() => lib.toggleFavourite(item.id)}>
              {item.favourite ? 'Favourite' : 'Add to favourites'}
            </Button>
          </div>

          <div className="flex flex-col gap-5 rounded-xl bg-paper p-5 ring-1 ring-line">
            <TagInput value={item.tags} onChange={(tags) => lib.updateItem(item.id, { tags })} suggestions={vocab} />
            <Field label="Collection">
              {({ id: fid }) => (
                <Select
                  id={fid}
                  value={item.collectionId ?? ''}
                  onChange={(e) => {
                    const next = e.target.value || null
                    lib.updateItem(item.id, { collectionId: next })
                    toast(next ? `Moved to ${lib.collections.find((c) => c.id === next)?.name}` : 'Removed from collection')
                  }}
                >
                  <option value="">None (My shelf)</option>
                  {lib.collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-4 text-[14px]">
              <dt className="text-subtle">Link</dt>
              <dd className="truncate text-ink-2">{item.url.replace(/^https?:\/\//, '')}</dd>
              <dt className="text-subtle">Type</dt>
              <dd className="text-ink-2">{KINDS[item.kind]}</dd>
              <dt className="text-subtle">Saved</dt>
              <dd className="text-ink-2">{longDate(item.savedAt)}</dd>
            </dl>
            <Button variant="ghost" className="justify-start text-danger! hover:bg-danger-soft!" icon={<Trash2 aria-hidden className="size-4" />} onClick={remove}>
              Delete this save
            </Button>
          </div>

          {[
            { title: 'Saved around the same time', list: related.sameTime },
            { title: 'Shares a tag', list: related.sameTag },
          ].map(
            (g) =>
              g.list.length > 0 && (
                <section key={g.title} aria-label={g.title}>
                  <h2 className="px-1 pb-2 text-[13px] tracking-[0.08em] text-subtle uppercase">{g.title}</h2>
                  <ul className="flex flex-col rounded-xl bg-paper p-1.5 ring-1 ring-line">
                    {g.list.map((i) => (
                      <li key={i.id}>
                        <ItemRow item={i} href={`/app/item/${i.id}`} />
                      </li>
                    ))}
                  </ul>
                </section>
              ),
          )}
        </aside>
      </div>
    </div>
  )
}
