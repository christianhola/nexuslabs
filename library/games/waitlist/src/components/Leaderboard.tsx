import { Trophy } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { referrals as copy } from '../content'
import { fetchLeaderboard, type LeaderEntry } from '../lib/api'
import { cx } from '../lib/cx'
import { ease } from '../lib/motion'
import { Avatar, Badge, Callout, Skeleton } from './ui'

export type LeaderboardState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; entries: LeaderEntry[]; boost: number }

/** Loads the top referrers; pass your code to have your row marked. */
export function useLeaderboard(code?: string | null): LeaderboardState {
  const [state, setState] = useState<LeaderboardState>({ status: 'loading' })
  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    fetchLeaderboard(code)
      .then((data) => live && setState({ status: 'ready', ...data }))
      .catch(() => live && setState({ status: 'error' }))
    return () => {
      live = false
    }
  }, [code])
  return state
}

/** Ranked list of top referrers with masked names. */
export function Leaderboard({ state, title = copy.leaderboardTitle, className }: { state: LeaderboardState; title?: string; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 text-heading font-semibold text-ink">
          <Trophy className="size-[18px] text-accent" aria-hidden="true" />
          {title}
        </h3>
        {state.status === 'ready' && <Badge tone="accent">+{state.boost} places per friend</Badge>}
      </div>

      {state.status === 'loading' && (
        <ol className="mt-4 divide-y divide-line-soft" aria-busy="true" aria-label="Loading leaderboard">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="ml-auto h-3 w-12" />
            </li>
          ))}
        </ol>
      )}

      {state.status === 'error' && <Callout tone="error" className="mt-4" title={copy.leaderboardError} />}

      {state.status === 'ready' && state.entries.length === 0 && <Callout className="mt-4" title={copy.leaderboardEmpty} icon={<Trophy className="size-[18px]" aria-hidden="true" />} />}

      {state.status === 'ready' && state.entries.length > 0 && (
        <ol className="mt-3 divide-y divide-line-soft">
          {state.entries.map((entry, i) => (
            <motion.li
              key={entry.name + i}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease, delay: i * 0.05 }}
              className={cx('flex items-center gap-3 py-3', entry.you && '-mx-3 rounded-card bg-accent-soft px-3')}
            >
              <span className={cx('w-5 text-center text-[14px] font-semibold tabular-nums', i === 0 ? 'text-accent-ink' : 'text-muted')}>{i + 1}</span>
              <Avatar initials={entry.name.slice(0, 2).toUpperCase()} tone={i === 0 ? 'ink' : entry.you ? 'accent' : 'neutral'} />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-[15px] font-medium text-ink">
                  {entry.name}
                  {entry.you && <Badge tone="accent" className="bg-white">You</Badge>}
                </span>
                <span className={cx('block text-small', entry.you ? 'text-body' : 'text-muted')}>
                  {entry.referrals} {entry.referrals === 1 ? 'friend' : 'friends'} joined
                </span>
              </span>
              <span className="text-[15px] font-semibold tabular-nums text-ink">#{entry.position.toLocaleString()}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </div>
  )
}
