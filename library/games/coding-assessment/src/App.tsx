import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { ToastProvider } from './components/Toast'
import { WorkspaceBar } from './components/WorkspaceBar'
import { BRAND } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<never>>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] as ComponentType<Record<string, string>> })))
const Demo = page(() => import('./pages/Demo'), 'Demo')
const Reports = page(() => import('./pages/Reports'), 'Reports')
const Report = page(() => import('./pages/Report'), 'Report')
const Library = page(() => import('./pages/Library'), 'Library')
const Assessments = page(() => import('./pages/Assessments'), 'Assessments')
const Pricing = page(() => import('./pages/Pricing'), 'Pricing')
const RequestDemo = page(() => import('./pages/RequestDemo'), 'RequestDemo')
const Signup = page(() => import('./pages/Signup'), 'Signup')
const Developers = page(() => import('./pages/Developers'), 'Developers')
const Styleguide = page(() => import('./pages/Styleguide'), 'Styleguide')

/*
  The route table. `layout` picks the frame: the marketing site (nav and
  footer), the hiring workspace (site nav plus the workspace bar), or bare
  (the challenge and sign-up bring their own chrome).
*/
type Route = { path: string; title: (p: Record<string, string>) => string; layout: 'site' | 'app' | 'bare'; render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: () => '', layout: 'site', render: () => <Home /> },
  { path: '/demo', title: () => 'Sample challenge', layout: 'bare', render: () => <Demo /> },
  { path: '/reports', title: () => 'Candidates', layout: 'app', render: () => <Reports /> },
  { path: '/reports/:id', title: () => 'Candidate report', layout: 'app', render: (p) => <Report id={p.id!} /> },
  { path: '/library', title: () => 'Question library', layout: 'app', render: () => <Library /> },
  { path: '/assessments', title: () => 'Assessments', layout: 'app', render: () => <Assessments /> },
  { path: '/pricing', title: () => 'Pricing', layout: 'site', render: () => <Pricing /> },
  { path: '/request-demo', title: () => 'Request demo', layout: 'site', render: () => <RequestDemo /> },
  { path: '/signup', title: () => 'Sign up', layout: 'bare', render: () => <Signup /> },
  { path: '/developers', title: () => 'For developers', layout: 'site', render: () => <Developers /> },
  { path: '/styleguide', title: () => 'Style guide', layout: 'site', render: () => <Styleguide /> },
]

const Blank = () => <div className="min-h-screen" aria-busy="true" />

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
  const title = hit ? hit.title(params) : 'Page not found'

  useEffect(() => {
    document.title = title ? `${title} | ${BRAND.name}` : `${BRAND.name}: ${BRAND.tagline}`
  }, [title])

  // On navigation: jump to the hash target (once the lazy page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    // A ref of the last path (not a first-run flag) so StrictMode's double effect does not steal focus on load.
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
      if (!isFirst && !hash) (main.current ?? document.getElementById('main'))?.focus({ preventScroll: true })
    }
    run()
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  let body: ReactNode
  if (hit?.layout === 'bare') {
    body = <Suspense fallback={<Blank />}>{hit.render(params)}</Suspense>
  } else {
    body = (
      <>
        <a href="#main" className="sr-only z-50 rounded-lg bg-brand px-4 py-2 text-on-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          Skip to content
        </a>
        <Nav overlay={path === '/'} />
        {hit?.layout === 'app' && <WorkspaceBar />}
        <main id="main" ref={main} tabIndex={-1} className="min-h-[60vh] outline-none">
          <Suspense fallback={<Blank />}>{hit ? hit.render(params) : <NotFound />}</Suspense>
        </main>
        <Footer />
      </>
    )
  }

  return <ToastProvider>{body}</ToastProvider>
}
