import { useMemo } from 'react'
import { Plus } from 'lucide-react'

import { Button } from '../../components/Button'
import { APP } from '../../content'
import { isSameDay } from '../../lib/dates'
import { useLibrary } from '../../lib/library'
import { useShell } from './AppShell'
import { ItemsView } from './ItemsView'

export type View = 'shelf' | 'today' | 'favourites'

export function LibraryPage({ view = 'shelf' }: { view?: View }) {
  const lib = useLibrary()
  const { openSave } = useShell()
  const base = useMemo(() => {
    if (view === 'today') return lib.items.filter((i) => isSameDay(new Date(i.savedAt), new Date()))
    if (view === 'favourites') return lib.items.filter((i) => i.favourite)
    return lib.items
  }, [lib.items, view])
  const empty = view === 'today' ? APP.emptyToday : view === 'favourites' ? APP.emptyFavourites : APP.emptyShelf
  return (
    <ItemsView
      key={view}
      base={base}
      title={APP.views[view]}
      searchLabel={`Search ${APP.views[view]}`}
      empty={{
        ...empty,
        action: view === 'favourites' ? undefined : (
          <Button variant="lime" icon={<Plus aria-hidden className="size-4" />} onClick={() => openSave()}>
            Save a link
          </Button>
        ),
      }}
    />
  )
}

export const TodayPage = () => <LibraryPage view="today" />
export const FavouritesPage = () => <LibraryPage view="favourites" />
