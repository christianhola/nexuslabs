import { useCallback, useEffect, useState, type FormEvent } from 'react'

import { ArrowLeft, Check, Copy, Mail, PhoneCall, RotateCw, Trash2 } from 'lucide-react'

import { useAccountActions } from '../app/AccountDrawer'
import { RenewalTimeline } from '../app/RenewalTimeline'
import { Avatar } from '../components/Avatar'
import { EmptyState } from '../components/EmptyState'
import { TextArea } from '../components/Field'
import { Kpi } from '../components/Kpi'
import { Link } from '../components/Link'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { Pill, pillClass } from '../components/Pill'
import { Progress } from '../components/Progress'
import { Skeleton } from '../components/Skeleton'
import { StatusTag } from '../components/StatusTag'
import { useToast } from '../components/Toast'
import { WeeklyChart } from '../components/WeeklyChart'
import { activityFor, FACTORS, type Account, type Activity, type Contact, type Range } from '../data'
import { cx } from '../lib/cx'
import { count, money, shortDate, signed } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { change, current, daysUntil, isStale, series, signals, status } from '../lib/metrics'
import { factorScore, share, type Weights } from '../lib/scoring'
import { useStore } from '../lib/store'
import { NotFound } from './NotFound'

type Load<T> = { state: 'loading' } | { state: 'error'; message: string } | { state: 'ready'; data: T }

/** Contacts come from the Worker (GET /api/accounts/:id/contacts) to show real loading and error states. */
function useContacts(id: string) {
  const [load, setLoad] = useState<Load<Contact[]>>({ state: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    // A stale flag rather than AbortController: the response is simply ignored if the account changed.
    let stale = false
    setLoad({ state: 'loading' })
    fetch(`/api/accounts/${encodeURIComponent(id)}/contacts`)
      .then(async (r) => {
        if (!r.ok) throw new Error(r.status === 404 ? 'This account has no contact record.' : `The server answered ${r.status}.`)
        const body = (await r.json()) as { contacts: Contact[] }
        if (!stale) setLoad({ state: 'ready', data: body.contacts })
      })
      .catch((e: Error) => {
        if (!stale) setLoad({ state: 'error', message: e.message === 'Failed to fetch' ? 'Network error. Check your connection.' : e.message })
      })
    return () => {
      stale = true
    }
  }, [id, attempt])
  return [load, useCallback(() => setAttempt((n) => n + 1), [])] as const
}

const KIND_LABEL: Record<Activity['kind'], string> = { note: 'Note', call: 'Call', email: 'Email', qbr: 'QBR', ticket: 'Ticket', touch: 'Touch' }

function usage(a: Account) {
  const now = current(a)
  return series(a).map((s) => Math.round(a.seats * Math.min(1, Math.max(0.05, a.seatUtilization + ((s - now) / 100) * 0.9))))
}

export function AccountDetail({ id }: { id: string }) {
  const { byId, settings, range, notes, addNote, removeNote } = useStore()
  const a = byId(id)
  if (!a) return <NotFound title="No such account" body={`There is no account with the id “${id}”.`} />
  return <Detail key={a.id} a={a} threshold={settings.threshold} range={range} notes={notes[a.id] ?? []} addNote={addNote} removeNote={removeNote} weights={settings.weights} />
}

