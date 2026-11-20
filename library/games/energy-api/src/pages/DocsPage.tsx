import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, CircleCheck, Eye, EyeOff, KeyRound, Play, RotateCcw } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Checkbox } from '../components/Checkbox'
import { CodeBlock, CopyButton } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/Field'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { RadioCard } from '../components/RadioCard'
import { Tabs, useIdBase } from '../components/Tabs'
import { docs, makers } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { mintSandboxKey } from '../shared/sandbox'
import { snippets } from '../lib/snippets'
import type { Lang } from '../lib/snippets'
import { keys, useStore } from '../lib/store'
import { Spinner } from '../components/Spinner'

type StepId = (typeof docs.steps)[number]['id']

const langs: { value: Lang; label: string }[] = [
  { value: 'curl', label: 'cURL' },
  { value: 'node', label: 'Node' },
  { value: 'python', label: 'Python' },
]

/** Code with the shared language tabs; the choice persists across the site. */
function LangCode({ snippet }: { snippet: keyof typeof snippets }) {
  const [lang, setLang] = useStore<Lang>(keys.docsLang, 'node')
  const idBase = useIdBase()
  return (
    <CodeBlock
      code={snippets[snippet][lang]}
      panel={{ idBase, value: lang }}
      header={<Tabs label="Language" idBase={idBase} tone="forest" value={lang} onChange={setLang} items={langs} className="-ml-2" />}
    />
  )
}

type ApiResult = { status: number; ms: number; body: unknown } | { status: 0; ms: number; body: string }

function ApiResponse({ result }: { result: ApiResult }) {
  const ok = result.status >= 200 && result.status < 300
  return (
    <div className="on-forest mt-3 overflow-hidden rounded-card-sm bg-forest-2 text-on-forest" role="status" aria-label="Response">
      <div className="flex items-center gap-3 border-b border-forest-line px-4 py-2.5 text-[13px]">
        <span className={cx('round rounded-pill px-2 py-0.5 font-mono text-[12px] font-medium', ok ? 'bg-volt text-ink' : 'bg-[#f3b3a8] text-[#4a120c]')}>
          {result.status || 'Network error'}
        </span>
        <span className="text-on-forest-muted tabular">{result.ms} ms</span>
      </div>
      <pre tabIndex={0} className="max-h-[320px] overflow-auto px-4 py-3 font-mono text-[12.5px] leading-[1.65] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-volt">
        {typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2)}
      </pre>
    </div>
  )
}

async function call(path: string, key: string | null, init?: RequestInit): Promise<ApiResult> {
  const t = performance.now()
  try {
    const res = await fetch(path, {
      ...init,
      headers: { 'content-type': 'application/json', ...(key ? { authorization: `Bearer ${key}` } : {}) },
    })
    const body = await res.json().catch(() => null)
    return { status: res.status, ms: Math.round(performance.now() - t), body }
  } catch {
    return { status: 0, ms: Math.round(performance.now() - t), body: 'Could not reach the sandbox. Is the dev server running?' }
  }
}

