import { useId } from 'react'

import { cx } from '../lib/cx'

export function Switch({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  const id = useId()
  return (
    <div className={cx('flex items-start justify-between gap-4', disabled && 'opacity-50')}>
      <label htmlFor={id} className="text-[15px] leading-snug text-ink">
        <span className="font-medium">{label}</span>
        {description ? <span className="mt-0.5 block text-[13.5px] text-muted">{description}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          'group round -my-1.5 inline-flex h-10 w-12 shrink-0 items-center rounded-full focus-visible:outline-none disabled:cursor-not-allowed',
        )}
      >
        <span className={cx('round inline-flex h-7 w-12 items-center rounded-full border-[1.5px] transition-colors duration-200 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink', checked ? 'border-ink bg-mint' : 'border-line-strong bg-mist-2')}>
          <span className={cx('round ml-[3px] size-5 rounded-full border-[1.5px] border-ink bg-white transition-transform duration-200 ease-[var(--ease-brand)]', checked && 'translate-x-[18px]')} />
        </span>
      </button>
    </div>
  )
}
