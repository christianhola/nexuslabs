import { motion } from 'motion/react'
import { ArrowRight, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { Sheet } from '../components/Sheet'
import { nav } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

/*
  Fixed top bar. Links are pages; the active one is violet with a sliding
  underline. On the home page "Features" stays highlighted over the hero, as
  in the reference. Below lg the links move into a side sheet.
*/
export function Nav() {
  const { path } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = path === '/' ? nav.links[0].href : nav.links.find((l) => isCurrent(l.href, path))?.href

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the sheet whenever the route changes.
  useEffect(() => setOpen(false), [path])

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cx(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,padding,box-shadow] duration-300',
        scrolled ? 'bg-black/70 py-3 shadow-[0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-xl' : 'py-5 lg:pt-[45px] lg:pb-4',
      )}
    >
      <Container className="relative flex items-center justify-between">
        <Logo />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[46px] lg:flex" aria-label="Main">
          {nav.links.map((link) => {
            const isActive = active === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(link.href, path) ? 'page' : undefined}
                className={cx(
                  'relative py-2 text-[17px] tracking-[-0.01em] transition-colors duration-200',
                  isActive ? 'text-violet-text' : 'text-white hover:text-white/70',
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                    className="absolute inset-x-1 -bottom-0.5 h-[2px] rounded-full bg-violet-text round"
                  />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button href={nav.cta.href} variant="dark" className="!px-[24px] max-sm:!hidden">
            {nav.cta.label}
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-11 place-items-center rounded-[12px] bg-[#1a1a1b] transition-colors hover:bg-[#252527] lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </Container>

      <Sheet open={open} onClose={() => setOpen(false)} title="Menu">
        <nav aria-label="Mobile" className="mt-2 flex flex-col">
          {[{ href: '/', label: 'Home' }, ...nav.links].map((link, i) => {
            const current = link.href === '/' ? path === '/' : isCurrent(link.href, path)
            return (
              <motion.div key={link.href} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.04 }}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={current ? 'page' : undefined}
                  className={cx(
                    'group flex min-h-[52px] items-center rounded-[14px] px-3 font-display text-[24px] font-semibold tracking-[-0.03em] transition-colors hover:bg-white/[0.05]',
                    current ? 'text-violet-text' : 'text-white',
                  )}
                >
                  {link.label}
                  <ArrowRight className="ml-auto size-5 text-muted opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" aria-hidden />
                </Link>
              </motion.div>
            )
          })}
        </nav>
        <div className="mt-auto flex flex-col gap-2 pt-8">
          <Button href={nav.cta.href} onClick={() => setOpen(false)} size="lg" className="w-full">
            {nav.cta.label}
          </Button>
          <Button href={nav.login.href} onClick={() => setOpen(false)} variant="outline" size="lg" className="w-full">
            {nav.login.label}
          </Button>
        </div>
      </Sheet>
    </motion.header>
  )
}
