import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowUp, Sparkles } from 'lucide-react'

import { ASSISTANT } from '../content'
import type { Problem } from '../data'
import { cx } from '../lib/cx'
import type { AiTurn } from '../lib/store'
import { useReducedMotion } from '../lib/useReducedMotion'
import { IconButton } from './Button'

/*
  The scripted pair assistant. It answers from the problem's hints and a few
  rules, streams the reply, and never writes the solution. Swap `reply` for a
  model call to make it real.
*/
export function reply(problem: Problem, q: string, hintsUsed: number): { text: string; hint: boolean } {
  const s = q.toLowerCase()
  if (/(write|give|show).*(solution|answer|code)|solve it|just (write|do)/.test(s)) return { text: ASSISTANT.refuse, hint: false }
  if (/edge|case|test/.test(s)) return { text: ASSISTANT.edge(problem.tests.filter((t) => !t.hidden).map((t) => t.label.toLowerCase())), hint: false }
  if (/complex|big ?o|fast|perform|time/.test(s)) return { text: problem.hints[problem.hints.length - 1]!, hint: false }
  if (/explain|what.*(problem|asking)|understand|start/.test(s)) return { text: ASSISTANT.explain(problem.fn), hint: false }
  const next = problem.hints[Math.min(hintsUsed, problem.hints.length - 1)]
  if (hintsUsed >= problem.hints.length) return { text: ASSISTANT.noMore, hint: false }
  return { text: next!, hint: true }
}

export function AiPanel({ problem, log, onAsk, className, disabled }: { problem: Problem; log: AiTurn[]; onAsk: (turn: AiTurn) => void; className?: string; disabled?: boolean }) {
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [streaming, setStreaming] = useState<{ q: string; text: string; full: string } | null>(null)
  const hints = useRef(log.filter((t) => problem.hints.includes(t.a)).length)
  const list = useRef<HTMLDivElement>(null)

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [log.length, streaming?.text])

  useEffect(() => {
    if (!streaming) return
    if (reduce || streaming.text.length >= streaming.full.length) {
      onAsk({ q: streaming.q, a: streaming.full })
      setStreaming(null)
      return
    }
    const id = window.setTimeout(() => setStreaming({ ...streaming, text: streaming.full.slice(0, streaming.text.length + 4) }), 16)
    return () => window.clearTimeout(id)
  }, [streaming, reduce, onAsk])

  const ask = (text: string) => {
    const t = text.trim()
    if (!t || streaming) return
    const r = reply(problem, t, hints.current)
    if (r.hint) hints.current++
    setStreaming({ q: t, text: '', full: r.text })
    setQ('')
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(q)
  }

  return (
    <div className={cx('flex min-h-0 flex-col', className)}>
      <div ref={list} className="scrollbar-thin min-h-0 flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        <Bubble who="ai">{ASSISTANT.intro}</Bubble>
        {log.map((t, i) => (
          <div key={i} className="space-y-3">
            <Bubble who="me">{t.q}</Bubble>
            <Bubble who="ai">{t.a}</Bubble>
          </div>
        ))}
        {streaming && (
          <div className="space-y-3">
            <Bubble who="me">{streaming.q}</Bubble>
            <Bubble who="ai">
              {streaming.text}
              <span aria-hidden className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-caret bg-brand" />
            </Bubble>
          </div>
        )}
      </div>
      <div className="border-t p-3">
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {ASSISTANT.suggestions.map((s) => (
            <button key={s} type="button" disabled={!!streaming || disabled} onClick={() => ask(s)} className="h-10 rounded-[10px] bg-white/6 px-3 text-[13px] text-muted ring-1 ring-inset ring-line transition-colors hover:bg-white/10 hover:text-fg disabled:opacity-45 sm:h-8">
              {s}
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 rounded-control bg-[#081012] p-1 pl-3.5 ring-1 ring-inset ring-line-strong focus-within:ring-2 focus-within:ring-brand/70">
          <label className="sr-only" htmlFor="ai-q">
            {ASSISTANT.placeholder}
          </label>
          <input id="ai-q" value={q} onChange={(e) => setQ(e.target.value)} disabled={disabled} placeholder={ASSISTANT.placeholder} className="h-10 min-w-0 flex-1 bg-transparent text-[14.5px] placeholder:text-faint focus:outline-none" />
          <IconButton label="Send" type="submit" disabled={!q.trim() || !!streaming || disabled} className="bg-brand text-on-brand hover:bg-[#3ae69a] hover:text-on-brand">
            <ArrowUp className="size-4" />
          </IconButton>
        </form>
      </div>
    </div>
  )
}

function Bubble({ who, children }: { who: 'ai' | 'me'; children: ReactNode }) {
  if (who === 'me')
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-[14px] rounded-br-[6px] bg-brand/14 px-3.5 py-2 text-[14px] text-fg">{children}</p>
      </div>
    )
  return (
    <div className="flex gap-2.5">
      <span aria-hidden className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-[9px] bg-brand/12 text-brand-text">
        <Sparkles className="size-3.5" />
      </span>
      <p className="max-w-[88%] text-[14px] leading-relaxed text-muted">{children}</p>
    </div>
  )
}
