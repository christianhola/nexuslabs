import { useState, type ReactNode } from 'react'
import { Bell, BookOpen, Menu } from 'lucide-react'

import { Avatar } from '../components/Avatar'
import { Button, IconButton } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { Logo } from '../components/Logo'
import { Popover } from '../components/Popover'
import { ME, offices, people } from '../data'
import { cn } from '../lib/cn'
import { timeAgo } from '../lib/dates'
import { Link } from '../lib/router'
import { useActions, useAppState } from '../lib/store'
import { adminNav, nav, type NavItem } from './nav'

/**
  Sidebar + main column. In the landing mock (`embedded`) it shows only the
  reference sidebar and no top-right controls, and links do nothing.
*/
export function AppShell({ path, children, embedded }: { path: string; children: ReactNode; embedded?: boolean }) {
  const [drawer, setDrawer] = useState(false)
  const items = embedded ? nav.filter((n) => n.reference) : nav
  return (
    <div className={cn('flex bg-canvas', embedded ? 'h-full' : 'min-h-dvh')}>
      <aside
        className={cn(
          'w-[182px] shrink-0 flex-col border-r border-line bg-surface',
          embedded ? 'flex' : 'sticky top-0 hidden h-dvh lg:flex lg:w-[220px]',
        )}
      >
        <SidebarBody items={items} path={path} embedded={embedded} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {!embedded && (
          <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-surface/90 px-3 backdrop-blur lg:hidden">
            <IconButton label="Open menu" onClick={() => setDrawer(true)} aria-expanded={drawer}>
              <Menu className="size-5" />
            </IconButton>
            <Link href="/" aria-label="DeskFlow home" className="inline-flex min-h-10 items-center rounded-sm">
              <Logo size={15} />
            </Link>
            <div className="ml-auto">
              <Notifications />
            </div>
          </header>
        )}
        <main id="main" className={cn('relative min-w-0 flex-1', embedded ? 'px-[23px] pt-[27px]' : 'px-4 pt-5 pb-28 sm:px-6 lg:px-8 lg:pt-7 lg:pb-12')}>
          {!embedded && (
            <div className="absolute top-6 right-8 hidden items-center gap-1 lg:flex">
              <Notifications />
            </div>
          )}
          {children}
        </main>
      </div>

      {!embedded && (
        <Dialog open={drawer} onClose={() => setDrawer(false)} title="Menu" side="left">
          <div className="-mx-5 -mt-2 flex h-full flex-col">
            <SidebarBody items={items} path={path} onNavigate={() => setDrawer(false)} hideLogo />
          </div>
        </Dialog>
      )}
    </div>
  )
}

function SidebarBody({ items, path, embedded, onNavigate, hideLogo }: { items: NavItem[]; path: string; embedded?: boolean; onNavigate?: () => void; hideLogo?: boolean }) {
  const { profile } = useAppState()
  const me = people.find((p) => p.id === ME)!
  return (
    <>
      {!hideLogo && (
        <div className="px-[18px] pt-[16px] pb-[17px]">
          {embedded ? (
            <Logo size={15} />
          ) : (
            <Link href="/" aria-label="DeskFlow home" className="inline-block rounded-sm">
              <Logo size={15} />
            </Link>
          )}
        </div>
      )}
      <nav aria-label="App" className="grid gap-[4px] px-[14px]">
        {items.map((item) => (
          <NavLink key={item.path} item={item} active={path === item.path} embedded={embedded} onNavigate={onNavigate} />
        ))}
      </nav>
      {!embedded && (
        <>
          <p className="mt-6 px-[22px] pb-1.5 text-2xs font-semibold tracking-wider text-faint uppercase">Admin</p>
          <nav aria-label="Admin" className="grid gap-[4px] px-[14px]">
            {adminNav.map((item) => (
              <NavLink key={item.path} item={item} active={path === item.path} onNavigate={onNavigate} />
            ))}
          </nav>
          <div className="mt-auto grid gap-1 border-t border-line-soft p-3">
            <Link
              href="/styleguide"
              onClick={onNavigate}
              className="flex h-9 items-center gap-2 rounded-sm px-2 text-xs font-medium text-muted hover:bg-subtle hover:text-fg"
            >
              <BookOpen className="size-3.5" aria-hidden /> Style guide
            </Link>
            <div className="flex items-center gap-2.5 rounded-sm px-2 py-1.5">
              <Avatar person={{ ...me, name: profile.name }} size={30} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg">{profile.name}</p>
                <p className="truncate text-xs text-muted">
                  {profile.team} · {offices.find((o) => o.id === profile.officeId)?.name}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

function NavLink({ item, active, embedded, onNavigate }: { item: NavItem; active: boolean; embedded?: boolean; onNavigate?: () => void }) {
  const Icon = item.icon
  const cls = cn(
    'relative flex h-[30px] items-center gap-[10px] rounded-[4px] px-[11px] text-sm transition-colors duration-150',
    !embedded && 'max-lg:h-10',
    active ? 'bg-subtle font-medium text-fg' : 'text-muted hover:bg-canvas hover:text-fg',
  )
  const body = (
    <>
      <Icon aria-hidden className="size-[15px] shrink-0" strokeWidth={1.75} />
      {item.label}
    </>
  )
  if (embedded) return <span className={cls}>{body}</span>
  return (
    <Link href={item.path} aria-current={active ? 'page' : undefined} className={cls} onClick={onNavigate}>
      {body}
    </Link>
  )
}

function Notifications() {
  const { notices } = useAppState()
  const { markAllRead, markRead } = useActions()
  const unread = notices.filter((n) => !n.read).length
  return (
    <Popover
      label="Notifications"
      trigger={(p) => (
        <IconButton label={unread ? `Notifications, ${unread} unread` : 'Notifications'} {...p}>
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] leading-4 font-bold text-white animate-pop">
              {unread}
            </span>
          )}
        </IconButton>
      )}
    >
      {() => (
        <div>
          <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <p className="text-sm font-semibold text-fg">Notifications</p>
            <Button variant="ghost" size="xs" disabled={!unread} onClick={markAllRead} className="-mr-2 h-8 text-brand">
              Mark all read
            </Button>
          </div>
          {notices.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">You’re all caught up.</p>
          ) : (
            <ul className="max-h-[360px] overflow-y-auto py-1">
              {notices.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="flex w-full gap-3 px-4 py-2.5 text-left hover:bg-canvas"
                  >
                    <span aria-hidden className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-bright')} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-fg">
                        {n.title}
                        {!n.read && <span className="sr-only"> (unread)</span>}
                      </span>
                      <span className="block text-xs text-muted">{n.body}</span>
                      <span className="mt-0.5 block text-2xs text-faint">{timeAgo(n.at)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Popover>
  )
}

/** Page heading used by every screen except the dashboard greeting. */
export function PageHeader({ title, sub, actions }: { title: string; sub?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3 lg:pr-14">
      <div className="min-w-0">
        <h1 className="text-[20px] leading-7 font-bold tracking-[-0.02em] text-ink">{title}</h1>
        {sub && <p className="mt-0.5 text-xs text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
