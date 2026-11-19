import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { ToastProvider } from './components/Toast'
import { Book } from './pages/Book'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { Portfolio } from './pages/Portfolio'
import { Process } from './pages/Process'
import { ProjectPage } from './pages/Project'
import { Quiz } from './pages/Quiz'
import { Saved } from './pages/Saved'
import { Services } from './pages/Services'
import { Studio } from './pages/Studio'
import { Styleguide } from './pages/Styleguide'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        // Wait for the page transition to mount the target.
        const t = window.setTimeout(() => el.scrollIntoView({ block: 'start' }), 350)
        return () => window.clearTimeout(t)
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 focus:outline-none"
        tabIndex={-1}
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="portfolio/:slug" element={<ProjectPage />} />
          <Route path="process" element={<Process />} />
          <Route path="style-quiz" element={<Quiz />} />
          <Route path="studio" element={<Studio />} />
          <Route path="book" element={<Book />} />
          <Route path="saved" element={<Saved />} />
          <Route path="styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

function Chrome() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-svh flex-col">
      <Header key={pathname === '/' ? 'home' : 'page'} tone={pathname === '/' ? 'light' : 'dark'} />
      <Pages />
      <Footer />
    </div>
  )
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ToastProvider>
          <ScrollManager />
          <a
            href="#main"
            className="round sr-only z-[100] rounded-full bg-ink px-5 py-3 text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:inline-flex focus:min-h-11 focus:items-center"
          >
            Skip to content
          </a>
          <Chrome />
        </ToastProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
