import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, CircleAlert } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'

import { useReducedMotion } from '../lib/useReducedMotion'

/*
  One global toast stack. Call `toast('Saved')` from anywhere; <Toaster />
  is mounted once in App. Messages are announced politely.
*/
type T = { id: number; text: string; tone: 'ok' | 'bad' }
let items: T[] = []
let seq = 0
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

export function toast(text: string, tone: 'ok' | 'bad' = 'ok') {
  items = [...items, { id: ++seq, text, tone }].slice(-3)
  emit()
}
function dismiss(id: number) {
  items = items.filter((t) => t.id !== id)
  emit()
}

function Item({ t }: { t: T }) {
  useEffect(() => {
    const h = setTimeout(() => dismiss(t.id), 4200)
    return () => clearTimeout(h)
  }, [t.id])
  const reduce = useReducedMotion()
  const Icon = t.tone === 'ok' ? CheckCircle2 : CircleAlert
  return (
    <motion.div
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      className="pointer-events-auto flex items-center gap-3 rounded-[12px] border border-line-strong bg-panel-2 px-4 py-3 text-[14px] text-ink shadow-[var(--shadow-pop)]"
    >
      <Icon className={t.tone === 'ok' ? 'size-4.5 text-ok' : 'size-4.5 text-bad'} aria-hidden />
      {t.text}
    </motion.div>
  )
}

export function Toaster() {
  const list = useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => items,
    () => items,
  )
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-24 left-1/2 z-[90] flex w-[calc(100%-32px)] max-w-[420px] -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence initial={false}>
        {list.map((t) => (
          <Item key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}
