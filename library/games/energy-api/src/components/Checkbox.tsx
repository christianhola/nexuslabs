import { useId } from 'react'
import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

import { cx } from '../lib/cx'
import type { ForceState } from './Button'

export function Checkbox({ checked, onChange, label, hint, disabled, force }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode; disabled?: boolean; force?: ForceState }) {
  const id = useId()
  return (
    <label htmlFor={id} className={cx('group flex min-h-10 items-start gap-3 py-1.5', disabled && 'cursor-not-allowed opacity-50')}>
      <span className="relative mt-[1px] grid size-[22px] shrink-0 place-items-center">
        <input id={id} type="checkbox" checked={checked} disabled={disabled} data-force={force} onChange={(e) => onChange(e.target.checked)} className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-[7px] bg-paper shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] transition-colors checked:bg-ink checked:shadow-none hover:shadow-[inset_0_0_0_1.5px_var(--color-faint)] disabled:cursor-not-allowed" />
        <Check className="pointer-events-none relative size-3.5 text-mint opacity-0 peer-checked:opacity-100" strokeWidth={3} aria-hidden />
      </span>
      <span className="text-[15px] leading-6">
        <span className="text-ink">{label}</span>
        {hint && <span className="block text-[13px] text-muted">{hint}</span>}
      </span>
    </label>
  )
}
