import { ArrowUp, Check, CheckCircle2, Link2, MessageSquare, Smile, Sparkles, Trash2, Undo2 } from 'lucide-react'
import { type FormEvent, useEffect, useMemo, useRef, useState } from 'react'

import { Button, ButtonLink, IconButton } from '@/components/Button'
import { LogoMark } from '@/components/Logo'
import { Menu } from '@/components/Menu'
import { Player } from '@/components/Player'
import { Spinner } from '@/components/Spinner'
import { useToast } from '@/components/Toast'
import { Avatar, EmptyState, Segmented, Skeleton, Switch } from '@/components/ui'
import { AGENT_ANSWER_PREFIX, BRAND, type Comment, ME, PRESENTERS, REACTIONS, type Recording } from '@/content'
import { cn } from '@/lib/cn'
import { clock, plural, timeAgo } from '@/lib/format'
import { Link, useLocation } from '@/lib/router'
import { actions, uid, useStore } from '@/lib/store'
import { NotFound } from './NotFound'

export function SharePage({ id }: { id: string }) {
  const recordings = useStore((s) => s.recordings)
  const rec = recordings.find((r) => r.id === id)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 400)
    return () => window.clearTimeout(t)
  }, [id])
  useEffect(() => {
    if (rec) document.title = `${rec.title} · ${BRAND.name}`
  }, [rec])
  useEffect(() => {
    if (rec && !loading) actions.markWatched(rec.id)
  }, [rec, loading])

  if (!rec) return <NotFound />
  return (
    <div className="min-h-dvh bg-bg">
      <ShareHeader rec={rec} />
      {loading ? <ShareSkeleton /> : <ShareBody key={rec.id} rec={rec} />}
    </div>
  )
}

function ShareHeader({ rec }: { rec: Recording }) {
  const toast = useToast()
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="-m-1.5 rounded-full p-1.5" aria-label={`${BRAND.name} home`}>
          <LogoMark size={28} />
        </Link>
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm text-muted">
          <Link to="/app" className="hidden rounded-full px-1 hover:text-fg sm:inline">
            {BRAND.workspace}
          </Link>
          <span className="hidden sm:inline" aria-hidden>
            /
          </span>
          <span className="truncate text-fg">{rec.title}</span>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-9"
            icon={<Link2 className="size-4" />}
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href).catch(() => {})
              toast({ title: 'Link copied to clipboard' })
            }}
          >
            <span className="hidden sm:inline">Copy link</span>
            <span className="sm:hidden">Copy</span>
          </Button>
          <ButtonLink to="/app" size="sm" variant="primary" className="h-9 max-md:hidden">
            Record your own
          </ButtonLink>
        </div>
      </div>
    </header>
  )
}

function ShareSkeleton() {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px]" aria-busy="true" aria-label="Loading clip">
      <div>
        <Skeleton className="aspect-video w-full rounded-[18px]" />
        <Skeleton className="mt-5 h-7 w-1/2" />
        <Skeleton className="mt-3 h-4 w-1/3" />
      </div>
      <Skeleton className="h-[420px] rounded-[18px]" />
    </div>
  )
}

