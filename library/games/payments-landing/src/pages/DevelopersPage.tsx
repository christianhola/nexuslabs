import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { FormEvent } from 'react'
import { Play } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { SelectField, TextField } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { Segmented } from '../components/Segmented'
import { Tabs, useTabIds } from '../components/Tabs'
import { developers } from '../content'
import type { Endpoint } from '../content'
import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { currencies } from '../shared/fx'

type Lang = 'curl' | 'node' | 'python'
const langs: { id: Lang; label: string }[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
]

function sample(ep: Endpoint, lang: Lang) {
  const url = `${developers.base}${ep.path}`
  if (ep.method === 'GET') {
    const qs = 'from=USD&to=EUR&amount=2500'
    if (lang === 'curl') return `curl "${url}?${qs}" \\\n  -H "Authorization: Bearer $LEDGERLY_KEY"`
    if (lang === 'node') return `const res = await fetch("${url}?${qs}", {\n  headers: { Authorization: \`Bearer \${process.env.LEDGERLY_KEY}\` },\n})\nconst quote = await res.json()`
    return `import os, requests\n\nquote = requests.get(\n    "${url}",\n    params={"from": "USD", "to": "EUR", "amount": 2500},\n    headers={"Authorization": f"Bearer {os.environ['LEDGERLY_KEY']}"},\n).json()`
  }
  const body =
    ep.id === 'transfers'
      ? '{ "quote": "qt_8fK2mZ", "recipient": { "name": "Lena Vogt", "account": "DE89370400440532013000" } }'
      : '{ "amount": 10500, "currency": "usd", "success_url": "https://shop.example/thanks" }'
  if (lang === 'curl') return `curl ${url} \\\n  -H "Authorization: Bearer $LEDGERLY_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${body}'`
  if (lang === 'node')
    return `const res = await fetch("${url}", {\n  method: "POST",\n  headers: {\n    Authorization: \`Bearer \${process.env.LEDGERLY_KEY}\`,\n    "Content-Type": "application/json",\n  },\n  body: JSON.stringify(${body}),\n})`
  return `import os, requests\n\nres = requests.post(\n    "${url}",\n    json=${body.replace(/"(\w+)":/g, '"$1":')},\n    headers={"Authorization": f"Bearer {os.environ['LEDGERLY_KEY']}"},\n)`
}

