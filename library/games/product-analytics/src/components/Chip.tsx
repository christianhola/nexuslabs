import { X } from 'lucide-react'

import { cx } from '../lib/cx'

/* An applied filter. The x button removes it; the label names what it does. */
export function Chip({ label, value, onRemove, className, size = 'md' }: { label: string; value: string; onRemove?: () => void; className?: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cx(
        'round inline-flex items-center gap-1.5 rounded-full border border-line bg-card text-body',
        size === 'sm' ? 'h-7 pl-2.5 pr-1 text-[11.5px]' : 'h-10 pl-3.5 pr-0 text-[13px]',
        className,
      )}
    >
      <span className="text-faint">{label}:</span>
      <span className="font-medium text-ink">{value}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove filter ${label}: ${value}`}
          className={cx('round grid place-items-center rounded-full text-muted transition-colors hover:bg-ink/[0.07] hover:text-ink focus-visible:outline-2 focus-visible:outline-leaf', size === 'sm' ? 'size-5' : 'size-10')}
        >
          <X className={size === 'sm' ? 'size-3' : 'size-3.5'} aria-hidden />
        </button>
      ) : null}
    </span>
  )
}
