import { BoardsPage } from './app/BoardsPage'
import { Editor } from './app/Editor'
import { NotFound } from './app/NotFound'
import { PresentPage } from './app/PresentPage'
import { StyleGuide } from './app/StyleGuide'
import { ToastProvider } from './components/Toast'
import { matchRoute, usePath } from './lib/router'
import { useStore } from './lib/store'

export function App() {
  const route = matchRoute(usePath())
  const exists = useStore((s) => (route.name === 'board' || route.name === 'present' ? s.boards.some((b) => b.id === route.id) : true))
  return (
    <ToastProvider>
      <div className="min-h-dvh">
        {route.name === 'landing' && <Editor key="landing" landing />}
        {route.name === 'board' && (exists ? <Editor key={route.id} boardId={route.id} /> : <NotFound what="board" />)}
        {route.name === 'present' && (exists ? <PresentPage id={route.id} /> : <NotFound what="board" />)}
        {route.name === 'boards' && <BoardsPage />}
        {route.name === 'styleguide' && <StyleGuide />}
        {route.name === 'notfound' && <NotFound what="page" />}
      </div>
    </ToastProvider>
  )
}
