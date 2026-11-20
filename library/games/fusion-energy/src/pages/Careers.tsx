import { ArrowUpRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Badge, Chip, EmptyState, SaveToggle } from '../components/Controls'
import { Input } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { jobs, photos, teams } from '../content'
import type { Team } from '../content'
import { Link } from '../lib/router'
import { useStored } from '../lib/store'

export function Careers() {
  const [query, setQuery] = useState('')
  const [team, setTeam] = useState<Team | 'all' | 'saved'>('all')
  const [saved, setSaved] = useStored<string[]>('saved-roles', [])
  const [applied] = useStored<string[]>('applied-roles', [])

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return jobs.filter((j) => {
      if (team === 'saved' && !saved.includes(j.slug)) return false
      if (team !== 'all' && team !== 'saved' && j.team !== team) return false
      if (q && !`${j.title} ${j.team} ${j.location} ${j.summary}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [query, team, saved])

  const toggle = (slug: string) => setSaved((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]))
  const reset = () => {
    setQuery('')
    setTeam('all')
  }

  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Build the reactor that goes to sea"
        body="We are a small team of engineers, physicists and mariners. Every role here touches real hardware."
        aside={
          <Card tone="steel" className="mx-auto aspect-[3/2] w-full max-w-[560px]">
            <img src={photos.careers} alt="Engineers around a vacuum vessel on the fabrication floor" width={1400} height={933} className="absolute inset-0 h-full w-full object-cover" />
          </Card>
        }
      />
      <section aria-labelledby="roles-title" className="pb-24">
        <Container size="xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <h2 id="roles-title" className="text-[24px] font-medium tracking-[-0.02em]">
              Open roles <span className="text-muted">{jobs.length}</span>
            </h2>
            <div className="relative w-full lg:max-w-[360px]">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
              <Input
                type="search"
                aria-label="Search roles"
                placeholder="Search roles"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="!h-12 pl-11"
              />
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by team">
            <Chip selected={team === 'all'} onClick={() => setTeam('all')} count={jobs.length}>
              All teams
            </Chip>
            {teams.map((t) => (
              <Chip key={t} selected={team === t} onClick={() => setTeam(t)} count={jobs.filter((j) => j.team === t).length}>
                {t}
              </Chip>
            ))}
            <Chip selected={team === 'saved'} onClick={() => setTeam('saved')} count={saved.length}>
              Saved
            </Chip>
          </div>

          <p className="sr-only" aria-live="polite">
            {list.length} {list.length === 1 ? 'role' : 'roles'} shown
          </p>

          {list.length === 0 ? (
            <EmptyState
              className="mt-8"
              title={team === 'saved' && !query ? 'No saved roles yet' : 'No roles match'}
              body={team === 'saved' && !query ? 'Tap the bookmark on any role to keep it here. Saved roles stay on this device.' : 'Try a different search or team.'}
              action={
                <Button variant="secondary" onClick={reset} className="mt-2">
                  <X className="size-4" aria-hidden />
                  Clear filters
                </Button>
              }
            />
          ) : (
            <ul className="mt-8 flex flex-col gap-3">
              {list.map((j) => (
                <li key={j.slug}>
                  <Card className="group flex items-center gap-4 p-5 transition-colors hover:bg-surface-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-plasma-text sm:p-6">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[18px] font-medium tracking-[-0.01em]">
                          <Link href={`/careers/${j.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
                            {j.title}
                          </Link>
                        </h3>
                        {applied.includes(j.slug) ? <Badge tone="success">Applied</Badge> : null}
                      </div>
                      <p className="mt-1 text-[15px] text-muted">{j.summary}</p>
                      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[14px] text-faint">
                        <span>{j.team}</span>
                        <span>{j.location}</span>
                        <span>{j.type}</span>
                      </p>
                    </div>
                    <SaveToggle saved={saved.includes(j.slug)} onToggle={() => toggle(j.slug)} label={j.title} />
                    <ArrowUpRight className="hidden size-5 shrink-0 text-faint transition-colors group-hover:text-white sm:block" aria-hidden />
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  )
}
