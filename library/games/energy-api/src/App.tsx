import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { brand } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const DocsPage = page(() => import('./pages/DocsPage'), 'DocsPage')
const DevicesPage = page(() => import('./pages/DevicesPage'), 'DevicesPage')
const UseCasesPage = page(() => import('./pages/UseCasesPage'), 'UseCasesPage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const ContactPage = page(() => import('./pages/ContactPage'), 'ContactPage')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table: a path pattern, a page title and the page. Add a page by
  adding a line here and a link in `nav` or `footer` (src/content.ts).
*/
type Route = { path: string; title: string; render: () => ReactNode }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/docs', title: 'Quickstart', render: () => <DocsPage /> },
  { path: '/devices', title: 'Device coverage', render: () => <DevicesPage /> },
  { path: '/use-cases', title: 'Use cases', render: () => <UseCasesPage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage /> },
  { path: '/contact', title: 'Talk to our team', render: () => <ContactPage /> },
  { path: '/styleguide', title: 'Style guide', render: () => <StyleGuide /> },
]

function resolve(path: string) {
  for (const r of routes) if (match(r.path, path)) return r
  return null
}

export function App() {
  const { path, hash } = useLocation()
  const hit = resolve(path)
  const main = useRef<HTMLElement>(null)
  const lastPath = useRef<string | null>(null)
  const title = hit?.title ?? 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name}: the API for home energy devices` : `${title} · ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target (after a lazy page mounts) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    const isFirst = lastPath.current === null
    const pathChanged = !isFirst && lastPath.current !== path
    lastPath.current = path
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      scrollToHash(hash, !isFirst)
      if (pathChanged && !hash) main.current?.focus({ preventScroll: true })
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-pill bg-ink px-4 py-2.5 text-[14px] font-medium text-mint focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90]"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>{hit ? hit.render() : <NotFound />}</Suspense>
      </main>
      <Footer />
    </>
  )
}