function ShareBody({ rec }: { rec: Recording }) {
  const { search } = useLocation()
  const allComments = useStore((s) => s.comments)
  const comments = useMemo(() => allComments.filter((c) => c.recId === rec.id).sort((a, b) => a.t - b.t), [allComments, rec.id])
  const [time, setTime] = useState(() => Math.min(rec.duration, Number(search.get('t')) || 0))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [tab, setTab] = useState<'summary' | 'transcript'>('summary')
  const presenter = PRESENTERS[rec.presenter]

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setTime((t) => {
        const n = t + 0.25 * speed
        if (n >= rec.duration) {
          setPlaying(false)
          return rec.duration
        }
        return n
      })
    }, 250)
    return () => window.clearInterval(id)
  }, [playing, speed, rec.duration])

  const seek = (t: number) => {
    setTime(t)
    document.getElementById('player')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  return (
    <main className="mx-auto grid max-w-[1400px] items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0">
        <div id="player">
          <Player
            scene={rec.scene}
            presenter={rec.presenter}
            duration={rec.duration}
            time={time}
            playing={playing}
            onTime={setTime}
            onPlaying={(p) => {
              if (p && time >= rec.duration) setTime(0)
              setPlaying(p)
            }}
            speed={speed}
            onSpeed={setSpeed}
            chapters={rec.chapters}
            markers={comments.filter((c) => !c.resolved).map((c) => ({ id: c.id, t: c.t, initials: c.initials, label: `${c.author}: ${c.body}` }))}
          />
        </div>
        <h1 className="mt-5 font-display text-[26px] leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[30px]">{rec.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted">
          <Avatar initials={presenter.initials} image={presenter.image} size={32} />
          <span className="text-fg">{presenter.name}</span>
          <span aria-hidden>·</span>
          <span>{timeAgo(rec.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{plural(rec.views, 'view')}</span>
        </div>

        <section className="mt-6 rounded-[18px] bg-surface p-4 ring-1 ring-line sm:p-5" aria-label="About this clip">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              label="Clip details"
              value={tab}
              onChange={setTab}
              options={[
                { id: 'summary', label: 'Summary' },
                { id: 'transcript', label: 'Transcript' },
              ]}
            />
            <span className="inline-flex items-center gap-1.5 text-[12px] text-faint">
              <Sparkles className="size-3.5" /> Generated from the transcript
            </span>
          </div>
          {tab === 'summary' ? (
            <div className="mt-5">
              <p className="max-w-[70ch] text-[15px] leading-relaxed text-fg/90">{rec.summary}</p>
              <h2 className="mt-6 text-[13px] font-medium text-muted">Chapters</h2>
              <ol className="mt-2 grid gap-1 sm:grid-cols-2">
                {rec.chapters.map((c) => (
                  <li key={c.t}>
                    <button type="button" onClick={() => seek(c.t)} className="flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left text-sm hover:bg-surface-2 pointer-coarse:py-2.5">
                      <span className="font-mono text-[12px] text-ember-text">{clock(c.t)}</span>
                      <span className="truncate">{c.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
              <AskAgent rec={rec} onSeek={seek} />
            </div>
          ) : (
            <ol className="mt-4 max-h-[360px] space-y-0.5 overflow-y-auto pr-1" aria-label="Transcript">
              {rec.transcript.map((s, i) => {
                const next = rec.transcript[i + 1]?.t ?? rec.duration
                const on = time >= s.t && time < next
                return (
                  <li key={s.t}>
                    <button type="button" onClick={() => seek(s.t)} aria-current={on || undefined} className={cn('flex w-full gap-4 rounded-[10px] px-2 py-2 text-left text-[15px] transition-colors', on ? 'bg-surface-2 text-fg' : 'text-muted hover:bg-surface-2/60 hover:text-fg')}>
                      <span className="w-10 shrink-0 pt-0.5 font-mono text-[12px] text-ember-text">{clock(s.t)}</span>
                      <span>{s.text}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          )}
        </section>
      </div>

      <Comments rec={rec} comments={comments} time={time} onSeek={seek} onPause={() => setPlaying(false)} />
    </main>
  )
}

function AskAgent({ rec, onSeek }: { rec: Recording; onSeek: (t: number) => void }) {
  const [q, setQ] = useState('')
  const [state, setState] = useState<{ kind: 'idle' } | { kind: 'thinking' } | { kind: 'error'; message: string } | { kind: 'answer'; text: string; t: number | null }>({ kind: 'idle' })

  function ask(e: FormEvent) {
    e.preventDefault()
    const query = q.trim()
    if (query.length < 3) return setState({ kind: 'error', message: 'Ask a question about the clip, like “what’s the open question?”' })
    setState({ kind: 'thinking' })
    // A stand-in for an agent call: picks the transcript line that shares the most words.
    window.setTimeout(() => {
      const words = new Set(query.toLowerCase().match(/[a-z]{3,}/g) ?? [])
      let best: { t: number; text: string; score: number } | null = null
      for (const s of rec.transcript) {
        const score = (s.text.toLowerCase().match(/[a-z]{3,}/g) ?? []).filter((w) => words.has(w)).length
        if (score > (best?.score ?? 0)) best = { ...s, score }
      }
      if (!best) setState({ kind: 'answer', text: `I couldn’t find that in this clip. ${rec.summary}`, t: null })
      else setState({ kind: 'answer', text: `${AGENT_ANSWER_PREFIX}“${best.text}”`, t: best.t })
    }, 900)
  }

  return (
    <div className="mt-6 rounded-[14px] bg-surface-2 p-3 ring-1 ring-line">
      <form onSubmit={ask} className="flex items-center gap-2" noValidate>
        <Sparkles className="ml-1 size-4 shrink-0 text-ember-text" />
        <label htmlFor="ask" className="sr-only">
          Ask the agent about this clip
        </label>
        <input
          id="ask"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            if (state.kind === 'error') setState({ kind: 'idle' })
          }}
          placeholder="Ask the agent about this clip"
          className="h-10 min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-faint focus:outline-none"
          aria-invalid={state.kind === 'error' || undefined}
          aria-describedby={state.kind === 'error' ? 'ask-err' : undefined}
        />
        <IconButton label="Ask" type="submit" className="bg-cream text-ink hover:bg-[#fffaf0] hover:text-ink" disabled={state.kind === 'thinking'}>
          {state.kind === 'thinking' ? <Spinner className="size-4" /> : <ArrowUp className="size-4" />}
        </IconButton>
      </form>
      <div aria-live="polite">
        {state.kind === 'error' && (
          <p id="ask-err" className="mt-2 px-1 text-[13px] text-ember-text">
            {state.message}
          </p>
        )}
        {state.kind === 'thinking' && <p className="mt-3 px-1 text-[13px] text-muted">Reading the transcript…</p>}
        {state.kind === 'answer' && (
          <div className="mt-3 rounded-[10px] bg-surface p-3 text-[14px] leading-relaxed text-fg/90">
            {state.text}
            {state.t !== null && (
              <button type="button" onClick={() => onSeek(state.t!)} className="ml-2 rounded-full bg-ember/15 px-2 py-0.5 font-mono text-[12px] text-ember-text hover:bg-ember/25">
                Jump to {clock(state.t)}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Comments({ rec, comments, time, onSeek, onPause }: { rec: Recording; comments: Comment[]; time: number; onSeek: (t: number) => void; onPause: () => void }) {
  const toast = useToast()
  const [body, setBody] = useState('')
  const [atTime, setAtTime] = useState(true)
  const [showResolved, setShowResolved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const shown = comments.filter((c) => showResolved || !c.resolved)
  const resolvedCount = comments.filter((c) => c.resolved).length

  function post(e?: FormEvent) {
    e?.preventDefault()
    const text = body.trim()
    if (!text) return setError('Write something first.')
    if (text.length > 1000) return setError('Keep comments under 1,000 characters.')
    const c: Comment = { id: uid('c'), recId: rec.id, t: atTime ? Math.floor(time) : 0, author: ME.name, initials: ME.initials, body: text, createdAt: new Date().toISOString(), mine: true }
    actions.addComment(c)
    setBody('')
    setError(null)
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-id="${c.id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
  }

  return (
    <aside className="flex flex-col rounded-[18px] bg-surface ring-1 ring-line lg:sticky lg:top-[88px] lg:max-h-[calc(100dvh-112px)]" aria-label="Comments">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 className="text-[15px] font-medium">
          Comments <span className="text-faint">({comments.length})</span>
        </h2>
        {resolvedCount > 0 && (
          <label className="flex items-center gap-2 text-[13px] text-muted">
            Show resolved ({resolvedCount})
            <Switch checked={showResolved} onChange={setShowResolved} label="Show resolved comments" />
          </label>
        )}
      </div>
      <ol ref={listRef} className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2">
        {shown.length === 0 ? (
          <li>
            <EmptyState icon={<MessageSquare className="size-5" />} title="No comments yet" body="Pause on the moment you mean and leave the first one." className="m-2 py-10" />
          </li>
        ) : (
          shown.map((c) => (
            <li key={c.id} data-id={c.id} className={cn('group/comment rounded-[12px] p-2.5 hover:bg-surface-2/60', c.resolved && 'opacity-60')}>
              <div className="flex items-start gap-2.5">
                <Avatar initials={c.initials} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-[13.5px] font-medium">{c.author}</span>
                    <button type="button" onClick={() => onSeek(c.t)} className="rounded-full bg-ember/15 px-1.5 py-0.5 font-mono text-[11px] text-ember-text hover:bg-ember/25 pointer-coarse:px-2.5 pointer-coarse:py-3" aria-label={`Jump to ${clock(c.t)}`}>
                      {clock(c.t)}
                    </button>
                    <span className="text-[12px] text-faint">{timeAgo(c.createdAt)}</span>
                    {c.resolved && (
                      <span className="inline-flex items-center gap-1 text-[12px] text-ok">
                        <CheckCircle2 className="size-3" /> Resolved
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[14px] leading-relaxed break-words text-fg/90">{c.body}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1">
                    {Object.entries(c.reactions ?? {}).map(([emoji, n]) => (
                      <button key={emoji} type="button" onClick={() => actions.react(c.id, emoji)} className="inline-flex h-7 items-center gap-1 rounded-full bg-surface-2 px-2 text-[12px] ring-1 ring-line hover:ring-line-strong pointer-coarse:h-10 pointer-coarse:px-2.5" aria-label={`React ${emoji}, ${n} so far`}>
                        {emoji} <span className="text-muted tabular-nums">{n}</span>
                      </button>
                    ))}
                    <Menu
                      label="Add reaction"
                      align="start"
                      width={196}
                      items={REACTIONS.map((r) => ({ id: r, label: `${r}  React`, onSelect: () => actions.react(c.id, r) }))}
                      trigger={(p) => (
                        <button {...p} type="button" aria-label="Add reaction" className="inline-flex size-7 items-center justify-center rounded-full text-faint hover:bg-surface-2 hover:text-fg pointer-coarse:size-10">
                          <Smile className="size-4" />
                        </button>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => actions.patchComment(c.id, { resolved: !c.resolved })}
                      className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[12px] text-faint hover:bg-surface-2 hover:text-fg pointer-coarse:h-10"
                    >
                      {c.resolved ? <Undo2 className="size-3.5" /> : <Check className="size-3.5" />}
                      {c.resolved ? 'Reopen' : 'Resolve'}
                    </button>
                    {c.mine && (
                      <button
                        type="button"
                        onClick={() => {
                          actions.removeComment(c.id)
                          toast({ title: 'Comment deleted', action: { label: 'Undo', run: () => actions.addComment(c) } })
                        }}
                        className="inline-flex h-7 items-center gap-1 rounded-full px-2 text-[12px] text-faint hover:bg-surface-2 hover:text-ember-text pointer-coarse:h-10"
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))
        )}
      </ol>
      <form onSubmit={post} className="border-t border-line p-3" noValidate>
        <label htmlFor="comment" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment"
          value={body}
          onChange={(e) => {
            setBody(e.target.value)
            setError(null)
          }}
          onFocus={onPause}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) post()
          }}
          rows={2}
          placeholder="Add a comment…"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'comment-err' : 'comment-hint'}
          className="block w-full resize-none rounded-[12px] bg-surface-2 px-3 py-2.5 text-[14px] ring-1 ring-line-strong ring-inset placeholder:text-faint focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none aria-invalid:ring-ember/70"
        />
        {error && (
          <p id="comment-err" role="alert" className="mt-1.5 text-[13px] text-ember-text">
            {error}
          </p>
        )}
        <div className="mt-2 flex items-center justify-between gap-2">
          <label className="flex min-h-10 items-center gap-2 text-[13px] text-muted">
            <input type="checkbox" checked={atTime} onChange={(e) => setAtTime(e.target.checked)} className="size-4 accent-[#e5484d]" />
            at <span className="font-mono text-ember-text">{clock(time)}</span>
          </label>
          <span id="comment-hint" className="hidden text-[12px] text-faint sm:inline">
            ⌘ Enter to post
          </span>
          <Button type="submit" size="sm" variant="primary">
            Post
          </Button>
        </div>
      </form>
    </aside>
  )
}
