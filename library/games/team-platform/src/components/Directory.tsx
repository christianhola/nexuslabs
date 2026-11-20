import { LayoutGrid, List, MapPin, Search, UserX } from 'lucide-react'
import { useMemo, useState } from 'react'

import { departments, locations, people, presenceLabel } from '../content'
import type { Person } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'
import { Avatar } from './Avatar'
import { Chip } from './Badge'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { EmptyState } from './EmptyState'
import { Select } from './Field'
import { ProfileCard } from './ProfileCard'
import { Segmented } from './Segmented'

/*
  The live team directory: search names, roles and skills, filter by
  department, location and who is working now, switch grid or list (the
  view is remembered). A card opens the profile in a dialog.
*/
export function Directory({ onShowInChart, onMessage }: { onShowInChart?: (id: string) => void; onMessage?: (p: Person) => void }) {
  const [query, setQuery] = useState('')
  const [dept, setDept] = useState<string>('All')
  const [place, setPlace] = useState('Anywhere')
  const [working, setWorking] = useState(false)
  const [view, setView] = useStored<'grid' | 'list'>('directory-view', 'grid')
  const [open, setOpen] = useState<Person | null>(null)

  const q = query.trim().toLowerCase()
  const base = useMemo(
    () => people.filter((p) => (!q || [p.name, p.role, ...p.skills].some((s) => s.toLowerCase().includes(q))) && (place === 'Anywhere' || p.location === place) && (!working || p.presence === 'online' || p.presence === 'on-shift')),
    [q, place, working],
  )
  const list = dept === 'All' ? base : base.filter((p) => p.dept === dept)
  const clear = () => {
    setQuery('')
    setDept('All')
    setPlace('Anywhere')
    setWorking(false)
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-card p-4 shadow-[var(--shadow-card)] sm:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
          <label htmlFor="dir-search" className="sr-only">
            Search people
          </label>
          <input id="dir-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search names, roles, skills or languages" className="h-12 w-full rounded-[10px] border border-line-strong bg-card pl-10 pr-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-[170px]">
            <label htmlFor="dir-place" className="sr-only">
              Location
            </label>
            <Select id="dir-place" value={place} onChange={(e) => setPlace(e.target.value)}>
              <option>Anywhere</option>
              {locations.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </Select>
          </div>
          <Chip active={working} onClick={() => setWorking((w) => !w)} className="h-12 sm:h-12">
            Working now
          </Chip>
          <Segmented
            label="Layout"
            value={view}
            onChange={setView}
            options={[
              { value: 'grid', label: <><LayoutGrid className="size-4" aria-hidden /><span className="sr-only sm:not-sr-only">Grid</span></> },
              { value: 'list', label: <><List className="size-4" aria-hidden /><span className="sr-only sm:not-sr-only">List</span></> },
            ]}
          />
        </div>
      </div>
      <div className="scrollbar-none -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:-mx-6 sm:px-6" role="group" aria-label="Department">
        {['All', ...departments].map((d) => (
          <Chip key={d} active={dept === d} onClick={() => setDept(d)} count={d === 'All' ? base.length : base.filter((p) => p.dept === d).length}>
            {d}
          </Chip>
        ))}
      </div>
      <p className="mt-4 text-[13.5px] text-faint" aria-live="polite">
        {list.length} {list.length === 1 ? 'person' : 'people'}
      </p>
      {list.length === 0 ? (
        <EmptyState className="mt-3" icon={<UserX />} title="Nobody matches those filters" body="Try another spelling, or clear the filters to see everyone." action={<Button size="sm" variant="outline" onClick={clear}>Clear filters</Button>} />
      ) : view === 'grid' ? (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setOpen(p)} className="flex h-full w-full flex-col items-start gap-3 rounded-[16px] border border-line p-4 text-left transition-[border-color,box-shadow] duration-150 hover:border-ink hover:shadow-[4px_4px_0_var(--color-mint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                <Avatar name={p.name} face={p.face} size={52} presence={p.presence} />
                <span>
                  <span className="block text-[15.5px] font-semibold text-ink">{p.name}</span>
                  <span className="block text-[14px] text-muted">{p.role}</span>
                </span>
                <span className="mt-auto flex w-full items-center justify-between gap-2 text-[13px] text-faint">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {p.location}
                  </span>
                  <span>{presenceLabel[p.presence]}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="mt-3 divide-y divide-line rounded-[16px] border border-line">
          {list.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => setOpen(p)} className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-3 py-3 text-left hover:bg-mist focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink sm:grid-cols-[auto_1.2fr_1fr_120px_100px] sm:px-4">
                <Avatar name={p.name} face={p.face} size={36} presence={p.presence} />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-ink">{p.name}</span>
                  <span className="block truncate text-[13.5px] text-muted sm:hidden">{p.role}</span>
                </span>
                <span className="hidden truncate text-[14px] text-muted sm:block">{p.role}</span>
                <span className="hidden text-[14px] text-muted sm:block">{p.location}</span>
                <span className={cx('text-right text-[13px] font-medium', p.presence === 'online' || p.presence === 'on-shift' ? 'text-leaf' : 'text-faint')}>{presenceLabel[p.presence]}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <Dialog open={!!open} onClose={() => setOpen(null)} title="Profile">
        {open ? (
          <ProfileCard
            person={open}
            compact
            onSelect={(id) => setOpen(people.find((p) => p.id === id) ?? null)}
            onMessage={
              onMessage
                ? (p) => {
                    setOpen(null)
                    onMessage(p)
                  }
                : undefined
            }
            onShowInChart={
              onShowInChart
                ? (id) => {
                    setOpen(null)
                    onShowInChart(id)
                  }
                : undefined
            }
          />
        ) : null}
      </Dialog>
    </div>
  )
}
