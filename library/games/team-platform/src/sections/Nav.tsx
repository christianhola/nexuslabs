import { Check, Menu } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button, IconButton } from '../components/Button'
import { Container } from '../components/Container'
import { Dialog } from '../components/Dialog'
import { Dropdown } from '../components/Dropdown'
import { Icon } from '../components/Icon'
import { Logo } from '../components/Logo'
import { languages, navLinks, productMenu } from '../content'
import { cx } from '../lib/cx'
import { useLang } from '../lib/lang'
import { isCurrent, Link, useLocation } from '../lib/router'

const linkCls = 'rounded-[8px] px-2.5 py-2 text-[15px] text-body transition-colors hover:text-ink hover:bg-ink/[0.04] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ink aria-[current=page]:text-ink aria-[current=page]:font-medium'

export function Nav() {
  const { path } = useLocation()
  const { lang, t, setLang } = useLang()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [path])

  const langLabel = languages.find((l) => l.code === lang)?.label ?? 'English'

  return (
    <header className={cx('sticky top-0 z-50 bg-page/95 backdrop-blur transition-shadow duration-200', scrolled && 'shadow-[0_1px_0_var(--color-line)]')}>
      <Container className="flex h-[76px] items-center gap-6 lg:h-[100px]">
        <Link href="/" aria-label="Branchwork home" className="-ml-1 rounded-[8px] p-1 focus-visible:outline-2 focus-visible:outline-ink">
          <Logo />
        </Link>
        <nav aria-label="Main" className="ml-10 hidden items-center gap-3 lg:flex">
          <Dropdown label={t.product} triggerClassName={cx(linkCls, path === '/product' && 'text-ink font-medium')} panelClassName="w-[560px]">
            {(close) => (
              <div className="grid grid-cols-2 gap-1">
                {productMenu.map((p) => (
                  <Link key={p.href} href={p.href} onClick={close} className="flex gap-3 rounded-[12px] p-3 transition-colors hover:bg-mist focus-visible:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border-[1.5px] border-ink bg-card text-ink">
                      <Icon name={p.icon} className="size-[18px]" />
                    </span>
                    <span>
                      <span className="block text-[15px] font-medium text-ink">{p.label}</span>
                      <span className="block text-[13.5px] leading-snug text-muted">{p.description}</span>
                    </span>
                  </Link>
                ))}
                <Link href="/product" onClick={close} className="col-span-2 mt-1 rounded-[12px] bg-mist px-3 py-2.5 text-[14px] font-medium text-ink hover:bg-mist-2 focus-visible:outline-2 focus-visible:outline-ink">
                  See the whole product →
                </Link>
              </div>
            )}
          </Dropdown>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={linkCls} aria-current={isCurrent(l.href, path) ? 'page' : undefined}>
              {t.nav[l.href] ?? l.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <Button href="/demo" variant="soft" className="hidden h-[42px] px-[18px] text-[15px] sm:inline-flex">
            {t.bookDemo}
          </Button>
          <span className="hidden h-8 w-px bg-line lg:block" aria-hidden />
          <div className="hidden lg:block">
            <Dropdown label={langLabel} ariaLabel={`Language: ${langLabel}`} align="right" triggerClassName={cx(linkCls, 'gap-3 pl-3')} panelClassName="w-48">
              {(close) => (
                <ul>
                  {languages.map((l) => (
                    <li key={l.code}>
                      <button
                        type="button"
                        lang={l.code}
                        aria-pressed={l.code === lang}
                        onClick={() => {
                          setLang(l.code)
                          close()
                        }}
                        className="flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[15px] text-body hover:bg-mist focus-visible:bg-mist focus-visible:outline-2 focus-visible:outline-ink aria-pressed:font-medium aria-pressed:text-ink"
                      >
                        {l.label}
                        {l.code === lang ? <Check className="size-4 text-leaf" aria-hidden /> : null}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Dropdown>
          </div>
          <IconButton label="Open menu" tone="soft" className="lg:hidden" onClick={() => setOpen(true)} aria-expanded={open}>
            <Menu aria-hidden />
          </IconButton>
        </div>
      </Container>

      <Dialog open={open} onClose={() => setOpen(false)} title="Menu" side="right">
        <nav aria-label="Mobile" className="flex flex-col">
          <p className="px-1 pb-2 text-[13px] font-medium text-faint">{t.product}</p>
          {productMenu.map((p) => (
            <Link key={p.href} href={p.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-[10px] px-1 py-2.5 text-[16px] text-ink hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
              <Icon name={p.icon} className="size-[18px]" />
              {p.label}
            </Link>
          ))}
          <div className="my-3 border-t border-line" />
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={isCurrent(l.href, path) ? 'page' : undefined} className="rounded-[10px] px-1 py-3 text-[17px] font-medium text-ink hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
              {t.nav[l.href] ?? l.label}
            </Link>
          ))}
          <Link href="/about" onClick={() => setOpen(false)} className="rounded-[10px] px-1 py-3 text-[17px] font-medium text-ink hover:bg-mist focus-visible:outline-2 focus-visible:outline-ink">
            About us
          </Link>
          <div className="my-3 border-t border-line" />
          <p className="px-1 pb-2 text-[13px] font-medium text-faint">Language</p>
          <div className="grid grid-cols-2 gap-2">
            {languages.map((l) => (
              <button key={l.code} type="button" lang={l.code} aria-pressed={l.code === lang} onClick={() => setLang(l.code)} className="h-11 rounded-[10px] border border-line text-[15px] text-body aria-pressed:border-ink aria-pressed:bg-mint-soft aria-pressed:font-medium aria-pressed:text-ink focus-visible:outline-2 focus-visible:outline-ink">
                {l.label}
              </button>
            ))}
          </div>
          <Button href="/demo" className="mt-6 w-full" size="lg" onClick={() => setOpen(false)}>
            {t.bookDemo}
          </Button>
        </nav>
      </Dialog>
    </header>
  )
}
