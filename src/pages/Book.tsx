import { CalendarCheck, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Button, ButtonLink } from '../components/Button'
import { Checkbox, ChoiceChips, SelectField, TextArea, TextField } from '../components/Field'
import { Label } from '../components/Label'
import { Modal } from '../components/Modal'
import { Photo } from '../components/Photo'
import { Stepper } from '../components/Stepper'
import { useToast } from '../components/Toast'
import { BOOK, PACKAGES, ROOM_TYPES, STYLES } from '../content'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { longDate, money } from '../lib/format'
import { useBooking, useBookingDraft, useQuiz, useSaved, type ConfirmedBooking } from '../lib/store'
import { addDays, isOpenDay, todayIso, validateBookingStep, type BookingInput, type FieldErrors } from '../shared/validation'

type Slot = { time: string; available: boolean }
type SlotState = { status: 'idle' } | { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; slots: Slot[] }

const STEP_FIELDS: (keyof BookingInput)[][] = [
  ['package', 'format'],
  ['rooms', 'property', 'budget', 'postcode'],
  ['date', 'time'],
  ['name', 'email', 'phone', 'notes', 'style', 'savedRooms'],
]

function Summary({ draft }: { draft: BookingInput }) {
  const pkg = PACKAGES.find((p) => p.id === draft.package)
  const rows = [
    { label: 'Package', value: pkg?.name },
    { label: 'Where', value: BOOK.formats.find((f) => f.id === draft.format)?.label },
    { label: 'Rooms', value: draft.rooms?.length ? draft.rooms.join(', ') : undefined },
    { label: 'Property', value: [draft.property, draft.postcode?.toUpperCase()].filter(Boolean).join(', ') || undefined },
    { label: 'Budget', value: draft.budget },
    { label: 'When', value: draft.date ? `${longDate(draft.date)}${draft.time ? ` at ${draft.time}` : ''}` : undefined },
  ]
  return (
    <aside aria-label="Your booking so far" className="rounded-[var(--radius-md)] bg-card p-5 shadow-[var(--shadow-inset)]">
      {pkg ? <Photo name={pkg.image} alt="" className="aspect-[16/10] rounded-[var(--radius-sm)]" /> : <div className="aspect-[16/10] rounded-[var(--radius-sm)] bg-paper-2" />}
      <dl className="mt-5 flex flex-col">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 border-b border-line py-2.5 text-[14px] last:border-0">
            <dt className="text-muted">{r.label}</dt>
            <dd className={cx('text-right font-medium', !r.value && 'font-normal text-muted')}>{r.value ?? 'Not chosen'}</dd>
          </div>
        ))}
      </dl>
      {pkg && (
        <p className="mt-4 flex items-baseline justify-between border-t border-ink pt-4">
          <span className="text-[14px] text-muted">{pkg.from ? 'Fees from' : 'Fee'}</span>
          <span className="text-[28px] font-medium tracking-[-0.045em] tabular-nums">
            {money(pkg.id === 'room' ? pkg.price * Math.max(1, draft.rooms?.length ?? 1) : pkg.price)}
          </span>
        </p>
      )}
    </aside>
  )
}

