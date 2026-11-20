import { useEffect, useMemo, useState } from 'react'
import { Armchair, List, Map as MapIcon, MapPin, X } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardTitle } from '../components/Card'
import { DateStepper } from '../components/DatePicker'
import { EmptyState } from '../components/EmptyState'
import { Segmented } from '../components/Segmented'
import { TimeRange } from '../components/TimeRange'
import { useToast } from '../components/Toast'
import { ME, floors, people, rooms } from '../data'
import { overlaps, relativeDay, todayKey } from '../lib/dates'
import { navigate, useSearch } from '../lib/router'
import { useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'
import { BookDialog, type BookTarget } from './BookDialog'
import { FloorPlan, Legend, type DeskStatus } from './FloorPlan'

export function FloorMap() {
  const state = useAppState()
  const { cancel, restore } = useActions()
  const toast = useToast()
  const search = useSearch()
  const params = new URLSearchParams(search)
  const focusDesk = params.get('desk') ?? undefined
  const [floorId, setFloorId] = useState(() => state.desks.find((d) => d.id === focusDesk)?.floorId ?? 'ground')
  const [date, setDate] = useState(todayKey())
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('17:00')
  const [view, setView] = useState<'map' | 'list'>('map')
  const [selected, setSelected] = useState<string | undefined>(focusDesk)
  const [target, setTarget] = useState<BookTarget | null>(null)

  useEffect(() => {
    if (!focusDesk) return
    const d = state.desks.find((x) => x.id === focusDesk)
    if (d) {
      setFloorId(d.floorId)
      setSelected(d.id)
      setView('map')
    }
    // Only when the URL asks for a desk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusDesk])

  const window_ = useMemo(
    () => state.bookings.filter((b) => b.date === date && overlaps(b.start, b.end, start, end)),
    [state.bookings, date, start, end],
  )
  const holder = (id: string) => window_.find((b) => b.resourceId === id)?.personId
  const statusOf = (d: { id: string }): DeskStatus => {
    const h = holder(d.id)
    return !h ? 'free' : h === ME ? 'mine' : 'busy'
  }
  const floorDesks = state.desks.filter((d) => d.floorId === floorId)
  const free = floorDesks.filter((d) => statusOf(d) === 'free')
  const sel = state.desks.find((d) => d.id === selected)
  const selBooking = sel ? window_.find((b) => b.resourceId === sel.id) : undefined
  const selPerson = selBooking ? people.find((p) => p.id === selBooking.personId) : undefined

  function openDesk(id: string) {
    setSelected(id)
    if (statusOf({ id }) === 'free') setTarget({ kind: 'desk', resourceId: id, date, start, end })
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Floor map"
        sub={`${free.length} of ${floorDesks.length} desks free on the ${floors.find((f) => f.id === floorId)?.name.toLowerCase()}, ${relativeDay(date).toLowerCase()} ${start}–${end}`}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented label="Floor" value={floorId} onChange={(v) => setFloorId(v)} options={floors.map((f) => ({ value: f.id, label: f.name }))} />
        <DateStepper value={date} onChange={setDate} />
        <TimeRange compact start={start} end={end} onChange={(s, e) => (setStart(s), setEnd(e))} />
        <Segmented
          className="ml-auto"
          label="View"
          value={view}
          onChange={setView}
          options={[
            { value: 'map', label: 'Map', icon: <MapIcon aria-hidden /> },
            { value: 'list', label: 'List', icon: <List aria-hidden /> },
          ]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="overflow-hidden">
          {view === 'map' ? (
            <>
              <div className="overflow-x-auto blueprint bg-canvas p-3 sm:p-4">
                <FloorPlan
                  className="min-w-[860px] md:min-w-[680px]"
                  floorId={floorId}
                  desks={state.desks}
                  statusOf={statusOf}
                  holderOf={holder}
                  roomBusy={(rid) => window_.find((b) => b.resourceId === rid)}
                  selected={selected}
                  highlight={focusDesk}
                  onDesk={(d) => openDesk(d.id)}
                  onRoom={(rid) => navigate(`/app/rooms?room=${rid}&date=${date}`)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-soft px-4 py-3">
                <Legend />
                <p className="text-xs text-muted">Click a green desk to book it. Rooms open the room planner.</p>
              </div>
            </>
          ) : free.length === 0 ? (
            <EmptyState className="m-4" icon={<Armchair />} title="No free desks" body="Try another time or the other floor." />
          ) : (
            <ul className="divide-y divide-line-soft">
              {floorDesks.map((d) => {
                const st = statusOf(d)
                const p = people.find((x) => x.id === holder(d.id))
                return (
                  <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                    <span className="w-12 text-sm font-bold text-ink">{d.id}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted">
                      {d.zone} · {d.features.join(', ')}
                    </span>
                    {st === 'free' ? (
                      <Button size="xs" className="max-md:h-10" onClick={() => openDesk(d.id)}>
                        Book
                      </Button>
                    ) : (
                      <Badge tone={st === 'mine' ? 'brand' : 'busy'}>{st === 'mine' ? 'Yours' : p?.name ?? 'Booked'}</Badge>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Card>

        <Card className="h-fit p-4">
          <CardTitle
            action={
              sel && (
                <Button variant="ghost" size="xs" aria-label="Clear selection" className="max-md:h-10" onClick={() => (setSelected(undefined), focusDesk && navigate('/app/floor', { replace: true }))}>
                  <X className="size-3.5" aria-hidden />
                </Button>
              )
            }
          >
            {sel ? `Desk ${sel.id}` : 'Details'}
          </CardTitle>
          {!sel ? (
            <p className="mt-2 text-xs text-muted">Select a desk to see who’s there and what it has. Rooms on this floor: {rooms.filter((r) => r.floorId === floorId).map((r) => r.name).join(', ')}.</p>
          ) : (
            <div className="mt-3 grid gap-3">
              <p className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin aria-hidden className="size-3.5" /> {floors.find((f) => f.id === sel.floorId)?.name} · {sel.zone}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {sel.features.map((f) => (
                  <Badge key={f}>{f}</Badge>
                ))}
              </div>
              {selPerson ? (
                <div className="flex items-center gap-2.5 rounded-sm bg-canvas p-2.5 ring-1 ring-line-soft">
                  <Avatar person={selPerson} size={32} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg">{selPerson.id === ME ? 'You' : selPerson.name}</p>
                    <p className="text-xs text-muted">
                      {selBooking!.start}–{selBooking!.end} · {selPerson.team}
                    </p>
                  </div>
                </div>
              ) : (
                <Badge tone="free" dot className="w-fit">
                  Available {start}–{end}
                </Badge>
              )}
              {selBooking?.personId === ME ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    const removed = cancel(selBooking.id)
                    if (removed) toast({ tone: 'info', title: `Cancelled desk ${removed.resourceId}`, action: { label: 'Undo', run: () => restore(removed) } })
                  }}
                >
                  Cancel my booking
                </Button>
              ) : (
                !selBooking && <Button size="sm" onClick={() => openDesk(sel.id)}>Book {sel.id}</Button>
              )}
            </div>
          )}
        </Card>
      </div>

      <BookDialog target={target} onClose={() => setTarget(null)} />
    </div>
  )
}
