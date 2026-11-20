import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { Sheet } from '../components/Sheet'
import { nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

/*
  Fixed top bar. Transparent over the sky; once the page scrolls it gains a
  frosted white backing and a hairline. Below md the links move into a
  side sheet.
*/
export function Nav() {
  const { path } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [path])

  return (
    <header
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300',
        scrolled ? 'bg-white/75 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150' : 'bg-transparent',
      )}
    >
      <div className="mx-auto grid h-16 max-w-[1140px] grid-cols-[1fr_auto] items-center px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {nav.map((n) => {
              const on = isCurrent(n.href, path)
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={on ? 'page' : undefined}
                    className={cx(
                      'round relative inline-flex h-9 items-center rounded-full px-3 text-[13.5px] font-medium text-ink transition-colors hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-leaf',
                      on && 'bg-white/60',
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="flex items-center justify-end gap-2">
          <Link href="/login" className="round hidden h-9 items-center rounded-full px-3 text-[13.5px] font-medium text-ink hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-leaf lg:inline-flex">
            Log in
          </Link>
          <Button href="/signup" size="sm" className="max-md:hidden">
            Get started
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="round grid size-11 place-items-center rounded-full bg-white/70 text-ink backdrop-blur focus-visible:outline-2 focus-visible:outline-leaf md:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Mobile" className="mt-2 flex flex-col">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isCurrent(n.href, path) ? 'page' : undefined}
              className="flex h-14 items-center rounded-[14px] px-3 font-display text-[22px] font-bold tracking-[-0.03em] text-ink hover:bg-wash aria-[current=page]:text-leaf focus-visible:outline-2 focus-visible:outline-leaf"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <Button href="/signup" size="lg" arrow>
            Get started
          </Button>
          <Button href="/login" size="lg" variant="outline">
            Log in
          </Button>
        </div>
      </Sheet>
    </header>
  )
}
