import { Sparkle } from 'lucide-react'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'

import { hero } from '../content'
import { cx } from '../lib/cx'
import { parseStoreUrl } from '../lib/validate'
import { ArrowDisc } from './Button'

/** The little "AI✦" chip inside the URL field. */
export function AiChip({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx('grid h-8 w-9 place-items-center rounded-[6px] bg-[#1c2a52] text-[12px] font-bold text-white', className ?? 'relative')}>
      <span className="relative pr-1">
        AI
        <Sparkle className="absolute -right-0.5 -top-0.5 size-2 fill-cobalt-text text-cobalt-text" />
      </span>
    </span>
  )
}

/**
 * The hero's "Enter your brand's URL / Test our AI" form. Validates in the
 * browser with the same rules as the Worker, then hands the hostname up.
 */
export function UrlForm({
  onSubmit,
  initial = '',
  loading = false,
  error: external,
  className,
  autoFocus,
}: {
  onSubmit: (host: string) => void
  initial?: string
  loading?: boolean
  error?: string
  className?: string
  autoFocus?: boolean
}) {
  const id = useId()
  const [value, setValue] = useState(initial)
  const [local, setLocal] = useState<string>()
  const error = local ?? external

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const { host, error } = parseStoreUrl(value)
    setLocal(error)
    if (host) onSubmit(host)
  }

  return (
    <form onSubmit={submit} noValidate className={cx('w-full max-w-[560px]', className)}>
      <div className="flex flex-col gap-1.5 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor={id} className="sr-only">
            {hero.inputLabel}
          </label>
          <AiChip className="pointer-events-none absolute left-[6px] top-1/2 z-10 -translate-y-1/2" />
          <input
            id={id}
            type="text"
            inputMode="url"
            autoComplete="url"
            spellCheck={false}
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (local) setLocal(undefined)
            }}
            placeholder={hero.placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cx(
              'h-[50px] w-full rounded-[7px] border bg-[#0b0f1e]/80 pl-[54px] pr-4 text-[15px] text-white placeholder:text-[#b3b8c6] backdrop-blur transition-[border-color,box-shadow] duration-200 hover:border-white/35 focus:outline-none focus-visible:outline-none focus:border-cobalt-text focus:shadow-[0_0_0_3px_rgb(47_102_232/0.35)]',
              error ? 'border-cherry-text/80' : 'border-white/25',
            )}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading || undefined}
          className="group/button inline-flex h-[50px] shrink-0 items-center justify-center gap-3 rounded-[7px] bg-cobalt px-5 text-[15px] font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)] transition-[background-color,box-shadow,transform] duration-200 ease-brand hover:bg-cobalt-hover hover:shadow-glow active:scale-[0.97] disabled:opacity-60"
        >
          {loading ? 'Drafting…' : hero.cta}
          <ArrowDisc />
        </button>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-cherry-text">
          {error}
        </p>
      ) : null}
    </form>
  )
}
