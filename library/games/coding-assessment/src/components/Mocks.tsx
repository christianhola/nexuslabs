import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { CircleCheck, CircleX, Lock, MessageSquare, Play, Sparkles, Video } from 'lucide-react'

import { CANDIDATES, getProblem } from '../data'
import { cx } from '../lib/cx'
import { runTests } from '../lib/runner'
import type { RunResult } from '../lib/runner'
import { useReducedMotion } from '../lib/useReducedMotion'
import { Badge } from './Badge'
import { Button } from './Button'
import { CodeEditor } from './CodeEditor'
import { Avatar } from './Misc'
import { Meter, ScoreRing } from './Score'

/* Live product mocks for the landing page. They run the same code as the app. */

/** A window frame with traffic lights and a title. */
export function Window({ title, children, className, right }: { title: string; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <div className={cx('depth relative overflow-hidden rounded-window bg-surface shadow-float', className)}>
      <div className="flex h-11 items-center gap-3 border-b bg-surface-2/80 px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="round size-2.5 rounded-full bg-white/15" />
          <span className="round size-2.5 rounded-full bg-white/15" />
          <span className="round size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-muted">{title}</span>
        {right}
      </div>
      {children}
    </div>
  )
}

/** Types the solution in, then runs the real tests in a Web Worker. */
export function ChallengeMock() {
  const p = getProblem('merge-windows')
  const reduce = useReducedMotion()
  const [n, setN] = useState(reduce ? p.solution.length : p.starter.length - 40)
  const [run, setRun] = useState<RunResult | null>(null)
  const [running, setRunning] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(!!e?.isIntersecting))
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!visible || n >= p.solution.length) return
    const id = window.setTimeout(() => setN((x) => Math.min(p.solution.length, x + 3)), 22)
    return () => window.clearTimeout(id)
  }, [n, visible, p.solution.length])
  const go = async () => {
    setRunning(true)
    const r = await runTests(p.solution.slice(0, n), p.fn, p.tests)
    setRun(r)
    setRunning(false)
  }
  const done = n >= p.solution.length
  useEffect(() => {
    if (done && !run && visible) void go()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, visible])
  const code = p.solution.slice(0, n)
  return (
    <div ref={ref}>
      <Window title={`${p.title}.js`} right={<Badge tone="brand">24:18 left</Badge>}>
        <CodeEditor label="Sample solution (read only)" value={code} readOnly className="h-[300px] text-left" minLines={14} />
        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <div className="flex min-w-0 flex-wrap gap-1.5" aria-live="polite">
            {run
              ? run.results.map((r) => (
                  <span key={r.id} className={cx('inline-flex h-7 items-center gap-1 rounded-[8px] px-2 text-[12.5px]', r.pass ? 'bg-brand/12 text-brand-text' : 'bg-danger/12 text-danger')}>
                    {r.hidden ? <Lock aria-hidden className="size-3" /> : r.pass ? <CircleCheck aria-hidden className="size-3" /> : <CircleX aria-hidden className="size-3" />}
                    {r.label}
                    <span className="sr-only">{r.pass ? 'passed' : 'failed'}</span>
                  </span>
                ))
              : <span className="text-[13px] text-faint">{done ? 'Ready to run' : 'Candidate is typing…'}</span>}
          </div>
          <Button size="sm" variant="secondary" icon={<Play className="size-3.5" />} onClick={go} loading={running}>
            Run tests
          </Button>
        </div>
      </Window>
    </div>
  )
}

/** Two cursors in one editor, with the interviewer's private notes. */
export function InterviewMock() {
  const p = getProblem('rate-limiter')
  const lines = p.solution.split('\n').slice(6, 18)
  return (
    <Window title="Live interview: Lucas Ferreira" right={<Badge tone="danger" dot>Recording</Badge>}>
      <div className="grid md:grid-cols-[1fr_220px]">
        <div className="relative overflow-hidden bg-[#061012] p-4 text-left font-mono text-[13px] leading-[22px] text-[#d9e6e2]">
          {lines.map((l, i) => (
            <div key={i} className="whitespace-pre">
              <span className="mr-4 inline-block w-5 text-right text-[#6f8682] select-none">{i + 7}</span>
              {l}
            </div>
          ))}
          <span aria-hidden className="absolute top-[64px] left-[230px] animate-[drift_6s_ease-in-out_infinite_alternate]">
            <span className="block h-5 w-0.5 bg-info" />
            <span className="mt-0.5 block rounded-[6px] bg-info px-1.5 py-0.5 font-sans text-[11px] text-[#04111c]">Lucas</span>
          </span>
          <span aria-hidden className="absolute top-[152px] left-[330px] animate-[drift_8s_ease-in-out_infinite_alternate-reverse]">
            <span className="block h-5 w-0.5 bg-brand" />
            <span className="mt-0.5 block rounded-[6px] bg-brand px-1.5 py-0.5 font-sans text-[11px] text-on-brand">You</span>
          </span>
        </div>
        <div className="grid content-start gap-3 border-t p-4 text-left md:border-t-0 md:border-l">
          <div className="flex items-center gap-2">
            <Avatar name="Lucas Ferreira" size={30} />
            <Avatar name="Priya Raman" size={30} />
            <span className="ml-auto inline-flex items-center gap-1 text-[12.5px] text-muted">
              <Video aria-hidden className="size-3.5" /> 18:42
            </span>
          </div>
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-fg">
            <MessageSquare aria-hidden className="size-3.5 text-brand-text" /> Private notes
          </p>
          {['Chose a queue over a counter map, explained why.', 'Caught the boundary at t − windowMs unprompted.', 'Follow up: memory if limit is large.'].map((n) => (
            <p key={n} className="rounded-[10px] bg-white/5 px-3 py-2 text-[13px] leading-snug text-muted">
              {n}
            </p>
          ))}
        </div>
      </div>
    </Window>
  )
}

/** A compact candidate report. */
export function ReportMock() {
  const c = CANDIDATES[0]!
  return (
    <Window title={`Report: ${c.name}`} right={<Badge tone="brand">Recommended</Badge>}>
      <div className="grid gap-6 p-5 text-left sm:grid-cols-[auto_1fr] sm:p-6">
        <div className="flex items-center gap-4 sm:flex-col sm:items-start">
          <ScoreRing score={c.score} size={116} />
          <div>
            <p className="text-[15px] font-medium">{c.name}</p>
            <p className="text-[13px] text-muted">{c.role}</p>
          </div>
        </div>
        <div className="grid gap-3.5">
          {c.skills.map((s) => (
            <Meter key={s.name} label={s.name} value={s.score} />
          ))}
          <div className="mt-1 flex items-start gap-2 rounded-[12px] bg-brand/8 px-3 py-2.5 text-[13.5px] text-muted ring-1 ring-inset ring-brand/15">
            <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-brand-text" />
            {c.ai.summary}
          </div>
        </div>
      </div>
    </Window>
  )
}
