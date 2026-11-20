import { ArrowUp } from 'lucide-react'

import { Leaderboard, useLeaderboard } from '../components/Leaderboard'
import { Reveal } from '../components/Reveal'
import { ButtonLink, Card, Container, SectionHeading } from '../components/ui'
import { referrals } from '../content'
import { loadSaved, statusPath } from '../lib/api'
import { BOOST } from '../worker/rank'

/** "Move up the list": how referrals work, plus the live leaderboard. */
export function Referrals() {
  const saved = typeof window === 'undefined' ? null : loadSaved()
  const board = useLeaderboard(saved?.code)
  const boost = board.status === 'ready' ? board.boost : BOOST

  return (
    <section id="referrals" aria-labelledby="referrals-title" className="scroll-mt-6 bg-page py-20 lg:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
        <div>
          <Reveal>
            <SectionHeading id="referrals-title" eyebrow={referrals.eyebrow} title={referrals.title} body={referrals.body} />
          </Reveal>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {referrals.steps.map((step, i) => (
              <li key={step.title}>
                <Reveal delay={i * 0.07}>
                  <span className="grid size-9 place-items-center rounded-full border border-line text-[14px] font-semibold text-ink">
                    {i === 2 ? <ArrowUp className="size-4 text-accent-ink" aria-hidden="true" /> : i + 1}
                  </span>
                  <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.015em] text-ink">{step.title}</h3>
                  <p className="mt-1 text-copy text-muted">{step.body.replace('{boost}', String(boost))}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal delay={0.2} className="mt-10">
            {saved ? (
              <ButtonLink href={statusPath(saved.code)} variant="secondary">
                See your rank
              </ButtonLink>
            ) : (
              <ButtonLink href="/#join">{referrals.cta}</ButtonLink>
            )}
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Card padding="lg">
            <Leaderboard state={board} />
          </Card>
        </Reveal>
      </Container>
    </section>
  )
}
