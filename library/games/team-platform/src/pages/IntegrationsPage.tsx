import { Check, PlugZap, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Badge, Chip } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Textarea } from '../components/Field'
import { IntegrationTile } from '../components/IntegrationTile'
import { Notice } from '../components/Notice'
import { PageHeader, SectionHeading } from '../components/SectionHeading'
import { integrationCategories, integrations } from '../content'
import type { Integration, IntegrationCategory } from '../content'
import { postJson } from '../lib/api'
import { validateIntegrationRequest } from '../lib/validate'
import type { Errors, IntegrationRequest } from '../lib/validate'

function RequestForm() {
  const [v, setV] = useState<IntegrationRequest>({ tool: '', email: '', useCase: '' })
  const [errors, setErrors] = useState<Errors<IntegrationRequest>>({})
  const [state, setState] = useState<{ kind: 'idle' | 'busy' } | { kind: 'ok'; ref: string } | { kind: 'error'; msg: string }>({ kind: 'idle' })
  const set = (k: keyof IntegrationRequest) => (e: { target: { value: string } }) => {
    setV((x) => ({ ...x, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validateIntegrationRequest(v)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setState({ kind: 'busy' })
    const res = await postJson<{ ref: string }>('/api/integration-requests', v)
    if (res.ok) {
      setState({ kind: 'ok', ref: res.data.ref })
      setV({ tool: '', email: '', useCase: '' })
    } else {
      setErrors((res.errors as Errors<IntegrationRequest>) ?? {})
      setState({ kind: 'error', msg: res.error })
    }
  }
  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-[var(--radius-card)] border border-line bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
      {state.kind === 'ok' ? (
        <Notice tone="ok" title="Request received">
          Thanks. Our product team reads every request; we will email you when it ships. Reference {state.ref}.
        </Notice>
      ) : null}
      {state.kind === 'error' ? <Notice tone="bad" title="That did not go through">{state.msg}</Notice> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Which tool?" error={errors.tool}>
          {(c) => <Input {...c} value={v.tool} onChange={set('tool')} placeholder="For example Rippling" />}
        </Field>
        <Field label="Work email" error={errors.email}>
          {(c) => <Input {...c} type="email" autoComplete="email" value={v.email} onChange={set('email')} placeholder="you@company.com" />}
        </Field>
      </div>
      <Field label="What should it do?" optional error={errors.useCase} hint="Who would use it, and what should sync">
        {(c) => <Textarea {...c} value={v.useCase} onChange={set('useCase')} />}
      </Field>
      <div>
        <Button type="submit" loading={state.kind === 'busy'}>
          Send request
        </Button>
      </div>
    </form>
  )
}

export function IntegrationsPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<IntegrationCategory | 'All'>('All')
  const [open, setOpen] = useState<Integration | null>(null)
  const query = q.trim().toLowerCase()
  const base = useMemo(() => integrations.filter((i) => !query || (i.name + ' ' + i.description + ' ' + i.category).toLowerCase().includes(query)), [query])
  const list = cat === 'All' ? base : base.filter((i) => i.category === cat)

  return (
    <>
      <Container>
        <PageHeader eyebrow="Integrations" title="Connect the tools you already run" body="People sync from HR, sign-in comes from your identity provider and shifts arrive from your scheduling tool. Most setups take an afternoon." />
        <div className="flex flex-col gap-4">
          <div className="relative max-w-[520px]">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
            <label htmlFor="int-q" className="sr-only">
              Search integrations
            </label>
            <input id="int-q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search integrations" className="h-12 w-full rounded-[10px] border border-line-strong pl-10 pr-3 text-[15px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45" />
          </div>
          <div role="group" aria-label="Category" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
            {(['All', ...integrationCategories] as const).map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)} count={c === 'All' ? base.length : base.filter((i) => i.category === c).length}>
                {c}
              </Chip>
            ))}
          </div>
        </div>
        <p className="mt-6 text-[13.5px] text-faint" aria-live="polite">
          {list.length} integration{list.length === 1 ? '' : 's'}
        </p>
        {list.length ? (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => setOpen(i)} className="flex h-full w-full items-start gap-4 rounded-[var(--radius-card-sm)] border border-line bg-card p-5 text-left transition-[border-color,box-shadow] duration-150 hover:border-ink hover:shadow-[5px_5px_0_var(--color-mint)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
                  <IntegrationTile name={i.name} color={i.color} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-ink">{i.name}</span>
                      {i.popular ? <Badge tone="mint">Popular</Badge> : null}
                    </span>
                    <span className="block text-[13px] text-faint">{i.category}</span>
                    <span className="mt-2 block text-[14.5px] leading-snug text-muted">{i.description}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            className="mt-3"
            icon={<PlugZap />}
            title={`No integration for “${q}” yet`}
            body="Ask for it below. Popular requests ship within a quarter."
            action={
              <Button size="sm" variant="outline" onClick={() => { setQ(''); setCat('All') }}>
                Show all
              </Button>
            }
          />
        )}
      </Container>

      <Container as="section" id="request" className="grid gap-10 pt-20 lg:grid-cols-[1fr_1.3fr]">
        <SectionHeading eyebrow="Missing something?" title="Request an integration" body="Tell us what you use and what should sync. You can also build your own with webhooks and the REST API." />
        <RequestForm />
      </Container>

      <Dialog open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} description={open?.category}>
        {open ? (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <IntegrationTile name={open.name} color={open.color} size={56} />
              <p className="text-[15.5px] leading-relaxed text-body">{open.description}</p>
            </div>
            <div>
              <h3 className="text-[13.5px] font-medium text-faint">What syncs</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {open.syncs.map((s) => (
                  <li key={s}>
                    <Badge tone="outline">
                      <Check className="size-3.5 text-leaf" aria-hidden />
                      {s}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="space-y-2.5 rounded-[14px] bg-mist p-4 text-[14.5px] text-body">
              {[`Connect ${open.name} as an admin in Branchwork settings`, 'Map fields and choose which teams sync', 'Run a preview sync, then switch on nightly updates'].map((s, n) => (
                <li key={s} className="flex gap-3">
                  <span className="round grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-card text-[12px] font-semibold">{n + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <Button href="/demo" arrow className="w-full" onClick={() => setOpen(null)}>
              See it in a demo
            </Button>
          </div>
        ) : null}
      </Dialog>
    </>
  )
}
