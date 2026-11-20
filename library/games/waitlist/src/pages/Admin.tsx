import { Download, Inbox, Lock, LogOut, RefreshCw, Search, ShieldOff } from 'lucide-react'
import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'

import { PageShell } from '../components/Layout'
import { Badge, Button, Callout, Card, Container, FieldMessage, Input, Label, Skeleton, Stat } from '../components/ui'
import { ApiError, adminEnabled, downloadSignupsCsv, fetchSignups, type Signup } from '../lib/api'
import { useTitle } from '../lib/router'

// The token lives in sessionStorage only: closing the tab locks admin again.
const TOKEN_KEY = 'waitlist:admin-token'

function readToken(): string {
  try {
    return sessionStorage.getItem(TOKEN_KEY) ?? ''
  } catch {
    return ''
  }
}
function writeToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage blocked: admin stays unlocked until reload.
  }
}

type State =
  | { status: 'locked'; error?: string }
  | { status: 'disabled' }
  | { status: 'loading' }
  | { status: 'ready'; signups: Signup[] }
  | { status: 'error'; message: string }

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function Unlock({ error, pending, onSubmit }: { error?: string; pending: boolean; onSubmit: (token: string) => void }) {
  const id = useId()
  const errorId = useId()
  const [token, setToken] = useState('')
  function submit(event: FormEvent) {
    event.preventDefault()
    if (token.trim()) onSubmit(token.trim())
  }
  return (
    <Card padding="lg" className="mx-auto max-w-[440px]">
      <span className="grid size-11 place-items-center rounded-full bg-accent-soft text-accent-ink">
        <Lock className="size-5" aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-[26px] font-bold tracking-[-0.035em] text-ink">Waitlist admin</h1>
      <p className="mt-1.5 text-copy text-muted">Enter the admin token to see signups. It is the ADMIN_TOKEN secret set on this site.</p>
      <form onSubmit={submit} className="mt-6" noValidate>
        <Label htmlFor={id}>Admin token</Label>
        <Input
          id={id}
          type="password"
          autoComplete="current-password"
          className="mt-2.5"
          value={token}
          invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => setToken(e.target.value)}
        />
        {error && (
          <FieldMessage id={errorId} role="alert" tone="error" className="pt-2">
            {error}
          </FieldMessage>
        )}
        <Button type="submit" loading={pending} disabled={!token.trim()} className="mt-5 w-full">
          Unlock
        </Button>
      </form>
    </Card>
  )
}

