import { useCallback, useMemo } from 'react'

import { SEED_COLLECTIONS, SEED_ITEMS } from '../content'
import type { Collection, Item, Kind, Swatch } from '../content'
import { daysAgo } from './dates'
import { useStored, writeStore } from './storage'

/*
  The library: bookmarks and collections, saved in localStorage under
  `keepsake:library`. The first visit materialises the seed shelf with dates
  relative to today, so "two weeks ago" always finds something. Replace this
  module with D1 calls when you add accounts.
*/

export type Library = { version: 1; items: Item[]; collections: Collection[] }

export function seedLibrary(now = new Date()): Library {
  return {
    version: 1,
    collections: SEED_COLLECTIONS.map((c) => ({ ...c })),
    items: SEED_ITEMS.map(({ daysAgo: n, ...rest }) => ({ ...rest, tags: [...rest.tags], savedAt: daysAgo(n, now).toISOString() })),
  }
}

const KEY = 'library'
const EMPTY: Library = { version: 1, items: [], collections: [] }
let initial: Library | null = null
function fallback() {
  initial ??= seedLibrary()
  return initial
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48)
}

const SWATCHES: Swatch[] = ['sand', 'lilac', 'sky', 'sage', 'blush']

/** Guess a title and type from a pasted URL, the way an unfurler would. */
export function guessFromUrl(url: string): { title: string; kind: Kind } {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop() ?? u.hostname
    const words = decodeURIComponent(last).replace(/\.[a-z0-9]+$/i, '').replace(/[-_+]+/g, ' ').trim()
    const title = words ? words.charAt(0).toUpperCase() + words.slice(1) : u.hostname.replace(/^www\./, '')
    const host = u.hostname
    const kind: Kind = /youtube|vimeo|video/.test(host) || /\/watch/.test(u.pathname)
      ? 'video'
      : /\.(png|jpe?g|gif|webp|avif)$/i.test(u.pathname) || /dribbble|unsplash|are\.na|pinterest/.test(host)
        ? 'image'
        : /fonts?|type/.test(host)
          ? 'font'
          : /shop|store|buy/.test(host)
            ? 'product'
            : 'article'
    return { title, kind }
  } catch {
    return { title: '', kind: 'article' }
  }
}

export function normaliseUrl(raw: string) {
  const s = raw.trim()
  if (!s) return ''
  return /^https?:\/\//i.test(s) ? s : `https://${s}`
}

export function isValidUrl(raw: string) {
  try {
    const u = new URL(normaliseUrl(raw))
    return /\./.test(u.hostname) && !/\s/.test(raw.trim())
  } catch {
    return false
  }
}

export type NewItem = { url: string; title: string; why: string; tags: string[]; collectionId: string | null; kind: Kind }

export function useLibrary() {
  const [lib, setLib] = useStored<Library>(KEY, fallback())

  const addItem = useCallback(
    (input: NewItem) => {
      const id = `${slugify(input.title) || 'save'}-${Date.now().toString(36)}`
      const item: Item = {
        id,
        url: normaliseUrl(input.url),
        title: input.title.trim(),
        note: input.why.trim().split(/[.!?]/)[0].slice(0, 70),
        why: input.why.trim(),
        tags: input.tags,
        collectionId: input.collectionId,
        savedAt: new Date().toISOString(),
        favourite: false,
        kind: input.kind,
        swatch: SWATCHES[Math.floor(Math.random() * SWATCHES.length)],
      }
      setLib((l) => ({ ...l, items: [item, ...l.items] }))
      return item
    },
    [setLib],
  )

  const updateItem = useCallback((id: string, patch: Partial<Item>) => setLib((l) => ({ ...l, items: l.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })), [setLib])
  const removeItem = useCallback((id: string) => setLib((l) => ({ ...l, items: l.items.filter((i) => i.id !== id) })), [setLib])
  const restoreItem = useCallback((item: Item, index: number) => setLib((l) => {
    const items = [...l.items]
    items.splice(Math.min(index, items.length), 0, item)
    return { ...l, items }
  }), [setLib])
  const toggleFavourite = useCallback((id: string) => setLib((l) => ({ ...l, items: l.items.map((i) => (i.id === id ? { ...i, favourite: !i.favourite } : i)) })), [setLib])

  const addCollection = useCallback(
    (name: string, description = '') => {
      const base = slugify(name) || 'collection'
      let id = base
      const taken = new Set(lib.collections.map((c) => c.id))
      for (let n = 2; taken.has(id); n++) id = `${base}-${n}`
      const c: Collection = { id, name: name.trim(), description: description.trim() }
      setLib((l) => ({ ...l, collections: [...l.collections, c] }))
      return c
    },
    [lib.collections, setLib],
  )
  const updateCollection = useCallback((id: string, patch: Partial<Collection>) => setLib((l) => ({ ...l, collections: l.collections.map((c) => (c.id === id ? { ...c, ...patch } : c)) })), [setLib])
  const removeCollection = useCallback(
    (id: string) => setLib((l) => ({ ...l, collections: l.collections.filter((c) => c.id !== id), items: l.items.map((i) => (i.collectionId === id ? { ...i, collectionId: null } : i)) })),
    [setLib],
  )

  const restoreCollection = useCallback(
    (c: Collection, itemIds: string[]) => {
      const ids = new Set(itemIds)
      setLib((l) => ({ ...l, collections: l.collections.some((x) => x.id === c.id) ? l.collections : [...l.collections, c], items: l.items.map((i) => (ids.has(i.id) ? { ...i, collectionId: c.id } : i)) }))
    },
    [setLib],
  )

  const reset = useCallback(() => {
    initial = seedLibrary()
    writeStore(KEY, initial)
  }, [])
  const clear = useCallback(() => writeStore(KEY, EMPTY), [])

  const counts = useMemo(() => {
    const byCollection: Record<string, number> = {}
    for (const i of lib.items) if (i.collectionId) byCollection[i.collectionId] = (byCollection[i.collectionId] ?? 0) + 1
    return { all: lib.items.length, favourites: lib.items.filter((i) => i.favourite).length, byCollection }
  }, [lib.items])

  return { ...lib, counts, addItem, updateItem, removeItem, restoreItem, toggleFavourite, addCollection, updateCollection, removeCollection, restoreCollection, reset, clear }
}

export type LibraryApi = ReturnType<typeof useLibrary>
