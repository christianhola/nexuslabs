import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ArrowRight, Check, Clock, Code2, Plus, Search, SearchX, Users } from 'lucide-react'

import { Badge, difficultyTone } from '../components/Badge'
import { Button, ButtonLink } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Drawer } from '../components/Drawer'
import { MiniSelect } from '../components/Field'
import { EmptyState } from '../components/Misc'
import { useToast } from '../components/Toast'
import { DIFFICULTIES, getProblem, QUESTION_TYPES, QUESTIONS } from '../data'
import type { Question } from '../data'
import { useStored } from '../lib/storage'
import { useDraft } from '../lib/store'

type Filters = { type: string; difficulty: string; skill: string }
const SKILLS = [...new Set(QUESTIONS.map((q) => q.skill))].sort()

/** The question library: search and filter, preview a question, add it to the assessment you are building. */
export function Library() {
  const [filters, setFilters] = useStored<Filters>('ui:library-filters', { type: '', difficulty: '', skill: '' })
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<Question | null>(null)
  const [draft, setDraft] = useDraft()
  const toast = useToast()

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return QUESTIONS.filter((x) => (!filters.type || x.type === filters.type) && (!filters.difficulty || x.difficulty === filters.difficulty) && (!filters.skill || x.skill === filters.skill) && (!s || `${x.title} ${x.summary} ${x.skill} ${x.languages.join(' ')}`.toLowerCase().includes(s)))
  }, [filters, q])

  const inDraft = (id: string) => draft.questionIds.includes(id)
  const toggle = (x: Question) => {
    const on = inDraft(x.id)
    setDraft((d) => ({ ...d, questionIds: on ? d.questionIds.filter((i) => i !== x.id) : [...d.questionIds, x.id] }))
    toast(on ? `Removed ${x.title}.` : `Added ${x.title} to your draft.`)
  }
  const set = (k: keyof Filters) => (e: ChangeEvent<HTMLSelectElement>) => setFilters({ ...filters, [k]: e.target.value })
  const clear = () => {
    setFilters({ type: '', difficulty: '', skill: '' })
    setQ('')
  }
  const active = filters.type || filters.difficulty || filters.skill || q

  return (
    <Container wide className="py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] leading-tight font-normal tracking-[-0.025em]">Question library</h1>
          <p className="mt-1 text-[15px] text-muted">Vetted questions, calibrated on real attempts. Showing {list.length} of {QUESTIONS.length}.</p>
        </div>
        <ButtonLink href="/assessments" variant="secondary" iconRight={<ArrowRight className="size-4" />}>
          Draft assessment ({draft.questionIds.length})
        </ButtonLink>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <label className="relative min-w-0 flex-1 basis-full sm:basis-64">
          <span className="sr-only">Search questions</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, skill or language" className="h-10 w-full rounded-[10px] bg-surface-2 pr-3 pl-9 text-[14px] ring-1 ring-inset ring-line-strong placeholder:text-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/80" />
        </label>
        <MiniSelect label="Question type" value={filters.type} onChange={set('type')} className="flex-1 sm:flex-none">
          <option value="">All types</option>
          {QUESTION_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </MiniSelect>
        <MiniSelect label="Difficulty" value={filters.difficulty} onChange={set('difficulty')} className="flex-1 sm:flex-none">
          <option value="">Any difficulty</option>
          {DIFFICULTIES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </MiniSelect>
        <MiniSelect label="Skill" value={filters.skill} onChange={set('skill')} className="flex-1 sm:flex-none">
          <option value="">All skills</option>
          {SKILLS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </MiniSelect>
        {active && (
          <Button variant="ghost" onClick={clear}>
            Clear filters
          </Button>
        )}
      </div>

      {list.length === 0 ? (
        <EmptyState className="mt-6" icon={<SearchX className="size-5" />} title="No questions match" body="Try a broader skill or clear the filters." action={<Button variant="secondary" onClick={clear}>Clear filters</Button>} />
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((x) => (
            <Card as="li" key={x.id} className="flex flex-col p-5 transition-colors hover:bg-surface-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={difficultyTone[x.difficulty]}>{x.difficulty}</Badge>
                <Badge>{x.type}</Badge>
                {x.problemId && <Badge tone="info">Playable</Badge>}
              </div>
              <h2 className="mt-4 text-[18px] leading-snug font-medium">
                <button type="button" onClick={() => setOpen(x)} className="min-h-10 rounded py-1 text-left hover:text-brand-text">
                  {x.title}
                </button>
              </h2>
              <p className="mt-1.5 flex-1 text-[14.5px] leading-relaxed text-muted">{x.summary}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                <span className="inline-flex items-center gap-1.5"><Clock aria-hidden className="size-3.5" /> {x.minutes} min</span>
                <span className="inline-flex items-center gap-1.5"><Users aria-hidden className="size-3.5" /> {x.usedBy.toLocaleString()} teams</span>
                <span className="inline-flex items-center gap-1.5"><Code2 aria-hidden className="size-3.5" /> {x.languages.slice(0, 2).join(', ')}{x.languages.length > 2 && ` +${x.languages.length - 2}`}</span>
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant={inDraft(x.id) ? 'secondary' : 'primary'} size="sm" icon={inDraft(x.id) ? <Check className="size-3.5" /> : <Plus className="size-3.5" />} onClick={() => toggle(x)} aria-pressed={inDraft(x.id)} aria-label={`${inDraft(x.id) ? 'Added' : 'Add'} ${x.title}`}>
                  {inDraft(x.id) ? 'Added' : 'Add'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpen(x)} aria-label={`Preview ${x.title}`}>
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </ul>
      )}

      <Drawer
        open={!!open}
        onClose={() => setOpen(null)}
        title={open?.title ?? ''}
        footer={
          open && (
            <div className="flex flex-wrap gap-2">
              <Button className="flex-1" variant={inDraft(open.id) ? 'secondary' : 'primary'} onClick={() => toggle(open)}>
                {inDraft(open.id) ? 'Remove from draft' : 'Add to draft'}
              </Button>
              {open.problemId && (
                <ButtonLink href={`/demo?problem=${open.problemId}`} variant="ghost">
                  Try it
                </ButtonLink>
              )}
            </div>
          )
        }
      >
        {open && <Preview q={open} />}
      </Drawer>
    </Container>
  )
}

function Preview({ q }: { q: Question }) {
  const p = q.problemId ? getProblem(q.problemId) : null
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-2">
        <Badge tone={difficultyTone[q.difficulty]}>{q.difficulty}</Badge>
        <Badge>{q.type}</Badge>
        <Badge>{q.skill}</Badge>
      </div>
      <p className="text-[15.5px] leading-relaxed text-muted">{p ? p.statement.join(' ') : q.summary}</p>
      <dl className="grid grid-cols-2 gap-3 text-[14px]">
        {[
          ['Time limit', `${q.minutes} minutes`],
          ['Used by', `${q.usedBy.toLocaleString()} teams`],
          ['Languages', q.languages.join(', ')],
          ['Scoring', p ? `${p.tests.length} tests, ${p.tests.filter((t) => t.hidden).length} hidden` : 'Rubric, 4 criteria'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-[12px] bg-surface-2 p-3 ring-1 ring-inset ring-line">
            <dt className="text-[12.5px] text-faint">{k}</dt>
            <dd className="mt-0.5 text-fg">{v}</dd>
          </div>
        ))}
      </dl>
      {p && (
        <pre className="scrollbar-thin overflow-x-auto rounded-[12px] bg-[#061012] p-4 font-mono text-[12.5px] leading-5 text-[#d9e6e2] ring-1 ring-inset ring-line">{p.starter}</pre>
      )}
    </div>
  )
}
