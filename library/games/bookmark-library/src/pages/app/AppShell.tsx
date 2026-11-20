import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ChevronDown, Eraser, Home, Menu, Plus, RotateCcw, X } from 'lucide-react'

import { Button, IconButton } from '../../components/Button'
import { Field, Input, Textarea } from '../../components/Field'
import { Kbd } from '../../components/Kbd'
import { Logo, Mark } from '../../components/Logo'
import { Modal } from '../../components/Modal'
import { NavItem } from '../../components/NavItem'
import { MenuItem, Popover } from '../../components/Popover'
import { useToast } from '../../components/Toast'
import { APP } from '../../content'
import { cx } from '../../lib/cx'
import { useLibrary } from '../../lib/library'
import { Link, navigate, useLocation } from '../../lib/router'
import { useFocusTrap } from '../../lib/useFocusTrap'
import { SaveDialog } from './SaveDialog'

type Shell = { openSave: (collectionId?: string | null) => void; openNewCollection: () => void }
const Ctx = createContext<Shell>({ openSave: () => {}, openNewCollection: () => {} })
export const useShell = () => useContext(Ctx)

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const lib = useLibrary()
  const { path } = useLocation()
  const { openNewCollection } = useShell()
  const today = new Date().toDateString()
  const todayCount = lib.items.filter((i) => new Date(i.savedAt).toDateString() === today).length
  return (
    <nav aria-label="Library" className="flex flex-col gap-1 px-4 pt-7 pb-6">
      <NavItem href="/app/today" label={APP.views.today} count={todayCount} active={path === '/app/today'} onClick={onNavigate} />
      <NavItem href="/app" label={APP.views.shelf} count={lib.counts.all} active={path === '/app'} onClick={onNavigate} />
      <NavItem href="/app/favourites" label={APP.views.favourites} count={lib.counts.favourites} active={path === '/app/favourites'} onClick={onNavigate} />
      <div className="mt-7 mb-1 flex items-center justify-between pr-1 pl-3">
        <p id="collections-label" className="text-[12px] tracking-[0.08em] text-subtle uppercase">
          Collections
        </p>
        <IconButton label="New collection" size="sm" onClick={openNewCollection} className="size-9 w-9">
          <Plus aria-hidden className="size-4" />
        </IconButton>
      </div>
      <ul aria-labelledby="collections-label" className="flex flex-col gap-1">
        {lib.collections.map((c) => (
          <li key={c.id}>
            <NavItem href={`/app/c/${c.id}`} label={c.name} count={lib.counts.byCollection[c.id] ?? 0} square={false} active={path === `/app/c/${c.id}`} onClick={onNavigate} />
          </li>
        ))}
        {!lib.collections.length && <li className="px-3 py-2 text-[14px] text-subtle">No collections yet.</li>}
      </ul>
    </nav>
  )
}

function NewCollectionDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const lib = useLibrary()
  const toast = useToast()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState<string>()
  useEffect(() => {
    if (open) {
      setName('')
      setDesc('')
      setError(undefined)
    }
  }, [open])
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError('Name the collection.')
    if (lib.collections.some((c) => c.name.toLowerCase() === n.toLowerCase())) return setError('You already have a collection with that name.')
    const c = lib.addCollection(n, desc)
    onClose()
    toast(`Created ${c.name}`)
    navigate(`/app/c/${c.id}`)
  }
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="New collection"
      description="Group saves for a project. Search understands its name."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="col-form" variant="dark">
            Create
          </Button>
        </>
      }
    >
      <form id="col-form" onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field label="Name" error={error}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              value={name}
              maxLength={40}
              onChange={(e) => {
                setName(e.target.value)
                setError(undefined)
              }}
              placeholder="Spring campaign"
              aria-invalid={invalid}
              aria-describedby={describedBy}
            />
          )}
        </Field>
        <Field label="Description" optional>
          {({ id }) => <Textarea id={id} value={desc} maxLength={160} onChange={(e) => setDesc(e.target.value)} placeholder="What goes in here?" />}
        </Field>
      </form>
    </Modal>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const lib = useLibrary()
  const toast = useToast()
  const { path, search } = useLocation()
  const [save, setSave] = useState<{ open: boolean; collectionId?: string | null }>({ open: false })
  const [newCol, setNewCol] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(drawerRef, drawer, () => setDrawer(false))

  const openSave = useCallback((collectionId?: string | null) => setSave({ open: true, collectionId }), [])
  const openNewCollection = useCallback(() => {
    setDrawer(false)
    setNewCol(true)
  }, [])

  // /app?save=1 (from the landing page) opens the save dialog once.
  useEffect(() => {
    const p = new URLSearchParams(search)
    if (p.get('save') === '1') {
      p.delete('save')
      navigate(path + (p.toString() ? `?${p}` : ''), { replace: true })
      setSave({ open: true })
    }
  }, [path, search])

  // n opens the save dialog anywhere in the app (not while typing).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.metaKey || e.ctrlKey || e.altKey || /INPUT|TEXTAREA|SELECT/.test(t.tagName) || t.isContentEditable || document.querySelector('[aria-modal="true"]')) return
      if (e.key === 'n') {
        e.preventDefault()
        openSave()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openSave])

  const currentCollection = path.startsWith('/app/c/') ? decodeURIComponent(path.split('/')[3] ?? '') : null

  return (
    <Ctx.Provider value={{ openSave, openNewCollection }}>
      <div className="min-h-screen bg-canvas lg:p-3">
        <div className="flex min-h-screen flex-col overflow-hidden bg-panel lg:min-h-[calc(100vh-24px)] lg:rounded-[22px] lg:shadow-[inset_0_0_0_1px_var(--color-line)]">
          <a href="#app-main" className="sr-only z-50 rounded-sm bg-ink px-3 py-2 text-paper focus:not-sr-only focus:absolute focus:top-3 focus:left-3">
            Skip to content
          </a>
          <header className="flex h-[66px] shrink-0 items-center justify-between gap-3 border-b border-line px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <IconButton label="Open library menu" aria-expanded={drawer} className="md:hidden" onClick={() => setDrawer(true)}>
                <Menu aria-hidden className="size-5" />
              </IconButton>
              <Link href="/" aria-label="Keepsake home" className="inline-flex h-11 min-w-11 items-center rounded-sm">
                <span className="hidden sm:inline">
                  <Logo />
                </span>
                <span className="sm:hidden">
                  <Mark />
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden items-center gap-1.5 text-[13px] text-subtle lg:flex">
                <Kbd>/</Kbd> search <Kbd>N</Kbd> save
              </span>
              <Button variant="lime" size="sm" className="h-10 shadow-none" icon={<Plus aria-hidden className="size-4" />} onClick={() => openSave(currentCollection)}>
                Save a link
              </Button>
              <Popover
                label="Account menu"
                trigger={
                  <>
                    <span aria-hidden className="grid size-8 place-items-center rounded-sm bg-chip text-[13px] font-medium text-ink-2">
                      S
                    </span>
                    <ChevronDown aria-hidden className="size-3.5 text-subtle" />
                  </>
                }
              >
                {(close) => (
                  <>
                    <p className="px-3 pt-2 pb-2 text-[13px] text-subtle">Demo library, saved in this browser</p>
                    <MenuItem
                      icon={<RotateCcw aria-hidden className="size-4" />}
                      onClick={() => {
                        lib.reset()
                        close()
                        toast('Demo shelf restored')
                      }}
                    >
                      Reset demo data
                    </MenuItem>
                    <MenuItem
                      tone="danger"
                      icon={<Eraser aria-hidden className="size-4" />}
                      onClick={() => {
                        lib.clear()
                        close()
                        toast('Library cleared', { label: 'Undo', onClick: () => lib.reset() })
                      }}
                    >
                      Start empty
                    </MenuItem>
                    <MenuItem
                      icon={<Home aria-hidden className="size-4" />}
                      onClick={() => {
                        close()
                        navigate('/')
                      }}
                    >
                      Back to the site
                    </MenuItem>
                  </>
                )}
              </Popover>
            </div>
          </header>
          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-[274px] shrink-0 border-r border-line md:block">
              <div className="sticky top-0">
                <Sidebar />
              </div>
            </aside>
            <main id="app-main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
              {children}
            </main>
          </div>
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div aria-hidden className="absolute inset-0 animate-fade bg-ink/25" onClick={() => setDrawer(false)} />
          <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Library menu" className={cx('absolute inset-y-0 left-0 w-[300px] max-w-[86vw] animate-[fade_200ms_ease-out] overflow-y-auto bg-panel shadow-pop')}>
            <div className="flex h-[66px] items-center justify-between border-b border-line px-4">
              <Logo />
              <IconButton label="Close library menu" onClick={() => setDrawer(false)}>
                <X aria-hidden className="size-5" />
              </IconButton>
            </div>
            <Sidebar onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <SaveDialog open={save.open} collectionId={save.collectionId} onClose={() => setSave({ open: false })} />
      <NewCollectionDialog open={newCol} onClose={() => setNewCol(false)} />
    </Ctx.Provider>
  )
}
