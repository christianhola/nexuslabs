import { Menu } from 'lucide-react'
import { useRef, useState } from 'react'

import { NAV, RESOURCES } from '@/content'
import { cn } from '@/lib/cn'
import { Link, useLocation } from '@/lib/router'
import { ButtonLink, IconButton } from './Button'
import { Drawer } from './Drawer'
import { Logo } from './Logo'
import { Popover } from './Popover'

const linkCls = 'relative rounded-full px-1 py-1 text-[15px] text-muted transition-colors duration-150 hover:text-fg'

export function SiteNav() {
  const [res, setRes] = useState(false)
  const [mobile, setMobile] = useState(false)
  const anchor = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  return (
    <header className="relative z-30 border-b border-line">
      <div className="mx-auto flex h-[70px] w-[min(1300px,calc(100%-40px))] items-center sm:w-[min(1300px,calc(100%-2*clamp(32px,9.4vw,150px)))]">
        <Link to="/" className="rounded-full py-1" aria-label="Clipwise home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[17px] lg:flex">
          {NAV.map((n) => (
            <Link key={n.label} to={n.to} className={cn(linkCls, pathname === n.to && 'text-fg')} aria-current={pathname === n.to ? 'page' : undefined}>
              {n.label === 'Agents' && <span className="absolute top-[19px] -left-1 h-[2px] w-[7px] animate-caret bg-ember" aria-hidden />}
              {n.label}
            </Link>
          ))}
          <button ref={anchor} type="button" className={cn(linkCls, 'inline-flex items-center gap-1', res && 'text-fg')} aria-expanded={res} aria-haspopup="dialog" onClick={() => setRes((v) => !v)}>
            Resources
          </button>
        </nav>
        <Popover open={res} onClose={() => setRes(false)} anchor={anchor} width={300} label="Resources">
          <ul>
            {RESOURCES.map((r) => (
              <li key={r.to}>
                <Link to={r.to} onClick={() => setRes(false)} className="block rounded-[10px] px-3 py-2.5 hover:bg-surface-2 focus-visible:bg-surface-2">
                  <span className="block text-sm font-medium">{r.label}</span>
                  <span className="block text-[13px] text-muted">{r.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Popover>
        <div className="ml-auto flex items-center gap-[14px]">
          <Link to="/app" className={cn(linkCls, 'hidden sm:inline-block')}>
            Log in
          </Link>
          <ButtonLink to="/app" variant="primary" size="sm" className="h-[34px] px-[13px] text-[15px] pointer-coarse:h-10">
            Sign up
          </ButtonLink>
          <IconButton label="Open menu" className="-mr-2 lg:hidden" onClick={() => setMobile(true)}>
            <Menu className="size-5" />
          </IconButton>
        </div>
      </div>
      <Drawer open={mobile} onClose={() => setMobile(false)} title="Menu">
        <nav aria-label="Mobile" className="flex flex-col p-3">
          {[...NAV, ...RESOURCES, { label: 'Log in', to: '/app' }].map((n) => (
            <Link key={n.label} to={n.to} onClick={() => setMobile(false)} className="rounded-[12px] px-3 py-3 text-[16px] text-muted hover:bg-surface-2 hover:text-fg">
              {n.label}
            </Link>
          ))}
        </nav>
      </Drawer>
    </header>
  )
}
