import { cx } from '../lib/cx'
import { inkOn } from '../lib/palette'

/** One colour chip with its hex. Click copies the hex when `onCopy` is given. */
export function Swatch({
  hex,
  size = 'md',
  onCopy,
  className,
}: {
  hex: string
  size?: 'sm' | 'md'
  onCopy?: (hex: string) => void
  className?: string
}) {
  const body = (
    <>
      <span
        className={cx('block w-full rounded-[7px] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.06)]', size === 'sm' ? 'h-8' : 'h-14')}
        style={{ background: hex }}
      />
      <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.02em] text-muted">{hex}</span>
    </>
  )
  if (!onCopy) return <span className={cx('block min-w-0 flex-1', className)}>{body}</span>
  return (
    <button
      type="button"
      aria-label={`Copy ${hex}`}
      onClick={() => onCopy(hex)}
      className={cx('block min-w-0 flex-1 rounded-[8px] text-left transition-transform duration-150 hover:-translate-y-0.5 active:scale-95', className)}
      style={{ ['--ink' as string]: inkOn(hex) }}
    >
      {body}
    </button>
  )
}
