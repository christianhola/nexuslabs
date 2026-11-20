import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import { cn } from '../lib/cn'
import { useFocusTrap } from '../lib/focus'
import { duration, ease } from '../lib/motion'

/**
  A click-to-open panel anchored to its trigger. Esc or an outside click
  closes it and focus returns to the trigger.
*/
export function Popover({
  trigger,
  children,
  label,
  align = 'right',
  className,
}: {
  trigger: (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-controls': string }) => ReactNode
  children: (close: () => void) => ReactNode
  label: string
  align?: 'left' | 'right'
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const id = useId()
  const close = () => setOpen(false)
  useFocusTrap(panel, open, close)
  useEffect(() => {
    if (!open) return
    function onDown(e: PointerEvent) {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])
  return (
    <div ref={wrap} className="relative">
      {trigger({ onClick: () => setOpen((o) => !o), 'aria-expanded': open, 'aria-controls': id })}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id={id}
            role="dialog"
            aria-label={label}
            className={cn(
              'absolute top-full z-40 mt-2 w-[min(340px,calc(100vw-24px))] rounded-md border border-line bg-surface shadow-pop',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              className,
            )}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: duration.fast, ease }}
          >
            {children(close)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
