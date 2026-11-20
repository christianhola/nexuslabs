import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Armchair, CalendarX2, Car, CheckCircle2, DoorOpen, Lock } from 'lucide-react'

import { Badge, IconChip } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { Segmented } from '../components/Segmented'
import { useToast } from '../components/Toast'
import type { ResourceKind } from '../data'
import { formatDay, relativeDay, todayKey } from '../lib/dates'
import { duration, ease } from '../lib/motion'
import { labelFor, myBookings, useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'

const icons = { desk: Armchair, room: DoorOpen, parking: Car, locker: Lock }
const tones = { desk: 'brand', room: 'teal', parking: 'slate', locker: 'amber' } as const

export function MyBookings() {
  const state = useAppState()
  const { cancel, restore, checkIn } = useActions()
  const toast = useToast()
  const [when, setWhen] = useState<'upcoming' | 'past'>('upcoming')
  const [kind, setKind] = useState<'all' | ResourceKind>('all')
  const today = todayKey()
  const all = myBookings(state)
  const list = all
    .filter((b) => (when === 'upcoming' ? b.date >= today : b.date < today))
    .filter((b) => kind === 'all' || b.kind === kind)
  if (when === 'past') list.reverse()
  const byDate = list.reduce<Record<string, typeof list>>((acc, b) => ((acc[b.date] ??= []).push(b), acc), {})

  return (
    <div className="mx-auto max-w-[880px]">
      <PageHeader title="My bookings" sub={`${all.filter((b) => b.date >= today).length} upcoming`} actions={<ButtonLink href="/app/floor" size="sm">Book a desk</ButtonLink>} />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Segmented label="When" value={when} onChange={setWhen} options={[{ value: 'upcoming', label: 'Upcoming' }, { value: 'past', label: 'Past' }]} />
        <Segmented
          label="Type"
          size="sm"
          className="max-w-full overflow-x-auto scrollbar-none"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'all', label: 'All' },
            { value: 'desk', label: 'Desks' },
            { value: 'room', label: 'Rooms' },
            { value: 'parking', label: 'Parking' },
            { value: 'locker', label: 'Lockers' },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<CalendarX2 />}
          title={when === 'upcoming' ? 'Nothing booked yet' : 'No past bookings'}
          body={when === 'upcoming' ? 'Pick a desk on the floor map, or a room from the planner.' : 'Bookings move here once their day has passed.'}
          action={when === 'upcoming' && <ButtonLink href="/app/floor" size="sm">Open floor map</ButtonLink>}
        />
      ) : (
        <div className="grid gap-5">
          {Object.entries(byDate).map(([date, items]) => {
            const d = formatDay(date)
            return (
              <section key={date} aria-label={relativeDay(date)} className="grid gap-2 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-4">
                <div className="flex items-baseline gap-2 sm:block sm:pt-2">
                  <p className="text-2xs font-semibold tracking-wider text-muted uppercase">{d.dow}</p>
                  <p className="text-h3 font-bold text-ink">{d.day}</p>
                  <p className="text-xs text-muted">{date === today ? 'Today' : d.month}</p>
                </div>
                <Card className="divide-y divide-line-soft">
                  <AnimatePresence initial={false}>
                    {items.map((b) => {
                      const Icon = icons[b.kind]
                      return (
                        <motion.div
                          key={b.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: duration.base, ease }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                            <IconChip tone={tones[b.kind]}>
                              <Icon />
                            </IconChip>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-fg">
                                {cap(labelFor(b))}
                                {b.title && <span className="font-normal text-muted"> · {b.title}</span>}
                              </p>
                              <p className="text-xs text-muted">
                                {b.start}–{b.end}
                              </p>
                            </div>
                            {b.checkedIn && (
                              <Badge tone="free">
                                <CheckCircle2 className="size-3" aria-hidden /> Checked in
                              </Badge>
                            )}
                            {when === 'upcoming' && (
                              <div className="flex gap-1.5">
                                {b.kind === 'desk' && b.date === today && !b.checkedIn && (
                                  <Button size="xs" className="max-md:h-10" onClick={() => (checkIn(b.id), toast({ tone: 'success', title: `Checked in at ${b.resourceId}` }))}>
                                    Check in
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="xs"
                                  className="max-md:h-10"
                                  aria-label={`Cancel ${labelFor(b)} on ${relativeDay(b.date)}`}
                                  onClick={() => {
                                    const removed = cancel(b.id)
                                    if (removed)
                                      toast({ tone: 'info', title: 'Booking cancelled', body: `${cap(labelFor(removed))} · ${relativeDay(removed.date)}`, action: { label: 'Undo', run: () => restore(removed) } })
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </Card>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
