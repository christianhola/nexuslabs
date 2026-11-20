import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronDown, Menu } from 'lucide-react'

import { ButtonLink, IconButton } from '../components/Button'
import { Drawer } from '../components/Drawer'
import { Logo } from '../components/Logo'
import { NAV, NAV_ACTIONS, PRODUCT_MENU } from '../content'
import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'

/** Site header. Over the hero it is transparent; elsewhere it turns solid once you scroll. */
export function Nav({ overlay = false }: { overlay?: boolean }) {
  const { path } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => setMobile(false), [path])

  const link = 'rounded-lg px-1 py-2 text-[16px] text-[#b4c2bf] transition-colors hover:text-white aria-[current=page]:text-white'

  return (
    <header className={cx('sticky top-0 z-40 transition-[background-color,backdrop-filter] duration-300', overlay && !scrolled ? 'bg-transparent' : 'bg-bg/80 backdrop-blur-xl')}>
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-8 border-b border-white/7 px-4 sm:px-6 lg:px-10">
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          <ProductsMenu />
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={link} aria-current={isCurrent(n.href, path) && !n.href.includes('#') ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-3 lg:flex">
          <Link href={NAV_ACTIONS.developers.href} className="mr-4 inline-flex items-center gap-1.5 rounded-lg py-2 text-[14.5px] text-[#dfe7e4] hover:text-white">
            {NAV_ACTIONS.developers.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
          <ButtonLink href={NAV_ACTIONS.demo.href} variant="secondary" size="sm" className="h-[34px] px-3.5 text-[14px]">
            {NAV_ACTIONS.demo.label}
          </ButtonLink>
          <ButtonLink href={NAV_ACTIONS.signup.href} variant="primary" size="sm" className="h-[34px] px-3.5 text-[14px]">
            {NAV_ACTIONS.signup.label}
          </ButtonLink>
        </div>
        <IconButton label="Open menu" className="ml-auto lg:hidden" onClick={() => setMobile(true)} aria-expanded={mobile}>
          <Menu className="size-5" />
        </IconButton>
      </div>
      <Drawer open={mobile} onClose={() => setMobile(false)} title="Menu" footer={
        <div className="grid grid-cols-2 gap-2">
          <ButtonLink href={NAV_ACTIONS.demo.href} variant="secondary">{NAV_ACTIONS.demo.label}</ButtonLink>
          <ButtonLink href={NAV_ACTIONS.signup.href}>{NAV_ACTIONS.signup.label}</ButtonLink>
        </div>
      }>
        <nav aria-label="Mobile" className="grid gap-1">
          <p className="px-3 pb-1 text-[13px] text-faint">Products</p>
          {PRODUCT_MENU.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-[12px] px-3 py-2.5 hover:bg-white/5" aria-current={isCurrent(n.href, path) ? 'page' : undefined}>
              <span className="block text-[16px] text-fg">{n.label}</span>
              <span className="block text-[13.5px] text-muted">{n.description}</span>
            </Link>
          ))}
          <div className="my-3 h-px bg-line" />
          {[...NAV, NAV_ACTIONS.developers].map((n) => (
            <Link key={n.href + n.label} href={n.href} className="flex min-h-11 items-center rounded-[12px] px-3 text-[16px] text-fg hover:bg-white/5">
              {n.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  )
}

function ProductsMenu() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)
  const { path } = useLocation()
  useEffect(() => setOpen(false), [path])
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        btn.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const active = PRODUCT_MENU.some((m) => isCurrent(m.href, path))
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button ref={btn} type="button" aria-expanded={open} aria-controls="products-menu" onClick={() => setOpen((o) => !o)} className={cx('inline-flex items-center gap-1 rounded-lg px-1 py-2 text-[16px] transition-colors hover:text-white', active || open ? 'text-white' : 'text-[#b4c2bf]')}>
        Products
        <ChevronDown aria-hidden className={cx('size-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div id="products-menu" className="depth absolute top-full left-[-16px] mt-3 w-[380px] animate-pop rounded-[18px] bg-surface/95 p-2 shadow-float backdrop-blur-xl">
          {PRODUCT_MENU.map((m) => (
            <Link key={m.href} href={m.href} className="block rounded-[12px] px-3.5 py-3 transition-colors hover:bg-white/6 focus-visible:bg-white/6" aria-current={isCurrent(m.href, path) ? 'page' : undefined}>
              <span className="block text-[15.5px] text-fg">{m.label}</span>
              <span className="mt-0.5 block text-[13.5px] text-muted">{m.description}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
