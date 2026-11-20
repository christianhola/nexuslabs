import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { chatCopy } from '../content'
import { cx } from '../lib/cx'
import { Button, IconButton } from './Button'
import { Input } from './Field'
import { Modal } from './Modal'

type Msg = { from: 'bot' | 'me'; text: string }

function answer(q: string) {
  const s = q.toLowerCase()
  return chatCopy.answers.find((a) => a.keys.some((k) => s.includes(k)))?.a ?? chatCopy.fallback
}

/*
  The floating "Ask Inkwell" pill and its drawer. Replies are canned
  (keyword matched in src/content.ts); swap `answer` for a real API call.
*/
export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: chatCopy.greeting }])
  const [text, setText] = useState('')
  const [typing, setTyping] = useState(false)
  const list = useRef<HTMLDivElement>(null)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [msgs, typing])

  const ask = (q: string) => {
    const v = q.trim()
    if (!v || typing) return
    setMsgs((m) => [...m, { from: 'me', text: v }])
    setText('')
    setTyping(true)
    timer.current = window.setTimeout(() => {
      setMsgs((m) => [...m, { from: 'bot', text: answer(v) }])
      setTyping(false)
    }, 700)
  }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(text)
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="round fixed bottom-5 right-4 z-40 inline-flex h-12 items-center gap-2.5 rounded-full border border-line-strong bg-panel-2/95 pl-4 pr-5 text-[16px] font-semibold text-white shadow-[var(--shadow-pop)] backdrop-blur transition-colors hover:bg-panel-3 sm:bottom-6 sm:right-6">
        <MessageCircle className="size-5 fill-white" aria-hidden />
        {chatCopy.label}
      </button>
      <Modal open={open} onClose={() => setOpen(false)} side="right" title={chatCopy.title} description="Demo replies, no account needed">
        <div className="flex h-full flex-col">
          <div ref={list} className="flex-1 space-y-3" aria-live="polite">
            {msgs.map((m, i) => (
              <p key={i} className={cx('max-w-[85%] rounded-[14px] px-3.5 py-2.5 text-[15px] leading-snug', m.from === 'bot' ? 'bg-panel-2 text-body' : 'ml-auto bg-ink-blue text-white')}>
                {m.text}
              </p>
            ))}
            {typing ? (
              <p className="inline-flex gap-1 rounded-[14px] bg-panel-2 px-4 py-3.5" aria-label="Assistant is typing">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="round size-1.5 animate-pulse rounded-full bg-muted" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </p>
            ) : null}
          </div>
          {msgs.length === 1 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {chatCopy.suggestions.map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => ask(s)}>
                  {s}
                </Button>
              ))}
            </div>
          ) : null}
          <form onSubmit={submit} className="sticky bottom-0 mt-4 flex gap-2 bg-panel pt-2">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <Input id="chat-input" data-autofocus value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question" autoComplete="off" />
            <IconButton label="Send" type="submit" disabled={!text.trim() || typing} className="!size-11 bg-ink-blue !text-white hover:bg-ink-blue-hover">
              <Send />
            </IconButton>
          </form>
        </div>
      </Modal>
    </>
  )
}
