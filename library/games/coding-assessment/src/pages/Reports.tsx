import { useMemo, useState } from 'react'
import { ArrowDownUp, Search, Users } from 'lucide-react'

import { Badge, statusTone } from '../components/Badge'
import { ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { MiniSelect } from '../components/Field'
import { Avatar, EmptyState } from '../components/Misc'
import { ScorePill } from '../components/Score'
import { Tabs } from '../components/Tabs'
import { getProblem } from '../data'
import type { CandidateStatus } from '../data'
import { formatDate } from '../lib/format'
import { Link } from '../lib/router'
import { useReports } from '../lib/store'
import { useStored } from '../lib/storage'

type Filter = 'all' | 'review' | 'Advanced' | 'Rejected' | 'pending'
type Sort = 'recent' | 'score' | 'name'

const matches = (f: Filter, s: CandidateStatus) =>
  f === 'all' || (f === 'review' && s === 'Completed') || (f === 'pending' && (s === 'Invited' || s === 'In progress')) || f === s

/** Candidates: every report, filterable by stage, searchable and sortable. Filters persist. */
export function Reports() {
  const reports = useReports()
  const [filter, setFilter] = useStored<Filter>('ui:reports-filter', 'all')
  const [sort, setSort] = useStored<Sort>('ui:reports-sort', 'recent')
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const list = reports.filter((r) => matches(filter, r.status) && (!s || `${r.name} ${r.email} ${r.role}`.toLowerCase().includes(s)))
    return list.sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'score' ? (b.score ?? -1) - (a.score ?? -1) : (b.submittedAt ?? '').localeCompare(a.submittedAt ?? '')))
  }, [reports, filter, sort, q])
  const count = (f: Filter) => reports.filter((r) => matches(f, r.status)).length
  const reviewed = reports.filter((r) => r.score !== null)
  const avg = reviewed.length ? Math.round(reviewed.reduce((n, r) => n + (r.score ?? 0), 0) / reviewed.length) : 0

  return (
    <Container wide className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-normal tracking-[-0.025em]">Candidates</h1>
          <p className="mt-1 text-[15px] text-muted">
            {reports.length} candidates across 3 assessments, average score {avg}
          </p>
        </div>
        <ButtonLink href="/demo">Take the challenge yourself</ButtonLink>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Tabs
          idBase="cand"
          panel={false}
          label="Stage"
          value={filter}
          onChange={setFilter}
          items={[
            { id: 'all', label: 'All', count: count('all') },
            { id: 'review', label: 'To review', count: count('review') },
            { id: 'Advanced', label: 'Advanced', count: count('Advanced') },
            { id: 'Rejected', label: 'Rejected', count: count('Rejected') },
            { id: 'pending', label: 'Not finished', count: count('pending') },
          ]}
        />
        <div className="ml-auto flex w-full gap-2 sm:w-auto">
          <label className="relative min-w-0 flex-1 sm:w-64">
            <span className="sr-only">Search candidates</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, role" className="h-10 w-full rounded-[10px] bg-surface-2 pr-3 pl-9 text-[14px] ring-1 ring-inset ring-line-strong placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/80" />
          </label>
          <MiniSelect label="Sort by" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="recent">Most recent</option>
            <option value="score">Highest score</option>
            <option value="name">Name</option>
          </MiniSelect>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState className="mt-6" icon={<Users className="size-5" />} title="No candidates match" body={q ? `Nothing matches “${q}” in this stage.` : 'No one is in this stage yet.'} action={<ButtonLink href="/demo" variant="secondary">Take the sample challenge</ButtonLink>} />
      ) : (
        <Card className="mt-6 overflow-hidden">
          <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Candidates table">
            <table className="w-full min-w-[820px] text-left text-[14.5px]">
              <caption className="sr-only">Candidates, sorted by {sort}</caption>
              <thead className="border-b text-[13px] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-normal">Candidate</th>
                  <th scope="col" className="px-3 py-3 font-normal">Challenge</th>
                  <th scope="col" className="px-3 py-3 font-normal">Stage</th>
                  <th scope="col" className="px-3 py-3 font-normal">
                    <span className="inline-flex items-center gap-1">Score {sort === 'score' && <ArrowDownUp aria-hidden className="size-3" />}</span>
                  </th>
                  <th scope="col" className="px-3 py-3 font-normal">Tests</th>
                  <th scope="col" className="px-5 py-3 font-normal">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const p = getProblem(r.problemId)
                  return (
                    <tr key={r.id} className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/3">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={r.name} size={34} />
                          <div className="min-w-0">
                            <Link href={`/reports/${r.id}`} className="inline-flex min-h-10 items-center rounded font-medium text-fg hover:text-brand-text sm:min-h-0">
                              {r.name}
                            </Link>
                            {r.mine && <Badge tone="info" className="ml-2 h-5 text-[11.5px]">You</Badge>}
                            <p className="truncate text-[13px] text-muted">{r.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted">{p.title}</td>
                      <td className="px-3 py-3">
                        <Badge tone={statusTone[r.status]} dot>
                          {r.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-3">
                        <ScorePill score={r.score} />
                      </td>
                      <td className="px-3 py-3 text-muted tabular-nums">{r.score === null ? '–' : `${r.passed.length} of ${p.tests.length}`}</td>
                      <td className="px-5 py-3 text-muted">{r.submittedAt ? formatDate(r.submittedAt) : 'Not yet'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Container>
  )
}
