import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search, X } from 'lucide-react'

import { cx } from '../lib/cx'

/** The big palette search field. */
export const SearchBox = forwardRef<HTMLInputElement, Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { onClear?: () => void; size?: 'md' | 'lg'; force?: 'focus' | 'hover' }>(function SearchBox(
  { onClear, size = 'lg', className, value, force, ...rest },
  ref,
) {
  return (
    <div data-force={force} className={cx('group/search relative flex items-center', className)}>
      <Search aria-hidden className={cx('pointer-events-none absolute text-ink-2', size === 'lg' ? 'left-0 size-5' : 'left-3.5 size-4.5')} strokeWidth={2} />
      <input
        ref={ref}
        type="search"
        value={value}
        autoComplete="off"
        spellCheck={false}
        className={cx(
          'w-full min-w-0 bg-transparent text-ink outline-none placeholder:text-subtle [&::-webkit-search-cancel-button]:appearance-none',
          size === 'lg' ? 'h-14 pr-10 pl-9 text-[20px] tracking-[-0.015em]' : 'h-11 rounded-md bg-white pr-10 pl-10 text-[15px] shadow-[inset_0_0_0_1px_var(--color-line-2)] hover:shadow-[inset_0_0_0_1px_var(--color-faint)] focus-visible:shadow-[inset_0_0_0_1.5px_var(--color-ink)] group-data-[force=focus]/search:shadow-[inset_0_0_0_1.5px_var(--color-ink)] group-data-[force=hover]/search:shadow-[inset_0_0_0_1px_var(--color-faint)]',
          size === 'lg' && 'focus-visible:outline-none',
        )}
        {...rest}
      />
      {onClear && value ? (
        <button type="button" onClick={onClear} aria-label="Clear search" className={cx('absolute grid size-10 place-items-center rounded-full text-subtle hover:bg-chip hover:text-ink', size === 'lg' ? '-right-2' : 'right-0.5')}>
          <X aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  )
})
