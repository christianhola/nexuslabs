import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { AnimatePresence, motion } from 'motion/react'

import { cx } from '../lib/cx'
import { useReducedMotion } from '../lib/useReducedMotion'

type PopoverProps = {
  /** Render the trigger; spread `props` on a button. */
  trigger: (props: { 'aria-expanded': boolean; 'aria-controls': string; onClick: () => void; ref: React.Ref<HTMLButtonElement> }) => ReactNode
  label: string
  align?: 'left' | 'right'
  className?: string
  children: ReactNode
}

/** Small floating panel (menus, column chooser). Esc or an outside click closes it; focus returns to the trigger. */
export function Popover({ trigger, label, align = 'right', className, children }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const wrap = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey, true)
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('input,button,select,[tabindex]')?.focus(), 20)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey, true)
      window.clearTimeout(t)
    }
  }, [open])

  return (
    <div ref={wrap} className="relative" onBlur={(e) => open && !wrap.current?.contains(e.relatedTarget as Node) && e.relatedTarget && setOpen(false)}>
      {trigger({ 'aria-expanded': open, 'aria-controls': id, onClick: () => setOpen((o) => !o), ref: btn })}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id={id}
            role="group"
            aria-label={label}
            initial={{ opacity: 0, y: reduce ? 0 : -4, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : -4, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className={cx(
              'absolute top-[calc(100%+8px)] z-40 min-w-[220px] rounded-[6px] border border-line bg-raised p-3 shadow-pop',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
