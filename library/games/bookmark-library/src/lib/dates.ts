const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAY = 86_400_000

export function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function endOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(23, 59, 59, 999)
  return x
}

/** Midday n days ago; for today, half an hour ago (never in the future). */
export function daysAgo(n: number, now = new Date()) {
  const noon = startOfDay(now).getTime() - n * DAY + 12 * 3_600_000
  return new Date(Math.min(noon, now.getTime() - 30 * 60_000 - n * 60_000))
}

/** "28 Jul" */
export function shortDate(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

/** "28 Jul 2026" */
export function longDate(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** "Today", "Yesterday", "Tue" (this week) or "28 Jul". */
export function relativeDate(iso: string, now = new Date()) {
  const d = new Date(iso)
  const diff = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / DAY)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return d.toLocaleDateString('en-GB', { weekday: 'short' })
  return shortDate(d)
}

/** "8 to 20 Aug" or "28 Jul to 4 Aug". */
export function rangeLabel(from: Date, to: Date) {
  if (startOfDay(from).getTime() === startOfDay(to).getTime()) return shortDate(from)
  if (from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear()) return `${from.getDate()} to ${to.getDate()} ${MONTHS[to.getMonth()]}`
  return `${shortDate(from)} to ${shortDate(to)}`
}

export function isSameDay(a: Date, b: Date) {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

export const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
export { DAY, MONTHS }
