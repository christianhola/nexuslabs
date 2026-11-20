import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useMemo } from 'react'

import { ToastProvider } from './components/Toast'
import { Landing } from './pages/Landing'
import { NotFound } from './pages/NotFound'
import { usePath } from './lib/router'

const AppRoot = lazy(() => import('./app/AppRoot'))
const Styleguide = lazy(() => import('./pages/Styleguide'))

const titles: Record<string, string> = {
  '/': 'DeskFlow: your office, organised',
  '/styleguide': 'Style guide · DeskFlow',
}

// Routes: / (landing), /app/* (the booking app), /styleguide, anything else 404.
export function App() {
  const path = usePath()
  const route = useMemo(() => {
    if (path === '/') return 'landing'
    if (path === '/app' || path.startsWith('/app/')) return 'app'
    if (path === '/styleguide') return 'styleguide'
    return '404'
  }, [path])
  useEffect(() => {
    if (titles[path]) document.title = titles[path]
    else if (route === '404') document.title = 'Page not found · DeskFlow'
  }, [path, route])
  return (
    <MotionConfig reducedMotion="user">
    <ToastProvider>
      <Suspense fallback={<div className="min-h-dvh bg-canvas" aria-busy="true" />}>
        {route === 'landing' && <Landing />}
        {route === 'app' && <AppRoot path={path} />}
        {route === 'styleguide' && <Styleguide />}
        {route === '404' && <NotFound />}
      </Suspense>
    </ToastProvider>
    </MotionConfig>
  )
}