export function DevelopersPage() {
  const [active, setActive] = useState(developers.sidebar[0].id)
  const [lang, setLang] = useState<Lang>('curl')

  // Scroll-spy: highlight the section nearest the top of the viewport.
  useEffect(() => {
    const els = developers.sidebar.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-90px 0px -60% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <PageHeader eyebrow="Developers" title={developers.title} body={developers.body}>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <code className="rounded-control-sm bg-white px-3 py-2 font-mono text-[13px] text-ink-2 shadow-card">{developers.base}</code>
          <Badge tone="teal" dot>
            v1, stable
          </Badge>
        </div>
      </PageHeader>
      <Container className="grid grid-cols-[minmax(0,1fr)] gap-10 py-14 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <nav aria-label="Docs" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {developers.sidebar.map((s) => (
              <li key={s.id} className="shrink-0">
                <Link
                  href={`#${s.id}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  className={cx(
                    'flex h-10 items-center rounded-control-sm px-3 text-[14px] font-medium transition-colors lg:border-l-2 lg:rounded-l-none',
                    active === s.id ? 'bg-teal-50 text-teal-deep lg:border-teal' : 'text-muted hover:text-ink lg:border-transparent',
                  )}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-20">
          <DocSection id="quickstart" title="Quickstart">
            <ol className="space-y-4">
              {developers.quickstart.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="round grid size-7 shrink-0 place-items-center rounded-full bg-navy text-[13px] font-semibold text-white">{i + 1}</span>
                  <p className="pt-0.5 text-[15.5px] leading-[1.6] text-ink-2">{s}</p>
                </li>
              ))}
            </ol>
          </DocSection>

          <DocSection id="auth" title="Authentication" body={developers.auth}>
            <CodeBlock title="Header" language="http" code={`Authorization: Bearer lk_test_4eC39HqLyjWDarjtT1zdp7dc`} />
          </DocSection>

          {developers.endpoints.map((ep) => (
            <DocSection key={ep.id} id={ep.id} title={ep.title} body={ep.body}>
              <p className="mb-5 flex items-center gap-2 font-mono text-[14px]">
                <Badge tone={ep.method === 'GET' ? 'teal' : 'navy'}>{ep.method}</Badge>
                <span className="text-ink">{ep.path}</span>
              </p>
              <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="overflow-x-auto rounded-card-sm border border-line">
                  <table className="w-full text-left text-[14px]">
                    <caption className="sr-only">Parameters for {ep.title}</caption>
                    <thead className="bg-mist-2 text-[12.5px] text-muted">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                          Parameter
                        </th>
                        <th scope="col" className="px-4 py-2.5 font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {ep.params.map((p) => (
                        <tr key={p.name} className="align-top">
                          <td className="px-4 py-3">
                            <code className="font-mono text-[13px] text-ink">{p.name}</code>
                            <span className="mt-0.5 block text-[12px] text-faint">
                              {p.type}
                              {p.required && <span className="text-warning">, required</span>}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <SampleTabs ep={ep} lang={lang} setLang={setLang} />
                  <CodeBlock title="Response" code={ep.response} />
                </div>
              </div>
            </DocSection>
          ))}

          <DocSection id="webhooks" title="Webhooks" body="We POST a signed JSON event to your endpoint. Verify the Ledgerly-Signature header before trusting it.">
            <ul className="divide-y divide-line rounded-card-sm border border-line">
              {developers.webhooks.map((w) => (
                <li key={w.event} className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-6">
                  <code className="w-52 shrink-0 font-mono text-[13px] text-teal-deep">{w.event}</code>
                  <span className="text-[14px] text-muted">{w.desc}</span>
                </li>
              ))}
            </ul>
          </DocSection>

          <DocSection id="errors" title="Errors" body="Errors return a JSON body with an error code and, for validation, per-field messages.">
            <div className="overflow-x-auto rounded-card-sm border border-line">
              <table className="w-full text-left text-[14px]">
                <caption className="sr-only">Error codes</caption>
                <thead className="bg-mist-2 text-[12.5px] text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Code
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-medium">
                      Meaning
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {developers.errors.map((e) => (
                    <tr key={e.code}>
                      <td className="tabular px-4 py-3 font-medium text-ink">{e.code}</td>
                      <td className="px-4 py-3">
                        <code className="font-mono text-[13px] text-ink-2">{e.name}</code>
                      </td>
                      <td className="px-4 py-3 text-muted">{e.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DocSection>

          <DocSection id="console" title={developers.console.title} body={developers.console.body}>
            <ApiConsole />
          </DocSection>
        </div>
      </Container>
    </>
  )
}

function DocSection({ id, title, body, children }: { id: string; title: string; body?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <h2 id={`${id}-h`} className="text-[28px] font-medium tracking-[-0.03em] text-ink">
        {title}
      </h2>
      {body && <p className="mt-3 max-w-[640px] text-[15.5px] leading-[1.65] text-muted">{body}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function SampleTabs({ ep, lang, setLang }: { ep: Endpoint; lang: Lang; setLang: (l: Lang) => void }) {
  const ids = useTabIds(`ex-${ep.id}`)
  return (
    <div>
      <Tabs label={`${ep.title} example language`} tabs={langs} value={lang} onChange={setLang} ids={ids} className="mb-2" />
      {langs.map((l) => (
        <div key={l.id} id={ids.panel(l.id)} role="tabpanel" aria-labelledby={ids.tab(l.id)} hidden={l.id !== lang}>
          {l.id === lang && <CodeBlock title={`${l.label} request`} code={sample(ep, l.id)} language={l.id} />}
        </div>
      ))}
    </div>
  )
}

function ApiConsole() {
  const [from, setFrom] = useState('USD')
  const [to, setTo] = useState('EUR')
  const [amount, setAmount] = useState('2500')
  const [speed, setSpeed] = useState<'instant' | 'standard'>('instant')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [result, setResult] = useState<{ status: number; ms: number; body: string } | null>(null)
  const url = `/api/quote?from=${from}&to=${to}&amount=${encodeURIComponent(amount)}&speed=${speed}`

  async function run(e: FormEvent) {
    e.preventDefault()
    setState('loading')
    const t0 = performance.now()
    const res = await api(url)
    setResult({ status: res.status, ms: Math.round(performance.now() - t0), body: JSON.stringify(res.data, null, 2) })
    setState('done')
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <form onSubmit={run} noValidate className="rounded-card-sm border border-line p-5">
        <div className="grid grid-cols-2 gap-4">
          <SelectField label="from" value={from} onChange={(e) => setFrom(e.target.value)} options={currencies.map((c) => c.code)} />
          <SelectField label="to" value={to} onChange={(e) => setTo(e.target.value)} options={currencies.map((c) => c.code)} />
          <TextField className="col-span-2" label="amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} hint="Try 0 or 5000000 to see a 400." />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-[14px] font-medium text-ink-2" id="console-speed">
            speed
          </p>
          <Segmented label="speed" value={speed} onChange={setSpeed} options={[{ id: 'instant', label: 'instant' }, { id: 'standard', label: 'standard' }]} />
        </div>
        <p className="mt-5 break-all rounded-control-sm bg-mist-2 px-3 py-2 font-mono text-[12.5px] text-ink-2">GET {url}</p>
        <Button type="submit" variant="dark" className="mt-4" loading={state === 'loading'} icon={<Play className="size-4" aria-hidden />}>
          {developers.console.run}
        </Button>
      </form>
      <div aria-live="polite">
        {result ? (
          <div>
            <p className="mb-2 flex items-center gap-2 text-[13px] text-muted">
              <Badge tone={result.status >= 200 && result.status < 300 ? 'success' : 'danger'}>{result.status || 'Network error'}</Badge>
              <span className="tabular">{result.ms} ms</span>
            </p>
            <CodeBlock title="Response body" code={result.body} />
          </div>
        ) : (
          <div className="grid h-full min-h-[220px] place-items-center rounded-card-sm border border-dashed border-line-strong bg-mist-2 p-6 text-center text-[14px] text-muted">
            Send a request to see the live response here.
          </div>
        )}
      </div>
    </div>
  )
}
