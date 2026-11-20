import { SearchX } from 'lucide-react'

import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { navigate } from '../lib/router'

export function NotFound({ what }: { what: 'page' | 'board' }) {
  return (
    <main className="dot-grid flex min-h-dvh items-center justify-center">
      <EmptyState
        icon={<SearchX size={20} />}
        heading
        title={what === 'board' ? 'This board doesn’t exist' : 'Page not found'}
        body={what === 'board' ? 'It may have been deleted, or it lives in another browser. Boards are saved locally.' : 'The link may be broken or the page has moved.'}
        action={<Button onClick={() => navigate('/boards')}>See all boards</Button>}
      />
    </main>
  )
}
