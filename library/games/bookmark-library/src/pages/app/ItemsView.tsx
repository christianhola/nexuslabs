import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { LayoutGrid, List, SearchX } from 'lucide-react'

import { Button } from '../../components/Button'
import { ItemCard } from '../../components/ItemCard'
import { ItemRow } from '../../components/ItemRow'
import { QueryChips } from '../../components/QueryChips'
import { SearchBox } from '../../components/SearchBox'
import { Segmented } from '../../components/Segmented'
import { Skeleton } from '../../components/Skeleton'
import { EmptyState } from '../../components/EmptyState'
import { APP } from '../../content'
import type { Item } from '../../content'
import { useLibrary } from '../../lib/library'
import { navigate, useLocation } from '../../lib/router'
import { parseQuery, searchItems } from '../../lib/search'
import { useStored } from '../../lib/storage'

type Sort = 'newest' | 'oldest' | 'title'

/*
  The searchable item list every library screen uses: the big search box
  (synced to ?q=), the chips it reads, sort, grid/list, loading and empty
  states. `base` is the set to search within.
*/
export function ItemsView({ base, title, subtitle, empty, actions, searchLabel }: { base: Item[]; title: string; subtitle?: ReactNode; empty: { title: string; body: string; action?: ReactNode }; actions?: ReactNode; searchLabel: string }) {
  const lib = useLibrary()
  const { path, search } = useLocation()
  const urlQ = new URLSearchParams(search).get('q') ?? ''
  const [q, setQ] = useState(urlQ)
  const [settled, setSettled] = useState(urlQ)
  const [off, setOff] = useState<Set<string>>(new Set())
  const [layout, setLayout] = useStored<'grid' | 'list'>('layout', 'grid')
  const [sort, setSort] = useStored<Sort>('sort', 'newest')
  const input = useRef<HTMLInputElement>(null)

  // Follow the URL (back/forward, links from the landing page).
  const qRef = useRef(q)
  qRef.current = q
  useEffect(() => {
    if (urlQ === qRef.current.trim()) return
    setQ(urlQ)
    setSettled(urlQ)
  }, [urlQ, path])

  // Debounce: the box updates instantly, results after a short "reading" beat.
  useEffect(() => {
    if (q === settled) return
    const t = window.setTimeout(() => {
      setSettled(q)
      setOff(new Set())
      const p = new URLSearchParams(search)
      if (q.trim()) p.set('q', q.trim())
      else p.delete('q')
      navigate(path + (p.toString() ? `?${p}` : ''), { replace: true })
    }, 280)
    return () => window.clearTimeout(t)
  }, [q, settled, path, search])

  // "/" focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.key !== '/' || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || document.querySelector('[aria-modal="true"]')) return
      e.preventDefault()
      input.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const parsed = useMemo(() => parseQuery(settled, lib.items, lib.collections), [settled, lib.items, lib.collections])
  const searching = settled.trim().length > 0
  const results = useMemo(() => {
    if (searching) return searchItems(base, parsed, off).map((h) => h.item)
    const list = [...base]
    if (sort === 'newest') list.sort((a, b) => b.savedAt.localeCompare(a.savedAt))
    if (sort === 'oldest') list.sort((a, b) => a.savedAt.localeCompare(b.savedAt))
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [base, parsed, off, searching, sort])
  const loading = q !== settled
  const colName = (id: string | null) => (id ? lib.collections.find((c) => c.id === id)?.name : undefined)

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8">
      <div className="overflow-hidden rounded-[20px] bg-paper shadow-card ring-1 ring-line has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ink">
        <div className="px-5 py-2 sm:px-7">
          <label htmlFor="library-search" className="sr-only">
            {searchLabel}
          </label>
          <SearchBox ref={input} id="library-search" value={q} onChange={(e) => setQ(e.target.value)} onClear={() => setQ('')} placeholder={APP.searchPlaceholder} />
        </div>
        {searching && parsed.chips.length > 0 && (
          <div className="border-t border-line px-5 py-3.5 sm:px-7">
            <QueryChips
              chips={parsed.chips}
              off={off}
              onToggle={(id) =>
                setOff((s) => {
                  const n = new Set(s)
                  if (n.has(id)) n.delete(id)
                  else n.add(id)
                  return n
                })
              }
            />
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[30px] leading-[1.1] font-bold tracking-[-0.04em]">{searching ? 'Results' : title}</h1>
          <p className="mt-1.5 text-[15px] text-muted" aria-live="polite">
            {loading ? 'Reading your sentence…' : searching ? `${results.length} ${results.length === 1 ? 'match' : 'matches'} in ${title}` : subtitle ?? `${results.length} saved`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {!searching && (
            <label className="flex items-center gap-2 text-[14px] text-muted">
              <span className="sr-only sm:not-sr-only">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-sm bg-chip px-3 text-[14px] text-ink outline-none hover:bg-chip-2 focus-visible:outline-2 focus-visible:outline-ink">
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Title</option>
              </select>
            </label>
          )}
          <Segmented
            label="Layout"
            size="sm"
            value={layout}
            onChange={setLayout}
            options={[
              { value: 'grid', title: 'Grid', label: <LayoutGrid aria-hidden className="size-4" /> },
              { value: 'list', title: 'List', label: <List aria-hidden className="size-4" /> },
            ]}
          />
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div aria-busy="true" aria-label="Loading results" className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="overflow-hidden rounded-xl ring-1 ring-line">
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="flex flex-col gap-2 p-4">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          searching ? (
            <EmptyState
              icon={<SearchX aria-hidden className="size-5" />}
              title={APP.emptySearch.title}
              body={APP.emptySearch.body}
              action={
                <Button variant="soft" onClick={() => setQ('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <EmptyState title={empty.title} body={empty.body} action={empty.action} />
          )
        ) : layout === 'grid' ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {results.map((item) => (
              <li key={item.id} className="animate-fade">
                <ItemCard item={item} onFavourite={lib.toggleFavourite} collectionName={colName(item.collectionId)} />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col rounded-xl bg-paper p-2 ring-1 ring-line">
            {results.map((item) => (
              <li key={item.id}>
                <ItemRow item={item} href={`/app/item/${item.id}`} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
