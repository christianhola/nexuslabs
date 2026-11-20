import { ChevronDown, Minus, Plus, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { people } from '../content'
import type { Person } from '../content'
import { cx } from '../lib/cx'
import { Avatar } from './Avatar'
import { Button, IconButton } from './Button'
import { EmptyState } from './EmptyState'
import { ProfileCard, byId, reportsOf } from './ProfileCard'

/*
  The live org chart. Teams expand and collapse, search finds a person and
  opens the path to them, zoom scales the tree, and selecting a card opens
  the profile beside it. `focusId` lets another component (the directory)
  jump to someone.
*/
const root = people.find((p) => p.managerId === null)!
const pathTo = (id: string) => {
  const out: string[] = []
  let p = byId(id)
  while (p?.managerId) {
    out.push(p.managerId)
    p = byId(p.managerId)
  }
  return out
}

export function OrgChart({ focusId, onMessage }: { focusId?: string | null; onMessage?: (p: Person) => void }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set([root.id, 'theo']))
  const [selected, setSelected] = useState<string>('amara')
  const [query, setQuery] = useState('')
  const [zoom, setZoom] = useState(1)
  const scroller = useRef<HTMLDivElement>(null)

  const q = query.trim().toLowerCase()
  const matches = useMemo(() => (q ? people.filter((p) => p.name.toLowerCase().includes(q) || p.role.toLowerCase().includes(q)) : []), [q])

  const reveal = (id: string) => {
    setOpen((o) => new Set([...o, ...pathTo(id)]))
    setSelected(id)
    requestAnimationFrame(() => {
      const el = scroller.current?.querySelector<HTMLElement>(`[data-person="${id}"]`)
      el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    })
  }

  // Start with the top of the tree centred, however narrow the screen.
  useEffect(() => {
    const el = scroller.current
    if (el && !focusId) el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (focusId) reveal(focusId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusId])

  const toggle = (id: string) =>
    setOpen((o) => {
      const n = new Set(o)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })

  const person = byId(selected) ?? root

  const node = (p: Person): React.ReactNode => {
    const kids = reportsOf(p.id)
    const isOpen = open.has(p.id)
    const hit = q && matches.some((m) => m.id === p.id)
    return (
      <li key={p.id}>
        <div data-person={p.id} className={cx('relative w-[172px] rounded-[14px] border-[1.5px] bg-card transition-[box-shadow,border-color] duration-200', selected === p.id ? 'border-ink shadow-[4px_4px_0_var(--color-mint)]' : 'border-line-strong hover:border-ink', hit && 'ring-4 ring-mint/60')}>
          <button type="button" onClick={() => setSelected(p.id)} aria-pressed={selected === p.id} className="flex w-full items-center gap-2.5 rounded-[13px] p-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
            <Avatar name={p.name} face={p.face} size={38} presence={p.presence} />
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-semibold text-ink">{p.name}</span>
              <span className="block truncate text-[12.5px] text-muted">{p.role}</span>
            </span>
          </button>
          {kids.length ? (
            <button
              type="button"
              onClick={() => toggle(p.id)}
              aria-expanded={isOpen}
              aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${p.name}'s team (${kids.length})`}
              className="absolute -bottom-5 left-1/2 z-10 flex h-10 min-w-10 -translate-x-1/2 items-center justify-center gap-1 sm:-bottom-3.5 sm:h-7 sm:min-w-0 rounded-[8px] border-[1.5px] border-ink bg-card px-2 text-[12px] font-semibold text-ink hover:bg-mint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {kids.length}
              <ChevronDown className={cx('size-3.5 transition-transform duration-200', isOpen && 'rotate-180')} aria-hidden />
            </button>
          ) : null}
        </div>
        {kids.length && isOpen ? (
          <ul>
            {kids.map((k) => node(k))}
          </ul>
        ) : null}
      </li>
    )
  }

  return (
    <div className="grid overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)] lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 border-line lg:border-r">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-3 sm:p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <label htmlFor="org-search" className="sr-only">
              Search the org chart
            </label>
            <input
              id="org-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && matches[0]) reveal(matches[0].id)
              }}
              placeholder="Search by name or role"
              className="h-10 w-full rounded-[10px] border border-line-strong bg-card pl-9 pr-9 text-[14.5px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45"
            />
            {query ? (
              <button type="button" aria-label="Clear search" onClick={() => setQuery('')} className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-[8px] text-muted hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
                <X className="size-4" aria-hidden />
              </button>
            ) : null}
          </div>
          <Button size="sm" variant="soft" onClick={() => setOpen(new Set(people.map((p) => p.id)))}>
            Expand all
          </Button>
          <Button size="sm" variant="soft" onClick={() => setOpen(new Set([root.id]))}>
            Collapse
          </Button>
          <span className="flex items-center rounded-[10px] border border-line">
            <IconButton label="Zoom out" onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(1)))} disabled={zoom <= 0.6}>
              <Minus aria-hidden />
            </IconButton>
            <span className="w-12 text-center text-[13px] font-medium tabular-nums text-ink" aria-live="polite">
              {Math.round(zoom * 100)}%
            </span>
            <IconButton label="Zoom in" onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.1).toFixed(1)))} disabled={zoom >= 1.2}>
              <Plus aria-hidden />
            </IconButton>
          </span>
        </div>
        {q ? (
          <div className="border-b border-line px-4 py-2.5 text-[14px]" aria-live="polite">
            {matches.length ? (
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-muted">
                  {matches.length} match{matches.length > 1 ? 'es' : ''}:
                </span>
                {matches.slice(0, 5).map((m) => (
                  <button key={m.id} type="button" onClick={() => reveal(m.id)} className="h-10 rounded-[7px] bg-mint-soft px-2.5 text-[13px] sm:h-8 font-medium text-leaf hover:bg-mint hover:text-ink focus-visible:outline-2 focus-visible:outline-ink">
                    {m.name}
                  </button>
                ))}
              </span>
            ) : (
              <span className="text-muted">Nobody matches “{query}”.</span>
            )}
          </div>
        ) : null}
        <div ref={scroller} className="org-scroll h-[520px] overflow-auto bg-[radial-gradient(circle,#e3e3e0_1px,transparent_1.2px)] [background-size:20px_20px]" tabIndex={0} aria-label="Org chart, scrollable">
          {q && !matches.length ? (
            <div className="grid h-full place-items-center p-6">
              <EmptyState title="No one found" body="Try a first name, a surname or a role like “manager”." action={<Button size="sm" variant="outline" onClick={() => setQuery('')}>Clear search</Button>} />
            </div>
          ) : (
            <div className="inline-block min-w-full origin-top-left p-8" style={{ zoom }}>
              <ul className="org-tree">
                {node(root)}
              </ul>
            </div>
          )}
        </div>
      </div>
      <aside aria-label="Selected profile" className="p-5 sm:p-6">
        <ProfileCard person={person} onSelect={reveal} onMessage={onMessage} />
      </aside>
    </div>
  )
}
