import { CalendarDays, Flame, Play, Trophy, Users } from 'lucide-react'

import { Badge, difficultyTone } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { PageIntro } from '../components/PageIntro'
import { Photo } from '../components/Photo'
import { useToast } from '../components/Toast'
import { DEVELOPERS, IMAGES } from '../content'
import { EVENTS, LEADERBOARD, PROBLEMS } from '../data'
import { formatDate } from '../lib/format'
import { useStored } from '../lib/storage'

/** For developers: practice challenges, the weekly board and community events (RSVPs persist). */
export function Developers() {
  const [rsvp, setRsvp] = useStored<string[]>('rsvp', [])
  const toast = useToast()
  return (
    <>
      <PageIntro eyebrow="For developers" title={DEVELOPERS.title} sub={DEVELOPERS.sub} />
      <Container className="pb-24">
        <h2 className="text-[22px] font-medium">Practice challenges</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <Card as="li" key={p.id} className="flex flex-col p-6">
              <div className="flex gap-2">
                <Badge tone={difficultyTone[p.difficulty]}>{p.difficulty}</Badge>
                <Badge>{p.minutes} min</Badge>
              </div>
              <h3 className="mt-4 text-[19px] font-medium">{p.title}</h3>
              <p className="mt-1.5 flex-1 text-[15px] text-muted">{p.summary}</p>
              <ButtonLink href={`/demo?problem=${p.id}`} variant="secondary" className="mt-5 self-start" icon={<Play className="size-4" />}>
                Solve
              </ButtonLink>
            </Card>
          ))}
        </ul>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 px-6 pt-6">
              <Trophy aria-hidden className="size-5 text-amber" />
              <h2 className="text-[19px] font-medium">This week’s board</h2>
            </div>
            <div className="mt-4 overflow-x-auto" tabIndex={0} role="region" aria-label="Leaderboard">
              <table className="w-full min-w-[460px] text-left text-[14.5px]">
                <thead className="border-y text-[13px] text-muted">
                  <tr>
                    <th scope="col" className="px-6 py-2.5 font-normal">Rank</th>
                    <th scope="col" className="px-3 py-2.5 font-normal">Developer</th>
                    <th scope="col" className="px-3 py-2.5 font-normal">Solved</th>
                    <th scope="col" className="px-3 py-2.5 font-normal">Streak</th>
                    <th scope="col" className="px-6 py-2.5 text-right font-normal">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {LEADERBOARD.map((r, i) => (
                    <tr key={r.handle} className="border-b border-white/5 last:border-0">
                      <td className="px-6 py-3 text-muted tabular-nums">{i + 1}</td>
                      <td className="px-3 py-3">
                        <span className="font-mono text-fg">{r.handle}</span>
                        <span className="ml-2 text-[13px] text-faint">{r.country}</span>
                      </td>
                      <td className="px-3 py-3 tabular-nums">{r.solved}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Flame aria-hidden className="size-3.5 text-amber" />
                          {r.streak}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right tabular-nums">{r.points.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <div className="grid content-start gap-4">
            <Photo image={IMAGES.community} className="aspect-[16/9] w-full rounded-card object-cover" />
            <h2 className="mt-2 text-[19px] font-medium">Upcoming events</h2>
            {EVENTS.map((ev) => {
              const going = rsvp.includes(ev.id)
              return (
                <Card key={ev.id} className="flex flex-wrap items-center gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[15.5px]">{ev.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13.5px] text-muted">
                      <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden className="size-3.5" />{formatDate(ev.date)}</span>
                      <span className="inline-flex items-center gap-1.5"><Users aria-hidden className="size-3.5" />{(ev.seats + (going ? 1 : 0)).toLocaleString()} going</span>
                      <Badge>{ev.kind}</Badge>
                    </p>
                  </div>
                  <Button
                    variant={going ? 'secondary' : 'primary'}
                    size="sm"
                    aria-pressed={going}
                    onClick={() => {
                      setRsvp((r) => (going ? r.filter((x) => x !== ev.id) : [...r, ev.id]))
                      toast(going ? 'RSVP cancelled.' : 'You are on the list. We will email the link.')
                    }}
                  >
                    {going ? 'Going' : 'RSVP'}
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>
      </Container>
    </>
  )
}
