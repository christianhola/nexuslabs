import { Menu } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { Sheet } from '../components/Sheet'
import { nav, navActions } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

/** The floating header from the reference: logo chip, grey link pill, Login and an outlined Get started. */
export function Nav() {
  const { path } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [path])

  return (
    <header className={cx('fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-300', scrolled ? 'border-b border-line bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent')}>
      <a href="#main" className="sr-only rounded-[8px] bg-white px-4 py-2 text-bg focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70]">
        Skip to content
      </a>
      <div className={cx('mx-auto flex w-full max-w-[1440px] items-center gap-3 px-5 transition-[height] duration-300 sm:px-8 lg:px-[72px]', scrolled ? 'h-[72px]' : 'h-[88px]')}>
        <Logo />
        <nav aria-label="Main" className="ml-3 hidden h-10 items-center rounded-[7px] bg-[#3b3f4c]/70 px-1.5 backdrop-blur md:flex">
          {nav.map((n) => {
            const current = isCurrent(n.href, path)
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={current ? 'page' : undefined}
                className={cx('flex h-8 items-center rounded-[5px] px-3.5 text-[15px] transition-colors lg:px-[15px]', current ? 'bg-white/[0.14] text-white' : 'text-[#eef0f5] hover:bg-white/[0.08]')}
              >
                {n.label}
              </Link>
            )
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 sm:gap-5">
          <Link href={navActions.login.href} aria-current={path === '/login' ? 'page' : undefined} className="hidden h-10 items-center rounded-[6px] px-2 text-[15px] text-white hover:text-cobalt-text sm:flex">
            {navActions.login.label}
          </Link>
          <Button href={navActions.start.href} variant="outline" arrow className="hidden h-10 rounded-[6px] pl-5 pr-[9px] text-[15px] sm:inline-flex">
            {navActions.start.label}
          </Button>
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="grid size-11 place-items-center rounded-[8px] border border-line-strong text-white md:hidden">
            <Menu aria-hidden className="size-5" />
          </button>
        </div>
      </div>
      <Sheet open={open} onClose={close} title="Menu">
        <nav aria-label="Mobile" className="grid gap-1">
          {[...nav, { label: 'Customers', href: '/customers' }, { label: 'Test our AI', href: '/demo' }].map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href, path) ? 'page' : undefined} className="flex min-h-12 items-center rounded-[10px] px-3 font-display text-[22px] font-medium text-white hover:bg-white/[0.06] aria-[current=page]:text-cobalt-text">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto grid gap-2">
          <Button href={navActions.login.href} variant="subtle" size="lg">
            {navActions.login.label}
          </Button>
          <Button href={navActions.start.href} size="lg" arrow>
            {navActions.start.label}
          </Button>
        </div>
      </Sheet>
    </header>
  )
}