function Detail({
  a,
  threshold,
  range,
  notes,
  addNote,
  removeNote,
  weights,
}: {
  a: Account
  threshold: number
  range: Range
  notes: Activity[]
  addNote: (id: string, text: string) => void
  removeNote: (id: string, noteId: string) => void
  weights: Weights
}) {
  const actions = useAccountActions()
  const toast = useToast()
  const [contacts, retry] = useContacts(a.id)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const now = current(a)
  const moved = change(a, range)
  const wau = usage(a)
  const activity = [...notes, ...activityFor(a)]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (text.length < 3) {
      setError('Write at least a few words.')
      return
    }
    addNote(a.id, text)
    setDraft('')
    setError(null)
    toast.show({ tone: 'success', title: 'Note added', body: a.name })
  }

  return (
    <>
      <Link to="/accounts" className="caps mb-5 inline-flex min-h-10 items-center gap-2 text-[10.5px] tracking-[0.2em] text-muted transition-colors hover:text-fg sm:min-h-0">
        <ArrowLeft className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        All accounts
      </Link>
      <PageHeader
        eyebrow={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{a.segment}</span>
            <span aria-hidden="true" className="text-faint">·</span>
            <span>Owner {a.owner}</span>
            <span aria-hidden="true" className="text-faint">·</span>
            <span>Cohort {a.cohort}</span>
          </span>
        }
        title={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {a.name}
            <StatusTag status={status(a, threshold)} className="translate-y-[3px]" />
          </span>
        }
        actions={
          <>
            <Pill variant="solid" icon={a.lastTouchDays === 0 ? <Check strokeWidth={2} /> : <PhoneCall strokeWidth={1.75} />} onClick={() => actions.logTouch(a)} disabled={a.lastTouchDays === 0}>
              {a.lastTouchDays === 0 ? 'Touch logged' : 'Log touch'}
            </Pill>
            <Pill
              variant="outline"
              icon={copied ? <Check strokeWidth={2} /> : <Copy strokeWidth={1.75} />}
              onClick={async () => {
                if (await actions.copySummary(a)) {
                  setCopied(true)
                  window.setTimeout(() => setCopied(false), 1600)
                }
              }}
            >
              {copied ? 'Copied' : 'Copy summary'}
            </Pill>
          </>
        }
      />

      <section aria-label="Account metrics" className="grid grid-cols-2 border-b border-line sm:grid-cols-4 [&>*]:border-line [&>*:nth-child(odd)]:border-r sm:[&>*:not(:last-child)]:border-r [&>*:nth-child(-n+2)]:border-b sm:[&>*:nth-child(-n+2)]:border-b-0">
        <Kpi size="sm" label="Health" value={now} format={(n) => String(Math.round(n))} note={`${signed(moved)} vs. ${range} weeks ago`} alert={moved < 0} delay={60} />
        <Kpi size="sm" label="ARR" value={a.arr} format={money} note={`${count(a.seats)} seats`} delay={110} />
        <Kpi size="sm" label="Seats active" value={a.seatUtilization * 100} format={(n) => `${Math.round(n)}%`} note={`${count(wau[wau.length - 1]!)} weekly users`} alert={a.seatUtilization < 0.45} delay={160} />
        <Kpi size="sm" label="Last touch" value={a.lastTouchDays} format={(n) => (Math.round(n) === 0 ? 'Today' : `${Math.round(n)}d`)} note={isStale(a) ? 'Overdue' : 'On cadence'} alert={isStale(a)} delay={210} />
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Panel id="history" title="Health history" meta="26 weeks" className="animate-rise [animation-delay:200ms]">
          <div className="mt-6">
            <WeeklyChart kind="line" label={`Health history for ${a.name}, 26 weeks`} values={series(a)} domain={[0, 100]} threshold={threshold} range={range} height={300} />
          </div>
        </Panel>

        <Panel id="signals" title="Signals" meta="Score factors" className="animate-rise [animation-delay:260ms]">
          <ul className="mt-6 space-y-2.5">
            {signals(a, threshold, range).map((s) => (
              <li key={s.text} className="flex items-start gap-3 text-[14px]">
                <span aria-hidden="true" className={cx('mt-[7px] size-1.5 shrink-0 rounded-full', s.bad ? 'bg-risk' : 'bg-high')} />
                {s.text}
              </li>
            ))}
          </ul>
          <h3 className="caps mt-7 text-[10px] tracking-[0.22em] text-muted">Factor scores · weight</h3>
          <ul className="mt-3 space-y-3.5">
            {FACTORS.map((f) => {
              const v = factorScore(a, f.key, now)
              return (
                <li key={f.key}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13.5px]">
                      {f.label} <span className="tnum font-mono text-[11px] text-muted">{Math.round(share(weights, f.key) * 100)}%</span>
                    </span>
                    <span className={cx('tnum font-mono text-[13px]', v < threshold ? 'text-risk' : 'text-muted')}>{v}</span>
                  </div>
                  <Progress value={v / 100} label={`${f.label} score`} alert={v < threshold} className="mt-1.5" />
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Panel id="usage" title="Usage trend" meta="Weekly active users" className="animate-rise [animation-delay:300ms]">
          <div className="mt-6">
            <WeeklyChart
              kind="bars"
              label={`Weekly active users for ${a.name}, 26 weeks`}
              values={wau}
              domain={[0, Math.max(a.seats, ...wau) * 1.12]}
              reference={{ value: a.seats, label: `${count(a.seats)} seats` }}
              range={range}
              height={220}
              format={count}
              barColor={(_, i) => healthFill(series(a)[i]!)}
            />
          </div>
        </Panel>

        <Panel id="contacts" title="Contacts" meta={contacts.state === 'ready' ? `${contacts.data.length} people` : undefined} className="animate-rise [animation-delay:340ms]">
          <div className="mt-6" aria-busy={contacts.state === 'loading'}>
            {contacts.state === 'loading' && (
              <ul className="space-y-4" aria-label="Loading contacts">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-center gap-3 border-t border-line pt-4">
                    <Skeleton className="size-9 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-2.5 w-3/4" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {contacts.state === 'error' && (
              <EmptyState tone="error" title="Couldn’t load contacts" action={<Pill variant="outline" size="sm" icon={<RotateCw strokeWidth={1.75} />} onClick={retry}>Retry</Pill>} className="py-6">
                {contacts.message}
              </EmptyState>
            )}
            {contacts.state === 'ready' && (
              <ul>
                {contacts.data.map((c) => (
                  <li key={c.email} className="flex items-center gap-3 border-t border-line py-3.5">
                    <Avatar name={c.name} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-[14.5px]">
                        {c.name}
                        {c.primary && <span className="caps text-[9px] tracking-[0.2em] text-risk">Primary</span>}
                      </p>
                      <p className="truncate text-[12.5px] text-muted">{c.role}</p>
                    </div>
                    <span className={cx('tnum shrink-0 font-mono text-[12px]', c.lastContactDays > 45 ? 'text-risk' : 'text-muted')}>{c.lastContactDays}d</span>
                    <a href={`mailto:${c.email}`} aria-label={`Email ${c.name}`} className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg max-sm:size-10">
                      <Mail className="size-3.5" strokeWidth={1.75} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel id="renewal" title="Renewal timeline" meta={`Renews ${shortDate(a.renewal)} · ${money(a.arr)}`} className="animate-rise [animation-delay:380ms]">
          <div className="mt-6">
            <RenewalTimeline a={a} />
          </div>
        </Panel>
      </div>

      <div className="mt-8">
        <Panel id="activity" title="Notes & activity" meta={`${activity.length} entries`} className="animate-rise [animation-delay:420ms]">
          <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start" noValidate>
            <TextArea
              label="Add a note"
              hideLabel
              placeholder={`Add a note about ${a.name}…`}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value)
                if (error) setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e)
              }}
              error={error}
              rows={2}
            />
            <button type="submit" className={pillClass('solid', 'md', 'sm:mt-1')}>
              <span className="-mr-[0.26em]">Add note</span>
            </button>
          </form>
          <ol className="mt-6">
            {activity.map((n, i) => {
              const mine = n.author === 'You'
              const ago = -daysUntil(n.date)
              return (
                <li key={n.id} className="grid animate-rise grid-cols-[64px_1fr_auto] items-start gap-x-4 border-t border-line py-3.5 sm:grid-cols-[96px_72px_1fr_auto]" style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <span className="tnum font-mono text-[12px] text-muted">{ago === 0 ? 'Today' : `${ago}d ago`}</span>
                  <span className={cx('caps hidden pt-px text-[10px] tracking-[0.2em] sm:block', n.kind === 'ticket' ? 'text-risk' : 'text-muted')}>{KIND_LABEL[n.kind]}</span>
                  <div className="min-w-0">
                    <p className="text-[14px] leading-snug">{n.text}</p>
                    <p className="mt-0.5 text-[12px] text-muted">
                      {n.author} · {shortDate(n.date)}
                    </p>
                  </div>
                  {mine ? (
                    <button
                      type="button"
                      aria-label="Delete note"
                      onClick={() => {
                        removeNote(a.id, n.id)
                        toast.show({ tone: 'info', title: 'Note deleted' })
                      }}
                      className="-mt-1.5 grid size-8 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-fg/[0.07] hover:text-risk max-sm:size-10"
                    >
                      <Trash2 className="size-3.5" strokeWidth={1.75} />
                    </button>
                  ) : (
                    <span />
                  )}
                </li>
              )
            })}
          </ol>
        </Panel>
      </div>
    </>
  )
}
