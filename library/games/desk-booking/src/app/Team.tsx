import { useState } from 'react'
import { MapPin, Search, Users } from 'lucide-react'

import { Avatar, AvatarStack } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Input, Select } from '../components/Field'
import { Segmented } from '../components/Segmented'
import { ME, people, teams } from '../data'
import { todayKey } from '../lib/dates'
import { bookingsOn, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'

export function Team() {
  const state = useAppState()
  const today = todayKey()
  const [q, setQ] = useState('')
  const [team, setTeam] = useState('all')
  const [scope, setScope] = useState<'in' | 'all'>('in')
  const desks = bookingsOn(state, today, 'desk')
  const deskOf = (id: string) => desks.find((b) => b.personId === id)
  const everyone = people.filter((p) => p.id !== ME)
  const inToday = everyone.filter((p) => deskOf(p.id))
  const list = everyone
    .filter((p) => scope === 'all' || deskOf(p.id))
    .filter((p) => team === 'all' || p.team === team)
    .filter((p) => `${p.name} ${p.role} ${p.team}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title="Team" sub={`${inToday.length} of ${everyone.length} teammates in the office today`} actions={<AvatarStack people={inToday} max={5} />} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented label="Show" value={scope} onChange={setScope} options={[{ value: 'in', label: 'In today' }, { value: 'all', label: 'Everyone' }]} />
        <Select aria-label="Team" value={team} onChange={(e) => setTeam(e.target.value)} className="w-[160px]">
          <option value="all">All teams</option>
          {teams.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <label className="relative ml-auto w-full sm:w-64">
          <span className="sr-only">Find a teammate</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a teammate" className="pl-9" />
        </label>
      </div>
      {list.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No one matches"
          body={scope === 'in' ? 'They may not be in today. Try Everyone.' : 'Try a different name or team.'}
          action={scope === 'in' && <Button variant="outline" size="sm" className="max-md:h-10" onClick={() => setScope('all')}>Show everyone</Button>}
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const b = deskOf(p.id)
            return (
              <li key={p.id}>
                <Card interactive className="flex h-full items-center gap-3 p-3.5">
                  <Avatar person={p} size={40} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{p.name}</p>
                    <p className="truncate text-xs text-muted">
                      {p.role} · {p.team}
                    </p>
                    <div className="mt-1.5">
                      {b ? (
                        <Badge tone="free" dot>
                          In · {b.resourceId} until {b.end}
                        </Badge>
                      ) : (
                        <Badge tone="busy">Remote today</Badge>
                      )}
                    </div>
                  </div>
                  {b && (
                    <ButtonLink href={`/app/floor?desk=${b.resourceId}`} variant="outline" size="sm" className="max-md:h-10" aria-label={`Find ${p.name} on the map`} icon={<MapPin className="size-3.5" aria-hidden />}>
                      Find
                    </ButtonLink>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
