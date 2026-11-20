import { useEffect, useRef, useState } from 'react'
import { Armchair, Car, DoorOpen, Lock, MapPin, Users } from 'lucide-react'

import { Badge, IconChip } from '../components/Badge'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { Field, Input } from '../components/Field'
import { DateStepper } from '../components/DatePicker'
import { TimeRange } from '../components/TimeRange'
import { useToast } from '../components/Toast'
import { lockers, parking, rooms, type ResourceKind } from '../data'
import { relativeDay } from '../lib/dates'
import { floorName, labelFor, personName, useActions, useAppState, type BookResult } from '../lib/store'

export type BookTarget = { kind: ResourceKind; resourceId: string; date: string; start: string; end: string }

const icons = { desk: Armchair, room: DoorOpen, parking: Car, locker: Lock }
const tones = { desk: 'brand', room: 'teal', parking: 'slate', locker: 'amber' } as const

/** One booking dialog for every resource kind, with live conflict checking. */
export function BookDialog({ target, onClose, onBooked }: { target: BookTarget | null; onClose: () => void; onBooked?: (r: Extract<BookResult, { ok: true }>) => void }) {
  const state = useAppState()
  const { book, cancel, restore } = useActions()
  const toast = useToast()
  const [draft, setDraft] = useState<BookTarget | null>(target)
  const [title, setTitle] = useState('')
  const [error, setError] = useState<string>()
  const [saving, setSaving] = useState(false)
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (target) {
      setDraft(target)
      setTitle('')
      setError(undefined)
      setSaving(false)
    }
  }, [target])

  const d = draft
  const Icon = d ? icons[d.kind] : Armchair
  const room = d?.kind === 'room' ? rooms.find((r) => r.id === d.resourceId) : undefined
  const desk = d?.kind === 'desk' ? state.desks.find((x) => x.id === d.resourceId) : undefined
  const spot = d?.kind === 'parking' ? parking.find((p) => p.id === d.resourceId) : d?.kind === 'locker' ? lockers.find((l) => l.id === d.resourceId) : undefined

  // Live conflict preview as the user changes the date or time.
  const clash = d
    ? state.bookings.find((b) => b.resourceId === d.resourceId && b.date === d.date && b.start < d.end && d.start < b.end)
    : undefined

  function submit() {
    if (!d) return
    if (d.kind === 'room' && !title.trim()) {
      setError('Give the meeting a title.')
      return
    }
    setSaving(true)
    setError(undefined)
    // A short pause so the loading state reads; swap for a real request.
    window.setTimeout(() => {
      const r = book({ ...d, title: d.kind === 'room' ? title.trim() : undefined })
      setSaving(false)
      if (!r.ok) {
        setError(r.error)
        return
      }
      toast({
        tone: 'success',
        title: `${cap(labelFor(r.booking))} booked`,
        body: `${relativeDay(r.booking.date)} · ${r.booking.start}–${r.booking.end}`,
        action: {
          label: 'Undo',
          run: () => {
            const removed = cancel(r.booking.id)
            if (removed) toast({ tone: 'info', title: 'Booking removed', action: { label: 'Redo', run: () => restore(removed) } })
          },
        },
      })
      onBooked?.(r)
      onClose()
    }, 450)
  }

  return (
    <Dialog
      open={!!target}
      onClose={onClose}
      title={d ? `Book ${labelFor(d)}` : 'Book'}
      initialFocus={confirmRef}
      description={
        d && (
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {desk && (
              <>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden /> {floorName(desk.floorId)} · {desk.zone}
                </span>
                {desk.features.map((f) => (
                  <Badge key={f}>{f}</Badge>
                ))}
              </>
            )}
            {room && (
              <>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" aria-hidden /> Up to {room.capacity}
                </span>
                <span>{floorName(room.floorId)}</span>
                {room.amenities.map((a) => (
                  <Badge key={a} tone="teal">
                    {a}
                  </Badge>
                ))}
              </>
            )}
            {spot && <span>{spot.note}</span>}
          </span>
        )
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button ref={confirmRef} onClick={submit} loading={saving} disabled={!!clash}>
            {saving ? 'Booking…' : 'Confirm booking'}
          </Button>
        </>
      }
    >
      {d && (
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!clash) submit()
          }}
        >
          <div className="flex items-center gap-3 rounded-sm bg-canvas p-3 ring-1 ring-line-soft">
            <IconChip tone={tones[d.kind]} size="lg">
              <Icon />
            </IconChip>
            <div className="min-w-0">
              <p className="text-base font-bold text-ink">{d.kind === 'room' ? room?.name : d.resourceId}</p>
              <p className="text-xs text-muted">
                {relativeDay(d.date)} · {d.start}–{d.end}
              </p>
            </div>
          </div>
          {d.kind === 'room' && (
            <Field label="Meeting title" error={error && !title.trim() ? error : undefined}>
              {(p) => <Input {...p} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly sync" autoComplete="off" />}
            </Field>
          )}
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold text-body">Day</span>
            <DateStepper value={d.date} onChange={(date) => setDraft({ ...d, date })} className="w-full justify-between" />
          </div>
          <div className="grid gap-1.5">
            <span className="text-xs font-semibold text-body">Time</span>
            <TimeRange start={d.start} end={d.end} invalid={!!clash} onChange={(start, end) => setDraft({ ...d, start, end })} />
          </div>
          {clash ? (
            <p role="alert" className="rounded-sm bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
              Taken: {clash.personId === 'u-lisa' ? 'you have' : `${personName(clash.personId)} has`} it {clash.start}–{clash.end}
              {clash.title ? ` (${clash.title})` : ''}. Pick another time.
            </p>
          ) : (
            error &&
            (d.kind !== 'room' || title.trim()) && (
              <p role="alert" className="rounded-sm bg-danger-soft px-3 py-2 text-xs font-medium text-danger">
                {error}
              </p>
            )
          )}
          <button type="submit" hidden />
        </form>
      )}
    </Dialog>
  )
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
