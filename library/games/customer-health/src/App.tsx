import { useCallback, useEffect, useRef, useState } from 'react'

import { Footer } from './app/Footer'
import { Header } from './app/Header'
import { MobileNav } from './app/MobileNav'
import { ShortcutsHelp } from './app/ShortcutsHelp'
import { TemplateGuide } from './app/TemplateGuide'
import { TopNav } from './app/TopNav'
import { ToastProvider, useToast } from './components/Toast'
import { copy, type Range } from './data'
import { useHotkeys } from './lib/hotkeys'
import { match, navigate, usePath, useRouteEffects, type Route } from './lib/router'
import { StoreProvider, useStore } from './lib/store'
import { useTheme } from './lib/theme'
import { AccountDetail } from './pages/AccountDetail'
import { Accounts } from './pages/Accounts'
import { NotFound } from './pages/NotFound'
import { Overview } from './pages/Overview'
import { Playbooks } from './pages/Playbooks'
import { Renewals } from './pages/Renewals'
import { Settings } from './pages/Settings'
import { StyleGuide } from './pages/StyleGuide'

function titleFor(route: Route, name?: string) {
  const page =
    route.name === 'overview'
      ? null
      : route.name === 'account'
        ? (name ?? 'Account')
        : route.name === 'not-found'
          ? 'Not found'
          : route.name === 'styleguide'
            ? 'Style guide'
            : route.name[0]!.toUpperCase() + route.name.slice(1)
  return page ? `${page} · ${copy.title}` : copy.title
}

function Page({ route }: { route: Route }) {
  switch (route.name) {
    case 'overview':
      return <Overview />
    case 'accounts':
      return <Accounts />
    case 'account':
      return <AccountDetail id={route.id} />
    case 'renewals':
      return <Renewals />
    case 'playbooks':
      return <Playbooks />
    case 'settings':
      return <Settings />
    case 'styleguide':
      return <StyleGuide />
    default:
      return <NotFound />
  }
}

function Shell() {
  const { theme, toggle } = useTheme()
  const { accounts, byId, setRange } = useStore()
  const toast = useToast()
  const path = usePath()
  const route = match(path)
  const [guideOpen, setGuideOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useRouteEffects(path, titleFor(route, route.name === 'account' ? byId(route.id)?.name : undefined))

  // Move focus to the new page's title after client-side navigation (not on first load).
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const t = window.setTimeout(() => {
      // Leave focus alone if something on the new page already took it (e.g. "/" focusing search).
      const a = document.activeElement
      if (a && a !== document.body && a.closest('main') && a.matches('input,textarea,select')) return
      document.querySelector<HTMLElement>('[data-page-title]')?.focus({ preventScroll: true })
    }, 60)
    return () => window.clearTimeout(t)
  }, [path])

  const range = (r: Range) => {
    setRange(r)
    toast.show({ tone: 'info', title: `Comparing with ${r} weeks ago` })
  }
  useHotkeys({
    'g o': () => navigate('/'),
    'g a': () => navigate('/accounts'),
    'g r': () => navigate('/renewals'),
    'g p': () => navigate('/playbooks'),
    'g s': () => navigate('/settings'),
    '/': () => {
      if (match(window.location.pathname).name !== 'accounts') navigate('/accounts')
      window.setTimeout(() => document.getElementById('account-search')?.focus(), 160)
    },
    '1': () => range(4),
    '2': () => range(8),
    '3': () => range(13),
    t: toggle,
    '?': () => setHelpOpen((o) => !o),
  })

  const closeGuide = useCallback(() => setGuideOpen(false), [])
  const closeHelp = useCallback(() => setHelpOpen(false), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <div className="flex min-h-dvh flex-col bg-bg text-fg">
      <a href="#main" className="caps fixed top-3 left-3 z-[70] pointer-events-none inline-flex min-h-10 -translate-y-16 items-center rounded-full bg-fg px-4 py-2.5 text-[11px] text-bg opacity-0 transition-[translate,opacity] focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100">
        Skip to content
      </a>
      <div className="mx-auto w-full max-w-[1304px] px-4 pt-4 sm:px-8 sm:pt-5">
        <TopNav path={path} onOpenMenu={() => setMenuOpen(true)} onOpenShortcuts={() => setHelpOpen(true)} />
      </div>
      <main id="main" className="mx-auto w-full max-w-[1304px] flex-1 px-4 pt-7 pb-16 sm:px-8 sm:pt-[30px] sm:pb-24">
        <Header count={accounts.length} arr={accounts.reduce((s, a) => s + a.arr, 0)} theme={theme} onToggleTheme={toggle} onOpenGuide={() => setGuideOpen(true)} />
        <div className={route.name === 'overview' ? '' : 'mt-10 sm:mt-12'}>
          <Page route={route} />
        </div>
      </main>
      <Footer onOpenShortcuts={() => setHelpOpen(true)} onOpenGuide={() => setGuideOpen(true)} />

      <TemplateGuide open={guideOpen} onClose={closeGuide} />
      <ShortcutsHelp open={helpOpen} onClose={closeHelp} />
      <MobileNav open={menuOpen} onClose={closeMenu} path={path} />
    </div>
  )
}

export function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <Shell />
      </StoreProvider>
    </ToastProvider>
  )
}
