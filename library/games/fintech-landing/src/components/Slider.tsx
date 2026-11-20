import { useId } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** Labelled range input with a violet fill up to the thumb and a live value. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format = (n) => String(n),
  hint,
  disabled,
  className,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step?: number
  onChange: (n: number) => void
  format?: (n: number) => ReactNode
  hint?: ReactNode
  disabled?: boolean
  className?: string
}) {
  const id = useId()
  const fill = ((value - min) / (max - min)) * 100
  return (
    <div className={cx('flex flex-col', disabled && 'opacity-50', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] text-muted">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[20px] font-semibold tracking-[-0.03em] tabular">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-3 w-full disabled:cursor-not-allowed"
        style={{ ['--fill' as string]: `${fill}%` }}
      />
      {hint ? <p className="mt-2 text-[12px] text-faint">{hint}</p> : null}
    </div>
  )
}
