import { STALE_TOUCH_DAYS, TODAY, type Account, type Range } from '../data'

/*
  Every number on the page comes from these functions, so plugging in real
  data only means producing `Account[]`.
*/

export const current = (a: Account) => a.history[a.history.length - 1]!
/** All 26 weekly scores, oldest first. */
export const series = (a: Account) => [...a.earlier, ...a.history]
/** Score `weeks` ago (the comparison point for deltas). */
export const ago = (a: Account, weeks: number) => {
  const s = series(a)
  return s[s.length - 1 - weeks]!
}
/** Score four weeks ago. */
export const fourWeeksAgo = (a: Account) => ago(a, 4)
/** The last `range` weeks plus the comparison point (range + 1 points). */
export const windowed = (a: Account, range: Range) => series(a).slice(-(range + 1))
/** Points below the 13-week peak (0 or negative). */
export const drawdown = (a: Account) => current(a) - Math.max(...a.history)
/** Week-over-week change. */
export const wow = (a: Account) => current(a) - a.history[a.history.length - 2]!
/** Change over the selected range. */
export const change = (a: Account, range: Range) => current(a) - ago(a, range)

export function daysUntil(iso: string): number {
  return Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${TODAY}T00:00:00Z`)) / 86_400_000)
}

/**
 * Weeks until the account crosses the threshold at its last-two-weeks slope.
 * null when it is already under, or not declining.
 */
export function runwayWeeks(a: Account, threshold: number): number | null {
  const now = current(a)
  if (now < threshold) return null
  const h = a.history
  const slope = (now - h[h.length - 3]!) / 2
  if (slope >= -0.5) return null
  const weeks = (now - threshold) / -slope
  return weeks > 26 ? null : weeks
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b)
  if (s.length === 0) return 0
  const m = s.length >> 1
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2
}

export type Kpis = {
  arrAtRisk: number
  arrAtRiskDelta: number
  accountsAtRisk: number
  accountsAtRiskDelta: number
  medianHealth: number
  medianHealthDelta: number
  renewals90Arr: number
  renewals90Count: number
}

export const isRenewing = (a: Account, days = 90) => {
  const d = daysUntil(a.renewal)
  return d >= 0 && d <= days
}

export function kpis(list: Account[], threshold: number, range: Range = 4): Kpis {
  const risk = list.filter((a) => current(a) < threshold)
  const riskThen = list.filter((a) => ago(a, range) < threshold)
  const sum = (l: Account[]) => l.reduce((s, a) => s + a.arr, 0)
  const renewing = list.filter((a) => isRenewing(a))
  const med = Math.round(median(list.map(current)))
  return {
    arrAtRisk: sum(risk),
    arrAtRiskDelta: sum(risk) - sum(riskThen),
    accountsAtRisk: risk.length,
    accountsAtRiskDelta: risk.length - riskThen.length,
    medianHealth: med,
    medianHealthDelta: med - Math.round(median(list.map((a) => ago(a, range)))),
    renewals90Arr: sum(renewing),
    renewals90Count: renewing.length,
  }
}

/** Accounts worth a look: under the threshold, or down 15+ points from peak. */
export function watchlist(list: Account[], threshold: number): Account[] {
  return list.filter((a) => current(a) < threshold || drawdown(a) <= -15)
}

export type Status = 'At risk' | 'Watch' | 'Healthy'
export function status(a: Account, threshold: number): Status {
  if (current(a) < threshold) return 'At risk'
  if (drawdown(a) <= -15 || current(a) < threshold + 10) return 'Watch'
  return 'Healthy'
}

export const isStale = (a: Account) => a.lastTouchDays > STALE_TOUCH_DAYS

/** Plain-language reasons this account is (or is not) on the watchlist. */
export function signals(a: Account, threshold: number, range: Range = 4): Array<{ text: string; bad: boolean }> {
  const out: Array<{ text: string; bad: boolean }> = []
  const now = current(a)
  const moved = change(a, range)
  if (now < threshold) out.push({ text: `Below the risk threshold of ${threshold}`, bad: true })
  if (drawdown(a) <= -15) out.push({ text: `${Math.abs(drawdown(a))} points off its 13-week peak`, bad: true })
  if (moved <= -5) out.push({ text: `Health down ${Math.abs(moved)} points in ${range} weeks`, bad: true })
  if (a.seatUtilization < 0.45) out.push({ text: `Only ${Math.round(a.seatUtilization * 100)}% of seats active`, bad: true })
  if (isStale(a)) out.push({ text: `No logged touch in ${a.lastTouchDays} days`, bad: true })
  const renew = daysUntil(a.renewal)
  if (renew >= 0 && renew <= 90) out.push({ text: `Renews in ${renew} days`, bad: now < threshold + 10 })
  if (out.length === 0) out.push({ text: 'Stable: no warning signs this week', bad: false })
  return out
}
