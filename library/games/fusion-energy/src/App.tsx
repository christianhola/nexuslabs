import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { brand, jobs, posts } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<{ slug?: string }>>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })))
const Technology = page(() => import('./pages/Technology'), 'Technology')
const Applications = page(() => import('./pages/Applications'), 'Applications')
const Company = page(() => import('./pages/Company'), 'Company')
const Careers = page(() => import('./pages/Careers'), 'Careers')
const Job = page(() => import('./pages/Job'), 'Job')
const News = page(() => import('./pages/News'), 'News')
const Article = page(() => import('./pages/Article'), 'Article')
const EarlyAccess = page(() => import('./pages/EarlyAccess'), 'EarlyAccess')
const Contact = page(() => import('./pages/Contact'), 'Contact')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table. Add a page by adding a line here and a link in `nav`
  (src/content.ts).
*/
type Params = Record<string, string>
type Route = { path: string; title: string | ((p: Params) => string | null); render: (p: Params) => ReactNode }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/technology', title: 'Technology', render: () => <Technology /> },
  { path: '/applications', title: 'Applications', render: () => <Applications /> },
  { path: '/company', title: 'Company', render: () => <Company /> },
  { path: '/careers', title: 'Careers', render: () => <Careers /> },
  { path: '/careers/:slug', title: (p) => jobs.find((j) => j.slug === p.slug)?.title ?? null, render: (p) => <Job slug={p.slug} /> },
  { path: '/news', title: 'News', render: () => <News /> },
  { path: '/news/:slug', title: (p) => posts.find((x) => x.slug === p.slug)?.title ?? null, render: (p) => <Article slug={p.slug} /> },
  { path: '/early-access', title: 'Early access', render: () => <EarlyAccess /> },
  { path: '/contact', title: 'Contact', render: () => <Contact /> },
  { path: '/styleguide', title: 'Style guide', render: () => <StyleGuide /> },
]

function resolve(path: string) {
  for (const r of routes) {
    const params = match(r.path, path)
    if (!params) continue
    const title = typeof r.title === 'function' ? r.title(params) : r.title
    // A detail route whose record does not exist is a 404.
    if (title === null) return null
    return { route: r, params, title }
  }
  return null
}

export function App() {
  const { path, hash } = useLocation()
  const hit = resolve(path)
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const title = hit ? hit.title : 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name}: maritime fusion power` : `${title} | ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target (after the page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    // Read and clear `first` inside the frame: StrictMode runs this effect
    // twice on mount and cancels the first frame, so the page load still
    // counts as first and focus is not pulled into <main>.
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      const isFirst = first.current
      first.current = false
      scrollToHash(hash, !isFirst)
      if (!isFirst && !hash) main.current?.focus({ preventScroll: true })
    }
    raf = requestAnimationFrame(run)
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-control bg-white px-5 py-2.5 text-[14px] font-medium text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]"
      >
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
