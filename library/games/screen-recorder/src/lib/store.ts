import { useSyncExternalStore } from 'react'

import { type Comment, type Playlist, PLAYLISTS, type Recording, seedComments, seedRecordings } from '@/content'

/*
  The whole library lives in localStorage under one key, so a reload keeps
  recordings, playlists and comments. Replace `load`/`save` with API calls
  when you move it to a database.
*/

export type State = {
  version: 1
  recordings: Recording[]
  comments: Comment[]
  playlists: Playlist[]
  connected: string[] // integration ids
}

const KEY = 'clipwise:v1'

function fresh(): State {
  return { version: 1, recordings: seedRecordings(), comments: seedComments(), playlists: PLAYLISTS, connected: ['kestrel'] }
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as State
      if (s.version === 1 && Array.isArray(s.recordings)) return s
    }
  } catch {
    /* fall through to seed */
  }
  return fresh()
}

let state: State | null = null
const listeners = new Set<() => void>()

function get(): State {
  if (!state) state = load()
  return state
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* storage full or blocked: keep working in memory */
  }
}

export function update(fn: (s: State) => State) {
  state = fn(get())
  save()
  listeners.forEach((l) => l())
}

export function resetDemo() {
  state = fresh()
  save()
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return
    state = load()
    l()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(l)
    window.removeEventListener('storage', onStorage)
  }
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(get()),
    () => select(get()),
  )
}

export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`

// ---- actions --------------------------------------------------------------

export const actions = {
  addRecording(r: Recording) {
    update((s) => ({ ...s, recordings: [r, ...s.recordings] }))
  },
  patchRecording(id: string, patch: Partial<Recording>) {
    update((s) => ({ ...s, recordings: s.recordings.map((r) => (r.id === id ? { ...r, ...patch } : r)) }))
  },
  removeRecording(id: string) {
    const prev = get()
    const rec = prev.recordings.find((r) => r.id === id)
    const idx = prev.recordings.findIndex((r) => r.id === id)
    update((s) => ({ ...s, recordings: s.recordings.filter((r) => r.id !== id) }))
    return () => {
      if (!rec) return
      update((s) => {
        const next = [...s.recordings]
        next.splice(idx, 0, rec)
        return { ...s, recordings: next }
      })
    }
  },
  markWatched(id: string) {
    const r = get().recordings.find((x) => x.id === id)
    if (!r || r.watched) return
    update((s) => ({ ...s, recordings: s.recordings.map((x) => (x.id === id ? { ...x, watched: true, views: x.views + 1 } : x)) }))
  },
  addPlaylist(name: string) {
    const p = { id: uid('pl'), name }
    update((s) => ({ ...s, playlists: [...s.playlists, p] }))
    return p
  },
  renamePlaylist(id: string, name: string) {
    update((s) => ({ ...s, playlists: s.playlists.map((p) => (p.id === id ? { ...p, name } : p)) }))
  },
  removePlaylist(id: string) {
    update((s) => ({
      ...s,
      playlists: s.playlists.filter((p) => p.id !== id),
      recordings: s.recordings.map((r) => (r.playlistId === id ? { ...r, playlistId: null } : r)),
    }))
  },
  addComment(c: Comment) {
    update((s) => ({ ...s, comments: [...s.comments, c] }))
  },
  patchComment(id: string, patch: Partial<Comment>) {
    update((s) => ({ ...s, comments: s.comments.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  },
  removeComment(id: string) {
    update((s) => ({ ...s, comments: s.comments.filter((c) => c.id !== id) }))
  },
  react(id: string, emoji: string) {
    update((s) => ({
      ...s,
      comments: s.comments.map((c) => {
        if (c.id !== id) return c
        const r = { ...(c.reactions ?? {}) }
        r[emoji] = (r[emoji] ?? 0) + 1
        return { ...c, reactions: r }
      }),
    }))
  },
  toggleIntegration(id: string) {
    update((s) => ({ ...s, connected: s.connected.includes(id) ? s.connected.filter((x) => x !== id) : [...s.connected, id] }))
  },
}
