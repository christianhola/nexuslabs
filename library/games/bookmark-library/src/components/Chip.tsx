import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { X } from 'lucide-react'

import { cx } from '../lib/cx'

export type ChipTone = 'soft' | 'active' | 'off' | 'lime' | 'outline'

const TONES: Record<ChipTone, string> = {
  soft: 'bg-chip text-ink-2',
  active: 'bg-chip-2 text-ink',
  off: 'bg-transparent text-subtle line-through decoration-faint shadow-[inset_0_0_0_1px_var(--color-line-2)]',
  lime: 'bg-lime-soft text-leaf',
  outline: 'bg-panel text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-2)]',
}

export function chipClass(tone: ChipTone = 'soft', extra?: string) {
  return cx('inline-flex h-10 max-w-full items-center gap-1.5 truncate rounded-sm px-3.5 text-[14px] tracking-[-0.005em] transition-colors duration-(--duration-fast)', TONES[tone], extra)
}

/** Static label chip (tags, query filters). */
export function Chip({ tone, icon, children, className }: { tone?: ChipTone; icon?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={chipClass(tone, className)}>
      {icon}
      {children}
    </span>
  )
}

/** Clickable chip; `removable` shows an x and labels the action. */
export function ChipButton({ tone = 'soft', icon, removable, force, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ChipTone; icon?: ReactNode; removable?: boolean; force?: 'hover' | 'focus' | 'pressed' }) {
  return (
    <button
      type="button"
      data-force={force}
      className={chipClass(
        tone,
        cx(
          'hover:bg-chip-2 data-[force=hover]:bg-chip-2 active:bg-line-2 data-[force=pressed]:bg-line-2 data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink disabled:opacity-45',
          tone === 'off' && 'hover:bg-chip data-[force=hover]:bg-chip',
          className,
        ),
      )}
      {...rest}
    >
      {icon}
      <span className="truncate">{children}</span>
      {removable && <X aria-hidden className="size-3.5 shrink-0 opacity-60" />}
    </button>
  )
}

/** Small inline tag (cards, rows). */
export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex h-6 items-center rounded-xs bg-chip px-2 text-[12.5px] text-ink-2', className)}>{children}</span>
}
