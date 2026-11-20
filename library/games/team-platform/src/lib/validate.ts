// Validation shared by the forms and the Worker, so both give the same answer.
import { demo } from '../content'

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export type Errors<T> = Partial<Record<keyof T, string>>

export function validateEmail(email: string): string | undefined {
  const v = email.trim()
  if (!v) return 'Enter your work email.'
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'Enter a valid email, like you@company.com.'
  return undefined
}

export type DemoInput = {
  name: string
  email: string
  company: string
  size: string
  role: string
  interests: string[]
  date: string
  slot: string
  notes: string
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export function validateDemoDetails(v: Partial<DemoInput>): Errors<DemoInput> {
  const e: Errors<DemoInput> = {}
  const name = (v.name ?? '').trim()
  if (name.length < 2) e.name = 'Enter your full name.'
  else if (name.length > 80) e.name = 'Keep your name under 80 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const company = (v.company ?? '').trim()
  if (company.length < 2) e.company = 'Enter your company name.'
  else if (company.length > 100) e.company = 'Keep the company name under 100 characters.'
  if (!demo.sizes.includes(v.size ?? '')) e.size = 'Choose how many employees you have.'
  if (!demo.roles.includes(v.role ?? '')) e.role = 'Choose the team you work in.'
  const interests = v.interests ?? []
  if (!Array.isArray(interests) || interests.some((i) => !demo.interests.includes(i))) e.interests = 'Choose from the list.'
  if ((v.notes ?? '').length > 1000) e.notes = 'Keep notes under 1,000 characters.'
  return e
}

export function validateDemoSlot(v: Partial<DemoInput>, today = new Date()): Errors<DemoInput> {
  const e: Errors<DemoInput> = {}
  const date = v.date ?? ''
  if (!ISO_DATE.test(date)) e.date = 'Choose a day.'
  else {
    const d = new Date(date + 'T12:00:00Z')
    const t = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12))
    const days = Math.round((d.getTime() - t.getTime()) / 86400000)
    const dow = d.getUTCDay()
    if (Number.isNaN(days) || days < 1 || days > 30) e.date = 'Choose a day in the next four weeks.'
    else if (dow === 0 || dow === 6) e.date = 'Demos run Monday to Friday.'
  }
  if (!demo.slots.includes(v.slot ?? '')) e.slot = 'Choose a time.'
  return e
}

export function validateDemo(v: Partial<DemoInput>, today?: Date): Errors<DemoInput> {
  return { ...validateDemoDetails(v), ...validateDemoSlot(v, today) }
}

export type IntegrationRequest = { tool: string; email: string; useCase: string }

export function validateIntegrationRequest(v: Partial<IntegrationRequest>): Errors<IntegrationRequest> {
  const e: Errors<IntegrationRequest> = {}
  const tool = (v.tool ?? '').trim()
  if (tool.length < 2) e.tool = 'Name the tool you want us to connect.'
  else if (tool.length > 60) e.tool = 'Keep it under 60 characters.'
  const email = validateEmail(v.email ?? '')
  if (email) e.email = email
  const use = (v.useCase ?? '').trim()
  if (use.length > 500) e.useCase = 'Keep it under 500 characters.'
  return e
}
