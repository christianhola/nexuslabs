import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CircleAlert, CircleCheck } from 'lucide-react'

import { cx } from '../lib/cx'

type Toast = { id: number; message: string; tone: 'default' | 'error'; action?: { label: string; onClick: () => void } }
type Push = (message: string, opts?: { tone?: Toast['tone']; action?: Toast['action'] }) => void

const Ctx = createContext<Push>(() => {})

export const useToast = () => useContext(Ctx)

let next = 1

/** Small dark toasts at the bottom centre, announced politely to screen readers. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = useCallback<Push>((message, opts) => {
    const id = next++
    setToasts((t) => [...t.slice(-2), { id, message, tone: opts?.tone ?? 'default', action: opts?.action }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts?.action ? 6000 : 3200)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      {createPortal(
        <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[88px] z-[120] flex flex-col items-center gap-2 px-4">
          {toasts.map((t) => (
            <ToastView key={t.id} toast={t} onDismiss={() => setToasts((x) => x.filter((y) => y.id !== t.id))} />
          ))}
        </div>,
        document.body,
      )}
    </Ctx.Provider>
  )
}

export function ToastView({ toast, onDismiss, className }: { toast: Omit<Toast, 'id'>; onDismiss?: () => void; className?: string }) {
  return (
    <div
      role={toast.tone === 'error' ? 'alert' : 'status'}
      className={cx(
        'pointer-events-auto flex min-h-10 animate-rise items-center gap-2.5 rounded-[10px] bg-ink py-2 pl-3 pr-2 text-[13.5px] text-white shadow-[var(--shadow-card-lift)]',
        className,
      )}
    >
      {toast.tone === 'error' ? <CircleAlert size={16} className="text-[#ff8a94]" /> : <CircleCheck size={16} className="text-[#8fe3b0]" />}
      <span className="pr-1">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action!.onClick()
            onDismiss?.()
          }}
          className="h-10 rounded-[6px] px-2 sm:h-7 text-[13px] font-medium text-white underline-offset-2 hover:bg-white/12"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  )
}
