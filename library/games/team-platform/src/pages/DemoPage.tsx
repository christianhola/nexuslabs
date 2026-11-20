import { CalendarCheck, CalendarPlus, Check } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Checkbox, Field, Input, Select, Textarea } from '../components/Field'
import { Notice } from '../components/Notice'
import { SectionHeading } from '../components/SectionHeading'
import { demo } from '../content'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { read, useStored, write } from '../lib/storage'
import { validateDemoDetails, validateDemoSlot } from '../lib/validate'
import type { DemoInput, Errors } from '../lib/validate'

type Booking = DemoInput & { ref: string }

const empty: DemoInput = { name: '', email: '', company: '', size: '', role: '', interests: [], date: '', slot: '', notes: '' }

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
function nextWeekdays(n: number) {
  const out: Date[] = []
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  while (out.length < n) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) out.push(new Date(d))
  }
  return out
}
const longDate = (s: string) => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

function icsHref(b: Booking) {
  const [y, m, d] = b.date.split('-')
  const [hh, mm] = b.slot.split(':')
  const start = `${y}${m}${d}T${hh}${mm}00`
  const endH = String(Number(hh) + (mm === '30' ? 1 : 0)).padStart(2, '0')
  const end = `${y}${m}${d}T${mm === '30' ? endH : hh}${mm === '30' ? '00' : '30'}00`
  const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Branchwork//Demo//EN', 'BEGIN:VEVENT', `UID:${b.ref}@branchwork.app`, `DTSTART;TZID=Europe/Berlin:${start}`, `DTEND;TZID=Europe/Berlin:${end}`, 'SUMMARY:Branchwork demo', `DESCRIPTION:Booking ${b.ref} for ${b.company}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n')
  return 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics)
}

