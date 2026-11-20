import { ArrowLeft, Link2, TrendingUp, Users } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

import { CopyField } from '../components/CopyField'
import { PageShell } from '../components/Layout'
import { Leaderboard, useLeaderboard } from '../components/Leaderboard'
import { Reveal } from '../components/Reveal'
import { useCountUp } from '../components/SuccessPanel'
import { Button, ButtonLink, Callout, Card, Container, Skeleton, Stat } from '../components/ui'
import { statusPage, success } from '../content'
import { ApiError, fetchStatus, shareUrl, type Status } from '../lib/api'
import { ease } from '../lib/motion'
import { useTitle } from '../lib/router'

type State = { status: 'loading' } | { status: 'missing' } | { status: 'error'; message: string } | { status: 'ready'; data: Status }

function useStatus(code: string) {
  const [state, setState] = useState<State>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let live = true
    setState({ status: 'loading' })
    fetchStatus(code)
      .then((data) => live && setState({ status: 'ready', data }))
      .catch((err) => {
        if (!live) return
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) setState({ status: 'missing' })
        else setState({ status: 'error', message: err instanceof ApiError ? err.message : 'Something went wrong.' })
      })
    return () => {
      live = false
    }
  }, [code, attempt])
  return { state, retry: () => setAttempt((a) => a + 1) }
}

/** Progress bar from where you joined to where you are now. */
function MoveUpBar({ joinedAt, position, count }: { joinedAt: number; position: number; count: number }) {
  const reduce = useReducedMotion()
  const toPct = (n: number) => (count <= 1 ? 100 : Math.round(((count - n) / (count - 1)) * 100))
  const start = toPct(joinedAt)
  const now = toPct(position)
  return (
    <div>
      <div className="relative h-2 overflow-hidden rounded-full bg-sunken" role="img" aria-label={`Ahead of ${now}% of the list`}>
        <span className="absolute inset-y-0 left-0 rounded-full bg-accent-soft" style={{ width: `${start}%` }} />
        <motion.span
          className="absolute inset-y-0 left-0 rounded-full bg-accent"
          initial={reduce ? false : { width: `${start}%` }}
          animate={{ width: `${now}%` }}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
        />
      </div>
      <p className="mt-2 flex justify-between text-micro text-muted">
        <span>Back of the list</span>
        <span>Front</span>
      </p>
    </div>
  )
}

function Ready({ data }: { data: Status }) {
  const reduce = useReducedMotion() ?? false
  const position = useCountUp(data.position, reduce)
  const moved = Math.max(0, data.joinedAt - data.position)
  const board = useLeaderboard(data.code)
  const link = shareUrl(data.code)

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Reveal>
          <Card padding="lg">
            <Stat label={statusPage.title} value={`#${position.toLocaleString()}`} suffix={`of ${data.count.toLocaleString()}`} tone="accent" size="lg" />
            <p className="mt-4 text-copy text-body">
              {statusPage.startedAt.replace('{n}', data.joinedAt.toLocaleString())}{' '}
              {moved > 0 ? statusPage.movedUp.replace('{n}', moved.toLocaleString()) : statusPage.lead.replace('{boost}', String(data.boost))}
            </p>
            <div className="mt-6">
              <MoveUpBar joinedAt={data.joinedAt} position={data.position} count={data.count} />
            </div>
          </Card>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <Card>
              <Users className="size-5 text-accent" aria-hidden="true" />
              <Stat className="mt-3" size="sm" label={statusPage.referralsLabel} value={data.referrals.toLocaleString()} />
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <Card>
              <TrendingUp className="size-5 text-accent" aria-hidden="true" />
              <Stat className="mt-3" size="sm" label={statusPage.aheadLabel} value={Math.max(0, data.position - 1).toLocaleString()} />
            </Card>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <Card padding="lg">
            <h2 className="inline-flex items-center gap-2 text-heading font-semibold text-ink">
              <Link2 className="size-[18px] text-accent" aria-hidden="true" />
              {statusPage.shareTitle}
            </h2>
            <p className="mt-1.5 text-copy text-muted">{statusPage.lead.replace('{boost}', String(data.boost))}</p>
            <CopyField className="mt-5" value={link} label="Your share link" copyLabel={success.copy} copiedLabel={success.copied} />
          </Card>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <Card padding="lg">
          <Leaderboard state={board} />
        </Card>
      </Reveal>
    </div>
  )
}

export function StatusPage({ code }: { code: string }) {
  useTitle('Your spot on the waitlist')
  const { state, retry } = useStatus(code)

  return (
    <PageShell>
      <Container className="py-12 lg:py-16">
        <h1 className="text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-title">Your waitlist status</h1>
        <p className="mt-2 text-lead text-muted">Code <span className="font-mono text-[15px] text-ink">{code}</span></p>
        <div className="mt-8" aria-live="polite" aria-busy={state.status === 'loading'}>
          {state.status === 'loading' && (
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              <Card padding="lg" className="space-y-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-14 w-48" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2 w-full" />
              </Card>
              <Card padding="lg" className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </Card>
            </div>
          )}
          {state.status === 'missing' && (
            <Callout
              title={statusPage.notFoundTitle}
              className="max-w-[560px] bg-white"
              action={
                <ButtonLink href="/" size="sm" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
                  Join the waitlist
                </ButtonLink>
              }
            >
              {statusPage.notFoundBody}
            </Callout>
          )}
          {state.status === 'error' && (
            <Callout
              tone="error"
              title="We couldn't load your spot."
              className="max-w-[560px]"
              action={
                <Button variant="secondary" size="sm" onClick={retry}>
                  Try again
                </Button>
              }
            >
              {state.message}
            </Callout>
          )}
          {state.status === 'ready' && <Ready data={state.data} />}
        </div>
      </Container>
    </PageShell>
  )
}
