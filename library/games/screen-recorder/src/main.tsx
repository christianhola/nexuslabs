import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'
import { ContactProvider } from './components/Contact'
import { ToastProvider } from './components/Toast'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ContactProvider>
        <App />
      </ContactProvider>
    </ToastProvider>
  </StrictMode>,
)
