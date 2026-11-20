import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import type { ForceState } from './Button'

/** One option in a card-style radio group. Wrap several in role="radiogroup" or a fieldset. */
export function RadioCard({ name, value, checked, onChange, title, hint, force, disabled }: { name: string; value: string; checked: boolean; onChange: (v: string) => void; title: ReactNode; hint?: ReactNode; force?: ForceState; disabled?: boolean }) {
  return (
    <label
      data-force={force}
      className={cx(
        'relative flex min-h-[64px] items-start gap-3 rounded-control bg-paper p-4 transition-shadow duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
        checked ? 'shadow-[inset_0_0_0_2px_var(--color-ink)]' : 'shadow-[inset_0_0_0_1px_var(--color-line)] hover:shadow-[inset_0_0_0_1px_var(--color-line-strong)] data-[force=hover]:shadow-[inset_0_0_0_1px_var(--color-line-strong)]',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={() => onChange(value)} className="peer sr-only" />
      <span className={cx('round mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full', checked ? 'bg-ink' : 'shadow-[inset_0_0_0_1.5px_var(--color-line-strong)]')} aria-hidden>
        {checked && <span className="round size-1.5 rounded-full bg-mint" />}
      </span>
      <span>
        <span className="block text-[15px] font-medium leading-5 text-ink">{title}</span>
        {hint && <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>}
      </span>
    </label>
  )
}
