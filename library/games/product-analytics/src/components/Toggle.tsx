import { cx } from '../lib/cx'

/* An on/off switch (role="switch"). Label it with `label`. */
export function Toggle({ checked, onChange, label, disabled, showLabel = true }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean; showLabel?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={showLabel ? undefined : label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="group inline-flex min-h-10 items-center gap-3 rounded-full text-[14px] text-body focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf disabled:opacity-45"
    >
      <span className={cx('round relative h-6 w-10 shrink-0 rounded-full transition-colors duration-200', checked ? 'bg-leaf' : 'bg-line-strong')}>
        <span className={cx('round absolute top-0.5 size-5 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.2)] transition-transform duration-200 ease-[var(--ease-brand)]', checked ? 'translate-x-[18px]' : 'translate-x-0.5')} />
      </span>
      {showLabel ? label : null}
    </button>
  )
}
