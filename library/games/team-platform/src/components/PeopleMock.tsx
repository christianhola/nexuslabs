import { Search } from 'lucide-react'
import { useState } from 'react'

import { people, presenceLabel } from '../content'
import { cx } from '../lib/cx'
import { Avatar } from './Avatar'
import { ProfileCard } from './ProfileCard'

/* A phone-sized people search with a profile view. */
export function PeopleMock() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const list = people.filter((p) => !q.trim() || (p.name + ' ' + p.role + ' ' + p.skills.join(' ')).toLowerCase().includes(q.trim().toLowerCase()))
  const person = people.find((p) => p.id === open)
  if (person)
    return (
      <div className="h-full overflow-y-auto px-4 pb-4">
        <button type="button" onClick={() => setOpen(null)} className="mb-3 h-9 rounded-[8px] px-2 text-[14px] font-medium text-ink hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
          ← All people
        </button>
        <ProfileCard person={person} compact onSelect={setOpen} />
      </div>
    )
  return (
    <div className="flex h-full flex-col">
      <div className="relative mx-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
        <label htmlFor="people-q" className="sr-only">
          Search people
        </label>
        <input id="people-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people or skills" className="h-11 w-full rounded-[10px] border border-line-strong pl-9 pr-3 text-[14.5px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45" />
      </div>
      <ul className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {list.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => setOpen(p.id)} className="flex w-full items-center gap-3 rounded-[12px] px-2 py-2 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
              <Avatar name={p.name} face={p.face} size={38} presence={p.presence} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14.5px] font-semibold text-ink">{p.name}</span>
                <span className="block truncate text-[12.5px] text-muted">{p.role}</span>
              </span>
              <span className={cx('text-[11.5px] font-medium', p.presence === 'online' || p.presence === 'on-shift' ? 'text-leaf' : 'text-faint')}>{presenceLabel[p.presence]}</span>
            </button>
          </li>
        ))}
        {!list.length ? <li className="px-3 py-8 text-center text-[14px] text-muted">Nobody matches “{q}”.</li> : null}
      </ul>
    </div>
  )
}
