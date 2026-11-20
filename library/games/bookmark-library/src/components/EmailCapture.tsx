import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

import { HERO } from '../content'
import { cx } from '../lib/cx'
import { navigate } from '../lib/router'
import { joinWaitlist } from '../lib/waitlist'
import { validateEmail } from '../shared/validate'
import { Button } from './Button'

/** Waitlist form: email + button inside one bordered pill. Success goes to /waitlist. */
export function EmailCapture({ className, plan, tone = 'light', autoFocus, forceState }: { className?: string; plan?: string; tone?: 'light' | 'dark'; autoFocus?: boolean; forceState?: 'error' | 'loading' }) {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(forceState === 'error' ? 'That email does not look right. Check for typos.' : null)
  const [busy, setBusy] = useState(forceState === 'loading')
  const ready = !validateEmail(email)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError(null)
    const res = await joinWaitlist(email, plan)
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    navigate('/waitlist')
  }

  return (
    <form onSubmit={submit} noValidate className={cx('w-full max-w-[462px]', className)}>
      <div
        className={cx(
          'flex items-center gap-2 rounded-[16px] p-[6px] transition-shadow duration-(--duration-fast)',
          tone === 'light' ? 'bg-paper shadow-[inset_0_0_0_1px_var(--color-line-2)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]' : 'bg-white/8 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.2)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-lime)]',
          error && 'shadow-[inset_0_0_0_1.5px_var(--color-danger)]!',
        )}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus={autoFocus}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (error) setError(null)
          }}
          placeholder={HERO.placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cx('h-[48px] min-w-0 flex-1 bg-transparent pl-4 text-[16px] outline-none focus-visible:outline-none', tone === 'light' ? 'text-ink placeholder:text-subtle' : 'text-paper placeholder:text-white/60')}
        />
        <Button type="submit" variant={ready ? 'lime' : 'soft'} size="lg" loading={busy} iconEnd={ready && !busy ? <ArrowRight aria-hidden className="size-4.5" /> : undefined} className={cx('h-[48px] rounded-[12px] px-6 text-[16px] shadow-none', !ready && tone === 'light' && 'text-ink-2', !ready && tone === 'dark' && 'bg-white/14 text-paper hover:bg-white/22')}>
          {HERO.cta}
        </Button>
      </div>
      <p id={`${id}-err`} role="alert" aria-live="polite" className={cx('min-h-6 pt-2 pl-5 text-left text-[14px] font-medium', tone === 'light' ? 'text-danger' : 'text-[#ffb4a8]')}>
        {error}
      </p>
    </form>
  )
}
