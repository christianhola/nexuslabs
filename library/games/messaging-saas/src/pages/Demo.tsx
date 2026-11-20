import { History, RotateCcw, TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Bubble, PhoneFrame, ProductCardInline } from '../components/mocks/Chat'
import { Notice } from '../components/Notice'
import { Eyebrow } from '../components/Section'
import { Skeleton, TypingDots } from '../components/TypingDots'
import { UrlForm } from '../components/UrlForm'
import { demoPage as d, images } from '../content'
import { postJson } from '../lib/api'
import type { Preview } from '../lib/preview'
import { navigate, useLocation } from '../lib/router'
import { useStored } from '../lib/storage'
import { useReducedMotion } from '../lib/useReducedMotion'

type State = { kind: 'idle' } | { kind: 'loading'; host: string } | { kind: 'error'; message: string } | { kind: 'done'; preview: Preview }

/** "Test our AI": posts the URL to /api/preview and plays back the drafted conversation. */
export function Demo() {
  const { search } = useLocation()
  const url = new URLSearchParams(search).get('url') ?? ''
  const reduce = useReducedMotion()
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [shown, setShown] = useState(0)
  const [step, setStep] = useState(0)
  const [recent, setRecent] = useStored<string[]>('demo-recent', [])
  const run = useRef(0)

  useEffect(() => {
    if (!url) {
      setState({ kind: 'idle' })
      return
    }
    const id = ++run.current
    setState({ kind: 'loading', host: url })
    setShown(0)
    setStep(0)
    const ticker = window.setInterval(() => setStep((s) => Math.min(s + 1, d.loading.length - 1)), reduce ? 50 : 550)
    const minWait = new Promise((r) => setTimeout(r, reduce ? 0 : 1700))
    Promise.all([postJson<{ preview: Preview }>('/api/preview', { url }), minWait]).then(([r]) => {
      clearInterval(ticker)
      if (id !== run.current) return
      if (!r.ok) return setState({ kind: 'error', message: r.error })
      setState({ kind: 'done', preview: r.data.preview })
      setRecent((list) => [r.data.preview.host, ...list.filter((h) => h !== r.data.preview.host)].slice(0, 5))
    })
    return () => clearInterval(ticker)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  // Reveal the drafted messages one by one.
  useEffect(() => {
    if (state.kind !== 'done') return
    if (shown >= state.preview.messages.length) return
    const t = setTimeout(() => setShown((n) => n + 1), reduce ? 0 : shown === 0 ? 200 : 850)
    return () => clearTimeout(t)
  }, [state, shown, reduce])

  const go = (host: string) => navigate(`/demo?url=${encodeURIComponent(host)}`)
  const p = state.kind === 'done' ? state.preview : null

  return (
    <section className="grain relative isolate overflow-hidden pb-24 pt-32 sm:pt-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_75%_10%,#17286a_0%,#0c1230_45%,#080b17_80%)]" />
      <img src={images.machine} alt="" aria-hidden className="absolute -right-40 top-10 -z-10 hidden w-[720px] animate-float opacity-30 [mask-image:radial-gradient(closest-side,#000_40%,transparent)] motion-reduce:animate-none xl:block" />
      <Container className="grid gap-14 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-20">
        <div className="grid content-start gap-8">
          <div className="grid gap-4">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h1 className="max-w-[640px] font-display text-[40px] font-medium leading-[1.08] tracking-[-0.025em] text-white sm:text-[56px]">{d.title}</h1>
            <p className="max-w-[560px] text-[17px] leading-[1.6] text-muted">{d.body}</p>
          </div>
          <UrlForm key={url} initial={url} onSubmit={go} loading={state.kind === 'loading'} autoFocus={!url} />

          {state.kind === 'error' ? (
            <Notice tone="error" title="We couldn’t draft that one">
              {state.message}
            </Notice>
          ) : null}

          {state.kind === 'loading' ? (
            <Card className="grid gap-4 p-6" aria-busy="true">
              <p className="text-[14px] text-soft" role="status">
                {d.loading[step]} for <span className="font-semibold text-white">{state.host}</span>…
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            </Card>
          ) : null}

          {p ? (
            <div className="grid gap-4 animate-rise">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-display text-[26px] font-medium text-white">{p.brand}</h2>
                <Badge>{p.category}</Badge>
                <Badge tone="mint" dot>
                  Draft ready
                </Badge>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="p-5">
                  <p className="text-[13px] text-faint">Projected lift</p>
                  <p className="mt-1 flex items-center gap-2 font-display text-[36px] font-medium text-white">
                    +{p.lift}% <TrendingUp aria-hidden className="size-5 text-mint-text" />
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-[13px] text-faint">Expected reply rate</p>
                  <p className="mt-1 font-display text-[36px] font-medium text-white">{p.replyRate}%</p>
                </Card>
                <Card className="p-5">
                  <p className="text-[13px] text-faint">Messages drafted</p>
                  <p className="mt-1 font-display text-[36px] font-medium text-white">{p.messages.filter((m) => m.from === 'brand').length}</p>
                </Card>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href={`/signup?store=${encodeURIComponent(p.host)}`} arrow size="lg">
                  Start with {p.brand}
                </Button>
                <Button variant="subtle" size="lg" onClick={() => navigate('/demo')}>
                  <RotateCcw aria-hidden className="size-4" /> Test another store
                </Button>
              </div>
            </div>
          ) : null}

          {state.kind === 'idle' ? (
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-[14px] font-semibold text-soft">
                  <History aria-hidden className="size-4" /> {d.recentTitle}
                </h2>
                {recent.length ? (
                  <button type="button" onClick={() => setRecent([])} className="min-h-10 rounded-[6px] px-2 text-[13px] text-muted hover:text-white">
                    Clear
                  </button>
                ) : null}
              </div>
              {recent.length ? (
                <ul className="flex flex-wrap gap-2">
                  {recent.map((h) => (
                    <li key={h}>
                      <button type="button" onClick={() => go(h)} className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-[14px] text-soft hover:bg-white hover:text-bg">
                        {h}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState title="No stores tested yet" body={d.recentEmpty} action={<Button variant="subtle" onClick={() => go('havencoffee.com')}>Try havencoffee.com</Button>} />
              )}
            </div>
          ) : null}
        </div>

        <PhoneFrame contact={p ? p.brand : state.kind === 'loading' ? 'Drafting…' : 'Your brand'}>
          <div className="flex flex-col gap-2.5" aria-live="polite">
            {p ? (
              p.messages.slice(0, shown).map((m, i) => (
                <Bubble key={i} from={m.from} className="animate-pop">
                  {m.text}
                  {m.product ? <ProductCardInline {...m.product} /> : null}
                </Bubble>
              ))
            ) : state.kind === 'loading' ? (
              <div className="flex justify-end">
                <TypingDots className="rounded-bl-[18px] rounded-br-[6px] bg-bubble-out/60" label="Drafting messages" />
              </div>
            ) : (
              <p className="m-auto max-w-[220px] pt-40 text-center text-[13px] text-faint">Enter a URL and your drafted conversation appears here.</p>
            )}
            {p && shown < p.messages.length ? (
              <div className={p.messages[shown].from === 'brand' ? 'flex justify-end' : 'flex'}>
                <TypingDots label="Typing" />
              </div>
            ) : null}
          </div>
        </PhoneFrame>
      </Container>
    </section>
  )
}
