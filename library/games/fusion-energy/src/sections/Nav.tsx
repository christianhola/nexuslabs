import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ButtonLink, IconButton } from '../components/Button'
import { Logo } from '../components/Logo'
import { Sheet } from '../components/Sheet'
import { cta, nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

export function Nav() {
  const { path } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [path])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,box-shadow] duration-300',
        scrolled ? 'bg-black/70 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-xl' : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" aria-label="Tidewell Fusion home" className="-m-2 inline-flex items-center rounded-[12px] p-2">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const current = isCurrent(n.href, path)
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={current ? 'page' : undefined}
                    className={cx(
                      'inline-flex h-10 items-center rounded-control px-4 text-[15px] transition-colors',
                      current ? 'bg-white/[0.09] text-white' : 'text-muted hover:text-white',
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href={cta.href} size="sm" className="hidden sm:inline-flex">
            {cta.label}
          </ButtonLink>
          <IconButton onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="lg:hidden">
            <Menu className="size-5" aria-hidden />
          </IconButton>
        </div>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Mobile" className="mt-4 flex flex-1 flex-col">
          <ul className="flex flex-col gap-1">
            {[{ label: 'Home', href: '/' }, ...nav].map((n) => {
              const current = isCurrent(n.href, path)
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={current ? 'page' : undefined}
                    className={cx('flex h-14 items-center rounded-[16px] px-4 text-[20px] font-medium tracking-[-0.02em]', current ? 'bg-white/[0.08] text-white' : 'text-soft hover:bg-white/[0.05]')}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className="mt-auto pt-6">
            <ButtonLink href={cta.href} size="lg" className="w-full">
              {cta.label}
            </ButtonLink>
          </div>
        </nav>
      </Sheet>
    </header>
  )
}
