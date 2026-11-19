import { cx } from '../lib/cx'

export function Swatch({ hex, name, size = 'md', className }: { hex: string; name?: string; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <div className={cx('flex flex-col gap-2', className)}>
      <span
        className={cx('block rounded-[var(--radius-sm)] shadow-[var(--shadow-inset)]', size === 'sm' && 'h-8 w-8', size === 'md' && 'h-16 w-full', size === 'lg' && 'h-24 w-full')}
        style={{ background: hex }}
        aria-hidden
      />
      {name && (
        <span className="flex flex-col text-[13px] leading-tight">
          <span className="font-medium text-ink">{name}</span>
          <span className="tabular-nums text-muted">{hex}</span>
        </span>
      )}
    </div>
  )
}
