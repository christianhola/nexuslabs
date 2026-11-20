// Local-date helpers. Dates are 'YYYY-MM-DD' strings in the viewer's timezone;
// times are 'HH:MM' strings. Comparing either as strings sorts correctly.

export function toKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey(): string {
  return toKey(new Date())
}

export function addDays(key: string, n: number): string {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

/** Monday of the week containing `key`. */
export function weekStart(key: string): string {
  const d = fromKey(key)
  const dow = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dow)
  return toKey(d)
}

export function weekdayIndex(key: string): number {
  return (fromKey(key).getDay() + 6) % 7
}

export function formatLong(key: string): string {
  return fromKey(key).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatShort(key: string): string {
  return fromKey(key).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDay(key: string): { dow: string; day: string; month: string } {
  const d = fromKey(key)
  return {
    dow: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: String(d.getDate()),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
  }
}

export function relativeDay(key: string): string {
  const t = todayKey()
  if (key === t) return 'Today'
  if (key === addDays(t, 1)) return 'Tomorrow'
  if (key === addDays(t, -1)) return 'Yesterday'
  return formatShort(key)
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function fromMinutes(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** Every half hour between two whole hours, as 'HH:MM'. */
export function halfHours(fromHour: number, toHour: number): string[] {
  const out: string[] = []
  for (let m = fromHour * 60; m <= toHour * 60; m += 30) out.push(fromMinutes(m))
  return out
}

export function greeting(now = new Date()): string {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function timeAgo(iso: string, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000))
  if (s < 60) return 'just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  return `${Math.round(h / 24)} d ago`
}
