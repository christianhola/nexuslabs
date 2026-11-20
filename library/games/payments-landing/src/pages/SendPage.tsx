import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDownUp, ArrowLeft, ArrowRight, Check, Clock, History, RefreshCw, Send, Trash2 } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { CurrencyBadge } from '../components/CurrencyBadge'
import { EmptyState } from '../components/EmptyState'
import { TextField } from '../components/Field'
import { MoneyInput } from '../components/MoneyInput'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { RadioCard } from '../components/RadioCard'
import { Stepper } from '../components/Stepper'
import { send } from '../content'
import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { keys, useStore } from '../lib/store'
import { useQuote } from '../lib/useQuote'
import { QUOTE_LOCK_SECONDS, bankEstimate, currency, formatMoney, formatRate } from '../shared/fx'
import type { CurrencyCode, Quote, Speed } from '../shared/fx'
import { validateRecipient } from '../shared/validate'
import type { Errors, TransferField } from '../shared/validate'

type Draft = {
  from: CurrencyCode
  to: CurrencyCode
  amount: string
  speed: Speed
  recipientName: string
  recipientEmail: string
  account: string
  reference: string
}

type Transfer = Quote & { id: string; createdAt: number; recipientName: string; status: string }

const emptyDraft: Draft = {
  from: send.defaults.from,
  to: send.defaults.to,
  amount: String(send.defaults.amount),
  speed: 'instant',
  recipientName: '',
  recipientEmail: '',
  account: '',
  reference: '',
}

const parse = (s: string) => Number(s.replace(/,/g, ''))

