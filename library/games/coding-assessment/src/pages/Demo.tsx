import { useCallback, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowLeft, Check, Clock, Lock, Play, RotateCcw, Send, Sparkles } from 'lucide-react'

import { AiPanel } from '../components/AiPanel'
import { Badge, difficultyTone } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { CodeEditor } from '../components/CodeEditor'
import { Checkbox, Input } from '../components/Field'
import { LogoMark } from '../components/Logo'
import { Kbd, Notice } from '../components/Misc'
import { Modal } from '../components/Modal'
import { Tabs, tabPanelProps } from '../components/Tabs'
import { ConsoleOutput, TestResults } from '../components/TestResults'
import { useToast } from '../components/Toast'
import { ASSISTANT, DEMO } from '../content'
import { getProblem, PROBLEMS } from '../data'
import type { Problem } from '../data'
import { ApiError, post } from '../lib/api'
import { cx } from '../lib/cx'
import { formatClock } from '../lib/format'
import { Link, navigate, useLocation } from '../lib/router'
import { runTests } from '../lib/runner'
import type { RunResult } from '../lib/runner'
import { readStore, useStored, writeStore } from '../lib/storage'
import { saveAttempt } from '../lib/store'
import type { AiTurn, Snapshot } from '../lib/store'
import { scoreAttempt, validateCandidate } from '../shared/validate'
import type { Errors } from '../shared/validate'

/*
  The candidate experience. Intro (who you are, which challenge) → workspace
  (statement, editor, tests, assistant) → submit, which runs the hidden tests,
  posts the result to /api/attempts and opens the report. The session lives
  in localStorage, so a reload drops you back where you were.
*/

type Session = {
  problemId: string
  startedAt: number
  ai: AiTurn[]
  pastes: number
  pastedChars: number
  tabSwitches: number
  runs: number
  snapshots: Snapshot[]
}

export function Demo() {
  const [session, setSession] = useStored<Session | null>('demo:session', null)
  const [candidate, setCandidate] = useStored<{ name: string; email: string } | null>('demo:candidate', null)
  if (!session || !candidate) return <Intro initial={candidate} onStart={(c, problemId) => {
    setCandidate(c)
    setSession({ problemId, startedAt: Date.now(), ai: [], pastes: 0, pastedChars: 0, tabSwitches: 0, runs: 0, snapshots: [] })
  }} />
  return <Workspace key={session.problemId + session.startedAt} session={session} setSession={setSession} candidate={candidate} />
}

function Frame({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-white/7 bg-bg/90 px-3 backdrop-blur-xl sm:px-4">
        <Link href="/" aria-label="Codetrial home" className="grid size-10 place-items-center rounded-lg">
          <LogoMark />
        </Link>
        {right}
      </header>
      <main id="main" tabIndex={-1} className="flex min-h-0 flex-1 flex-col">
        {children}
      </main>
    </div>
  )
}

