import { useId } from 'react'
import type React from 'react'

import { cx } from '../lib/cx'

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  className,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
  className?: string
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cx('flex flex-col gap-3', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-ink-2">
          {label}
        </label>
        <output htmlFor={id} className="tabular text-[18px] font-medium text-ink">
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
        aria-valuetext={format(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range h-10 w-full cursor-pointer appearance-none bg-transparent"
        style={{ '--pct': `${pct}%` } as React.CSSProperties}
      />
    </div>
  )
}
