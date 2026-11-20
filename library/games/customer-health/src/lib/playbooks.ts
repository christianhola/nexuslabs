import type { Account, PlaybookRule, Role } from '../data'
import { current, daysUntil, drawdown, isStale } from './metrics'

/** Which accounts each playbook applies to (recomputed live from the threshold). */
export function matches(rule: PlaybookRule, a: Account, threshold: number): boolean {
  switch (rule) {
    case 'below-threshold':
      return current(a) < threshold
    case 'drawdown':
      return drawdown(a) <= -15 && current(a) >= threshold
    case 'adoption':
      return a.seatUtilization < 0.45
    case 'quiet':
      return isStale(a)
    case 'renewal-risk': {
      const d = daysUntil(a.renewal)
      return d >= 0 && d <= 90 && current(a) < threshold + 10
    }
  }
}

export const TEAM = ['Account owner', 'Priya Raman', 'Marcus Lee', 'Elena Sousa', 'Tom Okafor', 'Hana Kim', 'Leo Brandt', 'Jonah Pierce', 'Dana Whitfield', 'Ruth Calloway', 'Sam Adeyemi'] as const

export const DEFAULT_ASSIGNEE: Record<Role, string> = {
  CSM: 'Account owner',
  'Account exec': 'Jonah Pierce',
  'Support lead': 'Dana Whitfield',
  'Exec sponsor': 'Ruth Calloway',
  Product: 'Sam Adeyemi',
}
