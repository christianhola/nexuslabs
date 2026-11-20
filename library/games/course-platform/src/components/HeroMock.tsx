import { motion } from 'motion/react'
import { Award, ChevronRight, CircleCheck, Clock, FileCode2, Layers, Medal, Trophy } from 'lucide-react'
import { useMemo, useState } from 'react'

import { heroActivity, heroCourses, heroQuiz, people } from '../content'
import { postJson } from '../lib/api'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { normaliseQuizCode, validateQuizCode } from '../lib/validate'
import { AvatarStack } from './Avatar'
import { Badge } from './Badge'
import { CourseIcon } from './CourseIcon'
import { CursorTag } from './CursorTag'
import { ariaSort, SortHeader } from './SortHeader'
import type { SortDir } from './SortHeader'

/*
  The hero's live product composite, laid out on a 540x400 canvas (wrap it
  in <ScaledFrame>): a sortable course table with collaborator cursors, a
  quiz-code card that joins a demo quiz through /api/quiz/join, and a live
  activity card.
*/
export const HERO_MOCK = { width: 540, height: 400 }

type Key = 'name' | 'lessons' | 'level' | 'category'
const rise = (delay: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const } })

export function HeroMock() {
  return (
    <div className="relative" style={HERO_MOCK}>
      <motion.div {...rise(0.15)} className="absolute left-[62px] top-0 w-[400px]">
        <CourseTable />
      </motion.div>
      <motion.div {...rise(0.4)} className="absolute left-0 top-[214px] w-[174px]">
        <QuizCard />
      </motion.div>
      <motion.div {...rise(0.55)} className="absolute left-[222px] top-[270px] w-[318px]">
        <ActivityCard />
      </motion.div>
    </div>
  )
}