function DayPicker({ value, onChange, error }: { value?: string; onChange: (iso: string) => void; error?: string }) {
  const today = todayIso()
  const days = useMemo(() => Array.from({ length: 21 }, (_, i) => addDays(today, i + 1)), [today])
  return (
    <fieldset aria-describedby={error ? 'day-msg' : undefined}>
      <legend className="mb-3 text-[14px] font-medium text-ink-2">Day</legend>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {days.map((iso) => {
          const d = new Date(iso + 'T12:00:00Z')
          const open = isOpenDay(iso)
          const selected = value === iso
          return (
            <button
              key={iso}
              type="button"
              disabled={!open}
              aria-pressed={selected}
              aria-label={`${longDate(iso)}${open ? '' : ', closed'}`}
              onClick={() => onChange(iso)}
              className={cx(
                'flex min-h-16 flex-col items-center justify-center rounded-[var(--radius-sm)] border text-center transition-colors duration-[var(--duration-fast)] disabled:cursor-not-allowed disabled:border-transparent disabled:bg-transparent disabled:text-line-strong',
                selected ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-card hover:border-ink',
              )}
            >
              <span className={cx('text-[12px]', selected ? 'text-paper/75' : 'text-muted', !open && 'text-line-strong')}>{d.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' })}</span>
              <span className="text-[20px] leading-tight font-medium tracking-[-0.03em] tabular-nums">{d.getUTCDate()}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[13px] text-muted">{BOOK.closed}</p>
      {error && (
        <p id="day-msg" className="mt-1 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function SlotPicker({ date, value, onChange, error }: { date?: string; value?: string; onChange: (t: string) => void; error?: string }) {
  const [state, setState] = useState<SlotState>({ status: 'idle' })
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    if (!date) return setState({ status: 'idle' })
    let alive = true
    setState({ status: 'loading' })
    fetch(`/api/slots?date=${encodeURIComponent(date)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error('bad')
        const json = (await r.json()) as { slots: Slot[] }
        if (alive) setState({ status: 'ready', slots: json.slots })
      })
      .catch(() => alive && setState({ status: 'error', message: 'We could not load times. Check your connection.' }))
    return () => {
      alive = false
    }
  }, [date, retry])

  return (
    <fieldset aria-describedby={error ? 'time-msg' : undefined} aria-busy={state.status === 'loading'}>
      <legend className="mb-3 text-[14px] font-medium text-ink-2">Time</legend>
      {state.status === 'idle' && <p className="text-[14px] text-muted">Choose a day to see times.</p>}
      {state.status === 'loading' && (
        <div className="flex flex-wrap gap-2" aria-label="Loading times">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="skeleton round h-10 w-20 rounded-full" />
          ))}
        </div>
      )}
      {state.status === 'error' && (
        <div role="alert" className="flex flex-wrap items-center gap-3 text-[14px] text-danger">
          {state.message}
          <Button size="sm" variant="outline" onClick={() => setRetry((n) => n + 1)}>
            Try again
          </Button>
        </div>
      )}
      {state.status === 'ready' &&
        (state.slots.some((s) => s.available) ? (
          <div className="flex flex-wrap gap-2">
            {state.slots.map((s) => (
              <label key={s.time} className="relative">
                <input type="radio" name="time" value={s.time} checked={value === s.time} disabled={!s.available} onChange={() => onChange(s.time)} className="peer sr-only" />
                <span className="round inline-flex min-h-10 cursor-pointer items-center rounded-full border border-line-strong bg-card px-4 text-[14px] font-medium tabular-nums transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink peer-disabled:cursor-not-allowed peer-disabled:border-line peer-disabled:bg-transparent peer-disabled:text-muted peer-disabled:line-through">
                  {s.time}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="text-[14px] text-muted">{BOOK.noSlots}</p>
        ))}
      {error && (
        <p id="time-msg" className="mt-2 text-[13px] font-medium text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}

function Existing({ booking, onCancel, onNew }: { booking: ConfirmedBooking; onCancel: () => void; onNew: () => void }) {
  const pkg = PACKAGES.find((p) => p.id === booking.package)
  const [confirm, setConfirm] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => heading.current?.focus(), [])
  return (
    <section className="container-page grid gap-10 pt-32 pb-24 md:grid-cols-12 md:pt-40">
      <div className="md:col-span-7">
        <Label>
          <CalendarCheck className="size-4 text-olive" strokeWidth={1.75} aria-hidden /> Reference {booking.reference}
        </Label>
        <h1 ref={heading} tabIndex={-1} className="font-display mt-5 text-[clamp(3rem,7vw,7rem)] text-balance focus:outline-none">
          {BOOK.existingTitle}
        </h1>
        <p className="mt-6 max-w-lg text-[17px] leading-snug text-ink-2">{BOOK.successBody}</p>
        <dl className="mt-8 grid max-w-lg grid-cols-2 gap-4 border-t border-ink pt-5">
          <div>
            <dt className="label-sm text-muted">When</dt>
            <dd className="mt-0.5 font-medium">
              {booking.date && longDate(booking.date)} at {booking.time}
            </dd>
          </div>
          <div>
            <dt className="label-sm text-muted">Package</dt>
            <dd className="mt-0.5 font-medium">{pkg?.name}</dd>
          </div>
          <div>
            <dt className="label-sm text-muted">Where</dt>
            <dd className="mt-0.5 font-medium">{BOOK.formats.find((f) => f.id === booking.format)?.label}</dd>
          </div>
          <div>
            <dt className="label-sm text-muted">Rooms</dt>
            <dd className="mt-0.5 font-medium">{booking.rooms?.join(', ')}</dd>
          </div>
        </dl>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => setConfirm(true)}>
            {BOOK.cancel}
          </Button>
          <Button variant="ghost" onClick={onNew}>
            Book another
          </Button>
        </div>
      </div>
      {pkg && <Photo name={pkg.image} alt="" className="aspect-[4/5] md:col-span-4 md:col-start-9" />}
      <Modal open={confirm} onClose={() => setConfirm(false)} title={BOOK.cancel} description={BOOK.cancelConfirm}>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Keep it
          </Button>
          <Button
            onClick={() => {
              setConfirm(false)
              onCancel()
            }}
          >
            Cancel booking
          </Button>
        </div>
      </Modal>
    </section>
  )
}

export function Book() {
  const [params] = useSearchParams()
  const [draft, setDraft] = useBookingDraft()
  const [booking, setBooking] = useBooking()
  const [quiz] = useQuiz()
  const { ids: savedIds } = useSaved()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [justBooked, setJustBooked] = useState(false)
  const [attachQuiz, setAttachQuiz] = useState(true)
  const [attachBoard, setAttachBoard] = useState(true)
  const stepHeading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // Prefill the package from ?package= links on the services page and quiz.
  useEffect(() => {
    const p = params.get('package')
    if (p && PACKAGES.some((x) => x.id === p) && draft.package !== p) setDraft((d) => ({ ...d, package: p, format: d.format ?? 'home' }))
    // Only on arrival.
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    stepHeading.current?.focus()
  }, [step])

  const set = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    setDraft((d) => ({ ...d, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  if (booking && !justBooked)
    return (
      <Existing
        booking={booking}
        onCancel={() => {
          setBooking(null)
          toast('Your consultation was cancelled')
        }}
        onNew={() => setBooking(null)}
      />
    )

  if (booking && justBooked)
    return (
      <section className="container-page pt-32 pb-24 md:pt-40" aria-live="polite">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl">
          <span className="round grid size-14 place-items-center rounded-full bg-olive text-snow">
            <Check className="size-6" strokeWidth={2} aria-hidden />
          </span>
          <h1 className="font-display mt-8 text-[clamp(3rem,8vw,8rem)]">{BOOK.successTitle}</h1>
          <p className="mt-6 text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] tracking-[-0.03em]">
            {booking.date && longDate(booking.date)} at {booking.time}. Reference <strong className="font-semibold">{booking.reference}</strong>.
          </p>
          <p className="mt-4 max-w-lg text-[16px] text-ink-2">{BOOK.successBody}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/portfolio" icon>
              Keep browsing rooms
            </ButtonLink>
            <Button variant="outline" onClick={() => setJustBooked(false)}>
              Manage booking
            </Button>
          </div>
        </motion.div>
      </section>
    )

  const payload = (): BookingInput => ({
    ...draft,
    style: attachQuiz && quiz.result ? quiz.result : undefined,
    savedRooms: attachBoard && savedIds.length ? savedIds : undefined,
  })

  const next = () => {
    const e = validateBookingStep(step, payload())
    setErrors(e)
    if (Object.keys(e).length) return
    setStep((s) => s + 1)
  }

  const submit = async () => {
    const body = payload()
    const e = validateBookingStep(3, body)
    setErrors(e)
    if (Object.keys(e).length) return
    setSubmitting(true)
    setFormError('')
    const res = await postJson<{ reference: string }>('/api/bookings', body)
    setSubmitting(false)
    if (!res.ok) {
      const fe = res.fieldErrors ?? {}
      setErrors(fe)
      setFormError(res.error)
      const target = STEP_FIELDS.findIndex((fields) => fields.some((f) => fe[f]))
      if (target >= 0 && target !== step) setStep(target)
      return
    }
    setBooking({ ...body, reference: res.data.reference, createdAt: Date.now() })
    setDraft(null)
    setJustBooked(true)
    window.scrollTo({ top: 0 })
  }

  const titles = ['Choose a package', 'Tell us about the rooms', 'Pick a time', 'How do we reach you?']

  return (
    <section className="container-page pt-28 pb-24 md:pt-36">
      <Label>{BOOK.label}</Label>
      <h1 className="font-display mt-5 animate-rise text-[clamp(3rem,7vw,7rem)] text-balance">{BOOK.title}</h1>
      <p className="mt-5 max-w-lg text-[17px] leading-snug text-ink-2">{BOOK.intro}</p>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Stepper steps={BOOK.steps} current={step} onSelect={setStep} />
          <form
            noValidate
            className="mt-10"
            onSubmit={(e) => {
              e.preventDefault()
              if (step < 3) next()
              else void submit()
            }}
          >
            <h2 ref={stepHeading} tabIndex={-1} className="text-[clamp(1.75rem,3vw,2.75rem)] leading-none font-medium tracking-[-0.045em] focus:outline-none">
              {titles[step]}
            </h2>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-col gap-8"
              >
                {step === 0 && (
                  <>
                    <fieldset aria-describedby={errors.package ? 'pkg-msg' : undefined}>
                      <legend className="mb-3 text-[14px] font-medium text-ink-2">Package</legend>
                      <div className="grid gap-2">
                        {PACKAGES.map((p) => (
                          <label key={p.id} className="relative block cursor-pointer">
                            <input type="radio" name="package" value={p.id} checked={draft.package === p.id} onChange={() => set('package', p.id)} className="peer sr-only" />
                            <span className="flex items-center gap-4 rounded-[var(--radius-md)] border border-line-strong bg-card p-4 transition-colors hover:border-ink peer-checked:border-ink peer-checked:shadow-[inset_0_0_0_1px_var(--color-ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-ink">
                              <span className="label-sm w-6 tabular-nums text-muted">{p.number}</span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-[18px] font-medium tracking-[-0.03em]">{p.name}</span>
                                <span className="block text-[13px] text-muted">{p.duration}</span>
                              </span>
                              <span className="text-right text-[18px] font-medium tracking-[-0.03em] tabular-nums">
                                {p.from && <span className="mr-1 text-[13px] font-normal text-muted">from</span>}
                                {money(p.price)}
                              </span>
                              <span className={cx('round grid size-6 shrink-0 place-items-center rounded-full border', draft.package === p.id ? 'border-ink bg-ink text-paper' : 'border-line-strong text-transparent')} aria-hidden>
                                <Check className="size-3.5" strokeWidth={2.5} />
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                      {errors.package && (
                        <p id="pkg-msg" className="mt-2 text-[13px] font-medium text-danger">
                          {errors.package}
                        </p>
                      )}
                    </fieldset>
                    <ChoiceChips
                      label="Where shall we meet?"
                      name="format"
                      options={BOOK.formats.map((f) => ({ value: f.id, label: f.label }))}
                      value={draft.format ?? ''}
                      onChange={(v) => set('format', v)}
                      error={errors.format}
                    />
                  </>
                )}

                {step === 1 && (
                  <>
                    <ChoiceChips
                      label="Which rooms?"
                      name="rooms"
                      multiple
                      options={ROOM_TYPES}
                      value={draft.rooms ?? []}
                      onChange={(v) => {
                        const cur = draft.rooms ?? []
                        set('rooms', cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v])
                      }}
                      error={errors.rooms}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <SelectField
                        label="Property"
                        options={BOOK.propertyTypes}
                        placeholder="Choose one"
                        value={draft.property ?? ''}
                        onChange={(e) => set('property', e.target.value)}
                        error={errors.property}
                      />
                      <TextField
                        label="Postcode"
                        autoComplete="postal-code"
                        value={draft.postcode ?? ''}
                        onChange={(e) => set('postcode', e.target.value)}
                        error={errors.postcode}
                        hint="So we can match you with a nearby designer"
                      />
                    </div>
                    <ChoiceChips label="Overall budget, including furniture and works" name="budget" options={BOOK.budgets} value={draft.budget ?? ''} onChange={(v) => set('budget', v)} error={errors.budget} />
                  </>
                )}

                {step === 2 && (
                  <>
                    <DayPicker
                      value={draft.date}
                      onChange={(iso) => {
                        setDraft((d) => ({ ...d, date: iso, time: undefined }))
                        setErrors((e) => ({ ...e, date: '', time: '' }))
                      }}
                      error={errors.date}
                    />
                    <SlotPicker date={draft.date} value={draft.time} onChange={(t) => set('time', t)} error={errors.time} />
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <TextField label="Full name" autoComplete="name" value={draft.name ?? ''} onChange={(e) => set('name', e.target.value)} error={errors.name} />
                      <TextField label="Email" type="email" autoComplete="email" value={draft.email ?? ''} onChange={(e) => set('email', e.target.value)} error={errors.email} />
                      <TextField label="Phone" type="tel" autoComplete="tel" optional value={draft.phone ?? ''} onChange={(e) => set('phone', e.target.value)} error={errors.phone} />
                    </div>
                    <TextArea
                      label="Anything we should know?"
                      optional
                      maxLength={2000}
                      value={draft.notes ?? ''}
                      onChange={(e) => set('notes', e.target.value)}
                      error={errors.notes}
                      placeholder="Timings, pets, the one thing that has to stay"
                    />
                    {(quiz.result || savedIds.length > 0) && (
                      <div className="flex flex-col gap-2 rounded-[var(--radius-md)] bg-olive-soft p-4">
                        {quiz.result && (
                          <Checkbox label={BOOK.attachQuiz} description={STYLES[quiz.result].name} checked={attachQuiz} onChange={(e) => setAttachQuiz(e.target.checked)} />
                        )}
                        {savedIds.length > 0 && (
                          <Checkbox
                            label={BOOK.attachBoard}
                            description={`${savedIds.length} saved ${savedIds.length === 1 ? 'room' : 'rooms'}`}
                            checked={attachBoard}
                            onChange={(e) => setAttachBoard(e.target.checked)}
                          />
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {formError && (
              <p role="alert" className="mt-6 rounded-[var(--radius-sm)] bg-danger/8 px-4 py-3 text-[14px] font-medium text-danger">
                {formError}
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className={cx(step === 0 && 'invisible')}>
                Back
              </Button>
              <Button type="submit" icon loading={submitting} size="lg">
                {step < 3 ? 'Continue' : 'Request consultation'}
              </Button>
            </div>
          </form>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <div className="lg:sticky lg:top-24">
            <Summary draft={draft} />
          </div>
        </div>
      </div>
    </section>
  )
}
