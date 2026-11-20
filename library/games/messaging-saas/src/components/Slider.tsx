import { useId } from 'react'

import { cx } from '../lib/cx'

/** A styled native range input with a label and a formatted value readout. */
export function Slider({ label, value, min, max, step, onChange, format, className }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string; className?: string }) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className={cx('grid gap-3', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[14px] font-medium text-soft">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[22px] font-semibold tabular-nums text-white">
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
        style={{ background: `linear-gradient(90deg, var(--color-cobalt) ${pct}%, rgb(255 255 255 / 0.12) ${pct}%) center / 100% 8px no-repeat` }}
        className="h-10 w-full rounded-full bg-transparent cursor-pointer appearance-none [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-cobalt [&::-moz-range-thumb]:bg-white [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-cobalt [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgb(0_0_0/0.4)]"
      />
    </div>
  )
}
