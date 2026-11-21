import { useEffect } from "react"
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"

import { Footer } from "@/components/footer"
import { SmoothCursor } from "@/components/ui/smooth-cursor"
import { Header } from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AssistantPage } from "@/pages/assistant-page"
import SubagentDemoPage from "@/pages/subagent-demo"
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

const base = import.meta.env.BASE_URL.replace(/\/$/, "")

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" })
  }, [pathname])

  return null
}

export function App() {
  return (
    <BrowserRouter basename={base || "/"}>
      <TooltipProvider>
        <div className="relative min-h-dvh overflow-x-hidden bg-background">
          <ScrollToTop />
          <Header />
          <main>
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
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="bottom-center" />
          <SmoothCursor />
        </div>
      </TooltipProvider>
    </BrowserRouter>
  )
}

export default App
