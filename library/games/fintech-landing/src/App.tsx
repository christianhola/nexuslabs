import { lazy, Suspense, useEffect, useRef } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { posts } from './content'
import { match, scrollToHash, useLocation } from './lib/router'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Footer } from './sections/Footer'
import { Nav } from './sections/Nav'

// Inner pages load on demand so the landing page ships alone.
const page = <K extends string>(load: () => Promise<Record<K, ComponentType<{ slug?: string }>>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })))
const FeaturesPage = page(() => import('./pages/FeaturesPage'), 'FeaturesPage')
const PricingPage = page(() => import('./pages/PricingPage'), 'PricingPage')
const CompanyPage = page(() => import('./pages/CompanyPage'), 'CompanyPage')
const BlogIndex = page(() => import('./pages/BlogIndex'), 'BlogIndex')
const BlogPost = page(() => import('./pages/BlogPost'), 'BlogPost')
const ContactPage = page(() => import('./pages/ContactPage'), 'ContactPage')
const SignUp = page(() => import('./pages/SignUp'), 'SignUp')
const LogIn = page(() => import('./pages/LogIn'), 'LogIn')
const StyleGuide = page(() => import('./pages/StyleGuide'), 'StyleGuide')

/*
  The route table. Each entry is a path pattern, a page title and the page.
  Add a page by adding a line here and a link in `nav` (src/content.ts).
*/
type Route = { path: string; title: string | ((p: Record<string, string>) => string); render: (p: Record<string, string>) => ReactNode }

const routes: Route[] = [
  { path: '/', title: 'Revio', render: () => <Home /> },
  { path: '/features', title: 'Features', render: () => <FeaturesPage /> },
  { path: '/pricing', title: 'Pricing', render: () => <PricingPage /> },
  { path: '/company', title: 'Company', render: () => <CompanyPage /> },
  { path: '/blog', title: 'Blog', render: () => <BlogIndex /> },
  {
    path: '/blog/:slug',
    title: (p) => posts.find((x) => x.slug === p.slug)?.title ?? 'Not found',
    render: (p) => <BlogPost slug={p.slug} />,
  },
  { path: '/contact', title: 'Contact', render: () => <ContactPage /> },
  { path: '/signup', title: 'Sign up', render: () => <SignUp /> },
  { path: '/login', title: 'Log in', render: () => <LogIn /> },
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
    document.title = title === 'Revio' ? 'Revio' : `${title} · Revio`
  }, [title])

  // On navigation: jump to the hash target (after the page renders) or the
  // top, and move focus to <main> so screen readers announce the new page.
  useEffect(() => {
    const isFirst = first.current
    first.current = false
    let raf = 0
    let tries = 0
    // Lazy pages may not be mounted yet: wait (up to ~2 s) for the target.
    const run = () => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
      if (hash && !target && tries++ < 120) {
        raf = requestAnimationFrame(run)
        return
      }
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
        className="sr-only rounded-[10px] bg-violet px-4 py-2.5 text-[14px] font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70]"
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
