import { SendHorizontal, Users } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { chatChannels, chatReplies } from '../content'
import { cx } from '../lib/cx'
import { useChannel, useChat } from '../lib/stores'
import { Avatar } from './Avatar'
import { IconButton } from './Button'
import { byId } from './ProfileCard'

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

/*
  The live chat: pick a group, send a message and a colleague replies.
  Messages are saved in this browser.
*/
export function ChatMock({ compact, prefill }: { compact?: boolean; prefill?: string }) {
  const id = useId()
  const [chat, setChat] = useChat()
  const [channel, setChannel] = useChannel()
  const [text, setText] = useState('')
  const [typing, setTyping] = useState<string | null>(null)
  const list = useRef<HTMLDivElement>(null)
  const replyN = useRef(0)
  const msgs = chat[channel] ?? []

  useEffect(() => {
    if (prefill) setText(prefill)
  }, [prefill])
  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight })
  }, [msgs.length, typing, channel])

  const send = () => {
    const body = text.trim()
    if (!body) return
    const ch = channel
    setChat((c) => ({ ...c, [ch]: [...(c[ch] ?? []), { id: `m${Date.now()}`, authorId: 'me', body: body.slice(0, 500), time: now() }] }))
    setText('')
    const r = chatReplies[replyN.current++ % chatReplies.length]
    window.setTimeout(() => setTyping(r.authorId), 600)
    window.setTimeout(() => {
      setTyping(null)
      setChat((c) => ({ ...c, [ch]: [...(c[ch] ?? []), { id: `r${Date.now()}`, authorId: r.authorId, body: r.body, time: now() }] }))
    }, 2000)
  }

  const current = chatChannels.find((c) => c.id === channel) ?? chatChannels[0]

  return (
    <div className={cx('flex h-full min-h-0 flex-col', !compact && 'overflow-hidden rounded-[var(--radius-card)] border border-line bg-card shadow-[var(--shadow-card)]')}>
      <div className={cx('scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line', compact ? 'px-3 pb-2' : 'p-3')} role="tablist" aria-label="Groups">
        {chatChannels.map((c) => (
          <button key={c.id} type="button" role="tab" aria-selected={c.id === channel} onClick={() => setChannel(c.id)} className={cx('h-10 shrink-0 rounded-[8px] px-3 text-[13.5px] font-medium focus-visible:outline-2 focus-visible:outline-ink', c.id === channel ? 'bg-ink text-white' : 'text-body hover:bg-mist')}>
            {c.name}
          </button>
        ))}
      </div>
      <p className="flex items-center gap-1.5 px-4 pt-2.5 text-[12.5px] text-faint">
        <Users className="size-3.5" aria-hidden />
        {current.members} members
      </p>
      <div ref={list} className={cx('flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-4 py-3', !compact && 'h-[330px]')} role="log" aria-live="polite" aria-label={`${current.name} messages`}>
        {msgs.map((m) => {
          const mine = m.authorId === 'me'
          const who = mine ? null : byId(m.authorId)
          return (
            <div key={m.id} className={cx('flex max-w-[85%] animate-pop-in items-end gap-2', mine && 'self-end')}>
              {who ? <Avatar name={who.name} face={who.face} size={28} /> : null}
              <div className={cx('rounded-[14px] px-3 py-2 text-[14px] leading-snug', mine ? 'rounded-br-[4px] border-[1.5px] border-ink bg-mint text-ink' : 'rounded-bl-[4px] bg-mist-2 text-body')}>
                {who ? <p className="text-[12px] font-semibold text-ink">{who.name.split(' ')[0]}</p> : null}
                <p>{m.body}</p>
                <p className={cx('mt-0.5 text-right text-[11px]', mine ? 'text-ink/70' : 'text-faint')}>{m.time}</p>
              </div>
            </div>
          )
        })}
        {typing ? (
          <div className="flex items-center gap-2 text-[12.5px] text-faint">
            <span className="flex gap-1 rounded-[12px] bg-mist-2 px-3 py-2.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <i key={i} className="round block size-1.5 animate-typing rounded-full bg-ink" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </span>
            {byId(typing)?.name.split(' ')[0]} is typing
          </div>
        ) : null}
      </div>
      <form
        className="flex items-center gap-2 border-t border-line p-3"
        onSubmit={(e) => {
          e.preventDefault()
          send()
        }}
      >
        <label htmlFor={id} className="sr-only">
          Message {current.name}
        </label>
        <input id={id} value={text} onChange={(e) => setText(e.target.value)} maxLength={500} placeholder={`Message ${current.name}`} className="h-11 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-card px-3 text-[14.5px] text-ink placeholder:text-faint focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45" />
        <IconButton label="Send" type="submit" tone="dark" disabled={!text.trim()} className="size-11">
          <SendHorizontal aria-hidden />
        </IconButton>
      </form>
    </div>
  )
}
