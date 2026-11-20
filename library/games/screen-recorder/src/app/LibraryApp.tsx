import { Archive, ArchiveRestore, Clock, FolderInput, LayoutGrid, Link2, List, Menu as MenuIcon, MessageSquare, MoreHorizontal, Pencil, Play, RotateCcw, Search, Trash2, Video, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { Button, IconButton } from '@/components/Button'
import { Drawer } from '@/components/Drawer'
import { ClipCard, ClipMeta, PlaylistsHeading, SidebarRow, WorkspaceHeader, type NavRow } from '@/components/Library'
import { LogoMark } from '@/components/Logo'
import { Menu } from '@/components/Menu'
import { Modal } from '@/components/Modal'
import { ScreenMock } from '@/components/ScreenMock'
import { useToast } from '@/components/Toast'
import { Avatar, Chip, EmptyState, Input, SearchField, Skeleton } from '@/components/ui'
import { APP_COPY, BRAND, type Recording } from '@/content'
import { cn } from '@/lib/cn'
import { short, timeAgo } from '@/lib/format'
import { Link, navigate, setQuery, useLocation } from '@/lib/router'
import { actions, resetDemo, useStore } from '@/lib/store'
import { Recorder } from './Recorder'

type View = 'mine' | 'watched' | 'activity' | 'archive' | string // or a playlist id

const LAYOUT_KEY = 'clipwise:layout'

export function LibraryApp() {
  const { search } = useLocation()
  const view: View = search.get('view') ?? 'mine'
  const q = search.get('q') ?? ''
  const sort = search.get('sort') === 'active' ? 'active' : 'latest'
  const recordings = useStore((s) => s.recordings)
  const comments = useStore((s) => s.comments)
  const playlists = useStore((s) => s.playlists)
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [drawer, setDrawer] = useState(false)
  const [recOpen, setRecOpen] = useState(false)
  const [renaming, setRenaming] = useState<Recording | null>(null)
  const [moving, setMoving] = useState<Recording | null>(null)
  const [layout, setLayout] = useState<'grid' | 'list'>(() => {
    try {
      return localStorage.getItem(LAYOUT_KEY) === 'list' ? 'list' : 'grid'
    } catch {
      return 'grid'
    }
  })
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(id)
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(LAYOUT_KEY, layout)
    } catch {
      /* ignore */
    }
  }, [layout])
  // "/" focuses search, "r" opens the recorder (outside text fields).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.closest('input,textarea,select,[contenteditable],[role=dialog]')) return
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'r' && !e.metaKey && !e.ctrlKey) setRecOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commentCount = useMemo(() => {
    const m = new Map<string, number>()
    comments.forEach((c) => m.set(c.recId, (m.get(c.recId) ?? 0) + 1))
    return m
  }, [comments])

  const live = recordings.filter((r) => !r.archived)
  const playlist = playlists.find((p) => p.id === view)

  const list = useMemo(() => {
    let xs = recordings.filter((r) => (view === 'archive' ? r.archived : !r.archived))
    if (view === 'watched') xs = xs.filter((r) => r.watched)
    if (playlist) xs = xs.filter((r) => r.playlistId === playlist.id)
    if (q.trim()) {
      const n = q.trim().toLowerCase()
      xs = xs.filter((r) => r.title.toLowerCase().includes(n) || r.summary.toLowerCase().includes(n))
    }
    const score = (r: Recording) => (commentCount.get(r.id) ?? 0) * 3 + r.views
    return [...xs].sort((a, b) => (sort === 'active' ? score(b) - score(a) : b.createdAt.localeCompare(a.createdAt)))
  }, [recordings, view, playlist, q, sort, commentCount])

  const activity = useMemo(
    () =>
      [...comments]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((c) => ({ c, r: recordings.find((r) => r.id === c.recId) }))
        .filter((x): x is { c: (typeof comments)[number]; r: Recording } => !!x.r),
    [comments, recordings],
  )

  const go = (v: View) => {
    const url = new URL(window.location.href)
    if (v === 'mine') url.searchParams.delete('view')
    else url.searchParams.set('view', v)
    url.searchParams.delete('q')
    navigate(url.pathname + url.search, { replace: true })
    setDrawer(false)
  }

  const title = view === 'mine' ? APP_COPY.nav.mine : view === 'watched' ? APP_COPY.nav.watched : view === 'activity' ? APP_COPY.nav.activity : view === 'archive' ? APP_COPY.nav.archive : (playlist?.name ?? APP_COPY.nav.mine)

  function cardMenu(r: Recording) {
    const link = `${window.location.origin}/v/${r.id}`
    return (
      <Menu
        label={`Actions for ${r.title}`}
        items={[
          {
            id: 'copy',
            label: 'Copy link',
            icon: <Link2 className="size-4" />,
            onSelect: () => {
              navigator.clipboard?.writeText(link).catch(() => {})
              toast({ title: 'Link copied' })
            },
          },
          { id: 'rename', label: 'Rename', icon: <Pencil className="size-4" />, onSelect: () => setRenaming(r) },
          { id: 'move', label: 'Move to playlist…', icon: <FolderInput className="size-4" />, onSelect: () => setMoving(r) },
          r.archived
            ? { id: 'restore', label: 'Restore', icon: <ArchiveRestore className="size-4" />, onSelect: () => (actions.patchRecording(r.id, { archived: false }), toast({ title: 'Clip restored' })) }
            : {
                id: 'archive',
                label: 'Archive',
                icon: <Archive className="size-4" />,
                onSelect: () => {
                  actions.patchRecording(r.id, { archived: true })
                  toast({ title: 'Clip archived', action: { label: 'Undo', run: () => actions.patchRecording(r.id, { archived: false }) } })
                },
              },
          { id: 'sep', separator: true },
          {
            id: 'delete',
            label: 'Delete',
            danger: true,
            icon: <Trash2 className="size-4" />,
            onSelect: () => {
              const undo = actions.removeRecording(r.id)
              toast({ title: `Deleted “${r.title}”`, action: { label: 'Undo', run: undo } })
            },
          },
        ]}
        trigger={(p) => (
          <button {...p} type="button" aria-label={`Actions for ${r.title}`} className="inline-flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-fg aria-expanded:bg-surface-2 aria-expanded:text-fg pointer-coarse:size-10">
            <MoreHorizontal className="size-4" />
          </button>
        )}
      />
    )
  }

  const sidebar = (
    <Sidebar
      view={view}
      go={go}
      counts={{ mine: live.length, watched: live.filter((r) => r.watched).length, activity: comments.length, archive: recordings.filter((r) => r.archived).length }}
      onSearch={() => {
        setDrawer(false)
        requestAnimationFrame(() => searchRef.current?.focus())
      }}
      onRecord={() => {
        setDrawer(false)
        setRecOpen(true)
      }}
    />
  )

  return (
    <div className="flex h-dvh bg-bg">
      <aside className="hidden w-[256px] shrink-0 flex-col border-r border-line bg-[#121110] lg:flex" aria-label="Library">
        {sidebar}
      </aside>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Library" side="left" className="bg-[#121110]">
        {sidebar}
      </Drawer>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line px-4 sm:px-6">
          <IconButton label="Open library menu" className="-ml-2 lg:hidden" onClick={() => setDrawer(true)}>
            <MenuIcon className="size-5" />
          </IconButton>
          <h1 className="min-w-0 truncate font-display text-[20px] font-semibold tracking-[-0.03em]">{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <SearchField
              ref={searchRef}
              id="lib-search"
              label="Search clips"
              placeholder="Search clips"
              shortcut="/"
              value={q}
              onChange={(e) => setQuery('q', e.target.value || null)}
              onKeyDown={(e) => e.key === 'Escape' && (setQuery('q', null), e.currentTarget.blur())}
              className="hidden w-[260px] sm:block"
            />
            <Button variant="record" size="sm" onClick={() => setRecOpen(true)} icon={<span className="size-2 rounded-full bg-white" />} className="h-9 px-3.5">
              <span className="hidden sm:inline">New recording</span>
              <span className="sm:hidden">Record</span>
            </Button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6">
            {/* search on phones */}
            <SearchField label="Search clips" placeholder="Search clips" size="lg" value={q} onChange={(e) => setQuery('q', e.target.value || null)} className="mb-4 sm:hidden" />

            {view === 'activity' ? (
              <ActivityList items={activity} loading={loading} />
            ) : (
              <>
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <Chip pressed={sort === 'latest'} onClick={() => setQuery('sort', null)} icon={<Clock className="size-3.5" />}>
                    {APP_COPY.sorts.latest}
                  </Chip>
                  <Chip pressed={sort === 'active'} onClick={() => setQuery('sort', 'active')} icon={<MessageSquare className="size-3.5" />}>
                    {APP_COPY.sorts.active}
                  </Chip>
                  {q && (
                    <Chip onClick={() => setQuery('q', null)} icon={<X className="size-3.5" />}>
                      “{q}”
                    </Chip>
                  )}
                  <span className="ml-auto text-[13px] text-faint" aria-live="polite">
                    {loading ? 'Loading…' : `${list.length} ${list.length === 1 ? 'clip' : 'clips'}`}
                  </span>
                  <div className="flex rounded-full p-0.5 ring-1 ring-line ring-inset" role="group" aria-label="Layout">
                    <IconButton label="Grid view" size="sm" aria-pressed={layout === 'grid'} onClick={() => setLayout('grid')} className={cn(layout === 'grid' && 'bg-raised text-fg')}>
                      <LayoutGrid className="size-4" />
                    </IconButton>
                    <IconButton label="List view" size="sm" aria-pressed={layout === 'list'} onClick={() => setLayout('list')} className={cn(layout === 'list' && 'bg-raised text-fg')}>
                      <List className="size-4" />
                    </IconButton>
                  </div>
                </div>

                {loading ? (
                  <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading clips">
                    {Array.from({ length: 6 }, (_, i) => (
                      <div key={i}>
                        <Skeleton className="aspect-video w-full rounded-[14px]" />
                        <Skeleton className="mt-3 h-4 w-2/3" />
                        <Skeleton className="mt-2 h-3 w-1/3" />
                      </div>
                    ))}
                  </div>
                ) : list.length === 0 ? (
                  <EmptyState
                    icon={q ? <Search className="size-5" /> : <Video className="size-5" />}
                    title={q ? APP_COPY.empty.search.title : view === 'watched' ? APP_COPY.empty.watched.title : view === 'archive' ? APP_COPY.empty.archive.title : APP_COPY.empty.playlist.title}
                    body={q ? APP_COPY.empty.search.body : view === 'watched' ? APP_COPY.empty.watched.body : view === 'archive' ? APP_COPY.empty.archive.body : APP_COPY.empty.playlist.body}
                    action={
                      q ? (
                        <Button variant="secondary" onClick={() => setQuery('q', null)}>
                          Clear search
                        </Button>
                      ) : view !== 'archive' && view !== 'watched' ? (
                        <Button variant="record" onClick={() => setRecOpen(true)} icon={<span className="size-2 rounded-full bg-white" />}>
                          Record a clip
                        </Button>
                      ) : undefined
                    }
                  />
                ) : layout === 'grid' ? (
                  <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                    {list.map((r) => (
                      <li key={r.id}>
                        <ClipCard
                          layout="stacked"
                          to={`/v/${r.id}`}
                          title={r.title}
                          scene={r.scene}
                          presenter={r.presenter}
                          duration={short(r.duration)}
                          ago={timeAgo(r.createdAt)}
                          views={r.views}
                          comments={commentCount.get(r.id) ?? 0}
                          unwatched={!r.watched}
                          menu={cardMenu(r)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="divide-y divide-line rounded-[16px] ring-1 ring-line">
                    {list.map((r) => (
                      <li key={r.id} className="flex items-center gap-4 px-3 py-3 sm:px-4">
                        <Link to={`/v/${r.id}`} className="flex min-w-0 flex-1 items-center gap-4 rounded-[10px]">
                          <ScreenMock scene={r.scene} presenter={r.presenter} className="aspect-video w-[112px] shrink-0 rounded-[8px] ring-1 ring-line" />
                          <span className="min-w-0">
                            <span className="block truncate text-[14.5px] font-medium">{r.title}</span>
                            <ClipMeta duration={short(r.duration)} ago={timeAgo(r.createdAt)} views={r.views} comments={commentCount.get(r.id) ?? 0} className="mt-1" />
                          </span>
                        </Link>
                        <span className="hidden text-[13px] text-faint md:block">{playlists.find((p) => p.id === r.playlistId)?.name ?? '—'}</span>
                        {cardMenu(r)}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Recorder
        open={recOpen}
        onClose={() => setRecOpen(false)}
        playlistId={playlist?.id ?? null}
        onSaved={(r) => {
          setRecOpen(false)
          toast({ title: `Saved “${r.title}”`, action: { label: 'Open', run: () => navigate(`/v/${r.id}`) } })
        }}
      />
      <RenameModal rec={renaming} onClose={() => setRenaming(null)} />
      <MoveModal rec={moving} onClose={() => setMoving(null)} />
    </div>
  )
}

function Sidebar({ view, go, counts, onSearch, onRecord }: { view: View; go: (v: View) => void; counts: Record<'mine' | 'watched' | 'activity' | 'archive', number>; onSearch: () => void; onRecord: () => void }) {
  const playlists = useStore((s) => s.playlists)
  const recordings = useStore((s) => s.recordings)
  const toast = useToast()
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [renameId, setRenameId] = useState<string | null>(null)

  const rows: NavRow[] = [
    { id: 'mine', label: APP_COPY.nav.mine, count: counts.mine, icon: 'mine', onClick: () => go('mine'), active: view === 'mine' },
    { id: 'watched', label: APP_COPY.nav.watched, count: counts.watched, icon: 'watched', onClick: () => go('watched'), active: view === 'watched' },
    { id: 'activity', label: APP_COPY.nav.activity, count: counts.activity, icon: 'activity', tone: 'ok', onClick: () => go('activity'), active: view === 'activity' },
    { id: 'archive', label: APP_COPY.nav.archive, count: counts.archive, icon: 'archive', onClick: () => go('archive'), active: view === 'archive' },
  ]

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError('Name the playlist.')
    if (playlists.some((p) => p.name.toLowerCase() === n.toLowerCase() && p.id !== renameId)) return setError('A playlist with that name exists.')
    if (renameId) actions.renamePlaylist(renameId, n)
    else go(actions.addPlaylist(n).id)
    setAdding(false)
    setRenameId(null)
    setName('')
    setError(null)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-3 pt-3">
        <div className="pl-2.5">
          <WorkspaceHeader name={BRAND.workspace} onSearch={onSearch} />
        </div>
        <Button variant="record" className="mt-3 w-full" onClick={onRecord} icon={<span className="size-2.5 rounded-full bg-white" />}>
          New recording
        </Button>
      </div>
      <nav className="mt-4 min-h-0 flex-1 overflow-y-auto px-3 pb-4" aria-label="Library views">
        <div className="space-y-0.5">
          {rows.map((r) => (
            <SidebarRow key={r.id} row={r} />
          ))}
        </div>
        <div className="mt-5">
          <PlaylistsHeading
            count={playlists.length}
            onAdd={() => {
              setAdding(true)
              setRenameId(null)
              setName('')
              setError(null)
            }}
          />
        </div>
        {(adding || renameId) && (
          <form onSubmit={submit} className="mt-1 mb-2 px-1" noValidate>
            <Input
              label={renameId ? 'Rename playlist' : 'New playlist name'}
              hideLabel
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.stopPropagation()
                  setAdding(false)
                  setRenameId(null)
                }
              }}
              placeholder="Playlist name"
              error={error}
              maxLength={60}
              className="[&_input]:h-9 [&_input]:text-sm"
            />
            <div className="mt-2 flex justify-end gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setAdding(false)
                  setRenameId(null)
                }}
              >
                Cancel
              </Button>
              <Button size="sm" variant="primary" type="submit">
                {renameId ? 'Rename' : 'Create'}
              </Button>
            </div>
          </form>
        )}
        <div className="space-y-0.5">
          {playlists.map((p) => (
            <SidebarRow
              key={p.id}
              row={{
                id: p.id,
                label: p.name,
                icon: 'playlist',
                count: recordings.filter((r) => r.playlistId === p.id && !r.archived).length,
                onClick: () => go(p.id),
                active: view === p.id,
                actions: (
                  <div className="absolute right-1 opacity-0 transition-opacity group-focus-within/item:opacity-100 group-hover/item:opacity-100 pointer-coarse:opacity-100 has-[[aria-expanded=true]]:opacity-100">
                    <Menu
                      label={`Playlist ${p.name}`}
                      width={180}
                      items={[
                        {
                          id: 'rename',
                          label: 'Rename',
                          icon: <Pencil className="size-4" />,
                          onSelect: () => {
                            setRenameId(p.id)
                            setAdding(false)
                            setName(p.name)
                            setError(null)
                          },
                        },
                        {
                          id: 'del',
                          label: 'Delete playlist',
                          danger: true,
                          icon: <Trash2 className="size-4" />,
                          onSelect: () => {
                            if (view === p.id) go('mine')
                            actions.removePlaylist(p.id)
                            toast({ title: `Deleted playlist “${p.name}”. Its clips stay in My Clips.` })
                          },
                        },
                      ]}
                      trigger={(tp) => (
                        <button {...tp} type="button" aria-label={`Options for ${p.name}`} className="inline-flex size-7 items-center justify-center rounded-full bg-surface-2 text-muted hover:text-fg pointer-coarse:size-9">
                          <MoreHorizontal className="size-3.5" />
                        </button>
                      )}
                    />
                  </div>
                ),
              }}
            />
          ))}
        </div>
      </nav>
      <div className="flex items-center gap-2 border-t border-line px-3 py-3">
        <Link to="/" className="flex flex-1 items-center gap-2 rounded-full px-2 py-1.5 text-[13px] text-muted hover:text-fg">
          <LogoMark size={20} /> {BRAND.name} home
        </Link>
        <IconButton
          label="Reset demo data"
          size="sm"
          onClick={() => {
            resetDemo()
            go('mine')
            toast({ title: 'Demo data reset' })
          }}
        >
          <RotateCcw className="size-4" />
        </IconButton>
      </div>
    </div>
  )
}

function ActivityList({ items, loading }: { items: Array<{ c: { id: string; t: number; author: string; initials: string; body: string; createdAt: string }; r: Recording }>; loading: boolean }) {
  if (loading)
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading activity">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-[14px]" />
        ))}
      </div>
    )
  if (!items.length) return <EmptyState icon={<MessageSquare className="size-5" />} title={APP_COPY.empty.activity.title} body={APP_COPY.empty.activity.body} />
  return (
    <ul className="divide-y divide-line rounded-[16px] ring-1 ring-line">
      {items.map(({ c, r }) => (
        <li key={c.id}>
          <Link to={`/v/${r.id}?t=${c.t}`} className="flex items-start gap-3 px-4 py-4 hover:bg-surface">
            <Avatar initials={c.initials} size={32} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm">
                <b className="font-medium">{c.author}</b> <span className="text-muted">commented on</span> <b className="font-medium">{r.title}</b>
              </span>
              <span className="mt-1 block truncate text-sm text-muted">{c.body}</span>
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1.5 text-[12px] text-faint">
              {timeAgo(c.createdAt)}
              <span className="inline-flex items-center gap-1 rounded-full bg-ember/15 px-1.5 py-0.5 font-mono text-[11px] text-ember-text">
                <Play className="size-2.5 fill-current" />
                {Math.floor(c.t / 60)}:{String(c.t % 60).padStart(2, '0')}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function RenameModal({ rec, onClose }: { rec: Recording | null; onClose: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (rec) {
      setValue(rec.title)
      setError(null)
    }
  }, [rec])
  return (
    <Modal open={!!rec} onClose={onClose} title="Rename clip" width={440}>
      <form
        className="space-y-4 p-5"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          if (!value.trim()) return setError('The title can’t be empty.')
          actions.patchRecording(rec!.id, { title: value.trim() })
          onClose()
        }}
      >
        <Input label="Title" value={value} onChange={(e) => (setValue(e.target.value), setError(null))} error={error} data-autofocus maxLength={120} />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function MoveModal({ rec, onClose }: { rec: Recording | null; onClose: () => void }) {
  const playlists = useStore((s) => s.playlists)
  const toast = useToast()
  return (
    <Modal open={!!rec} onClose={onClose} title="Move to playlist" width={400}>
      <ul className="p-2">
        {[{ id: '', name: 'No playlist' }, ...playlists].map((p) => {
          const on = (rec?.playlistId ?? '') === p.id
          return (
            <li key={p.id || 'none'}>
              <button
                type="button"
                className={cn('flex h-10 w-full items-center rounded-[10px] px-3 text-left text-sm hover:bg-surface-2', on && 'bg-surface-2 font-medium')}
                aria-current={on || undefined}
                onClick={() => {
                  actions.patchRecording(rec!.id, { playlistId: p.id || null })
                  toast({ title: p.id ? `Moved to ${p.name}` : 'Removed from playlist' })
                  onClose()
                }}
              >
                <span className="flex-1">{p.name}</span>
                {on && <span className="text-[12px] text-faint">Current</span>}
              </button>
            </li>
          )
        })}
      </ul>
    </Modal>
  )
}
