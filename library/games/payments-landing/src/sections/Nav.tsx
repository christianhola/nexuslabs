import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { Logo } from '../components/Logo'
import { nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'
import { useStore, keys } from '../lib/store'

export function Nav() {
  const { path } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [session] = useStore<{ email: string } | null>(keys.session, null)

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
        scrolled ? 'bg-white/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md' : 'bg-transparent',
      )}
    >
      <Container className={cx('flex items-center gap-10 transition-[height] duration-300', scrolled ? 'h-[72px]' : 'h-[84px]')}>
        <Link href="/" aria-label="Ledgerly home" className="-m-1 shrink-0 rounded-control-sm p-1">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.links.map((l) => {
              const on = isCurrent(l.href, path)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={on ? 'page' : undefined}
                    className={cx(
                      'relative inline-flex h-10 items-center rounded-control-sm px-3.5 text-[14px] font-medium transition-colors',
                      on ? 'text-teal-ink' : 'text-ink-2 hover:text-ink',
                    )}
                  >
                    {l.label}
                    {on && <span aria-hidden className="round absolute inset-x-3.5 bottom-1 h-0.5 rounded-full bg-teal" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {session ? (
            <ButtonLink href="/send" variant="outline" size="sm" className="h-11 px-5">
              {session.email.split('@')[0]}
            </ButtonLink>
          ) : (
            <ButtonLink href={nav.login.href} variant="outline" size="sm" className="h-11 bg-transparent px-5">
              {nav.login.label}
            </ButtonLink>
          )}
          <ButtonLink href={nav.signup.href} size="sm" className="h-11 px-5">
            {nav.signup.label}
          </ButtonLink>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="ml-auto grid size-11 place-items-center rounded-control text-ink hover:bg-ink/5 lg:hidden"
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)} title="Menu" variant="drawer">
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            {[{ label: 'Home', href: '/' }, ...nav.links, { label: 'Security', href: '/security' }].map((l) => {
              const on = l.href === '/' ? path === '/' : isCurrent(l.href, path)
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    aria-current={on ? 'page' : undefined}
                    className={cx('flex h-12 items-center rounded-control px-3 text-[16px] font-medium', on ? 'bg-teal-50 text-teal-deep' : 'text-ink hover:bg-mist')}
                  >
                    {l.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="mt-auto grid gap-2 pt-6">
          <ButtonLink href={nav.login.href} variant="outline" block>
            {nav.login.label}
          </ButtonLink>
          <ButtonLink href={nav.signup.href} block>
            {nav.signup.label}
          </ButtonLink>
        </div>
      </Dialog>
    </header>
  )
}
