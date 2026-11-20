import { AdminPage } from './pages/Admin'
import { EmailPreviewPage } from './pages/EmailPreview'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { StatusPage } from './pages/Status'
import { StyleGuidePage } from './pages/StyleGuide'
import { usePath } from './lib/router'

/** Routes. The Worker serves index.html for every non-API path. */
export function App() {
  const path = usePath().replace(/\/+$/, '') || '/'

  if (path === '/') return <Home />
  if (path === '/styleguide') return <StyleGuidePage />
  if (path === '/admin') return <AdminPage />
  if (path === '/email-preview') return <EmailPreviewPage />
  const status = path.match(/^\/status\/([^/]+)$/)
  if (status) return <StatusPage key={status[1]} code={decodeURIComponent(status[1])} />
  return <NotFound />
}
