import { Eye, Heart, Megaphone, Trash2 } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import { audiences } from '../content'
import type { FeedPost } from '../content'
import { cx } from '../lib/cx'
import { usePosts, useReactions } from '../lib/stores'
import { useReducedMotion } from '../lib/useReducedMotion'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Button, IconButton } from './Button'
import { EmptyState } from './EmptyState'
import { byId } from './ProfileCard'

const reach: Record<string, number> = { Everyone: 2140, Operations: 1260, 'Lisbon warehouse': 288, 'Berlin store': 64, 'People team': 18 }

function Post({ post, compact, onDelete }: { post: FeedPost; compact?: boolean; onDelete?: () => void }) {
  const [reacted, setReacted] = useReactions()
  const on = reacted.includes(post.id)
  const author = post.mine ? { name: 'You', face: undefined as number | undefined } : byId(post.authorId) ?? { name: 'Someone', face: undefined }
  const pct = Math.round((post.reads / post.reached) * 100)
  return (
    <article className={cx('animate-pop-in rounded-[16px] border border-line bg-card', compact ? 'p-3.5' : 'p-4 sm:p-5')}>
      <header className="flex items-center gap-3">
        <Avatar name={author.name} face={author.face} size={compact ? 34 : 40} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14.5px] font-semibold text-ink">{author.name}</p>
          <p className="truncate text-[12.5px] text-faint">
            To {post.audience} · {post.time}
          </p>
        </div>
        {post.mine && onDelete ? (
          <IconButton label="Delete post" onClick={onDelete}>
            <Trash2 aria-hidden />
          </IconButton>
        ) : null}
      </header>
      <p className={cx('mt-3 text-pretty text-body', compact ? 'text-[14px] leading-snug' : 'text-[15.5px] leading-relaxed')}>{post.body}</p>
      <footer className="mt-3.5 flex items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={on}
          aria-label={`${on ? 'Remove reaction' : 'React'} (${post.reactions + (on ? 1 : 0)})`}
          onClick={() => setReacted((r) => (on ? r.filter((x) => x !== post.id) : [...r, post.id]))}
          className={cx('inline-flex h-10 items-center gap-1.5 rounded-[8px] border px-3 text-[13.5px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ink', on ? 'border-ink bg-mint text-ink' : 'border-line text-body hover:bg-mist')}
        >
          <Heart className={cx('size-4', on && 'fill-ink')} aria-hidden />
          <span className="tabular-nums">{post.reactions + (on ? 1 : 0)}</span>
        </button>
        <span className="flex min-w-0 items-center gap-2 text-[12.5px] text-muted">
          <Eye className="size-4 shrink-0" aria-hidden />
          <span className="tabular-nums">
            {post.reads.toLocaleString('en-US')} of {post.reached.toLocaleString('en-US')} read
          </span>
          <span className="round hidden h-1.5 w-16 overflow-hidden rounded-full bg-mist-2 sm:block" aria-hidden>
            <span className="block h-full rounded-full bg-ink transition-[width] duration-700" style={{ width: `${pct}%` }} />
          </span>
        </span>
      </footer>
    </article>
  )
}

/*
  The live news feed: write an announcement, pick who sees it and publish.
  Reads climb as colleagues open it. Posts and reactions are saved in this
  browser.
*/
export function FeedMock({ compact, composer = true }: { compact?: boolean; composer?: boolean }) {
  const id = useId()
  const [posts, setPosts] = usePosts()
  const [text, setText] = useState('')
  const [audience, setAudience] = useState(audiences[0])
  const [error, setError] = useState<string>()
  const reduce = useReducedMotion()

  // Reads on your own posts climb towards ~88% of the audience.
  useEffect(() => {
    if (!posts.some((p) => p.mine && p.reads < p.reached * 0.88)) return
    const t = window.setInterval(
      () =>
        setPosts((ps) =>
          ps.map((p) => (p.mine && p.reads < p.reached * 0.88 ? { ...p, reads: Math.min(Math.round(p.reached * 0.88), p.reads + Math.ceil(p.reached / 14)), reactions: p.reactions + (Math.random() < 0.4 ? 1 : 0), time: 'Just now' } : p)),
        ),
      reduce ? 400 : 1100,
    )
    return () => window.clearInterval(t)
  }, [posts, setPosts, reduce])

  const publish = () => {
    const body = text.trim()
    if (body.length < 10) return setError('Write at least 10 characters.')
    if (body.length > 280) return setError('Keep it to 280 characters.')
    setPosts((ps) => [{ id: `me-${Date.now()}`, authorId: 'me', audience, time: 'Just now', body, reactions: 0, reads: 0, reached: reach[audience] ?? 100, mine: true }, ...ps])
    setText('')
    setError(undefined)
  }

  return (
    <div className={cx('flex h-full flex-col gap-3', compact && 'overflow-y-auto px-3 pb-4')}>
      {composer ? (
        <div className={cx('rounded-[16px] border-[1.5px] border-ink bg-card transition-shadow focus-within:ring-4 focus-within:ring-mint/45', compact ? 'p-3' : 'p-4')}>
          <label htmlFor={`${id}-t`} className="sr-only">
            Write an announcement
          </label>
          <textarea
            id={`${id}-t`}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              if (error) setError(undefined)
            }}
            rows={compact ? 2 : 3}
            placeholder="Share an update with your teams…"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-e` : `${id}-c`}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink placeholder:text-faint focus:outline-none"
          />
          {error ? (
            <p id={`${id}-e`} role="alert" className="text-[13px] font-medium text-bad">
              {error}
            </p>
          ) : null}
          <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-3">
            <label htmlFor={`${id}-a`} className="sr-only">
              Audience
            </label>
            <span className="relative">
              <Megaphone className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <select id={`${id}-a`} value={audience} onChange={(e) => setAudience(e.target.value)} className="h-10 appearance-none rounded-[9px] border border-line bg-mist pl-8 pr-3 text-[14px] font-medium text-ink focus:border-ink focus:outline-none focus:ring-4 focus:ring-mint/45 sm:h-9">
                {audiences.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </span>
            <span id={`${id}-c`} className={cx('ml-auto text-[12.5px] tabular-nums', text.length > 280 ? 'text-bad' : 'text-faint')}>
              {text.length}/280
            </span>
            <Button size="sm" onClick={publish} disabled={!text.trim()}>
              Publish
            </Button>
          </div>
        </div>
      ) : null}
      {posts.length ? (
        posts.map((p) => <Post key={p.id} post={p} compact={compact} onDelete={() => setPosts((ps) => ps.filter((x) => x.id !== p.id))} />)
      ) : (
        <EmptyState icon={<Megaphone />} title="No posts yet" body="Write the first announcement above." />
      )}
      {!composer ? null : (
        <p className="text-center text-[12.5px] text-faint">
          <Badge tone="outline">Demo</Badge> Posts stay in this browser.
        </p>
      )}
    </div>
  )
}