function Intro({ initial, onStart }: { initial: { name: string; email: string } | null; onStart: (c: { name: string; email: string }, problemId: string) => void }) {
  const { search } = useLocation()
  const fromUrl = new URLSearchParams(search).get('problem')
  const [problemId, setProblemId] = useState(PROBLEMS.some((p) => p.id === fromUrl) ? fromUrl! : PROBLEMS[0]!.id)
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = validateCandidate({ name, email, consent })
    setErrors(v.ok ? {} : v.errors)
    if (!v.ok) return
    setBusy(true)
    setFormError('')
    try {
      await post('/api/attempts/start', { name, email, consent })
      onStart(v.value, problemId)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields)
        setFormError(Object.keys(err.fields).length ? '' : err.message)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <Frame right={<ButtonLink href="/" variant="ghost" size="sm" className="ml-auto" icon={<ArrowLeft className="size-4" />}>Back to site</ButtonLink>}>
      <div className="relative isolate flex-1">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,#0c302c,transparent_75%)]" />
        <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_440px] lg:py-20">
          <div>
            <p className="text-[14px] font-medium text-brand-text">{DEMO.intro.eyebrow}</p>
            <h1 className="mt-3 text-balance text-[36px] leading-[1.06] font-normal tracking-[-0.03em] text-stage sm:text-[50px]">{DEMO.intro.title}</h1>
            <p className="mt-4 max-w-[540px] text-[17px] leading-relaxed text-muted">{DEMO.intro.sub}</p>
            <ul className="mt-8 grid gap-3">
              {DEMO.intro.rules.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[15.5px]">
                  <span className="round mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/15 text-brand-text">
                    <Check aria-hidden className="size-3" strokeWidth={3} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <Card className="p-6 sm:p-7">
            <form onSubmit={submit} noValidate className="grid gap-5">
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-[14px] font-medium">Choose a challenge</legend>
                {PROBLEMS.map((p) => (
                  <label key={p.id} className={cx('flex cursor-pointer items-center gap-3 rounded-[14px] px-4 py-3 ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-text', problemId === p.id ? 'bg-brand/8 ring-brand/50' : 'ring-line-strong hover:bg-white/4')}>
                    <input type="radio" name="problem" value={p.id} checked={problemId === p.id} onChange={() => setProblemId(p.id)} className="sr-only" />
                    <span aria-hidden className={cx('round grid size-4.5 shrink-0 place-items-center rounded-full ring-1 ring-inset', problemId === p.id ? 'ring-brand' : 'ring-white/30')}>
                      {problemId === p.id && <span className="round size-2.5 rounded-full bg-brand" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-fg">{p.title}</span>
                      <span className="block text-[13px] text-muted">{p.minutes} minutes, {p.skill.toLowerCase()}</span>
                    </span>
                    <Badge tone={difficultyTone[p.difficulty]}>{p.difficulty}</Badge>
                  </label>
                ))}
              </fieldset>
              <Input label="Your name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
              <Input label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} hint="Only used to label your sample report." />
              <Checkbox label={DEMO.intro.consent} checked={consent} onChange={setConsent} error={errors.consent} />
              {formError && <Notice tone="error">{formError}</Notice>}
              <Button type="submit" size="lg" loading={busy} className="w-full">
                {DEMO.intro.start}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Frame>
  )
}

