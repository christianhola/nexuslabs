import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { Logo } from '../components/Logo'
import { cta, nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

export function Nav() {
  const { path } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Close the drawer on navigation.
  useEffect(() => setOpen(false), [path])

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b border-ink/[0.07] transition-[background-color,backdrop-filter] duration-200',
        scrolled ? 'bg-mint/85 backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[58px] w-full max-w-[1440px] items-center px-5 sm:px-8 lg:px-16 xl:px-[106px]">
        <Link href="/" aria-label="Gridwise home" className="-ml-1 rounded-control-sm px-1 py-1">
          <Logo />
        </Link>
        <nav aria-label="Main" className="ml-[22px] hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const on = !n.href.includes('#') && isCurrent(n.href, path)
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={on ? 'page' : undefined}
                    className={cx(
                      'inline-flex h-9 items-center rounded-pill px-[14px] text-[14.5px] tracking-[-0.005em] transition-colors',
                      on ? 'text-ink' : 'text-ink-2 hover:text-ink',
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="-mr-2 grid size-11 place-items-center rounded-control-sm text-ink hover:bg-ink/[0.06] md:hidden"
          >
            <Menu className="size-[22px]" aria-hidden />
          </button>
        </div>
      </div>
      <Dialog open={open} onClose={() => setOpen(false)} title="Menu" variant="drawer">
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex h-12 items-center rounded-control-sm px-3 text-[18px] font-medium tracking-[-0.02em] hover:bg-mint-2">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ButtonLink href={cta.href} size="lg" block className="mt-auto">
          {cta.label}
        </ButtonLink>
      </Dialog>
    </header>
  )
}
