import { AnimatePresence, motion } from 'motion/react'
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'

import { cn } from '../lib/cn'
import { duration, ease } from '../lib/motion'

export type ToastTone = 'success' | 'error' | 'info'
type ToastItem = { id: number; tone: ToastTone; title: string; body?: string; action?: { label: string; run: () => void } }

const ToastContext = createContext<((t: Omit<ToastItem, 'id'>) => void) | null>(null)

/** Call `toast({ tone, title, body, action })` from anywhere under ToastProvider. */
export function useToast() {
  const fn = useContext(ToastContext)
  return fn ?? (() => {})
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const next = useRef(1)
  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), [])
  const push = useCallback(
    (t: Omit<ToastItem, 'id'>) => {
      const id = next.current++
      setItems((all) => [...all.slice(-2), { ...t, id }])
      window.setTimeout(() => dismiss(id), t.action ? 6000 : 4000)
    },
    [dismiss],
  )
  const value = useMemo(() => push, [push])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
      >
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <ToastView key={t.id} item={t} onClose={() => dismiss(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

const icons = { success: CheckCircle2, error: AlertCircle, info: Info }
const iconTone = { success: 'text-free', error: 'text-danger', info: 'text-slate' }

export function ToastView({ item, onClose, static: isStatic }: { item: Omit<ToastItem, 'id'>; onClose?: () => void; static?: boolean }) {
  const Icon = icons[item.tone]
  return (
    <motion.div
      layout={!isStatic}
      role={item.tone === 'error' ? 'alert' : 'status'}
      initial={isStatic ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, transition: { duration: duration.fast } }}
      transition={{ duration: duration.base, ease }}
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-line bg-surface p-3.5 shadow-pop',
        item.tone === 'error' && 'border-danger/30',
      )}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-[18px] shrink-0', iconTone[item.tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-fg">{item.title}</p>
        {item.body && <p className="mt-0.5 text-xs text-muted">{item.body}</p>}
      </div>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.run()
            onClose?.()
          }}
          className="-my-1 h-8 shrink-0 rounded-sm px-2 text-sm font-semibold text-brand hover:bg-brand-tint"
        >
          {item.action.label}
        </button>
      )}
      {onClose && (
        <button type="button" aria-label="Dismiss" onClick={onClose} className="-m-1 grid size-8 shrink-0 place-items-center rounded-sm text-muted hover:bg-subtle hover:text-fg">
          <X className="size-4" />
        </button>
      )}
    </motion.div>
  )
}