function CourseTable() {
  const [sort, setSort] = useState<{ key: Key; dir: SortDir } | null>(null)
  const [picked, setPicked] = useState<string>('python')
  const rows = useMemo(() => {
    if (!sort) return heroCourses
    const val = (r: (typeof heroCourses)[number]) => (sort.key === 'lessons' ? r.done / r.total : sort.key === 'name' ? r.name : sort.key === 'level' ? r.level : r.category)
    return [...heroCourses].sort((a, b) => {
      const x = val(a)
      const y = val(b)
      const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))
      return sort.dir === 'asc' ? c : -c
    })
  }, [sort])
  const toggle = (key: Key) => setSort((s) => (s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  const cols: { key: Key; label: string; w: string }[] = [
    { key: 'name', label: 'Course Name', w: 'w-[152px]' },
    { key: 'lessons', label: 'Lessons', w: 'w-[70px]' },
    { key: 'level', label: 'Level', w: 'w-[78px]' },
    { key: 'category', label: 'Category', w: '' },
  ]
  return (
    <div className="relative rounded-[16px] border border-line bg-card pb-1.5 pt-4 shadow-float">
      <div className="flex items-center justify-between px-4">
        <h3 className="font-display text-[16px] font-medium text-ink">Courses</h3>
        <Link href="/builder" className="rounded-[6px] px-1 text-[12px] text-muted hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
          View All
        </Link>
      </div>
      <CursorTag name="Editor" tone="violet" flip className="-left-[52px] top-[38px]" />
      <table className="mt-2 w-full table-fixed text-left text-[12px]">
        <caption className="sr-only">Courses in this school. Use the column headers to sort.</caption>
        <thead>
          <tr>
            {cols.map((c, i) => (
              <th key={c.key} scope="col" aria-sort={ariaSort(sort?.key === c.key, sort?.dir ?? 'asc')} className={cx(c.w, i === 0 ? 'pl-4' : '', 'pb-1')}>
                <SortHeader label={c.label} active={sort?.key === c.key} dir={sort?.dir ?? 'asc'} onSort={() => toggle(c.key)} className="!h-8 text-[11.5px]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const on = picked === r.id
            return (
              <tr
                key={r.id}
                onClick={() => setPicked(r.id)}
                className={cx('relative h-[51px] cursor-pointer transition-shadow duration-300', on && 'shadow-[0_6px_22px_-8px_rgb(18_18_20/0.22)] [&>td]:bg-card')}
              >
                <td className="pl-4">
                  <button type="button" onClick={() => setPicked(r.id)} className="flex w-full items-center gap-2 rounded-[6px] text-left text-ink focus-visible:outline-2 focus-visible:outline-flame-strong" aria-pressed={on}>
                    <CourseIcon name={r.icon} />
                    <span className="truncate pr-3">{r.name}</span>
                  </button>
                </td>
                <td className="tabular-nums text-ink">
                  {r.done}
                  <span className="text-faint">/{r.total}</span>
                </td>
                <td>
                  <Badge tone={r.level === 'Expert' ? 'solid' : 'indigo'} size="xs" className="rounded-[6px] px-2">
                    {r.level}
                  </Badge>
                </td>
                <td className="text-ink">{r.category}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <CursorTag name="Maya Chen" tone="azure" className="-right-[44px] top-[172px]" />
    </div>
  )
}

function QuizCard() {
  const [code, setCode] = useState('')
  const [state, setState] = useState<{ s: 'idle' | 'loading' | 'error' | 'joined'; msg?: string; title?: string; learners?: number }>({ s: 'idle' })
  const join = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateQuizCode(code)
    if (err) return setState({ s: 'error', msg: err })
    setState({ s: 'loading' })
    const res = await postJson<{ title: string; learners: number }>('/api/quiz/join', { code: normaliseQuizCode(code) })
    if (res.ok) setState({ s: 'joined', title: res.data.title, learners: res.data.learners })
    else setState({ s: 'error', msg: res.error })
  }
  return (
    <div className="rounded-[14px] border border-line bg-card p-3 shadow-float">
      <p className="text-[11px] text-ink">{heroQuiz.title}</p>
      {state.s === 'joined' ? (
        <div className="mt-3 flex flex-col items-center gap-2 pb-1 text-center" role="status">
          <CircleCheck className="size-7 text-flame" aria-hidden />
          <p className="font-display text-[12.5px] font-medium text-ink">You joined “{state.title}”</p>
          <p className="text-[11px] text-muted">{state.learners} learners are in the lobby</p>
          <button type="button" onClick={() => { setState({ s: 'idle' }); setCode('') }} className="mt-1 h-7 rounded-[7px] px-2 text-[11px] font-medium text-flame-ink hover:bg-flame-soft focus-visible:outline-2 focus-visible:outline-flame-strong">
            Leave quiz
          </button>
        </div>
      ) : (
        <form onSubmit={join} noValidate className="mt-2.5">
          <p className="text-center font-display text-[12px] font-medium text-ink">{heroQuiz.heading}</p>
          <p className="mt-1 text-center text-[10.5px] leading-snug text-muted">{heroQuiz.body}</p>
          <label htmlFor="hero-quiz" className="sr-only">
            Quiz code
          </label>
          <input
            id="hero-quiz"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase().slice(0, 7))
              if (state.s === 'error') setState({ s: 'idle' })
            }}
            placeholder="7Q4K2M"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={state.s === 'error' || undefined}
            aria-describedby="hero-quiz-help"
            className="mt-2.5 h-8 w-full rounded-[7px] border border-line-strong px-2 font-mono text-[12px] tracking-[0.12em] text-ink placeholder:text-[#8b8b95] focus:border-flame-strong focus:outline-none focus:ring-2 focus:ring-flame/25 aria-invalid:border-bad"
          />
          <p id="hero-quiz-help" className={cx('mt-1.5 text-center text-[9.5px] leading-tight', state.s === 'error' ? 'text-bad' : 'text-faint')} aria-live="polite">
            {state.s === 'error' ? state.msg : heroQuiz.hint}
          </p>
          <button type="submit" disabled={state.s === 'loading'} className="mt-2.5 h-8 w-full rounded-[7px] bg-flame-strong font-display text-[11.5px] font-medium text-white shadow-glow transition-colors hover:bg-flame-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-strong disabled:opacity-70">
            {state.s === 'loading' ? 'Joining…' : heroQuiz.cta}
          </button>
        </form>
      )}
    </div>
  )
}

function ActivityCard() {
  const medalIcons = [Medal, Trophy, Award]
  return (
    <div className="flex gap-3 rounded-[14px] border border-line bg-card p-3 shadow-float">
      <div className="w-[126px] shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="round size-1.5 animate-ping-soft rounded-full bg-flame" aria-hidden />
          <AvatarStack people={people.slice(0, 3)} size={16} label="Active learners" />
          <span className="text-[9.5px] leading-tight text-muted">{heroActivity.active}</span>
        </div>
        <p className="mt-3 font-display text-[22px] font-medium leading-none text-ink">
          {heroActivity.score.got}
          <span className="text-[13px] text-faint"> / {heroActivity.score.of}</span>
          <span className="ml-1.5 align-middle text-[9.5px] font-normal text-muted">{heroActivity.score.label}</span>
        </p>
        <ul className="mt-3 flex justify-between gap-1">
          {heroActivity.medals.map((m, i) => {
            const Icon = medalIcons[i]!
            return (
              <li key={m} className="flex flex-col items-center gap-1">
                <span className={cx('round grid size-5 place-items-center rounded-full', i === 0 ? 'bg-flame-soft text-flame-ink' : i === 1 ? 'bg-azure-soft text-indigo-ink' : 'bg-warn-soft text-warn')}>
                  <Icon className="size-3" aria-hidden />
                </span>
                <span className="whitespace-nowrap text-[8.5px] text-muted">{m}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <ul className="flex min-w-0 flex-1 flex-col gap-2">
        {heroActivity.lessons.map((l, i) => (
          <li key={l.title}>
            <Link href="/builder" className="flex items-center gap-2 rounded-[10px] border border-line bg-card p-2 shadow-[0_4px_14px_-8px_rgb(18_18_20/0.18)] transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-flame-strong">
              <span className={cx('grid size-6 shrink-0 place-items-center rounded-[6px]', i === 0 ? 'bg-flame-soft text-flame-ink' : 'bg-wash-2 text-ink')}>
                {i === 0 ? <Layers className="size-3.5" aria-hidden /> : <FileCode2 className="size-3.5" aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-medium text-ink">{l.title}</span>
                <span className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-[9.5px] text-muted">
                  {l.meta[0]}
                  <Clock className="size-2.5" aria-hidden />
                  {l.meta[1]}
                </span>
              </span>
              <ChevronRight className={cx('size-3.5', i === 0 ? 'text-flame-ink' : 'text-faint')} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
