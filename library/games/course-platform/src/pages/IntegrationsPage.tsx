import { CheckCircle2, PlugZap, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Chip } from '../components/Chip'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Select, Textarea, control } from '../components/Field'
import { Notice } from '../components/Notice'
import { SectionHeading } from '../components/SectionHeading'
import { Sheet } from '../components/Sheet'
import { useToast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { integrationCategories, integrations } from '../content'
import type { Integration, IntegrationCategory } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'
import { useForm } from '../lib/useForm'
import { validateIntegrationRequest } from '../lib/validate'

/*
  Integrations directory: search, filter by category, open one for details
  and connect it (kept in coursekit:connected). The request form at the
  bottom posts to /api/integration-request. Tiles show a coloured initial,
  not the vendor's logo; drop real logos in when you have the rights.
*/
export function IntegrationsPage() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<IntegrationCategory | 'All'>('All')
  const [connected, setConnected] = useStored<string[]>('connected', ['stripe', 'zoom'])
  const [onlyConnected, setOnlyConnected] = useState(false)
  const [open, setOpen] = useState<Integration | null>(null)
  const toast = useToast()

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return integrations.filter((i) => (cat === 'All' || i.category === cat) && (!onlyConnected || connected.includes(i.id)) && (!t || i.name.toLowerCase().includes(t) || i.blurb.toLowerCase().includes(t) || i.category.toLowerCase().includes(t)))
  }, [q, cat, onlyConnected, connected])

  const toggle = (i: Integration) => {
    const on = connected.includes(i.id)
    setConnected((c) => (on ? c.filter((x) => x !== i.id) : [...c, i.id]))
    toast(on ? `${i.name} disconnected` : `${i.name} connected`)
  }

  return (
    <>
      <section className="pb-10 pt-10 lg:pt-16">
        <Container>
          <SectionHeading as="h1" eyebrow="Integrations" title="Plug Coursekit Into Your Stack" lead="Payments, email, video, community and analytics. Connect in a click; everything syncs both ways." />
        </Container>
      </section>
      <section aria-label="Integration directory" className="pb-20">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-[340px]">
              <label htmlFor="int-search" className="sr-only">
                Search integrations
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <input id="int-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 18 integrations" className={cx(control, 'h-11 pl-10')} />
            </div>
            <Toggle checked={onlyConnected} onChange={setOnlyConnected} label={`Connected only (${connected.length})`} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {(['All', ...integrationCategories] as const).map((c) => (
              <Chip key={c} active={cat === c} onClick={() => setCat(c)} count={c === 'All' ? integrations.length : integrations.filter((i) => i.category === c).length}>
                {c}
              </Chip>
            ))}
          </div>
          <p className="sr-only" aria-live="polite">
            {list.length} integrations shown
          </p>
          {list.length === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<PlugZap />}
              title="No integrations match"
              body={q ? `Nothing matches “${q}”. Try another word, or ask us to build it.` : 'Nothing is connected in this category yet.'}
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" onClick={() => { setQ(''); setCat('All'); setOnlyConnected(false) }}>
                    Clear filters
                  </Button>
                  <Button href="#request">Request it</Button>
                </div>
              }
            />
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((i) => {
                const on = connected.includes(i.id)
                return (
                  <li key={i.id}>
                    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-card transition-shadow hover:shadow-float">
                      <div className="flex items-start justify-between gap-3">
                        <Tile i={i} />
                        {on ? (
                          <Badge tone="ok" dot>
                            Connected
                          </Badge>
                        ) : 'popular' in i && i.popular ? (
                          <Badge tone="flame">Popular</Badge>
                        ) : null}
                      </div>
                      <h2 className="mt-4 font-display text-[17px] font-medium text-ink">{i.name}</h2>
                      <p className="text-[13px] text-faint">{i.category}</p>
                      <p className="mt-2 flex-1 text-[14px] leading-relaxed text-muted">{i.blurb}</p>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" variant={on ? 'outline' : 'soft'} onClick={() => toggle(i)} aria-label={`${on ? 'Disconnect' : 'Connect'} ${i.name}`}>
                          {on ? 'Disconnect' : 'Connect'}
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setOpen(i)} aria-label={`${i.name} details`}>
                          Details
                        </Button>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          )}
        </Container>
      </section>
      <section id="request" aria-labelledby="request-title" className="bg-canvas py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading align="left" id="request-title" eyebrow="Missing something?" title="Request an integration" lead="Tell us what you use. We build the most requested ones every quarter and email you when yours ships." />
          <RequestForm />
        </Container>
      </section>
      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.name ?? 'Integration'}>
        {open ? <Details i={open} on={connected.includes(open.id)} onToggle={() => toggle(open)} /> : null}
      </Sheet>
    </>
  )
}

