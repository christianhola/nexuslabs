import { lazy, Suspense, useEffect } from 'react'

import { BRAND } from './content'
import { useLocation } from './lib/router'
import { Landing } from './sections/Landing'
import { NotFound } from './pages/NotFound'

const LibraryApp = lazy(() => import('./app/LibraryApp').then((m) => ({ default: m.LibraryApp })))
const SharePage = lazy(() => import('./pages/Share').then((m) => ({ default: m.SharePage })))
const Integrations = lazy(() => import('./pages/Integrations').then((m) => ({ default: m.Integrations })))
const Pricing = lazy(() => import('./pages/Pricing').then((m) => ({ default: m.Pricing })))
const Download = lazy(() => import('./pages/Download').then((m) => ({ default: m.Download })))
const StyleGuide = lazy(() => import('./styleguide/StyleGuide').then((m) => ({ default: m.StyleGuide })))

const TITLES: Record<string, string> = {
  '/': `${BRAND.name} — ${BRAND.tagline}`,
  '/app': `Library · ${BRAND.name}`,
  '/integrations': `Integrations · ${BRAND.name}`,
  '/pricing': `Pricing · ${BRAND.name}`,
  '/download': `Download · ${BRAND.name}`,
  '/styleguide': `Style guide · ${BRAND.name}`,
}

function route(pathname: string) {
  if (pathname === '/') return <Landing />
  if (pathname === '/app') return <LibraryApp />
  const share = pathname.match(/^\/v\/([\w-]+)$/)
  if (share) return <SharePage id={share[1]} />
  if (pathname === '/integrations') return <Integrations />
  if (pathname === '/pricing') return <Pricing />
  if (pathname === '/download') return <Download />
  if (pathname === '/styleguide') return <StyleGuide />
  return <NotFound />
}

export function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!pathname.startsWith('/v/')) document.title = TITLES[pathname] ?? `Not found · ${BRAND.name}`
  }, [pathname])
  return <Suspense fallback={<div className="min-h-dvh bg-bg" />}>{route(pathname)}</Suspense>
}
