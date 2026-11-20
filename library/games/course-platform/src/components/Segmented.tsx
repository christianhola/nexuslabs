import { motion } from 'motion/react'
import { useId, useRef } from 'react'
import type { KeyboardEvent } from 'react'

import { cx } from '../lib/cx'

/*
  A radio group drawn as pills (Web | iOS, Monthly | Yearly). Arrow keys
  move the selection, as in a native radio group. `tone="dark"` gives the
  black active pill from the reference's platform switch.
*/
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  size = 'md',
  tone = 'dark',
  className,
}: {
  options: readonly { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  size?: 'xs' | 'sm' | 'md'
  tone?: 'dark' | 'white'
  className?: string
}) {
  const group = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const onKey = (e: KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + options.length) % options.length
    onChange(options[next]!.value)
    refs.current[next]?.focus()
  }
  return (
    <div role="radiogroup" aria-label={label} className={cx('round inline-flex rounded-full bg-wash-2 p-[3px]', className)}>
      {options.map((o, i) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKey(e, i)}
            className={cx(
              'round relative rounded-full font-display font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-flame-strong',
              size === 'xs' && 'h-6 px-2.5 text-[11.5px]',
              size === 'sm' && 'h-10 px-3.5 text-[13px] sm:h-8',
              size === 'md' && 'h-10 px-4 text-[14px]',
              on ? (tone === 'dark' ? 'text-on-dark' : 'text-ink') : 'text-muted hover:text-ink',
            )}
          >
            {on ? (
              <motion.span
                layoutId={`seg-${group}`}
                className={cx('round absolute inset-0 rounded-full', tone === 'dark' ? 'bg-night' : 'bg-card shadow-card')}
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            ) : null}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}
