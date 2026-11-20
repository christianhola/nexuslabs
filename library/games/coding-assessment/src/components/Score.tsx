import { cx } from '../lib/cx'

export const scoreColour = (s: number) => (s >= 80 ? '#1fdc8a' : s >= 60 ? '#f4bd5a' : '#ff7a7a')

/** A circular score. `size` in px. */
export function ScoreRing({ score, size = 120, label = 'Score', className }: { score: number | null; size?: number; label?: string; className?: string }) {
  const r = 44
  const c = 2 * Math.PI * r
  const v = score ?? 0
  return (
    <div className={cx('relative inline-grid place-items-center', className)} style={{ width: size, height: size }} role="img" aria-label={score === null ? `${label}: not scored yet` : `${label}: ${score} out of 100`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="8" />
        {score !== null && <circle cx="50" cy="50" r={r} fill="none" stroke={scoreColour(v)} strokeWidth="8" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} className="transition-[stroke-dashoffset] duration-1000 ease-out" />}
      </svg>
      <div className="text-center leading-none" aria-hidden>
        <div className="font-medium tracking-[-0.03em] text-fg" style={{ fontSize: size * 0.3 }}>
          {score ?? '–'}
        </div>
        {size >= 100 && <div className="mt-1 text-[12px] text-muted">of 100</div>}
      </div>
    </div>
  )
}

/** A labelled horizontal bar. */
export function Meter({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between text-[14px]">
        <span className="text-muted">{label}</span>
        <span className="font-medium text-fg tabular-nums">{value}</span>
      </div>
      <div className="round h-2 overflow-hidden rounded-full bg-white/7" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div className="round h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${scoreColour(value)}99, ${scoreColour(value)})` }} />
      </div>
    </div>
  )
}

/** A small score pill for tables. */
export function ScorePill({ score }: { score: number | null }) {
  if (score === null) return <span className="text-[14px] text-faint">Not scored</span>
  return (
    <span className="inline-flex items-center gap-2 text-[14.5px] font-medium tabular-nums text-fg">
      <span aria-hidden className="round size-2 rounded-full" style={{ background: scoreColour(score) }} />
      {score}
    </span>
  )
}
