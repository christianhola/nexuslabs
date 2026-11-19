import { QUIZ, type StyleId } from '../content'

/** Sums each answer's style scores; the highest total wins (ties go to the first style). */
export function scoreQuiz(answers: Record<string, string>): StyleId {
  const totals: Record<StyleId, number> = { 'warm-minimal': 0, 'nordic-light': 0, collected: 0, earthy: 0 }
  for (const q of QUIZ) {
    const opt = q.options.find((o) => o.id === answers[q.id])
    if (!opt) continue
    for (const [k, v] of Object.entries(opt.scores)) totals[k as StyleId] += v ?? 0
  }
  return (Object.entries(totals) as [StyleId, number][]).sort((a, b) => b[1] - a[1])[0][0]
}
