import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

export type BadgeTone = 'neutral' | 'mint' | 'dark' | 'outline' | 'warn' | 'bad'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-mist-2 text-body',
  mint: 'bg-mint-soft text-leaf',
  dark: 'bg-night text-white',
  outline: 'border border-line-strong text-body',
  warn: 'bg-warn-soft text-warn',
  bad: 'bg-bad-soft text-bad',
}

export function Badge({ tone = 'neutral', children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return <span className={cx('inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-[7px] px-2 text-[12.5px] font-medium', tones[tone], className)}>{children}</span>
}

/* Small label above a heading, with a mint tick. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[14px] font-medium text-body', className)}>
      <span className="round size-2 rounded-full bg-mint ring-[1.5px] ring-ink" aria-hidden />
      {children}
    </p>
  )
}

/* Toggleable filter chip (aria-pressed). */
export function Chip({ active, children, className, force, count, ...rest }: { active?: boolean; force?: Force; count?: number; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-pressed={!!active}
      data-force={force}
      className={cx(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-[var(--radius-button)] border px-3.5 text-[14px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-ink disabled:opacity-45 sm:h-9',
        active ? 'border-ink bg-ink text-white' : 'border-line bg-card text-body hover:border-line-strong hover:bg-mist data-[force=hover]:border-line-strong data-[force=hover]:bg-mist',
        className,
      )}
      {...rest}
    >
      {children}
      {count != null ? <span className={cx('text-[12.5px]', active ? 'text-white/75' : 'text-faint')}>{count}</span> : null}
    </button>
  )
}