export function DemoPage() {
  const [booking, setBooking] = useStored<Booking | null>('demo-booking', null)
  const [v, setV] = useState<DemoInput>(() => ({ ...empty, ...read<Partial<DemoInput>>('demo-draft', {}) }))
  const [step, setStep] = useState<1 | 2>(1)
  const [errors, setErrors] = useState<Errors<DemoInput>>({})
  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState<string>()
  const heading = useRef<HTMLHeadingElement>(null)
  const days = nextWeekdays(10)

  // Keep the draft (not the booking) so a reload does not lose typing.
  useEffect(() => {
    if (!booking) write('demo-draft', v)
  }, [v, booking])

  const set = <K extends keyof DemoInput>(k: K, val: DemoInput[K]) => {
    setV((x) => ({ ...x, [k]: val }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }
  const focusFirstError = () => requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateDemoDetails(v)
    setErrors(errs)
    if (Object.keys(errs).length) return focusFirstError()
    setStep(2)
    requestAnimationFrame(() => heading.current?.focus())
  }

  const confirm = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateDemoSlot(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setBusy(true)
    setServerError(undefined)
    const res = await postJson<{ ref: string }>('/api/demo', v)
    setBusy(false)
    if (!res.ok) {
      const errs2 = (res.errors ?? {}) as Errors<DemoInput>
      setErrors(errs2)
      setServerError(res.error)
      if (Object.keys(validateDemoDetails(v)).length) setStep(1)
      return
    }
    setBooking({ ...v, ref: res.data.ref })
    write('demo-draft', {})
    requestAnimationFrame(() => heading.current?.focus())
  }

  return (
    <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
      <div>
        <SectionHeading as="h1" eyebrow={demo.eyebrow} title={demo.title} body={demo.body} />
        <ul className="mt-8 space-y-3.5">
          {demo.expect.map((x) => (
            <li key={x} className="flex items-start gap-3 text-[16px] text-body">
              <span className="round mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-mint">
                <Check className="size-3.5" strokeWidth={3} aria-hidden />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-[24px] border-[1.5px] border-ink bg-card p-5 shadow-[8px_8px_0_var(--color-mint)] sm:p-8">
        {booking ? (
          <div>
            <span className="grid size-12 place-items-center rounded-[14px] border-[1.5px] border-ink bg-mint">
              <CalendarCheck className="size-6" aria-hidden />
            </span>
            <h2 ref={heading} tabIndex={-1} className="mt-5 font-display text-[30px] font-semibold tracking-[-0.035em] text-ink outline-none">
              You are booked, {booking.name.split(' ')[0]}
            </h2>
            <p className="mt-2 text-[16px] text-muted">We sent the invite to {booking.email}.</p>
            <dl className="mt-6 grid gap-4 rounded-[16px] bg-mist p-5 sm:grid-cols-2">
              {[
                ['When', `${longDate(booking.date)}, ${booking.slot} ${demo.timezone}`],
                ['Company', `${booking.company}, ${booking.size} employees`],
                ['Focus', booking.interests.length ? booking.interests.join(', ') : 'A full tour'],
                ['Reference', booking.ref],
              ].map(([k, val]) => (
                <div key={k}>
                  <dt className="text-[13px] font-medium text-faint">{k}</dt>
                  <dd className="mt-0.5 text-[15px] text-ink">{val}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={icsHref(booking)} variant="dark" icon={<CalendarPlus className="size-4" aria-hidden />} {...{ download: 'branchwork-demo.ics' }}>
                Add to calendar
              </Button>
              <Button
                variant="soft"
                onClick={() => {
                  setV({ ...booking, slot: '', date: '' })
                  setBooking(null)
                  setStep(2)
                }}
              >
                Reschedule
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setBooking(null)
                  setV(empty)
                  setStep(1)
                }}
              >
                Cancel booking
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ol className="mb-7 flex items-center gap-3 text-[14px]" aria-label="Steps">
              {['Your details', 'Pick a time'].map((s, i) => (
                <li key={s} className="flex items-center gap-2" aria-current={step === i + 1 ? 'step' : undefined}>
                  <span className={cx('round grid size-7 place-items-center rounded-full border-[1.5px] text-[13px] font-semibold', step > i ? 'border-ink bg-mint text-ink' : 'border-line-strong text-faint', step === i + 1 && 'border-ink')}>{step > i + 1 ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : i + 1}</span>
                  <span className={cx(step === i + 1 ? 'font-medium text-ink' : 'text-muted')}>{s}</span>
                  {i === 0 ? <span className="mx-1 h-px w-8 bg-line-strong" aria-hidden /> : null}
                </li>
              ))}
            </ol>
            {serverError ? (
              <Notice tone="bad" title="We could not book that" className="mb-5">
                {serverError}
              </Notice>
            ) : null}
            {step === 1 ? (
              <form onSubmit={next} noValidate className="grid gap-5">
                <h2 ref={heading} tabIndex={-1} className="sr-only">
                  Your details
                </h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name}>
                    {(c) => <Input {...c} autoComplete="name" value={v.name} onChange={(e) => set('name', e.target.value)} />}
                  </Field>
                  <Field label="Work email" error={errors.email}>
                    {(c) => <Input {...c} type="email" autoComplete="email" value={v.email} onChange={(e) => set('email', e.target.value)} placeholder="you@company.com" />}
                  </Field>
                  <Field label="Company" error={errors.company}>
                    {(c) => <Input {...c} autoComplete="organization" value={v.company} onChange={(e) => set('company', e.target.value)} />}
                  </Field>
                  <Field label="Employees" error={errors.size}>
                    {(c) => (
                      <Select {...c} value={v.size} onChange={(e) => set('size', e.target.value)}>
                        <option value="">Choose…</option>
                        {demo.sizes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </Select>
                    )}
                  </Field>
                </div>
                <Field label="Your team" error={errors.role}>
                  {(c) => (
                    <Select {...c} value={v.role} onChange={(e) => set('role', e.target.value)}>
                      <option value="">Choose…</option>
                      {demo.roles.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </Select>
                  )}
                </Field>
                <fieldset>
                  <legend className="text-[14px] font-medium text-ink">
                    What should we show you? <span className="font-normal text-faint">Optional</span>
                  </legend>
                  <div className="mt-1 grid sm:grid-cols-2">
                    {demo.interests.map((i) => (
                      <Checkbox key={i} label={i} checked={v.interests.includes(i)} onChange={(on) => set('interests', on ? [...v.interests, i] : v.interests.filter((x) => x !== i))} />
                    ))}
                  </div>
                </fieldset>
                <Field label="Anything we should know?" optional error={errors.notes}>
                  {(c) => <Textarea {...c} value={v.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Number of sites, languages, the tools you use…" />}
                </Field>
                <div className="flex justify-end">
                  <Button type="submit" size="lg" arrow>
                    Choose a time
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={confirm} noValidate className="grid gap-6">
                <h2 ref={heading} tabIndex={-1} className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink outline-none">
                  Pick a time, {v.name.split(' ')[0] || 'there'}
                </h2>
                <fieldset>
                  <legend className="text-[14px] font-medium text-ink">Day</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {days.map((d) => {
                      const val = iso(d)
                      const on = v.date === val
                      return (
                        <label key={val} className={cx('flex cursor-pointer flex-col items-center rounded-[12px] border-[1.5px] py-2.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink', on ? 'border-ink bg-mint' : 'border-line hover:border-ink')}>
                          <input type="radio" name="day" value={val} checked={on} onChange={() => set('date', val)} className="sr-only" />
                          <span className="text-[12.5px] font-medium text-muted">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                          <span className="font-display text-[20px] font-semibold text-ink">{d.getDate()}</span>
                          <span className="text-[12px] text-muted">{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.date ? <p className="mt-2 text-[13px] font-medium text-bad">{errors.date}</p> : null}
                </fieldset>
                <fieldset>
                  <legend className="text-[14px] font-medium text-ink">Time ({demo.timezone})</legend>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {demo.slots.map((s) => {
                      const on = v.slot === s
                      return (
                        <label key={s} className={cx('grid h-11 cursor-pointer place-items-center rounded-[10px] border-[1.5px] text-[15px] font-medium tabular-nums transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink', on ? 'border-ink bg-mint text-ink' : 'border-line text-ink hover:border-ink')}>
                          <input type="radio" name="slot" value={s} checked={on} onChange={() => set('slot', s)} className="sr-only" />
                          {s}
                        </label>
                      )
                    })}
                  </div>
                  {errors.slot ? <p className="mt-2 text-[13px] font-medium text-bad">{errors.slot}</p> : null}
                </fieldset>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Button variant="ghost" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" loading={busy}>
                    Confirm booking
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </Container>
  )
}
