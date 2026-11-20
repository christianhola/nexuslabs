import { useId } from 'react'
import { ChevronDown } from 'lucide-react'

import { cx } from '../lib/cx'
import { currencies, currency } from '../shared/fx'
import type { CurrencyCode } from '../shared/fx'
import { CurrencyBadge } from './CurrencyBadge'

/*
  A large amount field joined to a currency picker, as in the send calculator.
  The amount is a plain text input with numeric keyboard so commas and
  partial input ("12.") are allowed while typing. Leave `onAmount` out for a
  read-only output row.
*/
export function MoneyInput({
  label,
  amount,
  onAmount,
  code,
  onCode,
  error,
  loading,
  className,
  force,
}: {
  label: string
  amount: string
  onAmount?: (v: string) => void
  code: CurrencyCode
  onCode: (c: CurrencyCode) => void
  error?: string | null
  loading?: boolean
  className?: string
  force?: 'focus'
}) {
  const id = useId()
  const readOnly = !onAmount
  return (
    <div className={className}>
      <div
        className={cx(
          'flex items-stretch rounded-card-sm border bg-white transition-[border-color,box-shadow]',
          error ? 'border-danger' : 'border-line-strong',
          'focus-within:border-teal focus-within:shadow-focus',
          force === 'focus' && 'border-teal shadow-focus',
        )}
      >
        <div className="min-w-0 flex-1 px-4 py-3">
          <label htmlFor={`${id}-amt`} className="block text-[12.5px] font-medium text-faint">
            {label}
          </label>
          {loading ? (
            <span className="skeleton mt-1.5 block h-8 w-36 rounded-[8px]" aria-hidden />
          ) : (
            <input
              id={`${id}-amt`}
              inputMode="decimal"
              autoComplete="off"
              value={amount}
              readOnly={readOnly}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${id}-err` : undefined}
              aria-live={readOnly ? 'polite' : undefined}
              onChange={(e) => onAmount?.(e.target.value.replace(/[^\d.,]/g, ''))}
              className={cx('tabular mt-0.5 w-full bg-transparent text-[30px] font-medium tracking-[-0.03em] text-ink outline-none', readOnly && 'cursor-default')}
            />
          )}
        </div>
        <div className="relative flex items-center border-l border-line">
          <label htmlFor={`${id}-cur`} className="sr-only">
            {label} currency
          </label>
          <span className="pointer-events-none absolute left-3.5">
            <CurrencyBadge code={code} />
          </span>
          <select
            id={`${id}-cur`}
            value={code}
            onChange={(e) => onCode(e.target.value as CurrencyCode)}
            className="h-full min-h-[72px] appearance-none rounded-r-card-sm bg-transparent pl-[50px] pr-9 text-[16px] font-semibold text-ink outline-none focus-visible:bg-mist-2"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 size-4 text-faint" aria-hidden />
        </div>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[13px] text-danger">
          {error}
        </p>
      )}
      <span className="sr-only">{currency(code).name}</span>
    </div>
  )
}
