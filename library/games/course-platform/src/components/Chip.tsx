import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'
import type { Force } from './Button'

/* A toggleable filter chip (aria-pressed). */
export function Chip({ active, children, count, force, className, ...rest }: { active?: boolean; children: ReactNode; count?: number; force?: Force } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-pressed={active}
      data-force={force}
      className={cx(
        'inline-flex h-10 items-center gap-2 rounded-[10px] border px-3.5 font-display text-[14px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-flame-strong data-[force=focus]:outline-2 data-[force=focus]:outline-flame-strong sm:h-9',
        active ? 'border-flame-strong bg-flame-soft text-flame-ink' : 'border-line bg-card text-body hover:border-line-strong hover:bg-wash data-[force=hover]:bg-wash',
        className,
      )}
      {...rest}
    >
      {children}
      {count != null ? <span className={cx('text-[12px]', active ? 'text-flame-ink' : 'text-faint')}>{count}</span> : null}
    </button>
  )
}
