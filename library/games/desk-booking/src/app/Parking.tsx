import { useState } from 'react'
import { Car, Lock, Zap } from 'lucide-react'

import { Badge, IconChip } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardTitle } from '../components/Card'
import { DateStepper } from '../components/DatePicker'
import { useToast } from '../components/Toast'
import { ME, lockers, parking, type Spot } from '../data'
import { cn } from '../lib/cn'
import { relativeDay, todayKey } from '../lib/dates'
import { availability, labelFor, personName, useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'
import { BookDialog, type BookTarget } from './BookDialog'
import { ResourceStrip } from './Dashboard'

export function Parking() {
  const state = useAppState()
  const [date, setDate] = useState(todayKey())
  const [target, setTarget] = useState<BookTarget | null>(null)
  const avail = availability(state, date)
  return (
    <div className="mx-auto max-w-[1080px]">
      <PageHeader title="Parking & lockers" sub={`Book a bay or a locker for ${relativeDay(date).toLowerCase()}`} actions={<DateStepper value={date} onChange={setDate} />} />
      <ResourceStrip
        className="mb-5"
        items={[
          { tone: 'slate', icon: <Car />, n: avail.parking, label: 'parking bays' },
          { tone: 'amber', icon: <Lock />, n: avail.lockers, label: 'lockers' },
        ]}
      />
      <div className="grid gap-5">
        <SpotGrid kind="parking" title="Parking" spots={parking} date={date} onBook={setTarget} />
        <SpotGrid kind="locker" title="Lockers" spots={lockers} date={date} onBook={setTarget} />
      </div>
      <BookDialog target={target} onClose={() => setTarget(null)} />
    </div>
  )
}

function SpotGrid({ kind, title, spots, date, onBook }: { kind: 'parking' | 'locker'; title: string; spots: Spot[]; date: string; onBook: (t: BookTarget) => void }) {
  const state = useAppState()
  const { cancel, restore } = useActions()
  const toast = useToast()
  const day = state.bookings.filter((b) => b.kind === kind && b.date === date)
  const Icon = kind === 'parking' ? Car : Lock
  return (
    <Card className="p-4">
      <CardTitle icon={<IconChip tone={kind === 'parking' ? 'slate' : 'amber'} size="sm"><Icon /></IconChip>}>{title}</CardTitle>
      <ul className={cn('mt-4 grid gap-2.5', kind === 'parking' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-8')}>
        {spots.map((s) => {
          const b = day.find((x) => x.resourceId === s.id)
          const mine = b?.personId === ME
          return (
            <li
              key={s.id}
              className={cn(
                'flex flex-col gap-2 rounded-sm p-3 ring-1 ring-inset transition-colors duration-150',
                mine ? 'bg-brand-tint ring-brand-bright/40' : b ? 'bg-canvas ring-line-soft' : 'bg-surface ring-line hover:ring-[#cfd4dc]',
              )}
            >
              <div className="flex items-start justify-between gap-1">
                <p className="text-sm font-bold text-ink">{s.label.replace('Locker ', 'L')}</p>
                {s.note === 'EV charger' && <Zap aria-label="EV charger" className="size-3.5 text-amber-icon" />}
              </div>
              <p className="-mt-1.5 text-2xs text-muted">{s.note}</p>
              {mine ? (
                <Button
                  variant="outline"
                  size="xs"
                  className="max-md:h-10"
                  onClick={() => {
                    const removed = cancel(b!.id)
                    if (removed) toast({ tone: 'info', title: `Released ${labelFor(removed)}`, action: { label: 'Undo', run: () => restore(removed) } })
                  }}
                >
                  Release
                </Button>
              ) : b ? (
                <Badge tone="busy" className="h-7 justify-center max-md:h-10">{personName(b.personId).split(' ')[0]}</Badge>
              ) : (
                <Button size="xs" className="max-md:h-10" aria-label={`Book ${s.label}`} onClick={() => onBook({ kind, resourceId: s.id, date, start: '08:00', end: '18:00' })}>
                  Book
                </Button>
              )}
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
