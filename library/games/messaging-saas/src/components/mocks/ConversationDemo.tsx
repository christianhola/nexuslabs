import { RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { conversationDemo as d } from '../../content'
import type { ChatMessage } from '../../content'
import { cx } from '../../lib/cx'
import { useReducedMotion } from '../../lib/useReducedMotion'
import { TypingDots } from '../TypingDots'
import { Bubble, PhoneFrame, ProductCardInline } from './Chat'

type Line = ChatMessage & { key: number }

/**
 * The interactive phone on the home page. Tap a reply chip: it appears as the
 * shopper's message, the brand "types", then the scripted answers arrive.
 */
export function ConversationDemo({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const [lines, setLines] = useState<Line[]>(() => d.opener.map((m, i) => ({ ...m, key: i })))
  const [typing, setTyping] = useState(false)
  const [used, setUsed] = useState<string[]>([])
  const [stopped, setStopped] = useState(false)
  const timers = useRef<number[]>([])
  const scroller = useRef<HTMLDivElement>(null)
  const keyRef = useRef(10)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => {
    const el = scroller.current?.querySelector('[data-thread]')?.parentElement
    el?.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [lines, typing, reduce])

  const push = (m: ChatMessage) => setLines((ls) => [...ls, { ...m, key: keyRef.current++ }])

  const reply = (text: string, answers: ChatMessage[]) => {
    if (typing) return
    push({ from: 'shopper', text })
    setUsed((u) => [...u, text])
    const gap = reduce ? 0 : 900
    setTyping(true)
    answers.forEach((a, i) => {
      timers.current.push(
        window.setTimeout(() => {
          push(a)
          if (i === answers.length - 1) setTyping(false)
        }, gap * (i + 1) + (reduce ? 0 : 300 * i)),
      )
    })
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setLines(d.opener.map((m, i) => ({ ...m, key: i })))
    setUsed([])
    setTyping(false)
    setStopped(false)
  }

  const options = d.steps.filter((s) => !used.includes(s.shopper))

  return (
    <div ref={scroller} className={className}>
      <PhoneFrame
        contact={d.contact}
        footer={
          <div className="grid gap-2">
            <p id="demo-replies" className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
              {stopped ? 'Conversation ended' : 'Tap a reply'}
            </p>
            <div role="group" aria-labelledby="demo-replies" className="flex flex-wrap gap-1.5">
              {!stopped &&
                options.map((s) => (
                  <button
                    key={s.shopper}
                    type="button"
                    disabled={typing}
                    onClick={() => reply(s.shopper, s.replies)}
                    className="min-h-10 rounded-full border border-cobalt-text/50 bg-cobalt-soft px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-cobalt disabled:opacity-50"
                  >
                    {s.shopper}
                  </button>
                ))}
              {!stopped ? (
                <button
                  type="button"
                  disabled={typing}
                  onClick={() => {
                    reply(d.stop, [{ from: 'brand', text: d.stopReply }])
                    setStopped(true)
                  }}
                  className="min-h-10 rounded-full border border-line-strong px-3.5 text-[13px] font-medium text-soft transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {d.stop}
                </button>
              ) : null}
              {(stopped || options.length === 0) && (
                <button type="button" onClick={reset} className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white px-3.5 text-[13px] font-semibold text-bg hover:bg-[#e6ebf7]">
                  <RotateCcw aria-hidden className="size-3.5" /> Start over
                </button>
              )}
            </div>
          </div>
        }
      >
        <div data-thread className="flex flex-col gap-2.5" aria-live="polite" aria-label="Conversation">
          <p className="pb-1 text-center text-[11px] text-faint">Today 10:02</p>
          {lines.map((m) => (
            <Bubble key={m.key} from={m.from} className={cx(!reduce && 'animate-pop')}>
              {m.text}
              {m.product ? <ProductCardInline {...m.product} /> : null}
            </Bubble>
          ))}
          {typing ? (
            <div className="flex justify-end">
              <TypingDots className="rounded-br-[6px] rounded-bl-[18px] bg-bubble-out/60" label="Haven Coffee is typing" />
            </div>
          ) : null}
        </div>
      </PhoneFrame>
    </div>
  )
}