function Step({ id, n, title, done, onDone, children }: { id: StepId; n: number; title: string; done: boolean; onDone: (v: boolean) => void; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-12 first:border-t-0 first:pt-0">
      <div className="flex items-start gap-4">
        <span
          className={cx(
            'round grid size-9 shrink-0 place-items-center rounded-full text-[14px] font-medium tabular transition-colors',
            done ? 'bg-ink text-volt' : 'bg-paper text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
          )}
          aria-hidden
        >
          {done ? <Check className="size-4" strokeWidth={3} /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${id}-title`} className="pt-1 text-[24px] font-medium tracking-[-0.025em]">
            {title}
          </h2>
          <div className="mt-4 space-y-4 text-[15.5px] leading-[1.65] text-ink-2">{children}</div>
          <div className="mt-6">
            <Checkbox checked={done} onChange={onDone} label="Mark this step as done" />
          </div>
        </div>
      </div>
    </section>
  )
}

const inline = 'round rounded-[6px] bg-mint-2 px-1.5 py-0.5 font-mono text-[13.5px] text-ink'

export function DocsPage() {
  const [key, setKey] = useStore<string | null>(keys.sandboxKey, null)
  const [done, setDone] = useStore<StepId[]>(keys.steps, [])
  const [active, setActive] = useState<StepId>('key')
  const [reveal, setReveal] = useState(false)

  // Scroll-spy: the last step whose top has passed the sticky header.
  useEffect(() => {
    let raf = 0
    const on = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        let current: StepId = docs.steps[0].id
        for (const s of docs.steps) {
          const el = document.getElementById(s.id)
          if (el && el.getBoundingClientRect().top < 160) current = s.id
        }
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = docs.steps[docs.steps.length - 1].id
        setActive(current)
      })
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', on)
    }
  }, [])

  const mark = (id: StepId) => (v: boolean) => setDone((d) => (v ? Array.from(new Set([...d, id])) : d.filter((x) => x !== id)))
  const isDone = (id: StepId) => done.includes(id)
  const progress = done.length / docs.steps.length

  return (
    <>
      <PageHeader eyebrow="Docs" title={docs.title} body={docs.body} />
      <Container className="pb-24">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <nav aria-label="Quickstart steps">
              <div className="mb-4">
                <div className="flex items-baseline justify-between text-[13.5px]">
                  <span className="font-medium">Your progress</span>
                  <span className="text-muted tabular">
                    {done.length} of {docs.steps.length}
                  </span>
                </div>
                <div className="round mt-2 h-1.5 overflow-hidden rounded-full bg-mint-3" role="progressbar" aria-label="Quickstart progress" aria-valuemin={0} aria-valuemax={docs.steps.length} aria-valuenow={done.length}>
                  <div className="h-full rounded-full bg-ink transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
                </div>
              </div>
              <ol className="space-y-0.5">
                {docs.steps.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      href={`#${s.id}`}
                      aria-current={active === s.id ? 'location' : undefined}
                      className={cx(
                        'flex min-h-10 items-center gap-3 rounded-control-sm px-3 text-[14.5px] transition-colors',
                        active === s.id ? 'bg-paper font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]' : 'text-muted hover:text-ink',
                      )}
                    >
                      <span className="w-4 text-center tabular text-[13px]">{isDone(s.id) ? <CircleCheck className="size-4 text-leaf" aria-label="Done" /> : i + 1}</span>
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ol>
              {done.length > 0 && (
                <Button variant="ghost" size="sm" className="mt-3" iconLeft={<RotateCcw className="size-3.5" aria-hidden />} onClick={() => setDone([])}>
                  Reset progress
                </Button>
              )}
            </nav>
          </aside>

          <div className="min-w-0 max-w-[780px]">
            <Step id="key" n={1} title="Create a sandbox key" done={isDone('key')} onDone={mark('key')}>
              <p>
                Sandbox keys start with <code className={inline}>gw_sbx_</code> and only reach simulated devices, so you can experiment freely. This one is stored in your browser and used by the
                Run buttons below.
              </p>
              {key ? (
                <Card className="flex flex-wrap items-center gap-3 p-3 pl-4">
                  <KeyRound className="size-4 shrink-0 text-muted" aria-hidden />
                  <code className="min-w-0 flex-1 truncate font-mono text-[13.5px]" aria-label="Sandbox key">
                    {reveal ? key : `${key.slice(0, 11)}${'•'.repeat(17)}`}
                  </code>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setReveal((r) => !r)} iconLeft={reveal ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}>
                      {reveal ? 'Hide' : 'Show'}
                    </Button>
                    <CopyButton text={key} label="Copy key" className="text-ink-2 hover:bg-mint-2 hover:text-ink" />
                    <Button variant="ghost" size="sm" onClick={() => setKey(null)}>
                      Revoke
                    </Button>
                  </div>
                </Card>
              ) : (
                <Button
                  iconLeft={<KeyRound className="size-4" aria-hidden />}
                  onClick={() => {
                    setKey(mintSandboxKey())
                    mark('key')(true)
                  }}
                >
                  Create sandbox key
                </Button>
              )}
            </Step>

            <Step id="install" n={2} title={docs.steps[1].title} done={isDone('install')} onDone={mark('install')}>
              <p>Install the SDK for your language and keep the key in an environment variable, never in source code.</p>
              <LangCode snippet="install" />
            </Step>

            <Step id="link" n={3} title={docs.steps[2].title} done={isDone('link')} onDone={mark('link')}>
              <p>
                Create a link session for one of your users and send them to its <code className={inline}>link_url</code>. They pick their brand, sign in once, and come back to your redirect
                with the device linked.
              </p>
              <LangCode snippet="link" />
              <LinkPreview onLinked={() => mark('link')(true)} />
            </Step>

            <Step id="read" n={4} title={docs.steps[3].title} done={isDone('read')} onDone={mark('read')}>
              <p>
                Every device returns the same shape: an <code className={inline}>id</code>, its <code className={inline}>type</code> and vendor, and a <code className={inline}>state</code>{' '}
                object that is normalised across brands.
              </p>
              <LangCode snippet="read" />
              <RunRead apiKey={key} onSuccess={() => mark('read')(true)} />
            </Step>

            <Step id="schedule" n={5} title={docs.steps[4].title} done={isDone('schedule')} onDone={mark('schedule')}>
              <p>
                Ask for a target and a ready time. Gridwise picks the cheapest hours before then and keeps the device on plan, re-planning if it is unplugged or prices change.
              </p>
              <LangCode snippet="schedule" />
              <RunSchedule apiKey={key} onSuccess={() => mark('schedule')(true)} />
            </Step>

            <Step id="webhooks" n={6} title={docs.steps[5].title} done={isDone('webhooks')} onDone={mark('webhooks')}>
              <p>Subscribe an HTTPS endpoint and Gridwise posts an event whenever something changes. Verify the signature header before trusting the body.</p>
              <LangCode snippet="webhook" />
              <div tabIndex={0} role="region" aria-label="Webhook events, scrolls sideways" className="relative overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-[14px]">
                  <caption className="sr-only">Webhook events</caption>
                  <thead>
                    <tr className="border-b border-line text-muted">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Event
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Sent when
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {[
                      ['device.linked', 'A user finishes the link flow'],
                      ['device.state.updated', 'Battery, power or plug state changes'],
                      ['schedule.started', 'A planned window begins'],
                      ['schedule.completed', 'The device reaches its target'],
                      ['device.unlinked', 'The user or vendor revokes access'],
                    ].map(([e, w]) => (
                      <tr key={e}>
                        <td className="py-2.5 pr-4 font-mono text-[13px]">{e}</td>
                        <td className="py-2.5 text-ink-2">{w}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Step>

            {done.length === docs.steps.length && (
              <Notice tone="success" title="You finished the quickstart" className="mt-2">
                Next, link a real device: it counts towards the 25 free devices on the Sandbox plan. <Link href="/pricing" className="underline underline-offset-2">See plans</Link>.
              </Notice>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

function RunRead({ apiKey, onSuccess }: { apiKey: string | null; onSuccess: () => void }) {
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)
  return (
    <Card tone="mint" className="p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[13px] text-ink-2">
          <span className="font-medium text-ink">GET</span> /v1/devices?type=vehicle
        </p>
        <Button
          size="sm"
          loading={busy}
          iconLeft={<Play className="size-3.5" aria-hidden />}
          onClick={async () => {
            setBusy(true)
            const r = await call('/api/v1/devices?type=vehicle', apiKey)
            setResult(r)
            setBusy(false)
            if (r.status === 200) onSuccess()
          }}
        >
          Run in sandbox
        </Button>
      </div>
      {!apiKey && !result && <p className="mt-2 text-[13.5px] text-muted">No key yet: this call will return 401. Create one in step 1.</p>}
      {result && <ApiResponse result={result} />}
    </Card>
  )
}

function RunSchedule({ apiKey, onSuccess }: { apiKey: string | null; onSuccess: () => void }) {
  const [busy, setBusy] = useState(false)
  const [target, setTarget] = useState('80')
  const [readyBy, setReadyBy] = useState('07:00')
  const [result, setResult] = useState<ApiResult | null>(null)
  const fields = result && result.status === 422 ? ((result.body as { error?: { fields?: Record<string, string> } })?.error?.fields ?? {}) : {}
  return (
    <Card tone="mint" className="p-4">
      <form
        className="grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault()
          setBusy(true)
          const r = await call('/api/v1/devices/veh_7Hq2Lx/schedules', apiKey, { method: 'POST', body: JSON.stringify({ targetPercent: Number(target), readyBy }) })
          setResult(r)
          setBusy(false)
          if (r.status === 201) onSuccess()
        }}
      >
        <Input label="targetPercent" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} error={fields.targetPercent} className="[&_label]:font-mono [&_label]:text-[13px]" />
        <Input label="readyBy" value={readyBy} onChange={(e) => setReadyBy(e.target.value)} error={fields.readyBy} className="[&_label]:font-mono [&_label]:text-[13px]" />
        <Button type="submit" loading={busy} iconLeft={<Play className="size-3.5" aria-hidden />} className="h-12 sm:mb-0">
          Send schedule
        </Button>
      </form>
      {result && <ApiResponse result={result} />}
    </Card>
  )
}

/** A simulated hosted link flow, so the step can be tried without a real account. */
function LinkPreview({ onLinked }: { onLinked: () => void }) {
  const [open, setOpen] = useState(false)
  const [vendor, setVendor] = useState('voltaro')
  const [phase, setPhase] = useState<'pick' | 'connecting' | 'done'>('pick')
  const evs = makers.filter((m) => m.category === 'ev' && m.status === 'live').slice(0, 4)
  const chosen = evs.find((m) => m.id === vendor)
  return (
    <>
      <Card className="flex flex-wrap items-center justify-between gap-4 p-4 pl-5">
        <div>
          <p className="text-[15px] font-medium text-ink">Try the link flow</p>
          <p className="text-[13.5px] text-muted">
            What your customer sees at link_url. <Link href="/devices?category=ev" className="underline underline-offset-2 hover:text-ink">All car brands</Link>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setPhase('pick')
            setOpen(true)
          }}
        >
          Open link flow
        </Button>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)} title={phase === 'done' ? 'Car linked' : 'Connect your car'} description={phase === 'pick' ? 'Choose the brand of your electric car.' : undefined}>
        {phase === 'pick' && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setPhase('connecting')
              window.setTimeout(() => {
                setPhase('done')
                onLinked()
              }, 1100)
            }}
          >
            <fieldset>
              <legend className="sr-only">Car brand</legend>
              <div className="grid gap-2">
                {evs.map((m) => (
                  <RadioCard key={m.id} name="vendor" value={m.id} checked={vendor === m.id} onChange={setVendor} title={m.name} hint={`${m.models} models`} />
                ))}
              </div>
            </fieldset>
            <Button type="submit" block size="lg" className="mt-5">
              Continue
            </Button>
          </form>
        )}
        {phase === 'connecting' && (
          <div className="flex flex-col items-center py-8 text-center" role="status">
            <Spinner className="size-7" />
            <p className="mt-4 text-[15px] font-medium">Connecting to {chosen?.name}…</p>
            <p className="text-[13.5px] text-muted">Checking the car is online</p>
          </div>
        )}
        {phase === 'done' && (
          <div>
            <Notice tone="success" title={`${chosen?.name} linked`}>
              Gridwise sent <span className="font-mono text-[13px]">device.linked</span> to your webhook.
            </Notice>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone="live" dot>
                Online
              </Badge>
              <Badge>46% battery</Badge>
              <Badge>Plugged in</Badge>
            </div>
            <Button block size="lg" className="mt-6" onClick={() => setOpen(false)}>
              Back to the docs
            </Button>
          </div>
        )}
      </Dialog>
    </>
  )
}