function Workspace({ session, setSession, candidate }: { session: Session; setSession: (s: Session | null | ((p: Session | null) => Session | null)) => void; candidate: { name: string; email: string } }) {
  const problem = getProblem(session.problemId)
  const toast = useToast()
  const [code, setCode] = useStored(`demo:code:${problem.id}`, problem.starter)
  const [run, setRun] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [out, setOut] = useState<'tests' | 'console'>('tests')
  const [side, setSide] = useState<'problem' | 'assistant'>('problem')
  const [confirm, setConfirm] = useState<'submit' | 'reset' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const now = useNow()
  const left = problem.minutes * 60 - (now - session.startedAt) / 1000

  const patch = useCallback((p: Partial<Session>) => setSession((s) => (s ? { ...s, ...p } : s)), [setSession])
  const patchWith = useCallback((f: (s: Session) => Partial<Session>) => setSession((s) => (s ? { ...s, ...f(s) } : s)), [setSession])

  // Integrity signals: tab switches. Pastes come from the editor.
  useEffect(() => {
    const on = () => {
      if (document.visibilityState === 'hidden') patchWith((s) => ({ tabSwitches: s.tabSwitches + 1 }))
    }
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [patchWith])

  // Code playback: a snapshot every 4 s while the code changes.
  const codeRef = useRef(code)
  codeRef.current = code
  useEffect(() => {
    const id = window.setInterval(() => {
      const s = readStore<Session | null>('demo:session', null)
      if (!s) return
      const last = s.snapshots[s.snapshots.length - 1]
      if (last?.code === codeRef.current) return
      const snap = { t: Math.round((Date.now() - s.startedAt) / 1000), code: codeRef.current }
      writeStore('demo:session', { ...s, snapshots: [...(s.snapshots.length ? s.snapshots : [{ t: 0, code: problem.starter }]), snap].slice(-240) })
    }, 4000)
    return () => window.clearInterval(id)
  }, [problem.starter])

  const doRun = useCallback(async () => {
    if (running) return
    setRunning(true)
    setOut('tests')
    const r = await runTests(codeRef.current, problem.fn, problem.tests)
    // Hidden tests run too, but only their count is shown until submit.
    setRun(r)
    setRunning(false)
    patchWith((s) => ({ runs: s.runs + 1 }))
  }, [running, problem, patchWith])

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        void doRun()
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [doRun])

  const submit = async () => {
    setSubmitting(true)
    setSubmitError('')
    const r = await runTests(codeRef.current, problem.fn, problem.tests)
    const passed = r.results.filter((x) => x.pass).map((x) => x.id)
    const s = readStore<Session | null>('demo:session', null) ?? session
    const durationSec = Math.round((Date.now() - s.startedAt) / 1000)
    try {
      const res = await post<{ id: string; score: number; submittedAt: string }>('/api/attempts', {
        candidate,
        problemId: problem.id,
        code: codeRef.current,
        passed,
        total: problem.tests.length,
        durationSec,
        aiPrompts: s.ai.length,
        pastes: s.pastes,
        tabSwitches: s.tabSwitches,
      })
      saveAttempt({
        id: res.id,
        candidate,
        problemId: problem.id,
        code: codeRef.current,
        passed,
        total: problem.tests.length,
        score: res.score ?? scoreAttempt(passed.length, problem.tests.length, s.ai.length, s.pastes),
        durationSec,
        submittedAt: res.submittedAt,
        runs: s.runs,
        ai: s.ai,
        integrity: { pastes: s.pastes, pastedChars: s.pastedChars, tabSwitches: s.tabSwitches },
        snapshots: [...(s.snapshots.length ? s.snapshots : [{ t: 0, code: problem.starter }]), { t: durationSec, code: codeRef.current }],
      })
      writeStore(`demo:code:${problem.id}`, undefined)
      setSession(null)
      navigate(`/reports/${res.id}`)
      toast('Submitted. This is the report your hiring team would see.')
    } catch (err) {
      setSubmitError(err instanceof ApiError ? (Object.values(err.fields)[0] ?? err.message) : 'Something went wrong. Try again.')
      setSubmitting(false)
    }
  }

  const visible = run?.results.filter((r) => !r.hidden) ?? []
  const visiblePassed = visible.filter((r) => r.pass).length
  const onAsk = useCallback((t: AiTurn) => patchWith((s) => ({ ai: [...s.ai, t] })), [patchWith])

  const header = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium">{problem.title}</p>
        <p className="hidden truncate text-[12.5px] text-muted sm:block">{candidate.name}</p>
      </div>
      <span role="timer" aria-label={`Time left: ${formatClock(left)}`} className={cx('inline-flex h-9 items-center gap-1.5 rounded-[10px] px-2.5 font-mono text-[14px] tabular-nums ring-1 ring-inset', left <= 0 ? 'bg-danger/10 text-danger ring-danger/30' : left < 300 ? 'text-amber ring-amber/30' : 'text-fg ring-line-strong')}>
        <Clock aria-hidden className="size-3.5" />
        {left <= 0 ? 'Time is up' : formatClock(left)}
      </span>
      <Button variant="secondary" size="sm" onClick={doRun} loading={running} icon={<Play className="size-3.5" />} aria-keyshortcuts="Control+Enter Meta+Enter">
        <span className="hidden sm:inline">Run tests</span>
        <span className="sm:hidden">Run</span>
      </Button>
      <Button size="sm" onClick={() => setConfirm('submit')} icon={<Send className="size-3.5" />}>
        Submit
      </Button>
    </>
  )

  return (
    <Frame right={header}>
      <div className="flex min-h-0 flex-1 flex-col lg:h-[calc(100vh-56px)] lg:flex-row">
        {/* Left: problem statement or assistant */}
        <aside className="flex min-h-0 flex-col border-b border-white/7 lg:w-[400px] lg:shrink-0 lg:border-r lg:border-b-0" aria-label="Problem and assistant">
          <div className="border-b border-white/7 p-2">
            <Tabs idBase="side" label="Side panel" size="sm" className="w-full" value={side} onChange={setSide} items={[{ id: 'problem', label: 'Problem' }, { id: 'assistant', label: <span className="inline-flex items-center gap-1.5"><Sparkles aria-hidden className="size-3.5 text-brand-text" />{ASSISTANT.name}</span>, count: session.ai.length || undefined }]} />
          </div>
          <div {...tabPanelProps('side', side)} className="flex min-h-0 flex-1 flex-col">
            {side === 'problem' ? <Statement problem={problem} /> : <AiPanel problem={problem} log={session.ai} onAsk={onAsk} className="h-[460px] lg:h-auto lg:flex-1" />}
          </div>
        </aside>

        {/* Middle: editor and results */}
        <section className="flex min-h-0 min-w-0 flex-1 flex-col" aria-label="Editor">
          <div className="flex h-11 items-center gap-2 border-b border-white/7 px-3 text-[13px] text-muted">
            <span className="rounded-[8px] bg-white/6 px-2 py-1 font-mono text-[12.5px] text-fg">solution.js</span>
            <span className="hidden md:inline">JavaScript</span>
            <span className="ml-auto hidden items-center gap-1.5 xl:inline-flex">
              <Kbd>Esc</Kbd> then <Kbd>Tab</Kbd> leaves the editor
            </span>
            <Button variant="ghost" size="sm" icon={<RotateCcw className="size-3.5" />} onClick={() => setConfirm('reset')}>
              Reset code
            </Button>
          </div>
          <CodeEditor
            label={`Code editor for ${problem.fn}`}
            value={code}
            onChange={setCode}
            onPaste={(n) => patchWith((s) => ({ pastes: s.pastes + 1, pastedChars: s.pastedChars + n }))}
            className="h-[420px] lg:h-auto lg:min-h-0 lg:flex-1"
          />
          <div className="border-t border-white/7 lg:h-[300px] lg:shrink-0">
            <div className="flex items-center justify-between gap-3 border-b border-white/7 px-3 py-2">
              <Tabs idBase="out" label="Output" size="sm" value={out} onChange={setOut} items={[{ id: 'tests', label: 'Tests', count: run ? visiblePassed : undefined }, { id: 'console', label: 'Console', count: run?.logs.length || undefined }]} />
              <span className="hidden text-[12.5px] text-faint sm:inline">
                <Kbd>Ctrl</Kbd> <Kbd>Enter</Kbd> runs
              </span>
            </div>
            <div {...tabPanelProps('out', out)} className="scrollbar-thin overflow-y-auto p-3 lg:h-[calc(300px-53px)]">
              {out === 'tests' ? <TestResults run={run} running={running} /> : <ConsoleOutput run={run} />}
            </div>
          </div>
        </section>
      </div>

      <Modal open={confirm === 'submit'} onClose={() => !submitting && setConfirm(null)} title={DEMO.submitTitle} description={run ? DEMO.submitBody(visiblePassed, visible.length) : 'You have not run the tests yet. Hidden tests run when you submit, and you cannot edit afterwards.'}>
        <ul className="mb-6 grid gap-2 text-[14px] text-muted">
          <li className="flex items-center gap-2"><Lock aria-hidden className="size-3.5" /> {problem.tests.filter((t) => t.hidden).length} hidden tests will run</li>
          <li className="flex items-center gap-2"><Sparkles aria-hidden className="size-3.5" /> {session.ai.length} assistant {session.ai.length === 1 ? 'prompt' : 'prompts'} recorded</li>
        </ul>
        {submitError && <Notice tone="error" className="mb-4">{submitError}</Notice>}
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(null)} disabled={submitting}>
            Keep working
          </Button>
          <Button onClick={submit} loading={submitting}>
            {submitError ? 'Try again' : 'Submit solution'}
          </Button>
        </div>
      </Modal>
      <Modal open={confirm === 'reset'} onClose={() => setConfirm(null)} title="Reset to the starter code?" description="Your current code is replaced. The replay in the report still shows what you wrote before.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setCode(problem.starter)
              setRun(null)
              setConfirm(null)
              patch({})
              toast('Code reset to the starter.')
            }}
          >
            Reset code
          </Button>
        </div>
      </Modal>
    </Frame>
  )
}

