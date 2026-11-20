import { Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { NavDropdown } from '../components/NavDropdown'
import { Sheet } from '../components/Sheet'
import { featureLinks, nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

/*
  Sticky top bar: logo, centred links (Features opens a dropdown), Sign Up
  and Get Started. It gains a frosted backing once the page scrolls. Below
  lg the links move into a side sheet.
*/
export function Nav() {
  const { path } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const inFeatures = featureLinks.some((f) => isCurrent(f.href, path))

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setOpen(false), [path])

  return (
    <header className={cx('sticky top-0 z-50 transition-[background-color,box-shadow] duration-300', scrolled ? 'bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'bg-paper')}>
      <div className="mx-auto grid h-[76px] max-w-[1140px] grid-cols-[1fr_auto] items-center px-5 sm:px-8 lg:h-[104px] lg:grid-cols-[1fr_auto_1fr]">
        <Logo />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-3">
            {nav.map((n) => (
              <li key={n.label}>
                {n.children ? (
                  <NavDropdown label={n.label} items={n.children} active={inFeatures} />
                ) : (
                  <Link
                    href={n.href}
                    aria-current={isCurrent(n.href, path) ? 'page' : undefined}
                    className="inline-flex h-10 items-center rounded-[10px] px-3.5 text-[15px] text-ink transition-colors hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:outline-flame-strong aria-[current=page]:text-flame-ink"
                  >
                    {n.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-end gap-2.5">
          <Button href="/signup" variant="outline" size="md" className="max-sm:hidden">
            Sign Up
          </Button>
          <Button href="/builder" size="md" className="max-lg:hidden">
            Get Started
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-[10px] border border-line-strong bg-card text-ink focus-visible:outline-2 focus-visible:outline-flame-strong lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Mobile" className="flex flex-col">
          {nav
            .filter((n) => !n.children)
            .map((n) => (
              <Link key={n.href} href={n.href} aria-current={isCurrent(n.href, path) ? 'page' : undefined} className="flex h-13 min-h-12 items-center rounded-[12px] px-3 font-display text-[21px] font-medium text-ink hover:bg-wash aria-[current=page]:text-flame-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
                {n.label}
              </Link>
            ))}
          <p className="mt-5 px-3 font-display text-[13px] font-medium text-faint">Features</p>
          {featureLinks.map((f) => (
            <Link key={f.href} href={f.href} aria-current={isCurrent(f.href, path) ? 'page' : undefined} className="flex flex-col rounded-[12px] px-3 py-2.5 hover:bg-wash aria-[current=page]:text-flame-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
              <span className="font-display text-[17px] font-medium text-ink">{f.label}</span>
              <span className="text-[13.5px] text-muted">{f.description}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <Button href="/builder" size="lg" arrow>
            Get Started
          </Button>
          <Button href="/signup" size="lg" variant="outline">
            Sign Up
          </Button>
        </div>
      </Sheet>
    </header>
  )
}
