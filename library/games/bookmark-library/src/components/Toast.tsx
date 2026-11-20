import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

type Action = { label: string; onClick: () => void }
type Toast = { id: number; text: string; action?: Action }
const Ctx = createContext<(text: string, action?: Action) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const dismiss = useCallback((id: number) => setItems((t) => t.filter((x) => x.id !== id)), [])
  const push = useCallback(
    (text: string, action?: Action) => {
      const id = Date.now() + Math.random()
      setItems((t) => [...t.slice(-2), { id, text, action }])
      window.setTimeout(() => dismiss(id), action ? 6000 : 3200)
    },
    [dismiss],
  )
  return (
    <Ctx.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[60] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div key={t.id} className="pointer-events-auto flex animate-pop items-center gap-3 rounded-full bg-ink py-2 pr-2 pl-4 text-[14px] text-paper shadow-pop">
            <span className="grid size-5 place-items-center rounded-full bg-lime text-ink">
              <Check aria-hidden className="size-3.5" strokeWidth={3} />
            </span>
            <span className="py-1">{t.text}</span>
            {t.action ? (
              <button
                type="button"
                onClick={() => {
                  t.action?.onClick()
                  dismiss(t.id)
                }}
                className="h-8 rounded-full bg-white/12 px-3 font-medium text-lime hover:bg-white/20"
              >
                {t.action.label}
              </button>
            ) : (
              <span className="w-2" />
            )}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
