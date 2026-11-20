import { useState } from 'react'
import { Armchair, ChevronLeft, ChevronRight } from 'lucide-react'

import { AvatarStack } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import { Card } from '../components/Card'
import { Segmented } from '../components/Segmented'
import { ME, people, teammatePatterns, type DayMode } from '../data'
import { cn } from '../lib/cn'
import { addDays, formatDay, todayKey, weekStart, weekdayIndex } from '../lib/dates'
import { isFree, useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'
import { BookDialog, type BookTarget } from './BookDialog'

/** Plan office / remote per weekday and see who from the team overlaps. */
export function Week() {
  const state = useAppState()
  const { setDay } = useActions()
  const today = todayKey()
  const [offset, setOffset] = useState(0)
  const [target, setTarget] = useState<BookTarget | null>(null)
  const mon = addDays(weekStart(today), offset * 7)
  const days = Array.from({ length: 5 }, (_, i) => addDays(mon, i))
  const officeDays = days.filter((d) => (state.week[d] ?? 'remote') === 'office').length

  function whoIn(date: string) {
    const booked = new Set(state.bookings.filter((b) => b.kind === 'desk' && b.date === date).map((b) => b.personId))
    return people.filter((p) => p.id !== ME && (booked.has(p.id) || teammatePatterns[p.id]?.includes(weekdayIndex(date))))
  }

  function suggestDesk(date: string) {
    const zone = state.profile.team === 'Design' ? 'Design' : state.profile.team === 'Engineering' ? 'Engineering' : 'Product'
    const pick = [...state.desks].sort((a, b) => Number(b.zone === zone) - Number(a.zone === zone)).find((d) => isFree(state, d.id, date, '09:00', '17:00'))
    if (pick) setTarget({ kind: 'desk', resourceId: pick.id, date, start: '09:00', end: '17:00' })
  }

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="My week"
        sub={`${officeDays} office ${officeDays === 1 ? 'day' : 'days'} planned`}
        actions={
          <div className="flex items-center gap-1">
            <IconButton label="Previous week" disabled={offset <= 0} onClick={() => setOffset((o) => o - 1)}>
              <ChevronLeft className="size-4" />
            </IconButton>
            <span className="min-w-[96px] text-center text-sm font-semibold text-fg">{offset === 0 ? 'This week' : offset === 1 ? 'Next week' : `In ${offset} weeks`}</span>
            <IconButton label="Next week" disabled={offset >= 3} onClick={() => setOffset((o) => o + 1)}>
              <ChevronRight className="size-4" />
            </IconButton>
          </div>
        }
      />
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {days.map((date) => {
          const mode: DayMode = state.week[date] ?? 'remote'
          const f = formatDay(date)
          const past = date < today
          const desk = state.bookings.find((b) => b.kind === 'desk' && b.personId === ME && b.date === date)
          const others = whoIn(date)
          const mates = others.filter((p) => p.team === state.profile.team)
          return (
            <li key={date}>
              <Card className={cn('flex h-full flex-col gap-3 p-3.5', date === today && 'ring-2 ring-brand-bright/60', past && 'bg-canvas')}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold text-fg">
                    {f.dow} <span className="text-muted">{f.day} {f.month}</span>
                  </p>
                  {date === today && <Badge tone="brand">Today</Badge>}
                </div>
                <Segmented
                  size="sm"
                  label={`${f.dow} ${f.day}: where`}
                  value={mode}
                  onChange={(v) => !past && setDay(date, v)}
                  className="w-full"
                  options={[
                    { value: 'office', label: 'Office' },
                    { value: 'remote', label: 'Remote' },
                    { value: 'off', label: 'Off' },
                  ]}
                />
                {mode === 'office' ? (
                  desk ? (
                    <Badge tone="brand" className="w-fit">
                      <Armchair className="size-3" aria-hidden /> {desk.resourceId} · {desk.start}–{desk.end}
                    </Badge>
                  ) : (
                    !past && (
                      <Button size="xs" variant="outline" className="w-fit max-md:h-10" onClick={() => suggestDesk(date)}>
                        Book a desk
                      </Button>
                    )
                  )
                ) : (
                  <p className="text-xs text-muted">{mode === 'remote' ? 'Working from home' : 'Out of office'}</p>
                )}
                <div className="mt-auto border-t border-line-soft pt-3">
                  <p className="mb-2 text-2xs font-semibold tracking-wider text-muted uppercase">In the office</p>
                  {others.length ? (
                    <>
                      <AvatarStack people={others} max={4} size={26} />
                      <p className="mt-1.5 text-2xs text-muted">
                        {mates.length} from {state.profile.team}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-muted">Nobody yet</p>
                  )}
                </div>
              </Card>
            </li>
          )
        })}
      </ul>
      <BookDialog target={target} onClose={() => setTarget(null)} />
    </div>
  )
}
