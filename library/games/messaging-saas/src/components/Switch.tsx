import { cx } from '../lib/cx'

/** An on/off switch: a 40x24 track inside a 48x40 hit area. */
export function Switch({ checked, onChange, label, disabled, force, className }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean; force?: 'focus'; className?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      data-force={force}
      onClick={() => onChange(!checked)}
      className={cx('group inline-flex h-10 w-12 shrink-0 items-center justify-center rounded-[10px] disabled:cursor-not-allowed disabled:opacity-45', className)}
    >
      <span aria-hidden className={cx('relative inline-flex h-6 w-10 items-center rounded-full border transition-colors duration-200', checked ? 'border-cobalt bg-cobalt' : 'border-line-strong bg-white/[0.08] group-hover:border-white/30')}>
        <span className={cx('size-[18px] rounded-full bg-white shadow transition-transform duration-200 ease-brand', checked ? 'translate-x-[18px]' : 'translate-x-[2px]')} />
      </span>
    </button>
  )
}
