import { motion } from 'motion/react'
import { useId, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from '../lib/cn'
import { spring } from '../lib/motion'

/**
  A row of mutually exclusive options (radio group) with a sliding indicator.
  Arrow keys move between options.
*/
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = 'md',
  className,
}: {
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: ReactNode; icon?: ReactNode }>
  label: string
  size?: 'sm' | 'md'
  className?: string
}) {
  const id = useId()
  function onKey(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = options[(i + d + options.length) % options.length]
    onChange(next.value)
    const el = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[(i + d + options.length) % options.length]
    el?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-sm bg-subtle p-[3px]', className)}>
      {options.map((o, i) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              'relative inline-flex flex-1 items-center justify-center gap-1.5 rounded-[4px] font-semibold whitespace-nowrap transition-colors duration-150',
              size === 'sm' ? 'h-8 min-w-0 px-2 text-xs md:h-7' : 'h-9 px-3.5 text-sm',
              active ? 'text-fg' : 'text-muted hover:text-fg',
            )}
          >
            {active && <motion.span layoutId={`seg-${id}`} transition={spring} className="absolute inset-0 rounded-[4px] bg-surface shadow-card ring-1 ring-line" />}
            <span className="relative inline-flex items-center gap-1.5 [&>svg]:size-3.5">
              {o.icon}
              {o.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