function Statement({ problem }: { problem: Problem }) {
  return (
    <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={difficultyTone[problem.difficulty]}>{problem.difficulty}</Badge>
        <Badge>{problem.skill}</Badge>
        <Badge>{problem.minutes} min</Badge>
      </div>
      <h1 className="mt-4 text-[24px] leading-tight font-normal tracking-[-0.02em]">{problem.title}</h1>
      <div className="mt-3 grid gap-3 text-[15px] leading-relaxed text-muted">
        {problem.statement.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h2 className="mt-6 text-[15px] font-medium">Examples</h2>
      <div className="mt-2 grid gap-2">
        {problem.examples.map((ex) => (
          <div key={ex.input} className="rounded-[12px] bg-[#061012] p-3 font-mono text-[12.5px] leading-5 ring-1 ring-inset ring-line">
            <div><span className="text-faint">Input </span><span className="text-fg">{ex.input}</span></div>
            <div><span className="text-faint">Output </span><span className="text-brand-text">{ex.output}</span></div>
            {ex.note && <div className="mt-1 font-sans text-[13px] text-muted">{ex.note}</div>}
          </div>
        ))}
      </div>
      <h2 className="mt-6 text-[15px] font-medium">Constraints</h2>
      <ul className="mt-2 grid list-disc gap-1 pl-5 text-[14px] text-muted marker:text-faint">
        {problem.constraints.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), ms)
    return () => window.clearInterval(id)
  }, [ms])
  return now
}
