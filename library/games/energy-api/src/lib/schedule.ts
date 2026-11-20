/*
  The planner behind the landing-page scheduler: fill the cheapest (or
  cleanest) hours before the ready time until the device has the energy it
  needs, and compare that with charging straight away.
*/
export type Goal = 'price' | 'carbon'

export type PlanInput = { kw: number; need: number; readyBy: number; goal: Goal; startHour: number; prices: number[]; carbon: number[] }

export type PlanResult = {
  window: number
  hours: number[]
  fill: number[]
  smartCost: number
  nowCost: number
  saving: number
  co2Saved: number
  short: number
}

function allocate(order: number[], kw: number, need: number, length: number) {
  const energy = new Array<number>(length).fill(0)
  let left = need
  for (const i of order) {
    if (left <= 0) break
    const e = Math.min(kw, left)
    energy[i] = e
    left -= e
  }
  return { energy, left: Math.max(0, left) }
}

export function plan({ kw, need, readyBy, goal, startHour, prices, carbon }: PlanInput): PlanResult {
  const window = (readyBy - startHour + 24) % 24 || 24
  const idx = Array.from({ length: window }, (_, i) => i)
  const metric = goal === 'price' ? prices : carbon
  const smart = allocate([...idx].sort((a, b) => metric[a] - metric[b] || a - b), kw, need, prices.length)
  const now = allocate(idx, kw, need, prices.length)
  const cost = (e: number[]) => e.reduce((s, kwh, i) => s + (kwh * prices[i]) / 100, 0)
  const co2 = (e: number[]) => e.reduce((s, kwh, i) => s + (kwh * carbon[i]) / 1000, 0)
  const smartCost = cost(smart.energy)
  const nowCost = cost(now.energy)
  return {
    window,
    hours: smart.energy.flatMap((e, i) => (e > 0 ? [i] : [])),
    fill: smart.energy.map((e) => e / kw),
    smartCost,
    nowCost,
    saving: nowCost > 0 ? Math.max(0, Math.round(((nowCost - smartCost) / nowCost) * 100)) : 0,
    co2Saved: Math.max(0, co2(now.energy) - co2(smart.energy)),
    short: smart.left,
  }
}
