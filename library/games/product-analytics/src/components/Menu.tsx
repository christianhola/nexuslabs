import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cx } from '../lib/cx'

/*
  A filter dropdown: a pill trigger and a popover of checkable options
  (role="menu" with menuitemcheckbox). Opens on click, Enter, Space or
  ArrowDown; arrows move, Esc closes and returns focus to the trigger, a
  click outside closes it.
*/
export function FilterMenu({
  label,
  options,
  selected,
  onToggle,
  size = 'md',
  className,
}: {
  label: string
  options: readonly string[]
  selected: string[]
  onToggle: (option: string) => void
  size?: 'sm' | 'md'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  useEffect(() => {
    if (open) items.current[active]?.focus()
  }, [open, active])

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <div ref={root} className={cx('relative', className)}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          setActive(0)
          setOpen((o) => !o)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive(0)
            setOpen(true)
          }
        }}
        className={cx(
          'round inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-wash font-display font-semibold text-ink transition-colors hover:bg-wash-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-leaf aria-expanded:bg-wash-2',
          size === 'sm' ? 'h-8 px-2.5 text-[12px]' : 'h-10 px-3.5 text-[13.5px]',
        )}
      >
        {label}
        {selected.length ? <span className="round grid h-[18px] min-w-[18px] place-items-center rounded-full bg-lime px-1 text-[11px] text-ink">{selected.length}</span> : null}
        <ChevronDown className={cx('size-3.5 text-muted transition-transform duration-200', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            role="menu"
            aria-label={label}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                e.preventDefault()
                e.stopPropagation()
                close()
              } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault()
                setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
              } else if (e.key === 'Tab') {
                setOpen(false)
              }
            }}
            className="absolute left-0 top-[calc(100%+6px)] z-30 min-w-[180px] origin-top-left rounded-[14px] bg-card p-1.5 shadow-pop"
          >
            {options.map((o, i) => {
              const on = selected.includes(o)
              return (
                <button
                  key={o}
                  ref={(el) => {
                    items.current[i] = el
                  }}
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={on}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => onToggle(o)}
                  className="flex h-10 w-full items-center justify-between gap-6 rounded-[9px] px-3 text-left text-[13.5px] text-ink hover:bg-wash focus:bg-wash focus:outline-none"
                >
                  {o}
                  <span className={cx('grid size-[18px] place-items-center rounded-[5px] border', on ? 'border-leaf bg-leaf text-white' : 'border-line-strong')}>
                    {on ? <Check className="size-3" strokeWidth={3} aria-hidden /> : null}
                  </span>
                </button>
              )
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
