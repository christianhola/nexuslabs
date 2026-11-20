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
const SendPage = page(() => import('./pages/SendPage'), 'SendPage')
const CheckoutPage = page(() => import('./pages/CheckoutPage'), 'CheckoutPage')
const DevelopersPage = page(() => import('./pages/DevelopersPage'), 'DevelopersPage')
const SecurityPage = page(() => import('./pages/SecurityPage'), 'SecurityPage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const CustomersPage = page(() => import('./pages/CustomersPage'), 'CustomersPage')
const SignUpPage = page(() => import('./pages/SignUpPage'), 'SignUpPage')
const LogInPage = page(() => import('./pages/LogInPage'), 'LogInPage')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table: a path pattern, a page title and the page. Add a page by
  adding a line here and a link in `nav` or `footer` (src/content.ts).
*/
type Route = { path: string; title: string; render: () => ReactNode; chrome?: boolean }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/send', title: 'Send money', render: () => <SendPage /> },
  { path: '/checkout', title: 'Checkout', render: () => <CheckoutPage /> },
  { path: '/developers', title: 'Developer docs', render: () => <DevelopersPage /> },
  { path: '/security', title: 'Security', render: () => <SecurityPage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage /> },
  { path: '/customers', title: 'Customers', render: () => <CustomersPage /> },
  { path: '/signup', title: 'Open an account', render: () => <SignUpPage /> },
  { path: '/login', title: 'Log in', render: () => <LogInPage /> },
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
  // The last path we handled; null until the first render. Comparing paths
  // (not a 'first run' flag) keeps StrictMode's double effect from stealing focus.
  const lastPath = useRef<string | null>(null)
  const title = hit?.title ?? 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name}: payments and global transfers` : `${title} · ${brand.name}`
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
        className="sr-only rounded-control-sm bg-navy px-4 py-2.5 text-[14px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90]"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen bg-mist" />}>{hit ? hit.render() : <NotFound />}</Suspense>
      </main>
      <Footer />
    </>
  )
}
