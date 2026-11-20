import { AnimatePresence, motion } from 'motion/react'
import { CalendarCheck2, Car, CheckCircle2, Clock, Lock, MapPin, Monitor } from 'lucide-react'

import { AvatarStack } from '../components/Avatar'
import { Badge, IconChip, type Tone } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card, CardTitle } from '../components/Card'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../components/Toast'
import { ME, people } from '../data'
import { cn } from '../lib/cn'
import { formatLong, greeting, timeAgo, todayKey } from '../lib/dates'
import { duration, ease, spring } from '../lib/motion'
import { availability, bookingsOn, floorName, labelFor, useActions, useAppState } from '../lib/store'

export function Dashboard({ embedded }: { embedded?: boolean }) {
  const state = useAppState()
  const today = todayKey()
  const first = state.profile.name.split(' ')[0]
  const avail = availability(state, today)
  const mineToday = bookingsOn(state, today).filter((b) => b.personId === ME)
  const desk = mineToday.find((b) => b.kind === 'desk')
  const others = mineToday.filter((b) => b.kind !== 'desk')
  const inToday = people.filter((p) => p.id !== ME && bookingsOn(state, today, 'desk').some((b) => b.personId === p.id))

  return (
    <div className={cn(!embedded && 'mx-auto max-w-[1080px]')}>
      <h1 className={cn('font-bold tracking-[-0.02em] text-ink', embedded ? 'text-[19px] leading-[26px]' : 'text-[22px] leading-8')}>
        {embedded ? 'Good morning' : greeting()}, {first}
      </h1>
      <p className="mt-0.5 text-xs text-muted">{formatLong(today)}</p>

      <ResourceStrip
        className="mt-[15px]"
        items={[
          { tone: 'teal', icon: <Monitor />, n: avail.desks, label: 'desks' },
          { tone: 'slate', icon: <Car />, n: avail.parking, label: 'parking' },
          { tone: 'amber', icon: <Lock />, n: avail.lockers, label: 'lockers' },
        ]}
        embedded={embedded}
      />

      <div className={cn('mt-[14px] grid gap-[15px]', embedded ? 'grid-cols-[minmax(0,2.06fr)_minmax(0,1fr)]' : 'md:grid-cols-[minmax(0,2.06fr)_minmax(0,1fr)]')}>
        <Card rule className="min-h-[140px] px-[18px] pt-[15px] pb-[19px]">
          <CardTitle icon={<CalendarCheck2 aria-hidden className="size-[15px] text-brand-bright" strokeWidth={2} />}>Today’s booking</CardTitle>
          {desk ? (
            <TodayDesk id={desk.id} embedded={embedded} />
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">No desk booked for today.</p>
              <ButtonLink href="/app/floor" size="xs">
                Book a desk
              </ButtonLink>
            </div>
          )}
          {!embedded && others.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line-soft pt-3">
              <span className="text-xs text-muted">Also today</span>
              {others.map((b) => (
                <Badge key={b.id} tone={b.kind === 'room' ? 'teal' : b.kind === 'parking' ? 'slate' : 'amber'}>
                  {cap(labelFor(b))} · {b.start}
                </Badge>
              ))}
            </div>
          )}
        </Card>

        <Card className="px-[14px] pt-[15px] pb-[19px]">
          <CardTitle>Quick actions</CardTitle>
          <div className="mt-[10px] grid gap-[6px]">
            {[
              ['Book a desk', '/app/floor'],
              ...(embedded ? [] : [['Book a meeting room', '/app/rooms']]),
              ['View my bookings', '/app/bookings'],
              ['Find teammates', '/app/team'],
            ].map(([label, href]) =>
              embedded ? (
                <span key={label} className="flex h-[25px] items-center rounded-[3px] px-[10px] text-xs text-fg ring-1 ring-line ring-inset">
                  {label}
                </span>
              ) : (
                <ButtonLink key={label} href={href} variant="outline" size="sm" className="justify-start font-medium max-md:h-10">
                  {label}
                </ButtonLink>
              ),
            )}
          </div>
        </Card>
      </div>

      <div className={cn('mt-[14px] grid gap-[15px]', !embedded && 'md:grid-cols-[minmax(0,2.06fr)_minmax(0,1fr)]')}>
        <Card className="px-[14px] py-[19px]">
          <CardTitle>Recent activity</CardTitle>
          <ul className="mt-3 grid">
            {state.activity.slice(0, embedded ? 3 : 6).map((a) => (
              <li key={a.id} className="flex items-center gap-3 border-t border-line-soft py-2.5 first:border-t-0 first:pt-0">
                <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[a.tone])} />
                <span className="min-w-0 flex-1 truncate text-sm text-body">{a.text}</span>
                <span className="shrink-0 text-xs text-muted">{timeAgo(a.at)}</span>
              </li>
            ))}
          </ul>
        </Card>
        {!embedded && (
          <Card className="px-[14px] py-[19px]">
            <CardTitle action={<ButtonLink href="/app/team" variant="ghost" size="xs" className="max-md:h-10">See all</ButtonLink>}>Who’s in today</CardTitle>
            {inToday.length ? (
              <div className="mt-3 grid gap-3">
                <AvatarStack people={inToday} max={6} />
                <p className="text-xs text-muted">
                  {inToday.length} teammates are in. {inToday.filter((p) => p.team === state.profile.team).length} from {state.profile.team}.
                </p>
              </div>
            ) : (
              <EmptyState className="mt-3 py-6" icon={<MapPin />} title="Quiet day" body="Nobody else has booked a desk yet." />
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

const dot = { brand: 'bg-brand-bright', teal: 'bg-teal', slate: 'bg-slate', amber: 'bg-amber-icon', danger: 'bg-danger' }

export function ResourceStrip({ items, className, embedded }: { items: Array<{ tone: Tone; icon: React.ReactNode; n: number; label: string }>; className?: string; embedded?: boolean }) {
  return (
    <div className={cn('flex flex-wrap items-center gap-y-2 rounded-[3px] border border-line bg-surface px-[11px] py-[9px]', !embedded && 'max-sm:gap-x-5', className)}>
      {items.map((it, i) => (
        <div key={it.label} className="flex items-center">
          {i > 0 && <span aria-hidden className={cn("mx-[14px] h-4 w-px bg-line", !embedded && "max-sm:hidden")} />}
          <IconChip tone={it.tone} size="sm">
            {it.icon}
          </IconChip>
          <motion.span
            key={it.n}
            initial={embedded ? false : { y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: duration.base, ease }}
            className="ml-[10px] text-sm font-bold text-fg tabular-nums"
          >
            {it.n}
          </motion.span>
          <span className="ml-[7px] text-sm text-muted">{it.label}</span>
        </div>
      ))}
      {!embedded && <span className="ml-auto hidden text-xs text-muted sm:inline">available today</span>}
    </div>
  )
}

function TodayDesk({ id, embedded }: { id: string; embedded?: boolean }) {
  const state = useAppState()
  const { checkIn } = useActions()
  const toast = useToast()
  const b = state.bookings.find((x) => x.id === id)
  const desk = state.desks.find((d) => d.id === b?.resourceId)
  if (!b) return null
  return (
    <div className="mt-[4px] flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-[15px] leading-6 font-bold tracking-[0.02em] text-ink">{b.resourceId}</p>
        <p className="mt-[1px] flex flex-wrap items-center gap-x-[10px] gap-y-1 text-[11.5px] text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3" /> {desk ? floorName(desk.floorId) : 'Ground floor'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3" /> {b.start} – {b.end}
          </span>
        </p>
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        {b.checkedIn ? (
          <motion.div
            key="in"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={spring}
            className="flex items-center gap-2"
          >
            <span className="inline-flex h-[23px] items-center gap-1 rounded-[3px] bg-free-soft px-2 text-xs font-semibold text-[#0b6b53]">
              <CheckCircle2 aria-hidden className="size-3.5" /> Checked in
            </span>
            {!embedded && (
              <Button
                variant="ghost"
                size="xs"
                className="max-md:h-10"
                onClick={() => {
                  checkIn(b.id, false)
                  toast({ tone: 'info', title: `Checked out of ${b.resourceId}` })
                }}
              >
                Check out
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div key="out" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={spring}>
            <Button
              size="xs"
              className={cn('mt-[1px] h-[23px] rounded-[3px] px-[8px] text-xs shadow-none', !embedded && 'max-md:h-10')}
              tabIndex={embedded ? -1 : undefined}
              onClick={() => {
                checkIn(b.id, true)
                toast({ tone: 'success', title: `Checked in at ${b.resourceId}`, body: 'Have a good day in the office.' })
              }}
            >
              Check in
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

