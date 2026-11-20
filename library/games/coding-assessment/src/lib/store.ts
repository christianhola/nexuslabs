import { CANDIDATES, getProblem, QUESTIONS } from '../data'
import type { Candidate, CandidateStatus } from '../data'
import { readStore, useStored, writeStore } from './storage'

/*
  Everything the demo remembers, in localStorage under `codetrial:`:
  - attempts: challenges submitted from /demo, shown in /reports
  - review: status changes and notes a reviewer made on any report
  - assessments: assessments saved in the builder; draft holds the one being built
  - demo:*: the candidate and in-progress code for the live challenge
*/

export type Snapshot = { t: number; code: string }
export type AiTurn = { q: string; a: string }

export type Attempt = {
  id: string
  candidate: { name: string; email: string }
  problemId: string
  code: string
  passed: string[]
  total: number
  score: number
  durationSec: number
  submittedAt: string
  runs: number
  ai: AiTurn[]
  integrity: { pastes: number; pastedChars: number; tabSwitches: number }
  snapshots: Snapshot[]
}

export type Review = { status?: CandidateStatus; notes?: string }

export type Assessment = {
  id: string
  name: string
  role: string
  minutes: number
  aiAllowed: boolean
  questionIds: string[]
  invited: string[]
  createdAt: string
}

export type Draft = Omit<Assessment, 'id' | 'createdAt' | 'invited'>

export const EMPTY_DRAFT: Draft = { name: '', role: 'Senior backend engineer', minutes: 60, aiAllowed: true, questionIds: ['q-rate', 'q-pr'] }

export const useAttempts = () => useStored<Attempt[]>('attempts', [])
export const useReviews = () => useStored<Record<string, Review>>('review', {})
export const useAssessments = () => useStored<Assessment[]>('assessments', [])
export const useDraft = () => useStored<Draft>('draft', EMPTY_DRAFT)

export function saveAttempt(a: Attempt) {
  writeStore('attempts', [a, ...readStore<Attempt[]>('attempts', []).filter((x) => x.id !== a.id)])
}

export function resetDemo() {
  for (const k of ['attempts', 'review', 'assessments', 'draft', 'demo:candidate', 'demo:problem', 'demo:session', ...['merge-windows', 'rate-limiter', 'top-words'].map((p) => `demo:code:${p}`)]) writeStore(k, undefined)
}

/* A report row: the seed candidates and your own attempts, in one shape. */
export type Report = {
  id: string
  name: string
  email: string
  role: string
  problemId: string
  status: CandidateStatus
  score: number | null
  submittedAt: string | null
  durationMin: number | null
  skills: { name: string; score: number }[]
  passed: string[]
  aiSummary: string
  aiPrompts: number
  aiLog: AiTurn[]
  integrity: { pastes: number; pastedChars: number; tabSwitches: number }
  snapshots: Snapshot[]
  code: string
  notes: string
  mine: boolean
}

/** Builds a believable typing replay for a seed candidate from the problem's solution. */
function seedSnapshots(c: Candidate): Snapshot[] {
  const p = getProblem(c.problemId)
  if (!c.durationMin) return [{ t: 0, code: p.starter }]
  const lines = p.solution.split('\n')
  const head = p.starter.split('\n').findIndex((l) => l.includes('Your code here'))
  const frames: Snapshot[] = [{ t: 0, code: p.starter }]
  const steps = 14
  const body = lines.slice(head)
  for (let i = 1; i <= steps; i++) {
    const n = Math.ceil((body.length * i) / steps)
    frames.push({ t: Math.round(((c.durationMin * 60) / steps) * i), code: [...lines.slice(0, head), ...body.slice(0, n)].join('\n') + (n < body.length ? '\n' : '') })
  }
  return frames
}

function fromCandidate(c: Candidate, r: Review | undefined): Report {
  const snapshots = seedSnapshots(c)
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    role: c.role,
    problemId: c.problemId,
    status: r?.status ?? c.status,
    score: c.score,
    submittedAt: c.submittedAt,
    durationMin: c.durationMin,
    skills: c.skills,
    passed: c.passed,
    aiSummary: c.ai.summary,
    aiPrompts: c.ai.prompts,
    aiLog: [],
    integrity: c.integrity,
    snapshots,
    code: snapshots[snapshots.length - 1]!.code,
    notes: r?.notes ?? c.notes ?? '',
    mine: false,
  }
}

function fromAttempt(a: Attempt, r: Review | undefined): Report {
  const total = Math.max(a.total, 1)
  const correctness = Math.round((a.passed.length / total) * 100)
  const p = getProblem(a.problemId)
  const hiddenTotal = p.tests.filter((t) => t.hidden).length
  const hiddenPassed = p.tests.filter((t) => t.hidden && a.passed.includes(t.id)).length
  const efficiency = Math.round(hiddenTotal ? (hiddenPassed / hiddenTotal) * 100 : correctness)
  const quality = Math.max(40, Math.min(100, 100 - Math.max(0, a.code.split('\n').length - 30) - a.integrity.pastes * 5))
  const aiScore = a.ai.length === 0 ? 80 : Math.max(40, 96 - Math.max(0, a.ai.length - 3) * 8)
  return {
    id: a.id,
    name: a.candidate.name,
    email: a.candidate.email,
    role: 'Sample challenge',
    problemId: a.problemId,
    status: r?.status ?? 'Completed',
    score: a.score,
    submittedAt: a.submittedAt,
    durationMin: Math.max(1, Math.round(a.durationSec / 60)),
    skills: [
      { name: 'Correctness', score: correctness },
      { name: 'Efficiency', score: efficiency },
      { name: 'Code quality', score: quality },
      { name: 'Working with AI', score: aiScore },
    ],
    passed: a.passed,
    aiSummary: a.ai.length ? `Asked the assistant ${a.ai.length === 1 ? 'once' : `${a.ai.length} times`} across ${a.runs} test ${a.runs === 1 ? 'run' : 'runs'}.` : 'Did not open the assistant.',
    aiPrompts: a.ai.length,
    aiLog: a.ai,
    integrity: a.integrity,
    snapshots: a.snapshots.length ? a.snapshots : [{ t: 0, code: a.code }],
    code: a.code,
    notes: r?.notes ?? '',
    mine: true,
  }
}

export function useReports(): Report[] {
  const [attempts] = useAttempts()
  const [reviews] = useReviews()
  return [...attempts.map((a) => fromAttempt(a, reviews[a.id])), ...CANDIDATES.map((c) => fromCandidate(c, reviews[c.id]))]
}

export function setReview(id: string, patch: Review) {
  const all = readStore<Record<string, Review>>('review', {})
  writeStore('review', { ...all, [id]: { ...all[id], ...patch } })
}

export const questionById = (id: string) => QUESTIONS.find((q) => q.id === id)
