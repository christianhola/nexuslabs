/*
  Health colour scale as CSS (not hex), so it follows the theme tokens and
  animates with them: --risk up to 37, through --mid around 67, to --high from 94.
*/
export function healthFill(score: number): string {
  if (score <= 37) return 'var(--risk)'
  if (score < 67) {
    const t = Math.round(((score - 37) / 30) * 100)
    return `color-mix(in oklab, var(--mid) ${t}%, var(--risk))`
  }
  if (score < 94) {
    const t = Math.round(((score - 67) / 27) * 100)
    return `color-mix(in oklab, var(--high) ${t}%, var(--mid))`
  }
  return 'var(--high)'
}
