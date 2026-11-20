import { cx } from '../lib/cx'

/*
  The hand-drawn double underline under the hero's accent word. Draws
  itself in on load (off with reduced motion).
*/
export function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 22" preserveAspectRatio="none" className={cx('pointer-events-none absolute -bottom-[0.2em] left-[2%] h-[0.32em] w-[96%] overflow-visible text-ink', className)} aria-hidden>
      <path className="squiggle-a" d="M3 9.5c30-2.6 72-4.4 118-3.6 24 .4 46 1.6 74 3.4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" pathLength={1} />
      <path className="squiggle-b" d="M122 14.8c22-2.2 44-2.6 70-1.4M112 19.5c26-2 52-2.2 80-.6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" pathLength={1} />
    </svg>
  )
}
