import { useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'

import { ButtonLink, IconButton } from '../components/Button'
import { Logo } from '../components/Logo'
import { NAV } from '../content'
import { cx } from '../lib/cx'
import { Link, isCurrent, useLocation } from '../lib/router'
import { useFocusTrap } from '../lib/useFocusTrap'

export function Nav() {
  const [open, setOpen] = useState(false)
  const { path } = useLocation()
  const panel = useRef<HTMLDivElement>(null)
  useFocusTrap(panel, open, () => setOpen(false))
  return (
    <header className="relative z-30">
      <div className="mx-auto flex h-[86px] w-full max-w-[930px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Keepsake home" className="inline-flex h-11 items-center rounded-sm">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={!n.href.includes('#') && isCurrent(n.href, path) ? 'page' : undefined} className="rounded-sm px-3 py-2 text-[16px] tracking-[-0.01em] text-ink hover:bg-chip aria-[current=page]:font-medium">
              {n.label}
            </Link>
          ))}
          <ButtonLink href="/#join" variant="lime" size="lg" className="ml-4 h-12 rounded-[13px] px-6 text-[16px]" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
            Join waitlist
          </ButtonLink>
        </nav>
        <IconButton label="Open menu" aria-expanded={open} aria-controls="mobile-menu" className="md:hidden" onClick={() => setOpen(true)}>
          <Menu aria-hidden className="size-5" />
        </IconButton>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div aria-hidden className="absolute inset-0 animate-fade bg-ink/25" onClick={() => setOpen(false)} />
          <div ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="absolute inset-x-3 top-3 animate-pop rounded-2xl bg-paper p-4 shadow-pop">
            <div className="flex items-center justify-between pb-2 pl-2">
              <Logo />
              <IconButton label="Close menu" onClick={() => setOpen(false)}>
                <X aria-hidden className="size-5" />
              </IconButton>
            </div>
            <nav aria-label="Mobile" className="flex flex-col">
              {[...NAV, { label: 'Open the library', href: '/app' }].map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className={cx('flex h-12 items-center rounded-md px-3 text-[18px] hover:bg-chip')}>
                  {n.label}
                </Link>
              ))}
            </nav>
            <ButtonLink href="/#join" variant="lime" size="lg" className="mt-3 w-full" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
              Join waitlist
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  )
}
