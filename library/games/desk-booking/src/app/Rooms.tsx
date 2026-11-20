import { useEffect, useState, type MouseEvent } from 'react'
import { Plus, Users } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DateStepper } from '../components/DatePicker'
import { useToast } from '../components/Toast'
import { DAY_END, DAY_START, ME, rooms } from '../data'
import { cn } from '../lib/cn'
import { fromMinutes, relativeDay, todayKey, toMinutes } from '../lib/dates'
import { useSearch } from '../lib/router'
import { floorName, personName, useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'
import { BookDialog, type BookTarget } from './BookDialog'

const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i)
const SPAN = (DAY_END - DAY_START) * 60
const pct = (hhmm: string) => ((toMinutes(hhmm) - DAY_START * 60) / SPAN) * 100

/** Meeting rooms on a day timeline: click empty track to book, your blocks cancel. */
export function Rooms() {
  const state = useAppState()
  const { cancel, restore } = useActions()
  const toast = useToast()
  const params = new URLSearchParams(useSearch())
  const focusRoom = params.get('room') ?? undefined
  const [date, setDate] = useState(params.get('date') && params.get('date')! >= todayKey() ? params.get('date')! : todayKey())
  const [target, setTarget] = useState<BookTarget | null>(null)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(t)
  }, [])
  useEffect(() => {
    if (focusRoom) document.getElementById(`room-${focusRoom}`)?.scrollIntoView({ block: 'center' })
  }, [focusRoom])

  const day = state.bookings.filter((b) => b.kind === 'room' && b.date === date)
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const showNow = date === todayKey() && nowMin > DAY_START * 60 && nowMin < DAY_END * 60

  function nextFree(roomId: string) {
    let m = date === todayKey() ? Math.max(DAY_START * 60, Math.ceil(nowMin / 30) * 30) : 9 * 60
    const taken = day.filter((b) => b.resourceId === roomId)
    while (m + 60 <= DAY_END * 60) {
      const s = fromMinutes(m)
      const e = fromMinutes(m + 60)
      if (!taken.some((b) => b.start < e && s < b.end)) return { start: s, end: e }
      m += 30
    }
    return { start: '09:00', end: '10:00' }
  }

  function clickTrack(e: MouseEvent<HTMLDivElement>, roomId: string) {
    if ((e.target as HTMLElement).closest('button')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    const m = Math.min(DAY_END * 60 - 60, Math.floor((DAY_START * 60 + ratio * SPAN) / 30) * 30)
    setTarget({ kind: 'room', resourceId: roomId, date, start: fromMinutes(m), end: fromMinutes(m + 60) })
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader title="Meeting rooms" sub={`${rooms.length} rooms · ${day.length} meetings ${relativeDay(date).toLowerCase()}`} actions={<DateStepper value={date} onChange={setDate} />} />

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-line bg-canvas">
              <div className="px-4 py-2 text-2xs font-semibold tracking-wider text-muted uppercase">Room</div>
              <div className="relative h-8">
                {HOURS.map((h) => (
                  <span key={h} className="absolute top-2 -translate-x-1/2 text-2xs font-medium text-muted tabular-nums first:translate-x-0" style={{ left: `${((h - DAY_START) / (DAY_END - DAY_START)) * 100}%` }}>
                    {String(h).padStart(2, '0')}:00
                  </span>
                ))}
              </div>
            </div>
            {rooms.map((r) => {
              const blocks = day.filter((b) => b.resourceId === r.id)
              return (
                <div key={r.id} id={`room-${r.id}`} className={cn('grid grid-cols-[180px_minmax(0,1fr)] border-b border-line-soft last:border-b-0', focusRoom === r.id && 'bg-brand-tint')}>
                  <div className="flex items-center justify-between gap-2 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg">{r.name}</p>
                      <p className="flex items-center gap-1 text-2xs text-muted">
                        <Users aria-hidden className="size-3" /> {r.capacity} · {floorName(r.floorId)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="!size-10 !px-0 md:!size-7"
                      aria-label={`Book ${r.name}`}
                      onClick={() => setTarget({ kind: 'room', resourceId: r.id, date, ...nextFree(r.id) })}
                    >
                      <Plus className="size-4" aria-hidden />
                    </Button>
                  </div>
                  <div
                    className="group relative cursor-copy border-l border-line-soft"
                    style={{ backgroundImage: 'linear-gradient(to right, var(--color-line-soft) 1px, transparent 1px)', backgroundSize: `${100 / (DAY_END - DAY_START)}% 100%` }}
                    onClick={(e) => clickTrack(e, r.id)}
                  >
                    {blocks.map((b) => {
                      const mine = b.personId === ME
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            if (!mine) {
                              toast({ tone: 'info', title: `${r.name} is booked ${b.start}–${b.end}`, body: `${b.title ?? 'Meeting'} · ${personName(b.personId)}` })
                              return
                            }
                            const removed = cancel(b.id)
                            if (removed) toast({ tone: 'info', title: `Cancelled ${b.title ?? 'meeting'}`, action: { label: 'Undo', run: () => restore(removed) } })
                          }}
                          className={cn(
                            'absolute inset-y-1.5 overflow-hidden rounded-sm px-2 text-left animate-fade-in transition-shadow hover:shadow-soft',
                            mine ? 'bg-brand-soft text-brand-press ring-1 ring-brand-bright/50 ring-inset' : 'bg-teal-soft text-[#0c6f67] ring-1 ring-teal/30 ring-inset',
                          )}
                          style={{ left: `${pct(b.start)}%`, width: `${pct(b.end) - pct(b.start)}%` }}
                        >
                          <span className="block truncate text-xs font-semibold">{b.title ?? 'Meeting'}</span>
                          <span className="block truncate text-2xs">
                            {b.start}–{b.end} · {mine ? 'You' : personName(b.personId).split(' ')[0]}
                          </span>
                          <span className="sr-only">{mine ? ', yours: press to cancel' : `, booked by ${personName(b.personId)}`}</span>
                        </button>
                      )
                    })}
                    {showNow && (
                      <span aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-brand-bright" style={{ left: `${((nowMin - DAY_START * 60) / SPAN) * 100}%` }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-line-soft px-4 py-3 text-xs text-muted">
          <Badge tone="brand">Yours</Badge>
          <Badge tone="teal">Booked</Badge>
          <span>Click an empty slot to book; click your own meeting to cancel it.</span>
        </div>
      </Card>

      <BookDialog target={target} onClose={() => setTarget(null)} />
    </div>
  )
}
