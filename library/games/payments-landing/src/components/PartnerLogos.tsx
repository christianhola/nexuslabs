import { cx } from '../lib/cx'

/*
  Fictional partner wordmarks set in type, so there are no real logos to
  license. Replace with your customers' SVGs.
*/
const styles = [
  'font-semibold tracking-[-0.04em]',
  'font-medium lowercase tracking-[-0.03em]',
  'font-bold tracking-[-0.02em]',
]

export function PartnerLogos({ names, label, className }: { names: string[]; label: string; className?: string }) {
  return (
    <div className={className}>
      <p className="sr-only">{label}</p>
      <ul className="flex flex-wrap items-center gap-x-9 gap-y-3 text-navy">
        {names.map((n, i) => (
          <li key={n} className={cx('text-[23px]', styles[i % styles.length])}>
            {i === 2 && (
              <svg viewBox="0 0 16 16" className="mr-1 inline size-4 -translate-y-0.5" aria-hidden>
                <path d="M8 0l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="currentColor" />
              </svg>
            )}
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}
