import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { brand, caseStudies, posts } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<{ slug?: string }>>>, name: K) => lazy(() => load().then((m) => ({ default: m[name] })))
const Features = page(() => import('./pages/Features'), 'Features')
const Pricing = page(() => import('./pages/Pricing'), 'Pricing')
const Customers = page(() => import('./pages/Customers'), 'Customers')
const CaseStudy = page(() => import('./pages/CaseStudy'), 'CaseStudy')
const Blog = page(() => import('./pages/Blog'), 'Blog')
const BlogPost = page(() => import('./pages/BlogPost'), 'BlogPost')
const Faq = page(() => import('./pages/Faq'), 'Faq')
const Demo = page(() => import('./pages/Demo'), 'Demo')
const Contact = page(() => import('./pages/Contact'), 'Contact')
const Login = page(() => import('./pages/Login'), 'Login')
const Signup = page(() => import('./pages/Signup'), 'Signup')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table. Add a page with a line here and a link in `nav` or
  `footer` (src/content.ts).
*/
type Route = { path: string; title: string | ((p: Record<string, string>) => string); render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: brand.name, render: () => <Home /> },
  { path: '/features', title: 'Features', render: () => <Features /> },
  { path: '/pricing', title: 'Pricing', render: () => <Pricing /> },
  { path: '/customers', title: 'Customers', render: () => <Customers /> },
  { path: '/customers/:slug', title: (p) => caseStudies.find((x) => x.slug === p.slug)?.brand ?? 'Not found', render: (p) => <CaseStudy slug={p.slug} /> },
  { path: '/blog', title: 'Blog', render: () => <Blog /> },
  { path: '/blog/:slug', title: (p) => posts.find((x) => x.slug === p.slug)?.title ?? 'Not found', render: (p) => <BlogPost slug={p.slug} /> },
  { path: '/faq', title: 'FAQ', render: () => <Faq /> },
  { path: '/demo', title: 'Test our AI', render: () => <Demo /> },
  { path: '/contact', title: 'Talk to sales', render: () => <Contact /> },
  { path: '/login', title: 'Log in', render: () => <Login /> },
  { path: '/signup', title: 'Get started', render: () => <Signup /> },
  { path: '/styleguide', title: 'Style guide', render: () => <StyleGuide /> },
]

function resolve(path: string) {
  for (const r of routes) {
    const params = match(r.path, path)
    if (params) return { route: r, params }
  }
  return null
}

export function App() {
  const { path, hash } = useLocation()
  const hit = resolve(path)
  const main = useRef<HTMLElement>(null)
  const first = useRef(true)
  const title = hit ? (typeof hit.route.title === 'function' ? hit.route.title(hit.params) : hit.route.title) : 'Page not found'

  useEffect(() => {
    document.title = title === brand.name ? `${brand.name} · ${brand.tagline}` : `${title} · ${brand.name}`
  }, [title])

  // On navigation: jump to the hash target (once the lazy page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    const isFirst = first.current
    first.current = false
    let raf = 0
    let tries = 0
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
      scrollToHash(hash, !isFirst)
      if (!isFirst && !hash) main.current?.focus({ preventScroll: true })
    }
    run()
    return () => cancelAnimationFrame(raf)
  }, [path, hash])

  return (
    <>
      <Nav />
      <main id="main" ref={main} tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>{hit ? hit.route.render(hit.params) : <NotFound />}</Suspense>
      </main>
      <Footer />
    </>
  )
}
