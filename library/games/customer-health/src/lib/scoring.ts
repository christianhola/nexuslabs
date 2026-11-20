import { DEFAULT_WEIGHTS, FACTORS, type Account, type FactorKey } from '../data'

/*
  The health score is a weighted blend of five factors. Each account stores
  its factor offsets from the blended score (`account.factors`), centred so
  the default weights reproduce the seeded history exactly. New weights shift
  every week of an account's history by the same amount.
*/

export type Weights = Record<FactorKey, number>

const same = (a: Weights, b: Weights) => FACTORS.every((f) => a[f.key] === b[f.key])

export function scoreShift(a: Account, w: Weights): number {
  const total = FACTORS.reduce((s, f) => s + w[f.key], 0)
  if (total <= 0) return 0
  return FACTORS.reduce((s, f) => s + w[f.key] * a.factors[f.key], 0) / total
}

const clampScore = (v: number) => Math.min(100, Math.max(1, Math.round(v)))

export function rescore(list: Account[], w: Weights): Account[] {
  if (same(w, DEFAULT_WEIGHTS)) return list
  return list.map((a) => {
    const d = scoreShift(a, w)
    return { ...a, history: a.history.map((v) => clampScore(v + d)), earlier: a.earlier.map((v) => clampScore(v + d)) }
  })
}

/** A factor's own score for an account (blended score + its offset). */
export function factorScore(a: Account, key: FactorKey, now: number): number {
  return clampScore(now + a.factors[key])
}

/** Share of the total weight, 0–1. */
export function share(w: Weights, key: FactorKey): number {
  const total = FACTORS.reduce((s, f) => s + w[f.key], 0)
  return total ? w[key] / total : 0
}
