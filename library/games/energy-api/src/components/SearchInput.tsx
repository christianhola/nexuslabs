import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

import { cx } from '../lib/cx'
import type { ForceState } from './Button'
import { controlClass } from './Field'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string
  onValueChange: (v: string) => void
  label: string
  force?: ForceState
}

/** A search box with a clear button. Esc clears it. */
export const SearchInput = forwardRef<HTMLInputElement, Props>(function SearchInput({ value, onValueChange, label, className, force, ...rest }, ref) {
  return (
    <div className={cx('relative', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted" aria-hidden />
      <input
        ref={ref}
        type="search"
        aria-label={label}
        value={value}
        data-force={force}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.stopPropagation()
            onValueChange('')
          }
        }}
        className={cx(controlClass, 'round h-12 rounded-pill pl-11 pr-12')}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onValueChange('')}
          aria-label="Clear search"
          className="round absolute right-1.5 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-mint-2 hover:text-ink"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
})
