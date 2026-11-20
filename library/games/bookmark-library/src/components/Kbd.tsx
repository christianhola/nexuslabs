import type { ReactNode } from 'react'

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-xs bg-white px-1.5 font-sans text-[12px] font-medium text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-2),0_1px_0_var(--color-line-2)]">{children}</kbd>
}
