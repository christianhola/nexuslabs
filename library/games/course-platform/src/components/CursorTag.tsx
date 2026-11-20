import { cx } from '../lib/cx'

/*
  A collaborator's cursor with a name tag, as in the hero: someone else is
  editing this course with you. Decorative (aria-hidden); `float` makes it
  drift gently unless reduced motion is on.
*/
export function CursorTag({ name, tone = 'violet', flip, className, float = true }: { name: string; tone?: 'violet' | 'azure'; flip?: boolean; className?: string; float?: boolean }) {
  const fill = tone === 'violet' ? 'var(--color-violet)' : 'var(--color-azure)'
  return (
    <span className={cx('pointer-events-none absolute z-20 flex flex-col', flip ? 'items-start' : 'items-end', float && 'animate-float', className)} aria-hidden>
      <svg viewBox="0 0 14 14" className={cx('size-3.5', flip ? '-scale-x-100 self-end' : 'self-end')} style={{ color: fill }}>
        <path d="M1 1l12 4.6-5.4 1.6L5.8 13z" fill="currentColor" />
      </svg>
      <span className="round -mt-0.5 rounded-full px-2.5 py-1 font-display text-[11px] font-medium leading-none text-white shadow-[0_4px_12px_-4px_rgb(0_0_0/0.3)]" style={{ background: fill }}>
        {name}
      </span>
    </span>
  )
}
