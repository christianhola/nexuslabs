import { useId } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  display,
  valueText,
  className,
  tone = 'ink',
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  display?: ReactNode
  valueText?: string
  className?: string
  tone?: 'ink' | 'forest'
}) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={cx('text-[14px] font-medium', tone === 'forest' ? 'text-on-forest-muted' : 'text-muted')}>
          {label}
        </label>
        <span className={cx('tabular text-[15px] font-medium', tone === 'forest' ? 'text-on-forest' : 'text-ink')}>{display ?? value}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ['--pct' as string]: `${pct}%` }}
      />
    </div>
  )
}
