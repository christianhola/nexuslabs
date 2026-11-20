import { AnimatePresence, motion } from 'motion/react'
import { CircleCheck } from 'lucide-react'
import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/*
  Toasts: short confirmations at the bottom of the screen, announced
  politely. `toast(message, { action })` offers one action, such as Undo.
*/
type Toast = { id: number; message: string; action?: { label: string; run: () => void } }
const Ctx = createContext<(message: string, opts?: { action?: Toast['action'] }) => void>(() => {})

export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const next = useRef(1)
  const push = useCallback((message: string, opts?: { action?: Toast['action'] }) => {
    const id = next.current++
    setItems((t) => [...t.slice(-2), { id, message, action: opts?.action }])
    window.setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 5000)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="pointer-events-auto flex min-h-12 items-center gap-3 rounded-[12px] bg-night py-2 pl-4 pr-2 text-[14px] text-on-dark shadow-pop"
            >
              <CircleCheck className="size-4 shrink-0 text-[#ff9a6e]" aria-hidden />
              <span>{t.message}</span>
              {t.action ? (
                <button
                  type="button"
                  onClick={() => {
                    t.action!.run()
                    setItems((x) => x.filter((y) => y.id !== t.id))
                  }}
                  className="h-10 rounded-[8px] px-3 font-display font-medium text-[#ffb08c] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                >
                  {t.action.label}
                </button>
              ) : (
                <span className="w-2" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
