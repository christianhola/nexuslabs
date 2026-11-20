import { useId } from 'react'
import type { ReactNode } from 'react'

/* A labelled range input with the value shown beside the label. */
export function Slider({ label, value, min, max, step = 1, onChange, display, hint }: { label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; display?: ReactNode; hint?: string }) {
  const id = useId()
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[14.5px] font-medium text-ink">
          {label}
        </label>
        <output htmlFor={id} className="font-display text-[18px] font-semibold tracking-[-0.02em] text-ink tabular-nums">
          {display ?? value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range h-10 w-full cursor-pointer appearance-none bg-transparent"
        style={{ ['--pct' as string]: `${pct}%` }}
      />
      {hint ? <p className="-mt-1 text-[13px] text-faint">{hint}</p> : null}
    </div>
  )
}