function SignupTable({ signups }: { signups: Signup[] }) {
  return (
    <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Signups table">
      <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-line text-micro uppercase tracking-[0.08em] text-muted">
            <th scope="col" className="py-3 pl-6 pr-3 font-medium">Email</th>
            <th scope="col" className="px-3 py-3 font-medium">Spot</th>
            <th scope="col" className="px-3 py-3 font-medium">Referrals</th>
            <th scope="col" className="px-3 py-3 font-medium">Code</th>
            <th scope="col" className="px-3 py-3 font-medium">Referred by</th>
            <th scope="col" className="py-3 pl-3 pr-6 font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          {signups.map((s) => (
            <tr key={s.id} className="border-b border-line-soft transition-colors duration-150 last:border-0 hover:bg-stage">
              <td className="max-w-[260px] truncate py-3 pl-6 pr-3 font-medium text-ink">{s.email}</td>
              <td className="px-3 py-3 tabular-nums text-ink">#{s.position}</td>
              <td className="px-3 py-3">{s.referrals > 0 ? <Badge tone="accent">{s.referrals}</Badge> : <span className="text-muted">0</span>}</td>
              <td className="px-3 py-3 font-mono text-[13px] text-body">{s.code}</td>
              <td className="px-3 py-3 font-mono text-[13px] text-muted">{s.referred_by ?? '—'}</td>
              <td className="whitespace-nowrap py-3 pl-3 pr-6 text-muted">{dateFormat.format(s.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function AdminPage() {
  useTitle('Waitlist admin')
  const [token, setToken] = useState(readToken)
  const [state, setState] = useState<State>(() => (readToken() ? { status: 'loading' } : { status: 'locked' }))
  const [pending, setPending] = useState(false)
  const [query, setQuery] = useState('')
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const searchId = useId()

  async function load(next: string) {
    setPending(true)
    try {
      const data = await fetchSignups(next)
      writeToken(next)
      setToken(next)
      setState({ status: 'ready', signups: data.signups })
    } catch (err) {
      if (err instanceof ApiError && err.code === 'admin_disabled') setState({ status: 'disabled' })
      else if (err instanceof ApiError && err.status === 401) {
        writeToken(null)
        setToken('')
        setState({ status: 'locked', error: err.message })
      } else setState({ status: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong.' })
    } finally {
      setPending(false)
    }
  }

  useEffect(() => {
    if (token) load(token)
    else adminEnabled().then((on) => !on && setState({ status: 'disabled' }))
    // Only on mount: later loads are explicit.
  }, [])

  function lock() {
    writeToken(null)
    setToken('')
    setState({ status: 'locked' })
  }

  async function exportCsv() {
    setExporting(true)
    setExportError(null)
    try {
      await downloadSignupsCsv(token)
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : 'Export failed. Try again.')
    } finally {
      setExporting(false)
    }
  }

  const signups = state.status === 'ready' ? state.signups : []
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? signups.filter((s) => s.email.includes(q) || s.code.includes(q)) : signups
  }, [signups, query])
  const referred = signups.filter((s) => s.referred_by).length
  const today = signups.filter((s) => Date.now() - s.created_at < 86_400_000).length

  return (
    <PageShell cta={false}>
      <Container className="py-12 lg:py-16">
        {state.status === 'locked' && <Unlock error={state.error} pending={pending} onSubmit={load} />}

        {state.status === 'disabled' && (
          <div className="mx-auto max-w-[520px]">
            <h1 className="sr-only">Waitlist admin</h1>
            <Callout title="Admin is turned off" icon={<ShieldOff className="size-5" aria-hidden="true" />} className="bg-white">
              Set an <code className="font-mono text-[13px]">ADMIN_TOKEN</code> secret on this site (or in <code className="font-mono text-[13px]">.dev.vars</code> locally) and
              reload to see signups.
            </Callout>
          </div>
        )}

        {state.status === 'error' && (
          <div className="mx-auto max-w-[520px]">
            <h1 className="sr-only">Waitlist admin</h1>
            <Callout
              tone="error"
              title="Couldn't load signups"
              action={
                <Button variant="secondary" size="sm" loading={pending} onClick={() => load(token)} icon={<RefreshCw className="size-4" aria-hidden="true" />}>
                  Try again
                </Button>
              }
            >
              {state.message}
            </Callout>
          </div>
        )}

        {(state.status === 'loading' || state.status === 'ready') && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-title">Signups</h1>
                <p className="mt-1.5 text-copy text-muted">Everyone on the waitlist, newest first. Spots include referral boosts.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => load(token)} loading={pending && state.status === 'ready'} icon={<RefreshCw className="size-4" aria-hidden="true" />}>
                  Refresh
                </Button>
                <Button size="sm" onClick={exportCsv} loading={exporting} disabled={state.status !== 'ready' || signups.length === 0} icon={<Download className="size-4" aria-hidden="true" />}>
                  Export CSV
                </Button>
                <Button variant="ghost" size="sm" onClick={lock} icon={<LogOut className="size-4" aria-hidden="true" />}>
                  Lock
                </Button>
              </div>
            </div>
            {exportError && (
              <FieldMessage role="alert" tone="error" className="mt-3">
                {exportError}
              </FieldMessage>
            )}

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Total signups', value: signups.length },
                { label: 'Joined via referral', value: referred },
                { label: 'Last 24 hours', value: today },
              ].map((s) => (
                <Card key={s.label}>{state.status === 'loading' ? <Skeleton className="h-12 w-24" /> : <Stat size="sm" label={s.label} value={s.value.toLocaleString()} />}</Card>
              ))}
            </div>

            <Card padding="none" className="mt-6 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-soft px-6 py-4">
                <label htmlFor={searchId} className="relative block w-full max-w-[320px]">
                  <span className="sr-only">Search signups</span>
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                  <Input id={searchId} inputSize="sm" type="search" placeholder="Search email or code" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-9!" />
                </label>
                {state.status === 'ready' && (
                  <p className="text-small text-muted" aria-live="polite">
                    {filtered.length.toLocaleString()} of {signups.length.toLocaleString()}
                  </p>
                )}
              </div>
              {state.status === 'loading' && (
                <div className="space-y-3 p-6" aria-busy="true" aria-label="Loading signups">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-5 w-full" />
                  ))}
                </div>
              )}
              {state.status === 'ready' && signups.length === 0 && (
                <Callout className="m-6" title="No signups yet" icon={<Inbox className="size-5" aria-hidden="true" />}>
                  Share the page and new signups will appear here.
                </Callout>
              )}
              {state.status === 'ready' && signups.length > 0 && filtered.length === 0 && (
                <Callout className="m-6" title="No matches" icon={<Search className="size-5" aria-hidden="true" />}>
                  Nothing matches “{query}”.
                </Callout>
              )}
              {state.status === 'ready' && filtered.length > 0 && <SignupTable signups={filtered} />}
            </Card>
          </>
        )}
      </Container>
    </PageShell>
  )
}
