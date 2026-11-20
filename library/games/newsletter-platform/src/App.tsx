import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { ChatWidget } from './components/ChatWidget'
import { Toaster } from './components/Toast'
import { brand } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const EditorPage = page(() => import('./pages/EditorPage'), 'EditorPage')
const TemplatesPage = page(() => import('./pages/TemplatesPage'), 'TemplatesPage')
const AnalyticsPage = page(() => import('./pages/AnalyticsPage'), 'AnalyticsPage')
const MonetizePage = page(() => import('./pages/MonetizePage'), 'MonetizePage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const SignUpPage = page(() => import('./pages/FormPages'), 'SignUpPage')
const LogInPage = page(() => import('./pages/FormPages'), 'LogInPage')
const DemoPage = page(() => import('./pages/FormPages'), 'DemoPage')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/* The route table. Add a page with a line here and a link in src/content.ts. */
type Route = { path: string; title: string; render: () => ReactNode; chat?: boolean }
const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home />, chat: true },
  { path: '/editor', title: 'Editor', render: () => <EditorPage /> },
  { path: '/templates', title: 'Templates', render: () => <TemplatesPage />, chat: true },
  { path: '/analytics', title: 'Analytics', render: () => <AnalyticsPage /> },
  { path: '/monetize', title: 'Monetization', render: () => <MonetizePage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage />, chat: true },
  { path: '/signup', title: 'Sign up', render: () => <SignUpPage /> },
  { path: '/login', title: 'Log in', render: () => <LogInPage /> },
  { path: '/demo', title: 'Get a demo', render: () => <DemoPage />, chat: true },
  { path: '/styleguide', title: 'Style guide', render: () => <StyleGuide /> },
]

export function App() {
  const { path, hash } = useLocation()
  const hit = routes.find((r) => match(r.path, path))
  const main = useRef<HTMLElement>(null)
  const lastPath = useRef<string | null>(null)
  const title = hit ? hit.title : 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name}: ${brand.tagline.toLowerCase()}` : `${title} · ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target or the top, and move focus to
  // <main> so screen readers announce the new page.
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
      <a href="#main" className="sr-only rounded-[8px] bg-white px-4 py-2.5 text-[14px] font-semibold text-night focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>{hit ? hit.render() : <NotFound />}</Suspense>
      </main>
      <Footer />
      {hit?.chat ? <ChatWidget /> : null}
      <Toaster />
    </>
  )
}
