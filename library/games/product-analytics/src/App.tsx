import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { brand, docs } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<{ slug?: string }>>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const FeaturesPage = page(() => import('./pages/FeaturesPage'), 'FeaturesPage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const DocsPage = page(() => import('./pages/DocsPage'), 'DocsPage')
const ChangelogPage = page(() => import('./pages/ChangelogPage'), 'ChangelogPage')
const StatusPage = page(() => import('./pages/StatusPage'), 'StatusPage')
const ContactPage = page(() => import('./pages/ContactPage'), 'ContactPage')
const SignUpPage = page(() => import('./pages/SignUpPage'), 'SignUpPage')
const LogInPage = page(() => import('./pages/LogInPage'), 'LogInPage')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table. Add a page with a line here and a link in `nav` or
  `footer` (src/content.ts).
*/
type Route = { path: string; title: string | ((p: Record<string, string>) => string | null); render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/features', title: 'Features', render: () => <FeaturesPage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage /> },
  { path: '/docs', title: 'Docs', render: () => <DocsPage /> },
  { path: '/docs/:slug', title: (p) => docs.find((d) => d.slug === p.slug)?.title ?? null, render: (p) => <DocsPage slug={p.slug} /> },
  { path: '/changelog', title: 'Changelog', render: () => <ChangelogPage /> },
  { path: '/status', title: 'Status', render: () => <StatusPage /> },
  { path: '/contact', title: 'Talk to us', render: () => <ContactPage /> },
  { path: '/signup', title: 'Start for free', render: () => <SignUpPage /> },
  { path: '/login', title: 'Log in', render: () => <LogInPage /> },
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
    document.title = title === brand.name ? `${brand.name}: product analytics` : `${title} · ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target (after the page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    // Compare paths rather than counting runs, so StrictMode's double effect
    // in development does not steal focus on the first load.
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
      <a href="#main" className="sr-only rounded-full bg-night px-4 py-2.5 text-[14px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]">
        Skip to content
      </a>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" />}>{hit ? hit.route.render(hit.params) : <NotFound />}</Suspense>
      </main>
      <Footer />
    </>
  )
}
