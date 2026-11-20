import { Menu as MenuIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, IconButton } from '../components/Button'
import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { NavMenu } from '../components/Menu'
import { Modal } from '../components/Modal'
import { nav, productMenu } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

export function Nav() {
  const { path } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className={cx('sticky top-0 z-50 border-b transition-colors duration-300', scrolled ? 'border-line bg-night/85 backdrop-blur-md' : 'border-[#17151f] bg-night')}>
      <Container className="flex h-[76px] items-center gap-8 lg:h-[84px]">
        <Link href="/" aria-label="Inkwell home" className="flex h-11 items-center rounded-[6px]">
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          <NavMenu label="Product" items={productMenu} />
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={isCurrent(n.href, path) ? 'page' : undefined} className="inline-flex h-10 items-center rounded-[6px] px-3 text-[15.5px] font-medium text-body transition-colors hover:text-white aria-[current=page]:text-white">
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link href="/login" className="inline-flex h-10 items-center rounded-[6px] px-3 text-[15.5px] font-medium text-body hover:text-white">
            Log in
          </Link>
          <Button href="/demo" variant="outline" size="sm" className="!h-10 !text-[15.5px]">
            Get a demo
          </Button>
          <Button href="/signup" variant="white" size="sm" className="!h-10 !text-[15.5px]">
            Sign up for free
          </Button>
        </div>
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Button href="/signup" variant="white" size="sm" className="hidden sm:inline-flex">
            Sign up for free
          </Button>
          <IconButton label="Open menu" onClick={() => setOpen(true)} className="!size-11 text-ink">
            <MenuIcon />
          </IconButton>
        </div>
      </Container>
      <Modal open={open} onClose={() => setOpen(false)} side="right" title="Menu">
        <nav aria-label="Mobile" className="flex flex-col">
          {[...productMenu, ...nav.filter((n) => !productMenu.some((p) => p.href === n.href))].map((n) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} aria-current={isCurrent(n.href, path) ? 'page' : undefined} className="flex min-h-12 items-center border-b border-line text-[18px] font-medium text-ink aria-[current=page]:text-pink-text">
              {n.label}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-3">
            <Button href="/signup" variant="white" onClick={() => setOpen(false)}>
              Sign up for free
            </Button>
            <Button href="/demo" variant="outline" onClick={() => setOpen(false)}>
              Get a demo
            </Button>
            <Button href="/login" variant="ghost" onClick={() => setOpen(false)}>
              Log in
            </Button>
          </div>
        </nav>
      </Modal>
    </header>
  )
}