export function SendPage() {
  const [draft, setDraft] = useStore<Draft>(keys.sendDraft, emptyDraft)
  const [history, setHistory, clearHistory] = useStore<Transfer[]>(keys.transfers, [])
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors<TransferField>>({})
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [done, setDone] = useState<Transfer | null>(null)
  const panel = useRef<HTMLDivElement>(null)

  const amount = parse(draft.amount)
  const live = useQuote(draft.from, draft.to, amount, draft.speed, step < 3)
  const q = live.quote
  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }))

  const bank = useMemo(() => (q ? bankEstimate(draft.from, draft.to, amount) : 0), [q, draft.from, draft.to, amount])
  const saving = q ? Math.max(0, q.receiveAmount - bank) : 0

  // Move focus to the step heading so keyboard and screen-reader users follow.
  useEffect(() => {
    panel.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true })
  }, [step])

  function goRecipient() {
    if (!q || live.error) return
    setStep(1)
  }

  function submitRecipient(e: FormEvent) {
    e.preventDefault()
    const errs = validateRecipient(draft)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0]
      document.getElementById(`send-${first}`)?.focus()
      return
    }
    setStep(2)
  }

  async function confirm() {
    if (!q) return
    setSubmitting(true)
    setNotice(null)
    const res = await api<Transfer>('/api/transfers', {
      body: { ...draft, amount, quotedAt: q.quotedAt },
    })
    setSubmitting(false)
    if (res.ok) {
      const t = { ...res.data, recipientName: draft.recipientName }
      setHistory((h) => [t, ...h].slice(0, 20))
      setDone(t)
      setStep(3)
      return
    }
    if (res.status === 409) {
      setNotice(send.review.expired)
      live.refresh()
      return
    }
    if (res.status === 422 && res.data.errors) {
      setErrors(res.data.errors as Errors<TransferField>)
      setStep(res.data.errors.amount ? 0 : 1)
      return
    }
    setNotice(res.data.message ?? 'Something went wrong. Try again.')
  }

  function restart() {
    setDraft({ ...emptyDraft, from: draft.from, to: draft.to })
    setDone(null)
    setErrors({})
    setStep(0)
  }

  return (
    <>
      <PageHeader eyebrow="Send money" title={send.title} body={send.body} />
      <section className="relative -mt-8 pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <Card padding="none" className="overflow-hidden">
            <div className="border-b border-line px-6 py-5 sm:px-8">
              <Stepper steps={send.steps} current={step} />
            </div>
            <div ref={panel} className="p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }}>
                  {step === 0 && (
                    <AmountStep
                      draft={draft}
                      update={update}
                      live={live}
                      bank={bank}
                      saving={saving}
                      onNext={goRecipient}
                      serverError={errors.amount}
                    />
                  )}
                  {step === 1 && (
                    <form noValidate onSubmit={submitRecipient}>
                      <h2 data-step-heading tabIndex={-1} className="text-[22px] font-medium tracking-[-0.02em] text-ink outline-none">
                        {send.recipient.title}
                      </h2>
                      <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <TextField
                          id="send-recipientName"
                          label={send.recipient.name}
                          autoComplete="name"
                          value={draft.recipientName}
                          onChange={(e) => update({ recipientName: e.target.value })}
                          error={errors.recipientName}
                        />
                        <TextField
                          id="send-recipientEmail"
                          type="email"
                          label={send.recipient.email}
                          autoComplete="email"
                          value={draft.recipientEmail}
                          onChange={(e) => update({ recipientEmail: e.target.value })}
                          error={errors.recipientEmail}
                          hint={send.recipient.emailHint}
                        />
                        <TextField
                          id="send-account"
                          className="sm:col-span-2"
                          label={send.recipient.account}
                          autoComplete="off"
                          spellCheck={false}
                          value={draft.account}
                          onChange={(e) => update({ account: e.target.value.toUpperCase() })}
                          error={errors.account}
                          hint={send.recipient.accountHint}
                          inputClassName="font-mono tracking-[0.04em]"
                        />
                        <TextField
                          id="send-reference"
                          className="sm:col-span-2"
                          label={send.recipient.reference}
                          maxLength={60}
                          value={draft.reference}
                          onChange={(e) => update({ reference: e.target.value })}
                          error={errors.reference}
                        />
                      </div>
                      <div className="mt-8 flex flex-wrap justify-between gap-3">
                        <Button variant="ghost" iconLeft={<ArrowLeft className="size-4" aria-hidden />} onClick={() => setStep(0)}>
                          Back
                        </Button>
                        <Button type="submit" icon={<ArrowRight className="size-4" aria-hidden />}>
                          Review transfer
                        </Button>
                      </div>
                    </form>
                  )}
                  {step === 2 && q && (
                    <div>
                      <h2 data-step-heading tabIndex={-1} className="text-[22px] font-medium tracking-[-0.02em] text-ink outline-none">
                        {send.review.title}
                      </h2>
                      {notice && (
                        <Notice tone="warning" className="mt-5">
                          {notice}
                        </Notice>
                      )}
                      <dl className="mt-6 divide-y divide-line rounded-card-sm border border-line">
                        {[
                          ['You send', formatMoney(q.sendAmount, q.from)],
                          ['Fee', formatMoney(q.fee, q.from)],
                          ['Rate', `1 ${q.from} = ${formatRate(q.rate)} ${q.to}`],
                          ['Arrives', q.arrival],
                          ['To', `${draft.recipientName} (${draft.account.replace(/\s+/g, '').slice(0, 4)}…${draft.account.replace(/\s+/g, '').slice(-4)})`],
                          ...(draft.reference ? [['Reference', draft.reference]] : []),
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4 px-4 py-3 text-[14.5px]">
                            <dt className="text-muted">{k}</dt>
                            <dd className="tabular text-right font-medium text-ink">{v}</dd>
                          </div>
                        ))}
                        <div className="flex justify-between gap-4 bg-mist-2 px-4 py-4">
                          <dt className="font-medium text-ink">{send.theyGet}</dt>
                          <dd className="tabular text-[20px] font-semibold tracking-[-0.02em] text-ink">{formatMoney(q.receiveAmount, q.to)}</dd>
                        </div>
                      </dl>
                      <LockBar remaining={live.remaining} status={live.status} className="mt-4" />
                      <div className="mt-8 flex flex-wrap justify-between gap-3">
                        <Button variant="ghost" iconLeft={<ArrowLeft className="size-4" aria-hidden />} onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button variant="dark" loading={submitting} icon={<Send className="size-4" aria-hidden />} onClick={confirm} disabled={live.status === 'loading'}>
                          {send.review.confirm}
                        </Button>
                      </div>
                    </div>
                  )}
                  {step === 3 && done && <DoneStep t={done} onAgain={restart} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>

          <div className="grid gap-6">
            <Card>
              <div className="flex items-center justify-between gap-4">
                <h2 className="flex items-center gap-2 text-[18px] font-medium tracking-[-0.02em] text-ink">
                  <History className="size-5 text-teal-ink" aria-hidden />
                  {send.history.title}
                </h2>
                {history.length > 0 && (
                  <Button variant="ghost" size="sm" iconLeft={<Trash2 className="size-4" aria-hidden />} onClick={clearHistory}>
                    {send.history.clear}
                  </Button>
                )}
              </div>
              {history.length === 0 ? (
                <EmptyState className="mt-5" icon={<Send className="size-5" aria-hidden />} title="Nothing sent yet" body={send.history.empty} />
              ) : (
                <ul className="mt-4 divide-y divide-line">
                  {history.map((t) => (
                    <li key={t.id} className="flex items-center gap-3 py-3.5">
                      <CurrencyBadge code={t.to} className="size-9" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px] font-medium text-ink">{t.recipientName}</p>
                        <p className="text-[12.5px] text-faint">
                          {new Date(t.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="tabular text-[14.5px] font-medium text-ink">{formatMoney(t.receiveAmount, t.to)}</p>
                        <Badge tone="success" className="mt-0.5">
                          Delivered
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
            <Card tone="mist" className="shadow-none">
              <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">How we price it</h2>
              <ul className="mt-4 space-y-3 text-[14.5px] leading-[1.6] text-muted">
                <li className="flex gap-2.5">
                  <Check className="mt-1 size-4 shrink-0 text-teal-ink" aria-hidden />
                  The mid-market rate you see on independent sites, with no markup.
                </li>
                <li className="flex gap-2.5">
                  <Check className="mt-1 size-4 shrink-0 text-teal-ink" aria-hidden />
                  0.45% to 0.65% plus a small fixed fee, shown before you pay.
                </li>
                <li className="flex gap-2.5">
                  <Check className="mt-1 size-4 shrink-0 text-teal-ink" aria-hidden />
                  Same-currency transfers are free.
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </section>
    </>
  )
}

function AmountStep({
  draft,
  update,
  live,
  bank,
  saving,
  onNext,
  serverError,
}: {
  draft: Draft
  update: (p: Partial<Draft>) => void
  live: ReturnType<typeof useQuote>
  bank: number
  saving: number
  onNext: () => void
  serverError?: string
}) {
  const q = live.quote
  const error = live.error ?? serverError ?? null
  return (
    <div>
      <h2 data-step-heading tabIndex={-1} className="sr-only outline-none">
        Amount
      </h2>
      <MoneyInput label={send.youSend} amount={draft.amount} onAmount={(v) => update({ amount: v })} code={draft.from} onCode={(c) => update({ from: c })} error={error} />
      <div className="relative my-3 flex items-center gap-3 pl-5">
        <span aria-hidden className="absolute bottom-[-12px] left-[29px] top-[-12px] w-px bg-line" />
        <button
          type="button"
          onClick={() => update({ from: draft.to, to: draft.from })}
          aria-label={`Swap currencies: send ${draft.to}, receive ${draft.from}`}
          className="round relative grid size-10 place-items-center rounded-full border border-line bg-white text-ink-2 shadow-card hover:text-ink"
        >
          <ArrowDownUp className="size-4" aria-hidden />
        </button>
        <dl className="relative grid flex-1 gap-1 text-[13.5px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Fee ({q ? `${q.feePercent}% + ${formatMoney(q.feeFixed, draft.from)}` : '—'})</dt>
            <dd className="tabular font-medium text-ink">{q ? `− ${formatMoney(q.fee, draft.from)}` : '—'}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{send.rateLabel}</dt>
            <dd className="tabular font-medium text-ink">{q ? `1 ${draft.from} = ${formatRate(q.rate)} ${draft.to}` : '—'}</dd>
          </div>
        </dl>
      </div>
      <MoneyInput
        label={send.theyGet}
        amount={q ? q.receiveAmount.toLocaleString('en-US', { minimumFractionDigits: currency(draft.to).decimals, maximumFractionDigits: currency(draft.to).decimals }) : ''}
        code={draft.to}
        onCode={(c) => update({ to: c })}
        loading={!q && !error}
      />

      <fieldset className="mt-6">
        <legend className="mb-2.5 text-[14px] font-medium text-ink-2">{send.speedLabel}</legend>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {send.speeds.map((s) => (
            <RadioCard key={s.id} name="send-speed" value={s.id} checked={draft.speed === s.id} onChange={(v) => update({ speed: v as Speed })} label={s.label} detail={s.note} />
          ))}
        </div>
      </fieldset>

      <LockBar remaining={live.remaining} status={live.status} className="mt-6" onRefresh={live.refresh} />

      {q && draft.from !== draft.to && saving > 0 && (
        <p className="mt-4 rounded-control bg-teal-50 px-4 py-3 text-[14px] text-teal-deep">
          {send.bankCompare} {formatMoney(bank, draft.to)}. <strong className="font-semibold">{send.saving} {formatMoney(saving, draft.to)}.</strong>
        </p>
      )}
      {live.status === 'offline' && (
        <Notice tone="warning" className="mt-4">
          We couldn’t reach the pricing service. These figures are an estimate.
        </Notice>
      )}
      <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-1.5 text-[13.5px] text-muted">
          <Clock className="size-4" aria-hidden />
          Arrives {q?.arrival ?? '—'}
        </p>
        <Button size="lg" onClick={onNext} disabled={!q || !!error} icon={<ArrowRight className="size-4" aria-hidden />}>
          Continue
        </Button>
      </div>
    </div>
  )
}

function LockBar({ remaining, status, className, onRefresh }: { remaining: number; status: string; className?: string; onRefresh?: () => void }) {
  const pct = (remaining / QUOTE_LOCK_SECONDS) * 100
  const loading = status === 'loading'
  return (
    <div className={cx('flex items-center gap-3', className)}>
      <div className="flex-1">
        <div className="flex justify-between text-[12.5px]">
          <span className="font-medium text-ink-2">{loading ? send.refreshing : send.lockLabel}</span>
          <span className="tabular text-muted" aria-hidden={loading}>
            {loading ? '' : `0:${String(remaining).padStart(2, '0')}`}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-mist-3" role="progressbar" aria-label="Quote lock remaining" aria-valuemin={0} aria-valuemax={QUOTE_LOCK_SECONDS} aria-valuenow={remaining}>
          <div className={cx('h-full rounded-full bg-teal transition-[width] duration-1000 ease-linear', loading && 'skeleton')} style={{ width: loading ? '100%' : `${pct}%` }} />
        </div>
      </div>
      {onRefresh && (
        <button type="button" onClick={onRefresh} aria-label="Refresh quote" className="grid size-10 place-items-center rounded-control-sm text-muted hover:bg-mist hover:text-ink">
          <RefreshCw className={cx('size-4', loading && 'animate-spin-slow')} aria-hidden />
        </button>
      )}
    </div>
  )
}

function DoneStep({ t, onAgain }: { t: Transfer; onAgain: () => void }) {
  const [stage, setStage] = useState(1)
  useEffect(() => {
    if (stage >= send.done.track.length - 1) return
    const id = setTimeout(() => setStage((s) => s + 1), 1100)
    return () => clearTimeout(id)
  }, [stage])
  return (
    <div>
      <span className="round grid size-12 animate-pulse-ring place-items-center rounded-full bg-teal-ink text-white">
        <Check className="size-6" aria-hidden />
      </span>
      <h2 data-step-heading tabIndex={-1} className="mt-5 text-[26px] font-medium tracking-[-0.03em] text-ink outline-none">
        {send.done.title}
      </h2>
      <p className="mt-2 text-[15px] text-muted">
        {formatMoney(t.receiveAmount, t.to)} to {t.recipientName}. {send.done.body}
      </p>
      <ol className="mt-7 space-y-0" aria-label="Transfer tracking">
        {send.done.track.map((label, i) => {
          const reached = i <= stage
          return (
            <li key={label} className="relative flex gap-4 pb-6 last:pb-0">
              {i < send.done.track.length - 1 && (
                <span aria-hidden className={cx('absolute left-[11px] top-6 h-[calc(100%-24px)] w-0.5 transition-colors duration-500', i < stage ? 'bg-teal' : 'bg-line')} />
              )}
              <span
                className={cx(
                  'round relative grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-500',
                  reached ? 'bg-teal-ink text-white' : 'border-2 border-line bg-white',
                )}
              >
                {reached && <Check className="size-3.5" aria-hidden />}
              </span>
              <span className={cx('text-[15px]', reached ? 'font-medium text-ink' : 'text-faint')}>
                {label}
                <span className="sr-only">{reached ? ' (complete)' : ' (pending)'}</span>
              </span>
            </li>
          )
        })}
      </ol>
      <p className="sr-only" role="status">
        {send.done.track[stage]}
      </p>
      <p className="mt-6 font-mono text-[12.5px] text-faint">Transfer {t.id}</p>
      <Button className="mt-6" variant="outline" onClick={onAgain}>
        {send.done.another}
      </Button>
    </div>
  )
}
