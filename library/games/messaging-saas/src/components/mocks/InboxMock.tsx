import { Send, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { inboxThreads } from '../../content'
import type { InboxThread } from '../../content'
import { cx } from '../../lib/cx'
import { Avatar } from '../Avatar'
import { Badge } from '../Badge'
import { AppWindow } from './AppWindow'
import { Bubble } from './Chat'

const tagTone = { Sizing: 'saffron', Shipping: 'cobalt', Order: 'mint', VIP: 'cherry' } as const

/** The shared inbox: pick a thread, use the AI draft or write your own, send. */
export function InboxMock({ className }: { className?: string }) {
  const [threads, setThreads] = useState<(InboxThread & { replied?: boolean })[]>(inboxThreads)
  const [activeId, setActiveId] = useState(inboxThreads[0].id)
  const [draft, setDraft] = useState('')
  const active = threads.find((t) => t.id === activeId)!

  const open = (id: string) => {
    setActiveId(id)
    setDraft('')
    setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, unread: false } : t)))
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setThreads((ts) => ts.map((t) => (t.id === activeId ? { ...t, replied: true, preview: `You: ${text}`, time: 'now', messages: [...t.messages, { from: 'brand', text, time: 'now' }] } : t)))
    setDraft('')
  }

  const unread = threads.filter((t) => t.unread).length

  return (
    <AppWindow title="Inbox · Relaytext" className={className} actions={<Badge tone="cobalt">{unread} unread</Badge>}>
      <div className="grid min-h-[460px] md:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_210px]">
        <ul aria-label="Conversations" className="no-scrollbar flex gap-1 overflow-x-auto border-b border-line p-2 md:block md:space-y-1 md:overflow-visible md:border-b-0 md:border-r">
          {threads.map((t) => (
            <li key={t.id} className="shrink-0 md:shrink">
              <button
                type="button"
                onClick={() => open(t.id)}
                aria-current={t.id === activeId ? 'true' : undefined}
                className={cx(
                  'flex w-[220px] items-start gap-3 rounded-[10px] p-2.5 text-left transition-colors md:w-full',
                  t.id === activeId ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]',
                )}
              >
                <Avatar name={t.name} initials={t.initials} tone={t.tone} size={34} />
                <span className="grid min-w-0 flex-1 gap-0.5">
                  <span className="flex items-center gap-2">
                    <span className={cx('truncate text-[13px]', t.unread ? 'font-bold text-white' : 'font-medium text-soft')}>{t.name}</span>
                    <span className="ml-auto text-[11px] text-faint">{t.time}</span>
                  </span>
                  <span className="truncate text-[12px] text-muted">{t.preview}</span>
                </span>
                {t.unread ? <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-cobalt-text" /> : null}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex min-w-0 flex-col">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <p className="text-[14px] font-semibold text-white">{active.name}</p>
            <Badge tone={tagTone[active.tag]}>{active.tag}</Badge>
            {active.replied ? (
              <Badge tone="mint" className="ml-auto">
                Replied
              </Badge>
            ) : null}
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2.5 p-4" aria-live="polite">
            {active.messages.map((m, i) => (
              <Bubble key={i} from={m.from} meta={m.time} className="animate-pop">
                {m.text}
              </Bubble>
            ))}
          </div>
          <form onSubmit={send} className="grid gap-2 border-t border-line p-3">
            <button
              type="button"
              onClick={() => setDraft(active.suggestion)}
              className="flex items-start gap-2 rounded-[10px] border border-cobalt/40 bg-cobalt-soft p-2.5 text-left text-[12.5px] leading-snug text-soft transition-colors hover:border-cobalt-text"
            >
              <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0 text-cobalt-text" />
              <span>
                <span className="font-semibold text-white">AI draft · </span>
                {active.suggestion}
              </span>
            </button>
            <div className="flex gap-2">
              <label htmlFor="inbox-reply" className="sr-only">
                Reply to {active.name}
              </label>
              <input
                id="inbox-reply"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Write a reply or use the draft"
                className="h-10 min-w-0 flex-1 rounded-[8px] border border-line bg-[#0b0e18] px-3 text-[13px] text-white placeholder:text-faint focus:border-cobalt-text focus:outline-none"
              />
              <button type="submit" disabled={!draft.trim()} aria-label="Send reply" className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-cobalt text-white transition-colors hover:bg-cobalt-hover disabled:opacity-40">
                <Send aria-hidden className="size-4" />
              </button>
            </div>
          </form>
        </div>

        <aside aria-label="Shopper details" className="hidden border-l border-line p-4 xl:block">
          <div className="grid justify-items-center gap-2 border-b border-line pb-4 text-center">
            <Avatar name={active.name} initials={active.initials} tone={active.tone} size={52} />
            <p className="text-[14px] font-semibold text-white">{active.name}</p>
            <p className="text-[12px] text-faint">Subscribed via checkout</p>
          </div>
          <dl className="grid gap-3 pt-4 text-[12px]">
            <div className="flex justify-between">
              <dt className="text-faint">Lifetime value</dt>
              <dd className="font-semibold text-white">{active.ltv}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-faint">Orders</dt>
              <dd className="font-semibold text-white">{active.orders}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-faint">Saved card</dt>
              <dd className="font-semibold text-white">Yes</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-faint">Consent</dt>
              <dd className="font-semibold text-mint-text">Verified</dd>
            </div>
          </dl>
        </aside>
      </div>
    </AppWindow>
  )
}
