import type { Issue } from '../content'
import { defaultIssue } from '../content'
import { useStored } from './storage'

/* The editor's draft, kept in localStorage under inkwell:draft. */
export function useDraft() {
  return useStored<Issue>('draft', defaultIssue)
}

export const newId = () => Math.random().toString(36).slice(2, 9)

export function words(issue: Issue) {
  const text = [issue.title, issue.subtitle, ...issue.blocks.map((b) => b.text ?? '')].join(' ')
  return text.split(/\s+/).filter(Boolean).length
}
