import { Trophy } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Photo } from '../components/Photo'
import { Eyebrow } from '../components/SectionHeading'
import { COMMUNITY, IMAGES } from '../content'
import { LEADERBOARD } from '../data'

export function Community() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <Photo image={IMAGES.community} className="aspect-[3/2] w-full rounded-card object-cover" />
            <div className="depth absolute right-4 -bottom-8 w-[250px] rounded-card-sm bg-surface/90 p-4 shadow-float backdrop-blur-xl sm:-right-6">
              <p className="flex items-center gap-2 text-[13.5px] font-medium">
                <Trophy aria-hidden className="size-4 text-amber" /> This week
              </p>
              <ol className="mt-3 grid gap-2">
                {LEADERBOARD.slice(0, 3).map((r, i) => (
                  <li key={r.handle} className="flex items-center gap-2 text-[13.5px]">
                    <span className="w-4 text-faint">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-fg">{r.handle}</span>
                    <span className="text-muted tabular-nums">{r.points.toLocaleString()}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <div>
            <Eyebrow>{COMMUNITY.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-[34px] leading-[1.08] font-normal tracking-[-0.025em] text-stage sm:text-[48px]">{COMMUNITY.title}</h2>
            <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-muted">{COMMUNITY.body}</p>
            <ButtonLink href={COMMUNITY.cta.href} variant="secondary" className="mt-8">
              {COMMUNITY.cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