function Tile({ i, big }: { i: Integration; big?: boolean }) {
  return (
    <span className={cx('grid shrink-0 place-items-center rounded-[12px] font-display font-semibold text-white', big ? 'size-14 text-[24px]' : 'size-11 text-[18px]')} style={{ background: i.color }} aria-hidden>
      {i.name[0]}
    </span>
  )
}

function Details({ i, on, onToggle }: { i: Integration; on: boolean; onToggle: () => void }) {
  const [sync, setSync] = useStored<Record<string, boolean>>(`sync-${i.id}`, { enrol: true, complete: true, refunds: false })
  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex items-center gap-4">
        <Tile i={i} big />
        <div>
          <p className="text-[13.5px] text-muted">{i.category}</p>
          {on ? (
            <p className="flex items-center gap-1.5 text-[14px] font-medium text-ok">
              <CheckCircle2 className="size-4" aria-hidden /> Connected
            </p>
          ) : (
            <p className="flex items-center gap-1.5 text-[14px] text-muted">
              <X className="size-4" aria-hidden /> Not connected
            </p>
          )}
        </div>
      </div>
      <p className="text-[15px] leading-relaxed text-body">{i.blurb} Setup takes about two minutes and you can disconnect at any time.</p>
      <Card tone="wash" pad="sm">
        <p className="font-display text-[14px] font-medium text-ink">Sync these events</p>
        <div className="mt-2 flex flex-col">
          <Toggle checked={sync.enrol!} onChange={(v) => setSync((s) => ({ ...s, enrol: v }))} label="New enrolments" disabled={!on} />
          <Toggle checked={sync.complete!} onChange={(v) => setSync((s) => ({ ...s, complete: v }))} label="Course completions" disabled={!on} />
          <Toggle checked={sync.refunds!} onChange={(v) => setSync((s) => ({ ...s, refunds: v }))} label="Refunds" disabled={!on} />
        </div>
        {!on ? <p className="mt-2 text-[13px] text-muted">Connect first to choose what syncs.</p> : null}
      </Card>
      <div className="mt-auto pt-4">
        <Button className="w-full" size="lg" variant={on ? 'outline' : 'primary'} onClick={onToggle}>
          {on ? `Disconnect ${i.name}` : `Connect ${i.name}`}
        </Button>
      </div>
    </div>
  )
}

function RequestForm() {
  const f = useForm<{ tool: string; category: string; email: string; useCase: string }, { ref: string }>({
    initial: { tool: '', category: '', email: '', useCase: '' },
    url: '/api/integration-request',
    validate: validateIntegrationRequest,
  })
  if (f.status === 'success')
    return (
      <Card pad="lg">
        <Notice tone="ok" title={`Request ${f.result?.ref} received`}>
          Thanks. We will email {f.values.email} when {f.values.tool} ships.
        </Notice>
        <Button variant="outline" className="mt-4" onClick={f.reset}>
          Request another
        </Button>
      </Card>
    )
  return (
    <Card pad="lg">
      <form ref={f.form} onSubmit={f.submit} noValidate className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Tool name" error={f.errors.tool}>
          {(ctl) => <Input {...ctl} value={f.values.tool} onChange={(e) => f.set('tool', e.target.value)} placeholder="e.g. Notion" />}
        </Field>
        <Field label="Category" error={f.errors.category}>
          {(ctl) => (
            <Select {...ctl} value={f.values.category} onChange={(e) => f.set('category', e.target.value)}>
              <option value="">Choose one</option>
              {integrationCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          )}
        </Field>
        <Field label="Your email" error={f.errors.email} className="sm:col-span-2">
          {(ctl) => <Input {...ctl} type="email" autoComplete="email" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} />}
        </Field>
        <Field label="What would you use it for?" optional error={f.errors.useCase} className="sm:col-span-2">
          {(ctl) => <Textarea {...ctl} value={f.values.useCase} onChange={(e) => f.set('useCase', e.target.value)} />}
        </Field>
        {f.status === 'error' && f.message ? <Notice tone="bad" className="sm:col-span-2">{f.message}</Notice> : null}
        <Button type="submit" size="lg" loading={f.status === 'submitting'} className="sm:col-span-2 sm:justify-self-start">
          Send request
        </Button>
      </form>
    </Card>
  )
}
