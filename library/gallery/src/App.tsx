import { lazy, Suspense, useEffect } from "react"
import { MotionConfig } from "motion/react"
import { LenisProvider } from "@/components/motion/lenis-provider"
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"

const SilkSpiderCursor = lazy(() =>
  import("@/components/ui/silk-spider-cursor").then((m) => ({
    default: m.default,
  }))
)

import { Footer } from "@/components/footer"
import { ShaderBackground } from "@/components/ui/voronoi"
import { CookieBanner } from "@/components/cookie-banner"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { ImageWarmup } from "@/components/ui/image-warmup"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
const AssistantPage = lazy(() =>
  import("@/pages/assistant-page").then((m) => ({ default: m.AssistantPage }))
)
const SubagentDemoPage = lazy(() => import("@/pages/subagent-demo"))
import { CatalogPage } from "@/pages/catalog-page"
import { CommentsPage } from "@/pages/comments-page"
import { ContactPage } from "@/pages/contact-page"
import { HomePage } from "@/pages/home"
import {
  CreditsPage,
  FaqPage,
  IndustriesPage,
  ProcessPage,
  StudioPage,
} from "@/pages/simple-pages"
import { TemplatePage } from "@/pages/template-page"
import { LegalPage } from "@/pages/legal-page"
const AnalyticsPage = lazy(() =>
  import("@/pages/analytics-page").then((m) => ({ default: m.AnalyticsPage }))
)
const FilesPage = lazy(() =>
  import("@/pages/files-page").then((m) => ({ default: m.FilesPage }))
)
const TourPage = lazy(() =>
  import("@/pages/tour-page").then((m) => ({ default: m.TourPage }))
)

const base = import.meta.env.BASE_URL.replace(/\/$/, "")

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname])

  return null
}

// /recorrido is a full-screen scroll-scrubbed piece: it brings its own top bar
// and route dots, so the site chrome stays out of the way.
function SiteHeader() {
  const { pathname } = useLocation()
  return pathname === "/recorrido" ? null : <Header />
}

function SiteFooter() {
  const { pathname } = useLocation()
  return pathname === "/recorrido" ? null : <Footer />
}

// Montaje del cursor de seda: solo en rutas con chrome del sitio. En móvil
// también vive: sigue el dedo y teje igual que con el ratón. Carga diferida
// para no inflar el bundle inicial.
function SilkSpiderLayer() {
  const { pathname } = useLocation()

  if (pathname === "/recorrido") return null

  return (
    <Suspense fallback={null}>
      <SilkSpiderCursor
        anchorSelector="[data-silk-anchor]"
        position="fixed"
        zIndex={30}
        seedWebs={3}
        enter
      />
    </Suspense>
  )
}

export function App() {
  return (
    <BrowserRouter basename={base || "/"}>
      <MotionConfig reducedMotion="user">
      <LenisProvider>
      <TooltipProvider>
        <div className="relative min-h-dvh overflow-x-hidden">
          <ShaderBackground className="pointer-events-none fixed inset-0 -z-10" />
          <ScrollToTop />
          <ImageWarmup />
          <SiteHeader />
          <main>
            <Suspense
              fallback={
                <div className="flex min-h-[40vh] items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
                  Cargando…
                </div>
              }
            >
              <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/plantillas" element={<CatalogPage />} />
              <Route path="/plantillas/:id" element={<TemplatePage />} />
              <Route path="/industrias" element={<IndustriesPage />} />
              <Route path="/proceso" element={<ProcessPage />} />
              <Route path="/estudio" element={<StudioPage />} />
              <Route path="/preguntas" element={<FaqPage />} />
              <Route path="/creditos" element={<CreditsPage />} />
              <Route path="/comentarios" element={<CommentsPage />} />
              <Route path="/asistente" element={<AssistantPage />} />
              <Route path="/subagent-demo" element={<SubagentDemoPage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/privacidad" element={<LegalPage />} />
              <Route path="/terminos" element={<LegalPage />} />
              <Route path="/servicios" element={<LegalPage />} />
              <Route path="/garantias" element={<LegalPage />} />
              <Route path="/recorrido" element={<TourPage />} />
              <Route path="/analitica" element={<AnalyticsPage />} />
              <Route path="/archivos" element={<FilesPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
            </Suspense>
          </main>
          <SiteFooter />
          <CookieBanner />
          <Toaster position="bottom-center" />
          <SmoothCursor />
          <SilkSpiderLayer />
        </div>
      </TooltipProvider>
      </LenisProvider>
      </MotionConfig>
    </BrowserRouter>
  )
}

export default App
