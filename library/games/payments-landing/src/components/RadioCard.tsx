import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A selectable row, like the payment-method options in the hero widget.
  Wraps a native radio so arrow keys, Space and form semantics just work.
*/
export function RadioCard({
  name,
  value,
  checked,
  onChange,
  icon,
  label,
  detail,
  disabled,
  force,
  size = 'md',
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  icon?: ReactNode
  label: ReactNode
  detail?: ReactNode
  disabled?: boolean
  force?: 'hover' | 'focus'
  size?: 'sm' | 'md'
}) {
  return (
    <label
      className={cx(
        'group relative flex items-center gap-3 rounded-control border bg-white transition-[border-color,box-shadow,background-color] duration-150',
        size === 'sm' ? 'min-h-11 px-3.5 py-2' : 'min-h-[52px] px-4 py-2.5',
        checked ? 'border-teal shadow-[0_0_0_1px_var(--color-teal)]' : 'border-line hover:border-line-strong',
        force === 'hover' && !checked && 'border-line-strong',
        'has-[:focus-visible]:shadow-focus',
        force === 'focus' && 'shadow-focus',
        disabled ? 'cursor-not-allowed opacity-55' : 'cursor-pointer',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      {icon && <span className="text-ink-2">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {detail && <span className="block text-[12.5px] text-faint">{detail}</span>}
      </span>
      <span
        aria-hidden
        className={cx(
          'round grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors',
          checked ? 'border-teal bg-teal-50' : 'border-line-strong bg-white',
        )}
      >
        <span className={cx('round size-2.5 rounded-full bg-teal transition-transform duration-200', checked ? 'scale-100' : 'scale-0')} />
      </span>
    </label>
  )
}
