const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** $720k, $6.7M */
export function money(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return `$${Math.round(n / 1000)}k`
}

/** +621k, −1.2M (no currency sign, as in the KPI deltas) */
export function moneyDelta(n: number): string {
  const sign = n > 0 ? '+' : n < 0 ? '−' : '±'
  const a = Math.abs(n)
  return `${sign}${a >= 1_000_000 ? `${(a / 1_000_000).toFixed(1)}M` : `${Math.round(a / 1000)}k`}`
}

/** +1, −6, ±0 */
export function signed(n: number): string {
  if (n === 0) return '±0'
  return n > 0 ? `+${n}` : `−${Math.abs(n)}`
}

/** May 24 ’27 */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ’${String(d.getUTCFullYear()).slice(2)}`
}

export function percent(n: number): string {
  return `${Math.round(n * 100)}%`
}

/** Nov 11 (no year) */
export function dayMonth(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`)
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`
}

export function monthName(index: number): string {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index]!
}

/** 1,240 */
export function count(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}
