import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { CookieBanner } from './components/CookieBanner'
import { brand, cases } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<{ slug?: string }>>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const ProductPage = page(() => import('./pages/ProductPage'), 'ProductPage')
const WhyUsPage = page(() => import('./pages/WhyUsPage'), 'WhyUsPage')
const CustomersPage = page(() => import('./pages/CustomersPage'), 'CustomersPage')
const CasePage = page(() => import('./pages/CasePage'), 'CasePage')
const IntegrationsPage = page(() => import('./pages/IntegrationsPage'), 'IntegrationsPage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const AboutPage = page(() => import('./pages/AboutPage'), 'AboutPage')
const DemoPage = page(() => import('./pages/DemoPage'), 'DemoPage')
const CookiesPage = page(() => import('./pages/CookiesPage'), 'CookiesPage')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table. Add a page with a line here and a link in `navLinks` or
  `footer` (src/content.ts).
*/
type Route = { path: string; title: string | ((p: Record<string, string>) => string | null); render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/product', title: 'Product', render: () => <ProductPage /> },
  { path: '/why-us', title: 'Why us', render: () => <WhyUsPage /> },
  { path: '/customers', title: 'Customers', render: () => <CustomersPage /> },
  { path: '/customers/:slug', title: (p) => cases.find((c) => c.slug === p.slug)?.company ?? null, render: (p) => <CasePage slug={p.slug} /> },
  { path: '/integrations', title: 'Integrations', render: () => <IntegrationsPage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage /> },
  { path: '/about', title: 'About us', render: () => <AboutPage /> },
  { path: '/demo', title: 'Book a demo', render: () => <DemoPage /> },
  { path: '/cookies', title: 'Cookie policy', render: () => <CookiesPage /> },
  { path: '/styleguide', title: 'Style guide', render: () => <StyleGuide /> },
]

function resolve(path: string) {
  for (const r of routes) {
    const params = match(r.path, path)
    if (!params) continue
    const title = typeof r.title === 'function' ? r.title(params) : r.title
    if (title === null) return null
    return { route: r, params, title }
  }
  return null
}

export function App() {
  const { path, hash } = useLocation()
  const hit = resolve(path)
  const main = useRef<HTMLElement>(null)
  const lastPath = useRef<string | null>(null)
  const title = hit ? hit.title : 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name}: ${brand.tagline.toLowerCase()}` : `${title} · ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target (after the page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    const initial = lastPath.current === null
    const samePage = lastPath.current === path
    lastPath.current = path
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      if (!(samePage && !hash)) scrollToHash(hash, !initial)
      if (!initial && !samePage && !hash) main.current?.focus({ preventScroll: true })
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  return (
    <>
      <a href="#main" className="sr-only rounded-[9px] bg-night px-4 py-2.5 text-[14px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90]">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>{hit ? hit.route.render(hit.params) : <NotFound />}</Suspense>
      </main>
      <Footer />
      <CookieBanner />
    </>
  )
}
