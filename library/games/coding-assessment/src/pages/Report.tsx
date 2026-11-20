import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, Ban, CircleCheck, CircleX, Clipboard, Clock, Eye, FlaskConical, Hourglass, Lock, Pause, Play, Sparkles, ThumbsUp } from 'lucide-react'

import { Badge, statusTone } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { CodeEditor } from '../components/CodeEditor'
import { Container } from '../components/Container'
import { MiniSelect, Textarea } from '../components/Field'
import { Avatar, EmptyState } from '../components/Misc'
import { Meter, ScoreRing } from '../components/Score'
import { useToast } from '../components/Toast'
import { getProblem } from '../data'
import { cx } from '../lib/cx'
import { formatClock, formatDateTime, plural } from '../lib/format'
import { Link } from '../lib/router'
import { setReview, useReports } from '../lib/store'
import type { Report as ReportRow } from '../lib/store'
import { useReducedMotion } from '../lib/useReducedMotion'
import { NotFound } from './NotFound'

/** One candidate's report: score, skills, tests, code playback, AI usage, integrity and the team's decision. */
export function Report({ id }: { id: string }) {
  const report = useReports().find((r) => r.id === id)
  const toast = useToast()
  if (!report) return <NotFound />
  const p = getProblem(report.problemId)
  const done = report.score !== null

  const decide = (status: 'Advanced' | 'Rejected' | 'Completed') => {
    setReview(report.id, { status })
    toast(status === 'Completed' ? 'Decision cleared.' : `${report.name.split(' ')[0]} marked ${status.toLowerCase()}.`)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast('Report link copied.')
    } catch {
      toast('Copy is blocked here. The link is in the address bar.')
    }
  }

  return (
    <Container wide className="py-8">
      <Link href="/reports" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg text-[14px] text-muted hover:text-fg">
        <ArrowLeft aria-hidden className="size-4" /> All candidates
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <Avatar name={report.name} size={56} />
        <div className="min-w-0 flex-1">
          <h1 className="flex flex-wrap items-center gap-3 text-[30px] leading-tight font-normal tracking-[-0.025em]">
            {report.name}
            <Badge tone={statusTone[report.status]} dot>
              {report.status}
            </Badge>
          </h1>
          <p className="mt-1 text-[14.5px] text-muted">
            {report.role}, {p.title}
            {report.submittedAt && `, submitted ${formatDateTime(report.submittedAt)}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" icon={<Clipboard className="size-4" />} onClick={copy}>
            Copy link
          </Button>
          {done && report.status !== 'Rejected' && (
            <Button variant="secondary" icon={<Ban className="size-4" />} onClick={() => decide('Rejected')}>
              Reject
            </Button>
          )}
          {done && report.status !== 'Advanced' && (
            <Button icon={<ThumbsUp className="size-4" />} onClick={() => decide('Advanced')}>
              Advance
            </Button>
          )}
          {done && (report.status === 'Advanced' || report.status === 'Rejected') && (
            <Button variant="ghost" onClick={() => decide('Completed')}>
              Undo decision
            </Button>
          )}
        </div>
      </div>

      {!done ? (
        <EmptyState
          className="mt-8"
          icon={<Hourglass className="size-5" />}
          title={report.status === 'Invited' ? 'Invitation sent, not started' : 'Assessment in progress'}
          body={`${report.name.split(' ')[0]} has ${p.minutes} minutes for ${p.title}. The report fills in once they submit.`}
          action={<Button variant="secondary" onClick={() => toast(`Reminder sent to ${report.email}.`)}>Send a reminder</Button>}
        />
      ) : (
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="grid content-start gap-5">
            <Card className="p-6">
              <div className="flex items-center gap-6">
                <ScoreRing score={report.score} size={128} />
                <dl className="grid gap-3 text-[14px]">
                  <Fact icon={<Clock className="size-4" />} label="Time used" value={`${report.durationMin} of ${p.minutes} min`} />
                  <Fact icon={<FlaskConical className="size-4" />} label="Tests" value={`${report.passed.length} of ${p.tests.length} passed`} />
                  <Fact icon={<Sparkles className="size-4" />} label="Assistant" value={plural(report.aiPrompts, 'prompt')} />
                </dl>
              </div>
              <div className="mt-6 grid gap-4">
                {report.skills.map((s) => (
                  <Meter key={s.name} label={s.name} value={s.score} />
                ))}
              </div>
            </Card>
            <Card className="p-6">
              <CardHeader title="Tests" sub="Hidden tests were not shown to the candidate" />
              <ul className="mt-4 grid gap-2">
                {p.tests.map((t) => {
                  const ok = report.passed.includes(t.id)
                  return (
                    <li key={t.id} className="flex items-center gap-2.5 text-[14px]">
                      {ok ? <CircleCheck aria-hidden className="size-4 text-brand-text" /> : <CircleX aria-hidden className="size-4 text-danger" />}
                      <span className="sr-only">{ok ? 'Passed' : 'Failed'}</span>
                      <span className="flex-1">{t.label}</span>
                      {t.hidden && (
                        <span className="inline-flex items-center gap-1 text-[12.5px] text-faint">
                          <Lock aria-hidden className="size-3" /> Hidden
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Card>
            <Integrity report={report} />
          </div>

          <div className="grid min-w-0 content-start gap-5">
            <Playback report={report} />
            <Card className="p-6">
              <CardHeader title="Working with AI" sub={report.aiSummary} />
              {report.aiLog.length > 0 ? (
                <ol className="mt-4 grid gap-3">
                  {report.aiLog.map((t, i) => (
                    <li key={i} className="rounded-[14px] bg-surface-2 p-4 ring-1 ring-inset ring-line">
                      <p className="text-[14.5px] text-fg">
                        <span className="mr-2 text-faint">Asked</span>
                        {t.q}
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-muted">
                        <span className="mr-2 text-brand-text">Reply</span>
                        {t.a}
                      </p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-[14px] text-faint">{report.mine ? 'No prompts in this attempt.' : 'Full prompt log is available on the Team plan.'}</p>
              )}
            </Card>
            <Notes report={report} />
          </div>
        </div>
      )}
    </Container>
  )
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span aria-hidden className="text-faint">{icon}</span>
      <dt className="sr-only">{label}</dt>
      <dd className="text-fg">{value}</dd>
    </div>
  )
}

function Integrity({ report }: { report: ReportRow }) {
  const { pastes, pastedChars, tabSwitches } = report.integrity
  const flagged = pastedChars > 200 || tabSwitches > 3
  return (
    <Card className="p-6">
      <CardHeader title="Integrity signals" sub="Signals to discuss, never an automatic verdict" action={flagged ? <Badge tone="amber">Review</Badge> : <Badge tone="brand">Clear</Badge>} />
      <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Pastes', value: pastes },
          { label: 'Pasted chars', value: pastedChars },
          { label: 'Tab switches', value: tabSwitches },
        ].map((s) => (
          <div key={s.label} className="rounded-[12px] bg-surface-2 px-2 py-3 ring-1 ring-inset ring-line">
            <dd className="text-[22px] tabular-nums">{s.value}</dd>
            <dt className="text-[12.5px] text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </Card>
  )
}

/** Steps through the code snapshots, like a video. */
function Playback({ report }: { report: ReportRow }) {
  const reduce = useReducedMotion()
  const frames = report.snapshots
  const [i, setI] = useState(frames.length - 1)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  useEffect(() => {
    if (!playing) return
    if (i >= frames.length - 1) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setI((x) => x + 1), reduce ? 0 : 700 / speed)
    return () => window.clearTimeout(id)
  }, [playing, i, frames.length, speed, reduce])
  const frame = frames[Math.min(i, frames.length - 1)]!
  const total = frames[frames.length - 1]!.t
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <h2 className="text-[17px] font-medium">Code playback</h2>
        <span className="text-[13.5px] text-muted">{plural(frames.length, 'snapshot')}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[13.5px] text-muted">
          <Eye aria-hidden className="size-4" /> Read only
        </span>
      </div>
      <CodeEditor label={`${report.name}'s code at ${formatClock(frame.t)}`} value={frame.code} readOnly className="h-[380px] border-y border-white/7" minLines={16} />
      <div className="flex flex-wrap items-center gap-3 px-5 py-4">
        <Button
          variant="secondary"
          size="sm"
          icon={playing ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          onClick={() => {
            if (!playing && i >= frames.length - 1) setI(0)
            setPlaying((p) => !p)
          }}
          disabled={frames.length < 2}
        >
          {playing ? 'Pause' : 'Play'}
        </Button>
        <label className="flex min-w-[180px] flex-1 items-center gap-3">
          <span className="sr-only">Playback position</span>
          <input
            type="range"
            min={0}
            max={frames.length - 1}
            value={i}
            onChange={(e) => {
              setPlaying(false)
              setI(Number(e.target.value))
            }}
            aria-valuetext={`${formatClock(frame.t)} of ${formatClock(total)}`}
            className={cx('h-10 w-full cursor-pointer accent-[#1fdc8a]')}
          />
        </label>
        <span className="font-mono text-[13px] text-muted tabular-nums">
          {formatClock(frame.t)} / {formatClock(total)}
        </span>
        <MiniSelect label="Playback speed" value={String(speed)} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value="1">1×</option>
          <option value="2">2×</option>
          <option value="4">4×</option>
        </MiniSelect>
      </div>
    </Card>
  )
}

function Notes({ report }: { report: ReportRow }) {
  const toast = useToast()
  const [text, setText] = useState(report.notes)
  const [error, setError] = useState('')
  useEffect(() => setText(report.notes), [report.id, report.notes])
  const dirty = text !== report.notes
  return (
    <Card className="p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (text.length > 2000) return setError('Keep notes under 2,000 characters.')
          setError('')
          setReview(report.id, { notes: text.trim() })
          toast('Note saved.')
        }}
        className="grid gap-3"
      >
        <Textarea label="Reviewer notes" value={text} onChange={(e) => setText(e.target.value)} placeholder="What would you ask in the next round?" error={error} hint="Visible to everyone on the hiring team. Saved in this browser." />
        <div className="flex justify-end">
          <Button type="submit" variant="secondary" disabled={!dirty}>
            Save note
          </Button>
        </div>
      </form>
    </Card>
  )
}

