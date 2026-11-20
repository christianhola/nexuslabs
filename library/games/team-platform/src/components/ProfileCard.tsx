import { Clock, MapPin, MessageSquare, Network } from 'lucide-react'

import { people, presenceLabel } from '../content'
import type { Person } from '../content'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'

export const byId = (id: string | null | undefined) => people.find((p) => p.id === id)
export const reportsOf = (id: string) => people.filter((p) => p.managerId === id)

/* A colleague's profile, as the app shows it. */
export function ProfileCard({ person, onSelect, onShowInChart, onMessage, compact }: { person: Person; onSelect?: (id: string) => void; onShowInChart?: (id: string) => void; onMessage?: (p: Person) => void; compact?: boolean }) {
  const manager = byId(person.managerId)
  const reports = reportsOf(person.id)
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Avatar name={person.name} face={person.face} size={compact ? 56 : 68} presence={person.presence} />
        <div className="min-w-0">
          <p className="font-display text-[21px] font-semibold leading-tight tracking-[-0.02em] text-ink">{person.name}</p>
          <p className="text-[15px] text-muted">{person.role}</p>
          {person.pronouns ? <p className="text-[13px] text-faint">{person.pronouns}</p> : null}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone="mint">{presenceLabel[person.presence]}</Badge>
        <Badge>{person.dept}</Badge>
        <Badge tone="outline">
          <MapPin className="size-3.5" aria-hidden />
          {person.location}
        </Badge>
        <Badge tone="outline">
          <Clock className="size-3.5" aria-hidden />
          Since {person.since}
        </Badge>
      </div>
      <div>
        <p className="text-[13px] font-medium text-faint">Skills and languages</p>
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {person.skills.map((s) => (
            <span key={s} className="rounded-[7px] border border-line px-2 py-1 text-[13px] text-body">
              {s}
            </span>
          ))}
        </p>
      </div>
      {manager || reports.length ? (
        <div className="grid gap-3 border-t border-line pt-4">
          {manager ? (
            <div>
              <p className="text-[13px] font-medium text-faint">Reports to</p>
              <button type="button" onClick={() => onSelect?.(manager.id)} className="mt-1.5 flex w-full items-center gap-2.5 rounded-[10px] p-1.5 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
                <Avatar name={manager.name} face={manager.face} size={34} />
                <span className="min-w-0">
                  <span className="block truncate text-[14.5px] font-medium text-ink">{manager.name}</span>
                  <span className="block truncate text-[13px] text-muted">{manager.role}</span>
                </span>
              </button>
            </div>
          ) : null}
          {reports.length ? (
            <div>
              <p className="text-[13px] font-medium text-faint">
                {reports.length} direct report{reports.length > 1 ? 's' : ''}
              </p>
              <ul className="mt-1.5">
                {reports.map((r) => (
                  <li key={r.id}>
                    <button type="button" onClick={() => onSelect?.(r.id)} className="flex w-full items-center gap-2.5 rounded-[10px] p-1.5 text-left hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
                      <Avatar name={r.name} face={r.face} size={34} presence={r.presence} />
                      <span className="min-w-0">
                        <span className="block truncate text-[14.5px] font-medium text-ink">{r.name}</span>
                        <span className="block truncate text-[13px] text-muted">{r.role}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {onMessage || onShowInChart ? (
        <div className="flex flex-wrap gap-2">
          {onMessage ? (
            <Button size="sm" variant="dark" icon={<MessageSquare className="size-4" aria-hidden />} onClick={() => onMessage(person)}>
              Message
            </Button>
          ) : null}
          {onShowInChart ? (
            <Button size="sm" variant="soft" icon={<Network className="size-4" aria-hidden />} onClick={() => onShowInChart(person.id)}>
              Show in org chart
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
