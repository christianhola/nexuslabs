import { cx } from '../lib/cx'

/*
  The strip of former employers and universities on the team card. Names are
  placeholders set as typographic wordmarks (no real logos); replace them in
  content.ts with your own, or swap the spans for logo files.
*/
type Mark = { name: string; style: 'wide' | 'mono' | 'serif-caps' | 'serif' }

const styles: Record<Mark['style'], string> = {
  wide: 'text-[11px] font-semibold tracking-[0.22em]',
  mono: 'font-mono text-[10px] font-semibold',
  'serif-caps': 'font-serif text-[10px] tracking-[0.04em] [font-variant:small-caps]',
  serif: 'font-serif text-[15px] tracking-[-0.01em]',
}

export function Pedigree({ marks, className }: { marks: Mark[]; className?: string }) {
  return (
    <ul
      aria-label="Where our team has worked and studied"
      className={cx('flex items-center justify-between gap-2 overflow-hidden rounded-[18px] bg-black/90 px-4 py-3.5 text-white/90 ring-1 ring-white/10', className)}
    >
      {marks.map((m) => (
        <li key={m.name} className={cx('whitespace-nowrap', styles[m.style])}>
          {m.name}
        </li>
      ))}
    </ul>
  )
}
