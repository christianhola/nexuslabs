/*
  Form rules shared by the page and the Worker, so the browser shows the same
  errors the server would return. Each validator returns the cleaned value or
  a map of field errors.
*/
import { PROBLEM_IDS } from '../data'

export type Errors = Record<string, string>
export type Result<T> = { ok: true; value: T } | { ok: false; errors: Errors }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|icloud|proton)\./i

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
const done = <T>(errors: Errors, value: T): Result<T> => (Object.keys(errors).length ? { ok: false, errors } : { ok: true, value })

export const isEmail = (v: string) => EMAIL.test(v)

export function validateCandidate(input: Record<string, unknown>) {
  const name = str(input.name)
  const email = str(input.email).toLowerCase()
  const errors: Errors = {}
  if (name.length < 2) errors.name = 'Enter your name.'
  else if (name.length > 80) errors.name = 'Keep it under 80 characters.'
  if (!isEmail(email)) errors.email = 'Enter a valid email address.'
  if (input.consent !== true) errors.consent = 'Agree to the assessment terms to start.'
  return done(errors, { name, email })
}

export type AttemptInput = {
  candidate: { name: string; email: string }
  problemId: string
  code: string
  passed: string[]
  total: number
  durationSec: number
  aiPrompts: number
  pastes: number
  tabSwitches: number
}

export function validateAttempt(input: Record<string, unknown>): Result<AttemptInput> {
  const errors: Errors = {}
  const c = (input.candidate ?? {}) as Record<string, unknown>
  const cand = validateCandidate({ ...c, consent: true })
  if (!cand.ok) Object.assign(errors, cand.errors)
  const problemId = str(input.problemId)
  if (!PROBLEM_IDS.includes(problemId)) errors.problemId = 'Unknown challenge.'
  const code = typeof input.code === 'string' ? input.code : ''
  if (!code.trim()) errors.code = 'Write some code before you submit.'
  else if (code.length > 20000) errors.code = 'Code must be under 20,000 characters.'
  const passed = Array.isArray(input.passed) ? input.passed.filter((x): x is string => typeof x === 'string').slice(0, 50) : null
  if (!passed) errors.passed = 'Missing test results.'
  const num = (k: string, max: number) => {
    const n = input[k]
    if (typeof n !== 'number' || !Number.isFinite(n) || n < 0 || n > max) {
      errors[k] = `Invalid ${k}.`
      return 0
    }
    return Math.round(n)
  }
  const total = num('total', 50)
  const durationSec = num('durationSec', 6 * 3600)
  const aiPrompts = num('aiPrompts', 500)
  const pastes = num('pastes', 5000)
  const tabSwitches = num('tabSwitches', 5000)
  if (total === 0) errors.total = 'Invalid total.'
  return done(errors, { candidate: cand.ok ? cand.value : { name: '', email: '' }, problemId, code, passed: passed ?? [], total, durationSec, aiPrompts, pastes, tabSwitches })
}

/** Scores an attempt from its test results. The same rule runs on both sides. */
export function scoreAttempt(passed: number, total: number, aiPrompts: number, pastes: number) {
  const correctness = Math.round((passed / Math.max(total, 1)) * 100)
  const penalty = Math.min(10, pastes * 2) + Math.max(0, aiPrompts - 4) * 2
  return Math.max(0, Math.min(100, correctness - penalty))
}

export function validateDemoRequest(input: Record<string, unknown>) {
  const name = str(input.name)
  const email = str(input.email).toLowerCase()
  const company = str(input.company)
  const size = str(input.size)
  const message = str(input.message)
  const errors: Errors = {}
  if (name.length < 2) errors.name = 'Enter your name.'
  if (!isEmail(email)) errors.email = 'Enter a valid email address.'
  else if (FREE_MAIL.test(email)) errors.email = 'Use your work email so we can find your team.'
  if (company.length < 2) errors.company = 'Enter your company.'
  if (!size) errors.size = 'Choose your team size.'
  if (message.length > 1000) errors.message = 'Keep it under 1,000 characters.'
  return done(errors, { name, email, company, size, message })
}

export function validateSignup(input: Record<string, unknown>) {
  const name = str(input.name)
  const email = str(input.email).toLowerCase()
  const company = str(input.company)
  const password = typeof input.password === 'string' ? input.password : ''
  const errors: Errors = {}
  if (name.length < 2) errors.name = 'Enter your name.'
  if (!isEmail(email)) errors.email = 'Enter a valid email address.'
  if (company.length < 2) errors.company = 'Enter your company or team name.'
  if (password.length < 10) errors.password = 'Use at least 10 characters.'
  else if (!/[0-9]/.test(password) || !/[a-z]/i.test(password)) errors.password = 'Mix letters and numbers.'
  if (input.terms !== true) errors.terms = 'Accept the terms to continue.'
  return done(errors, { name, email, company })
}

export function validateInvites(input: Record<string, unknown>) {
  const assessment = str(input.assessment)
  const raw = Array.isArray(input.emails) ? input.emails : []
  const emails = [...new Set(raw.map((e) => str(e).toLowerCase()).filter(Boolean))]
  const errors: Errors = {}
  if (assessment.length < 2) errors.assessment = 'Name the assessment first.'
  if (!emails.length) errors.emails = 'Add at least one email.'
  else if (emails.length > 25) errors.emails = 'Invite up to 25 candidates at a time.'
  else {
    const bad = emails.find((e) => !isEmail(e))
    if (bad) errors.emails = `${bad} is not a valid email.`
  }
  return done(errors, { assessment, emails })
}

export function validateSubscribe(input: Record<string, unknown>) {
  const email = str(input.email).toLowerCase()
  return done(isEmail(email) ? {} : { email: 'Enter a valid email address.' }, { email })
}
