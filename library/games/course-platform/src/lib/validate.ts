// Validation shared by the forms and the Worker, so both give the same answer.

import { audienceSizes, contactTopics, creatorKinds, integrationCategories, storefrontCourses } from '../content'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const QUIZ_CODE_RE = /^[A-Z0-9]{6}$/

export type Errors<T> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | undefined {
  const v = email.trim()
  if (!v) return 'Enter your email address.'
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email, like you@company.com.'
  return undefined
}

function name(v: string | undefined, what = 'your full name') {
  const n = (v ?? '').trim()
  if (n.length < 2) return `Enter ${what}.`
  if (n.length > 80) return 'Keep it under 80 characters.'
  return undefined
}

export function normaliseQuizCode(code: string) {
  return code.replace(/[\s-]/g, '').toUpperCase()
}

export function validateQuizCode(code: string): string | undefined {
  const c = normaliseQuizCode(code)
  if (!c) return 'Enter the 6-character code.'
  if (!QUIZ_CODE_RE.test(c)) return 'Codes are 6 letters or numbers, like 7Q4K2M.'
  return undefined
}

export type ContactInput = { name: string; email: string; company: string; topic: string; audience: string; message: string }
export function validateContact(v: Partial<ContactInput>): Errors<ContactInput> {
  const e: Errors<ContactInput> = {}
  const n = name(v.name)
  if (n) e.name = n
  const em = validateEmail(v.email ?? '')
  if (em) e.email = em
  const company = (v.company ?? '').trim()
  if (company.length > 100) e.company = 'Keep it under 100 characters.'
  if (!contactTopics.some((t) => t.value === v.topic)) e.topic = 'Choose what you want to talk about.'
  if (!audienceSizes.includes((v.audience ?? '') as (typeof audienceSizes)[number])) e.audience = 'Choose your audience size.'
  const msg = (v.message ?? '').trim()
  if (msg.length < 20) e.message = `Write at least 20 characters (${msg.length} so far).`
  else if (msg.length > 2000) e.message = 'Keep your message under 2,000 characters.'
  return e
}

export type SignupInput = { name: string; email: string; school: string; kind: string; terms: boolean }
export function validateSignup(v: Partial<SignupInput>): Errors<SignupInput> {
  const e: Errors<SignupInput> = {}
  const n = name(v.name)
  if (n) e.name = n
  const em = validateEmail(v.email ?? '')
  if (em) e.email = em
  const s = (v.school ?? '').trim()
  if (s.length < 2) e.school = 'Name your school or brand.'
  else if (s.length > 60) e.school = 'Keep it under 60 characters.'
  if (!creatorKinds.some((k) => k.value === v.kind)) e.kind = 'Choose what describes you best.'
  if (v.terms !== true) e.terms = 'Accept the terms to continue.'
  return e
}

export type EnrollInput = { name: string; email: string; courseId: string; plan: string }
export function validateEnroll(v: Partial<EnrollInput>): Errors<EnrollInput> {
  const e: Errors<EnrollInput> = {}
  const n = name(v.name)
  if (n) e.name = n
  const em = validateEmail(v.email ?? '')
  if (em) e.email = em
  if (!storefrontCourses.some((c) => c.id === v.courseId)) e.courseId = 'That course is not for sale.'
  if (v.plan !== 'full' && v.plan !== 'plan') e.plan = 'Choose how to pay.'
  return e
}

export type IntegrationRequest = { tool: string; category: string; email: string; useCase: string }
export function validateIntegrationRequest(v: Partial<IntegrationRequest>): Errors<IntegrationRequest> {
  const e: Errors<IntegrationRequest> = {}
  const t = (v.tool ?? '').trim()
  if (t.length < 2) e.tool = 'Name the tool you want to connect.'
  else if (t.length > 60) e.tool = 'Keep it under 60 characters.'
  if (!integrationCategories.includes((v.category ?? '') as (typeof integrationCategories)[number])) e.category = 'Choose a category.'
  const em = validateEmail(v.email ?? '')
  if (em) e.email = em
  const u = (v.useCase ?? '').trim()
  if (u.length > 500) e.useCase = 'Keep it under 500 characters.'
  return e
}

export type PublishInput = { title: string; price: number; modules: { title: string; lessons: { title: string }[] }[] }
export function validatePublish(v: Partial<PublishInput>): string[] {
  const out: string[] = []
  const title = (v.title ?? '').trim()
  if (title.length < 3) out.push('Give the course a title of at least 3 characters.')
  if (title.length > 90) out.push('Keep the course title under 90 characters.')
  if (typeof v.price !== 'number' || !Number.isFinite(v.price) || v.price < 0 || v.price > 10000) out.push('Set a price between $0 and $10,000.')
  const mods = Array.isArray(v.modules) ? v.modules : []
  const lessons = mods.reduce((n, m) => n + (Array.isArray(m?.lessons) ? m.lessons.length : 0), 0)
  if (!lessons) out.push('Add at least one lesson before publishing.')
  mods.forEach((m, i) => {
    if (!m || typeof m.title !== 'string' || !m.title.trim()) out.push(`Module ${i + 1} needs a title.`)
    ;(Array.isArray(m?.lessons) ? m.lessons : []).forEach((l, j) => {
      if (!l || typeof l.title !== 'string' || !l.title.trim()) out.push(`Lesson ${j + 1} in module ${i + 1} needs a title.`)
    })
  })
  if (mods.length > 50) out.push('A course can have at most 50 modules.')
  return out
}

/* Live quizzes that exist in the demo. Any other well-formed code is a 404. */
export const LIVE_QUIZZES: Record<string, { title: string; learners: number; questions: number }> = {
  '7Q4K2M': { title: 'Name that pairing', learners: 24, questions: 20 },
  SQ1A9B: { title: 'Python basics sprint', learners: 61, questions: 15 },
}
