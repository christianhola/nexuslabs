import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { ChoiceGroup, Notice, Stepper, SuccessMark } from '../components/Controls'
import { Field, Input, Textarea } from '../components/Field'
import { FireStreaks } from '../components/FireStreaks'
import { Ship } from '../components/Ship'
import { Eyebrow } from '../components/Typography'
import { earlyAccess } from '../content'
import { useLocation } from '../lib/router'
import { postJson, useStored } from '../lib/store'
import { SEGMENTS, hasErrors, validateEarlyAccessStep1, validateEarlyAccessStep2 } from '../lib/validate'
import type { EarlyAccessInput } from '../lib/validate'

type Draft = EarlyAccessInput
const empty: Draft = { name: '', email: '', organisation: '', role: '', segment: '', fleetSize: '', timeline: '', notes: '' }
type Receipt = { reference: string; name: string; email: string; segment: string; at: string }

export function EarlyAccess() {
  const { search } = useLocation()
  const [draft, setDraft, clearDraft] = useStored<Draft>('early-access-draft', empty)
  const [receipt, setReceipt, clearReceipt] = useStored<Receipt | null>('early-access-receipt', null)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({})
  const [serverError, setServerError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  // ?segment=defense preselects the segment (links from the home page).
  useEffect(() => {
    const seg = new URLSearchParams(search).get('segment')
    if (seg && SEGMENTS.includes(seg as (typeof SEGMENTS)[number]) && !draft.segment) setDraft((d) => ({ ...d, segment: seg }))
  }, [search, draft.segment, setDraft])

  // Move focus to the step heading when the step changes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    heading.current?.focus()
  }, [step, receipt])

  const set = (k: keyof Draft, v: string) => {
    setDraft((d) => ({ ...d, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const focusFirstError = (errs: object) => {
    const first = Object.keys(errs)[0]
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-field="${first}"] input, [data-field="${first}"] textarea`)?.focus())
  }

  const next = (e: FormEvent) => {
    e.preventDefault()
    const errs = step === 0 ? validateEarlyAccessStep1(draft) : validateEarlyAccessStep2(draft)
    setErrors(errs)
    if (hasErrors(errs)) return focusFirstError(errs)
    setStep((s) => s + 1)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setServerError(undefined)
    setBusy(true)
    const res = await postJson<{ ok: true; reference: string }>('/api/early-access', draft)
    setBusy(false)
    if (!res.ok) {
      setServerError(res.error)
      if (res.errors) {
        setErrors(res.errors)
        setStep(res.errors.name || res.errors.email || res.errors.organisation || res.errors.segment ? 0 : 1)
      }
      return
    }
    setReceipt({ reference: res.data.reference, name: draft.name, email: draft.email, segment: draft.segment, at: new Date().toISOString() })
    clearDraft()
    setStep(0)
  }

  const segmentLabel = (id: string) => earlyAccess.segments.find((s) => s.id === id)?.label ?? id

  return (
    <section aria-labelledby="ea-title" className="relative isolate overflow-hidden pb-24 pt-28 sm:pt-36">
      <div className="absolute inset-x-0 top-[400px] -z-10 h-[420px] opacity-70 lg:top-[360px]" aria-hidden>
        <FireStreaks intensity={0.8} />
      </div>
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,#000_0%,#000_60%,#081536_100%)]" aria-hidden />
      <Container size="xl" className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start gap-5 lg:pt-10">
          <Eyebrow>{earlyAccess.eyebrow}</Eyebrow>
          <h1 id="ea-title" className="display text-balance text-[44px] sm:text-[60px]">
            {earlyAccess.title}
          </h1>
          <p className="max-w-[460px] text-[18px] leading-[1.55] text-muted">{earlyAccess.body}</p>
          <div className="mt-6 flex gap-6">
            <Ship kind="cargo" className="h-16 w-auto" decorative />
            <Ship kind="frigate" className="h-16 w-auto" decorative />
          </div>
        </div>

        <Card className="p-6 sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {receipt ? (
              <motion.div key="done" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-start gap-4" role="status">
                <SuccessMark />
                <h2 ref={heading} tabIndex={-1} className="text-[28px] font-medium tracking-[-0.02em] outline-none">
                  {earlyAccess.success.title}
                </h2>
                <p className="text-[16px] text-muted">{earlyAccess.success.body}</p>
                <dl className="mt-2 grid w-full gap-x-6 gap-y-3 rounded-[20px] bg-white/[0.04] p-5 text-[15px] sm:grid-cols-2">
                  {[
                    ['Reference', receipt.reference],
                    ['Segment', segmentLabel(receipt.segment)],
                    ['Name', receipt.name],
                    ['Reply to', receipt.email],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-faint">{k}</dt>
                      <dd className="break-words text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ButtonLink href="/technology" variant="secondary">
                    Read about the technology
                  </ButtonLink>
                  <Button variant="ghost" onClick={clearReceipt}>
                    Start another request
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
                <Stepper steps={earlyAccess.steps} current={step} />
                <h2 ref={heading} tabIndex={-1} className="mt-8 text-[24px] font-medium tracking-[-0.02em] outline-none">
                  {earlyAccess.steps[step]}
                </h2>
                {serverError ? (
                  <Notice tone="error" title="We couldn’t send that" className="mt-5">
                    {serverError}
                  </Notice>
                ) : null}

                {step === 0 ? (
                  <form onSubmit={next} noValidate className="mt-6 flex flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div data-field="name">
                        <Field label="Full name" error={errors.name}>
                          {(p) => <Input {...p} autoComplete="name" value={draft.name} onChange={(e) => set('name', e.target.value)} />}
                        </Field>
                      </div>
                      <div data-field="email">
                        <Field label="Work email" error={errors.email}>
                          {(p) => <Input {...p} type="email" autoComplete="email" value={draft.email} onChange={(e) => set('email', e.target.value)} />}
                        </Field>
                      </div>
                      <div data-field="organisation">
                        <Field label="Organisation" error={errors.organisation}>
                          {(p) => <Input {...p} autoComplete="organization" value={draft.organisation} onChange={(e) => set('organisation', e.target.value)} />}
                        </Field>
                      </div>
                      <Field label="Role" optional>
                        {(p) => <Input {...p} autoComplete="organization-title" value={draft.role ?? ''} onChange={(e) => set('role', e.target.value)} />}
                      </Field>
                    </div>
                    <div data-field="segment">
                      <ChoiceGroup legend="Segment" options={earlyAccess.segments} value={draft.segment} onChange={(v) => set('segment', v)} error={errors.segment} />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button type="submit" size="lg">
                        Continue
                      </Button>
                    </div>
                  </form>
                ) : step === 1 ? (
                  <form onSubmit={next} noValidate className="mt-6 flex flex-col gap-6">
                    <div data-field="fleetSize">
                      <ChoiceGroup
                        legend="Fleet size"
                        columns={2}
                        options={earlyAccess.fleetSizes.map((f) => ({ id: f, label: f }))}
                        value={draft.fleetSize}
                        onChange={(v) => set('fleetSize', v)}
                        error={errors.fleetSize}
                      />
                    </div>
                    <div data-field="timeline">
                      <ChoiceGroup
                        legend="Timeline"
                        columns={2}
                        options={earlyAccess.timelines.map((f) => ({ id: f, label: f }))}
                        value={draft.timeline}
                        onChange={(v) => set('timeline', v)}
                        error={errors.timeline}
                      />
                    </div>
                    <div data-field="notes">
                      <Field label="Anything else" optional hint="Routes, vessel classes, power needs." error={errors.notes}>
                        {(p) => <Textarea {...p} value={draft.notes ?? ''} onChange={(e) => set('notes', e.target.value)} />}
                      </Field>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <Button variant="ghost" onClick={() => setStep(0)}>
                        <ArrowLeft className="size-4" aria-hidden />
                        Back
                      </Button>
                      <Button type="submit" size="lg">
                        Review
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-6">
                    <dl className="flex flex-col divide-y divide-white/10 rounded-[20px] bg-white/[0.04] px-5">
                      {(
                        [
                          ['Name', draft.name, 0],
                          ['Email', draft.email, 0],
                          ['Organisation', [draft.organisation, draft.role].filter(Boolean).join(', '), 0],
                          ['Segment', segmentLabel(draft.segment), 0],
                          ['Fleet size', draft.fleetSize, 1],
                          ['Timeline', draft.timeline, 1],
                          ['Notes', draft.notes || 'None', 1],
                        ] as const
                      ).map(([k, v, s]) => (
                        <div key={k} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 py-3.5">
                          <dt className="col-start-1 row-start-1 text-[13px] text-faint">{k}</dt>
                          <dd className="col-start-1 row-start-2 break-words text-[15px] text-white">{v}</dd>
                          <dd className="col-start-2 row-span-2 row-start-1">
                            <Button variant="ghost" size="sm" onClick={() => setStep(s)} aria-label={`Edit ${k.toLowerCase()}`}>
                              Edit
                            </Button>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="text-[13px] text-faint">We use these details only to reply to you. Your draft is kept on this device until you send it.</p>
                    <div className="flex items-center justify-between gap-3">
                      <Button variant="ghost" onClick={() => setStep(1)}>
                        <ArrowLeft className="size-4" aria-hidden />
                        Back
                      </Button>
                      <Button type="submit" size="lg" loading={busy}>
                        {busy ? 'Sending' : 'Send request'}
                      </Button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </Container>
    </section>
  )
}
