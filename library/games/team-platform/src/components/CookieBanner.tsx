import { useState } from 'react'

import { cx } from '../lib/cx'
import { useLang } from '../lib/lang'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'
import { Button } from './Button'

export type Consent = { choice: 'accepted' | 'rejected' | 'custom'; analytics: boolean; marketing: boolean; at: string }

export function useConsent() {
  return useStored<Consent | null>('consent', null)
}

/* The cookie mark: a round cookie with two chocolate-chip eyes. */
export function CookieMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={cx('size-7', className)} aria-hidden>
      <path d="M14 3.2c1 2 3 3.1 5 2.6-.3 2.4 1.3 4.6 3.6 5 .1 0 .2 0 .3.1A10.8 10.8 0 1 1 14 3.2Z" fill="#0f0f0f" />
      <circle cx="10.4" cy="13.6" r="2.1" fill="#fff" />
      <circle cx="16.8" cy="13.6" r="2.1" fill="#fff" />
      <circle cx="10.8" cy="14" r="1" fill="#0f0f0f" />
      <circle cx="17.2" cy="14" r="1" fill="#0f0f0f" />
      <path d="M11.6 19c1.3.9 2.9.9 4.2 0" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </svg>
  )
}

/*
  The bottom cookie bar from the reference. Accept or Reject is saved in this
  browser (branchwork:consent) and the bar stays away after a reload.
  /cookies lets the visitor change it later.
*/
export function CookieBanner() {
  const { t } = useLang()
  const [consent, setConsent] = useConsent()
  const [leaving, setLeaving] = useState(false)
  if (consent) return null
  const choose = (choice: 'accepted' | 'rejected') => {
    setLeaving(true)
    window.setTimeout(() => setConsent({ choice, analytics: choice === 'accepted', marketing: choice === 'accepted', at: new Date().toISOString() }), 180)
  }
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] px-4 sm:px-6 lg:px-8">
      <section
        aria-label="Cookie consent"
        className={cx(
          'pointer-events-auto mx-auto flex max-w-[1200px] flex-col gap-3 rounded-t-[18px] border border-b-0 border-[#e2e2e2] bg-card px-5 py-4 shadow-[0_-10px_40px_-20px_rgb(15_15_15/0.25)] transition-[translate,opacity] duration-200 sm:flex-row sm:items-center sm:gap-4 sm:px-8 sm:py-[22px]',
          leaving && 'translate-y-4 opacity-0',
        )}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <p className="flex shrink-0 items-center gap-2.5 font-display text-[17px] font-medium tracking-[-0.01em] text-ink">
            <CookieMark />
            {t.cookieTitle}
          </p>
          <span className="hidden h-7 w-px bg-line sm:block" aria-hidden />
        </div>
        <p className="flex-1 text-[14.5px] leading-snug text-body">
          {t.cookieBody}{' '}
          <Link href="/cookies" className="text-ink underline decoration-faint underline-offset-[3px] hover:decoration-ink">
            {t.cookieLink}
          </Link>
          .
        </p>
        <div className="flex gap-2.5">
          <Button variant="soft" size="sm" className="h-10 flex-1 px-8 sm:flex-none" onClick={() => choose('accepted')}>
            {t.accept}
          </Button>
          <Button variant="soft" size="sm" className="h-10 flex-1 px-8 sm:flex-none" onClick={() => choose('rejected')}>
            {t.reject}
          </Button>
        </div>
      </section>
    </div>
  )
}
