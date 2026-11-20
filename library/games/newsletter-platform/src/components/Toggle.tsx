import { useId } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* An on/off switch with a visible label (role="switch"). */
export function Toggle({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; description?: ReactNode; disabled?: boolean }) {
  const id = useId()
  return (
    <div className={cx('flex items-start justify-between gap-4', disabled && 'opacity-50')}>
      <div>
        <label htmlFor={id} className="text-[15px] font-medium text-ink">
          {label}
        </label>
        {description ? <p className="mt-0.5 text-[13px] text-muted">{description}</p> : null}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="group/sw -my-1.5 grid h-10 w-14 shrink-0 place-items-center rounded-full focus-visible:outline-none"
      >
        <span className={cx('round relative h-7 w-12 rounded-full transition-colors duration-200 group-focus-visible/sw:outline-2 group-focus-visible/sw:outline-offset-2 group-focus-visible/sw:outline-pink', checked ? 'bg-pink-fill' : 'bg-panel-3 ring-1 ring-inset ring-line-strong')}>
          <span className={cx('round absolute left-1 top-1 size-5 rounded-full bg-white shadow transition-transform duration-200 ease-[var(--ease-brand)]', checked && 'translate-x-5')} />
        </span>
      </button>
    </div>
  )
}
