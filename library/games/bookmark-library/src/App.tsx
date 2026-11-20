import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { ToastProvider } from './components/Toast'
import { BRAND } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string, P = object>(load: () => Promise<Record<K, ComponentType<P>>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const Pricing = page(() => import('./pages/Pricing'), 'Pricing')
const Waitlist = page(() => import('./pages/Waitlist'), 'Waitlist')
const Styleguide = page(() => import('./pages/Styleguide'), 'Styleguide')
const AppShell = lazy(() => import('./pages/app/AppShell').then((m) => ({ default: m.AppShell })))
const LibraryPage = page(() => import('./pages/app/Library'), 'LibraryPage')
const TodayPage = page(() => import('./pages/app/Library'), 'TodayPage')
const FavouritesPage = page(() => import('./pages/app/Library'), 'FavouritesPage')
const CollectionPage = page<'CollectionPage', { id: string }>(() => import('./pages/app/Collection'), 'CollectionPage')
const ItemDetailPage = page<'ItemDetailPage', { id: string }>(() => import('./pages/app/ItemDetail'), 'ItemDetailPage')

type Route = { path: string; title: string; layout: 'site' | 'app'; render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: '', layout: 'site', render: () => <Home /> },
  { path: '/pricing', title: 'Pricing', layout: 'site', render: () => <Pricing /> },
  { path: '/waitlist', title: 'You are on the list', layout: 'site', render: () => <Waitlist /> },
  { path: '/styleguide', title: 'Style guide', layout: 'site', render: () => <Styleguide /> },
  { path: '/app', title: 'My shelf', layout: 'app', render: () => <LibraryPage /> },
  { path: '/app/today', title: 'Today', layout: 'app', render: () => <TodayPage /> },
  { path: '/app/favourites', title: 'Favourites', layout: 'app', render: () => <FavouritesPage /> },
  { path: '/app/c/:id', title: 'Collection', layout: 'app', render: (p) => <CollectionPage id={p.id} /> },
  { path: '/app/item/:id', title: 'Save', layout: 'app', render: (p) => <ItemDetailPage id={p.id} /> },
]

const Blank = () => <div className="min-h-[60vh]" aria-busy="true" />

export function App() {
  const { path, hash } = useLocation()
  let params: Record<string, string> = {}
  const hit = routes.find((r) => {
    const m = match(r.path, path)
    if (m) params = m
    return !!m
  })
  const main = useRef<HTMLElement>(null)
  const last = useRef<string | null>(null)
  const title = hit ? hit.title : 'Page not found'

  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name}: ${BRAND.tagline}`
  }, [title, path])

  // On navigation: jump to the hash target (once the lazy page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    // Compare with the last location rather than a "first render" flag, so
    // StrictMode's double effect run does not steal focus on load.
    const key = path + hash
    const isFirst = last.current === null || last.current === key
    last.current = key
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      scrollToHash(hash, !isFirst)
      if (!isFirst && !hash) (main.current ?? document.getElementById('app-main'))?.focus({ preventScroll: true })
    }
    run()
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  let body: ReactNode
  if (hit?.layout === 'app') {
    body = (
      <Suspense fallback={<Blank />}>
        <AppShell>
          <Suspense fallback={<Blank />}>{hit.render(params)}</Suspense>
        </AppShell>
      </Suspense>
    )
  } else {
    body = (
      <div className="min-h-screen bg-canvas lg:px-3 lg:pt-3">
        <div className="min-h-screen overflow-x-clip bg-paper lg:rounded-t-[22px]">
          <a href="#main" className="sr-only z-50 rounded-sm bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3">
            Skip to content
          </a>
          <Nav />
          <main id="main" ref={main} tabIndex={-1} className="outline-none">
            <Suspense fallback={<Blank />}>{hit ? hit.render(params) : <NotFound />}</Suspense>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return <ToastProvider>{body}</ToastProvider>
}
