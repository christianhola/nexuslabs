import { cx } from '../lib/cx'

/*
  The hero's dot-matrix columns: five bars of a load chart drawn in dots,
  fading at both ends, drifting slowly up and down like demand over a day.
  Positions are fractions of a 1440px frame so they keep the reference
  composition at every desktop width. Hidden below `lg`.
*/
export type DotColumn = { left: number; top: number; height: number; delay: number }

export const heroColumns: DotColumn[] = [
  { left: 797, top: 22, height: 221, delay: 0 },
  { left: 860, top: 180, height: 220, delay: -2.2 },
  { left: 1053, top: 117, height: 297, delay: -4.1 },
  { left: 1247, top: 180, height: 261, delay: -1.3 },
  { left: 1310, top: 58, height: 212, delay: -3.4 },
]

export function DotColumns({ columns = heroColumns, className, animate = true }: { columns?: DotColumn[]; className?: string; animate?: boolean }) {
  return (
    <div aria-hidden className={cx('pointer-events-none absolute inset-0 mx-auto hidden max-w-[1440px] lg:block', className)}>
      {columns.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: `${(c.left / 1440) * 100}%`, top: c.top, width: 60, height: c.height }}
        >
          <div
            className={cx('dots size-full', animate && 'animate-breathe')}
            style={{
              animationDelay: `${c.delay}s`,
              maskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 70%, transparent 100%)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
