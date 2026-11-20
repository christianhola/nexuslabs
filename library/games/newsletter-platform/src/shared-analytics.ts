/*
  The demo analytics report, built deterministically so numbers are stable
  between reloads. The Worker serves it at /api/analytics; replace this with
  queries against your own sends table.
*/
export type Range = '7d' | '30d' | '90d'
export const ranges: Range[] = ['7d', '30d', '90d']

export type Post = { id: string; title: string; sent: string; recipients: number; openRate: number; clickRate: number; revenue: number }
export type Report = {
  range: Range
  labels: string[]
  series: { subscribers: number[]; opens: number[]; clicks: number[]; revenue: number[] }
  totals: { subscribers: number; opens: number; clicks: number; revenue: number }
  deltas: { subscribers: number; opens: number; clicks: number; revenue: number }
  sources: { label: string; value: number }[]
  posts: Post[]
}

function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

const titles = ['The quiet hour', 'Five things worth your Friday', 'Notes from the edge of the map', 'A bowl for busy Tuesdays', 'What the fiftieth launch taught me', 'Six roads worth the detour', 'Why I stopped writing at night', 'The week in numbers', 'Letters from readers', 'On finishing things', 'The paper map comeback', 'Small rooms, big ideas']

export function buildReport(range: Range, now = new Date('2026-11-12T12:00:00Z')): Report {
  const n = range === '7d' ? 7 : range === '30d' ? 30 : 90
  const r = rng(n * 7919)
  const labels: string[] = []
  const subscribers: number[] = []
  const opens: number[] = []
  const clicks: number[] = []
  const revenue: number[] = []
  let subs = 372096 - n * 410
  for (let i = 0; i < n; i++) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - (n - 1 - i))
    labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }))
    subs += Math.round(260 + r() * 300)
    subscribers.push(subs)
    opens.push(Number((36 + r() * 6).toFixed(2)))
    clicks.push(Number((3.2 + r() * 1.9).toFixed(2)))
    revenue.push(Math.round(40 + r() * 90 + (i % 7 === 2 ? 180 : 0)))
  }
  const avg = (a: number[]) => Number((a.reduce((s, v) => s + v, 0) / a.length).toFixed(2))
  const posts: Post[] = Array.from({ length: Math.min(12, Math.ceil(n / 2.5)) }, (_, i) => {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - Math.round(i * (n / Math.min(12, Math.ceil(n / 2.5)))))
    const rec = subs - i * 900 - Math.round(r() * 400)
    return {
      id: `p${i}`,
      title: titles[i % titles.length],
      sent: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      recipients: rec,
      openRate: Number((34 + r() * 10).toFixed(1)),
      clickRate: Number((2.4 + r() * 3.6).toFixed(1)),
      revenue: Math.round(r() * 900 + 120),
    }
  })
  return {
    range,
    labels,
    series: { subscribers, opens, clicks, revenue },
    totals: { subscribers: subs, opens: avg(opens), clicks: avg(clicks), revenue: revenue.reduce((s, v) => s + v, 0) },
    deltas: { subscribers: Number((((subs - subscribers[0]) / subscribers[0]) * 100).toFixed(1)), opens: Number((r() * 4 - 1).toFixed(1)), clicks: Number((r() * 3 - 1.4).toFixed(1)), revenue: Number((r() * 20 + 2).toFixed(1)) },
    sources: [
      { label: 'Referrals', value: Math.round(n * 140 * (0.8 + r() * 0.4)) },
      { label: 'Recommendations', value: Math.round(n * 115 * (0.8 + r() * 0.4)) },
      { label: 'Sign-up page', value: Math.round(n * 70 * (0.8 + r() * 0.4)) },
      { label: 'Social', value: Math.round(n * 44 * (0.8 + r() * 0.4)) },
      { label: 'Import', value: Math.round(n * 12 * (0.8 + r() * 0.4)) },
    ],
    posts,
  }
}
