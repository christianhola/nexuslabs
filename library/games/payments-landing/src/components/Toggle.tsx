import { useId } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** A switch. The button is a 56x40 hit area around the visible track. */
export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled,
  force,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: ReactNode
  description?: ReactNode
  disabled?: boolean
  force?: 'focus'
}) {
  const id = useId()
  return (
    <div className={cx('flex items-center justify-between gap-4', disabled && 'opacity-55')}>
      <div>
        <label htmlFor={id} className="text-[14px] font-medium text-ink">
          {label}
        </label>
        {description && <p className="text-[13px] text-faint">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-force={force}
        onClick={() => onChange(!checked)}
        className="-mr-1 grid h-10 w-14 shrink-0 place-items-center rounded-control-sm disabled:cursor-not-allowed"
      >
        <span aria-hidden className={cx('round relative block h-7 w-12 rounded-full transition-colors duration-200', checked ? 'bg-teal-ink' : 'bg-line-strong')}>
          <span className={cx('round absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform duration-200', checked && 'translate-x-5')} />
        </span>
      </button>
    </div>
  )
}
