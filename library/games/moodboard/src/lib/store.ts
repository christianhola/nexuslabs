import { useSyncExternalStore } from 'react'

import { COPY, seedBoards } from '../content'
import { uid } from './cx'
import type { Board, Camera, Item } from './types'

/*
  One small external store for every board. Boards (items + camera) persist
  to localStorage; uploaded image blobs live in IndexedDB (see idb.ts).
  Undo history is per board and in memory only.
*/

const STORAGE_KEY = 'inspo.boards.v1'
const ACTIVE_KEY = 'inspo.active.v1'
const HISTORY_LIMIT = 100

type History = { past: Item[][]; future: Item[][] }

export type State = {
  boards: Board[]
  activeId: string
  selection: string[]
  history: Record<string, History>
}

function load(): Pick<State, 'boards' | 'activeId'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const boards = JSON.parse(raw) as Board[]
      if (Array.isArray(boards)) {
        const activeId = localStorage.getItem(ACTIVE_KEY) ?? boards[0]?.id ?? ''
        return { boards, activeId: boards.some((b) => b.id === activeId) ? activeId : (boards[0]?.id ?? '') }
      }
    }
  } catch {
    /* corrupt or blocked storage: start fresh */
  }
  const boards = seedBoards()
  return { boards, activeId: boards[0]!.id }
}

let state: State = { ...load(), selection: [], history: {} }
const listeners = new Set<() => void>()
let saveTimer: ReturnType<typeof setTimeout> | undefined

function persist() {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.boards))
      localStorage.setItem(ACTIVE_KEY, state.activeId)
    } catch {
      /* quota or private mode: keep working in memory */
    }
  }, 250)
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.boards))
      localStorage.setItem(ACTIVE_KEY, state.activeId)
    } catch {
      /* ignore */
    }
  })
}

function set(next: Partial<State>, save = true) {
  state = { ...state, ...next }
  if (save) persist()
  for (const l of listeners) l()
}

export function getState() {
  return state
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => selector(state),
    () => selector(state),
  )
}

export const activeBoard = (s: State = state) => s.boards.find((b) => b.id === s.activeId)

function patchBoard(id: string, fn: (b: Board) => Board, save = true) {
  set({ boards: state.boards.map((b) => (b.id === id ? fn(b) : b)) }, save)
}

function historyOf(id: string): History {
  return state.history[id] ?? { past: [], future: [] }
}

/* ---------- boards ---------- */

export function setActive(id: string) {
  if (state.activeId === id) return
  set({ activeId: id, selection: [] })
}

export function createBoard(name: string = COPY.newBoardName, items: Item[] = []): Board {
  const board: Board = {
    id: uid('b'),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items,
    camera: { cx: 0, cy: 0, zoom: 1 },
  }
  set({ boards: [board, ...state.boards], activeId: board.id, selection: [] })
  return board
}

export function renameBoard(id: string, name: string) {
  patchBoard(id, (b) => ({ ...b, name: name.trim() || b.name, updatedAt: Date.now() }))
}

export function duplicateBoard(id: string): Board | undefined {
  const src = state.boards.find((b) => b.id === id)
  if (!src) return
  const copy: Board = {
    ...structuredClone(src),
    id: uid('b'),
    name: `${src.name} copy`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  const i = state.boards.indexOf(src)
  const boards = [...state.boards]
  boards.splice(i + 1, 0, copy)
  set({ boards })
  return copy
}

export function deleteBoard(id: string) {
  const boards = state.boards.filter((b) => b.id !== id)
  const activeId = state.activeId === id ? (boards[0]?.id ?? '') : state.activeId
  const history = { ...state.history }
  delete history[id]
  set({ boards, activeId, selection: state.activeId === id ? [] : state.selection, history })
}

export function restoreBoard(board: Board, index: number) {
  const boards = [...state.boards]
  boards.splice(Math.min(index, boards.length), 0, board)
  set({ boards })
}

export function resetDemo() {
  const boards = seedBoards()
  set({ boards, activeId: boards[0]!.id, selection: [], history: {} })
}

export function setCamera(id: string, camera: Camera) {
  patchBoard(id, (b) => ({ ...b, camera }))
}

/* ---------- items ---------- */

/** Replace items without recording history (live drags). Call beginGesture first. */
export function setItemsLive(id: string, items: Item[]) {
  patchBoard(id, (b) => ({ ...b, items }), false)
}

let gestureSnapshot: { id: string; items: Item[] } | null = null

export function beginGesture(id: string) {
  const b = state.boards.find((x) => x.id === id)
  if (b) gestureSnapshot = { id, items: b.items }
}

export function endGesture() {
  const snap = gestureSnapshot
  gestureSnapshot = null
  if (!snap) return
  const b = state.boards.find((x) => x.id === snap.id)
  if (!b || b.items === snap.items) return
  pushHistory(snap.id, snap.items)
  patchBoard(snap.id, (x) => ({ ...x, updatedAt: Date.now() }))
}

function pushHistory(id: string, prev: Item[]) {
  const h = historyOf(id)
  set({
    history: { ...state.history, [id]: { past: [...h.past, prev].slice(-HISTORY_LIMIT), future: [] } },
  }, false)
}

/** Apply a change and record it for undo. */
export function commit(id: string, fn: (items: Item[]) => Item[]) {
  const b = state.boards.find((x) => x.id === id)
  if (!b) return
  const next = fn(b.items)
  if (next === b.items) return
  pushHistory(id, b.items)
  patchBoard(id, (x) => ({ ...x, items: next, updatedAt: Date.now() }))
}

export function undo(id: string) {
  const h = historyOf(id)
  const b = state.boards.find((x) => x.id === id)
  const prev = h.past[h.past.length - 1]
  if (!b || !prev) return false
  set({
    history: { ...state.history, [id]: { past: h.past.slice(0, -1), future: [b.items, ...h.future] } },
    selection: state.selection.filter((s) => prev.some((i) => i.id === s)),
  }, false)
  patchBoard(id, (x) => ({ ...x, items: prev, updatedAt: Date.now() }))
  return true
}

export function redo(id: string) {
  const h = historyOf(id)
  const b = state.boards.find((x) => x.id === id)
  const next = h.future[0]
  if (!b || !next) return false
  set({
    history: { ...state.history, [id]: { past: [...h.past, b.items], future: h.future.slice(1) } },
    selection: state.selection.filter((s) => next.some((i) => i.id === s)),
  }, false)
  patchBoard(id, (x) => ({ ...x, items: next, updatedAt: Date.now() }))
  return true
}

export function select(ids: string[]) {
  const same = ids.length === state.selection.length && ids.every((v, i) => v === state.selection[i])
  if (!same) set({ selection: ids }, false)
}

/* ---------- item helpers (pure, used with commit) ---------- */

export const updateItem = (id: string, patch: Partial<Item>) => (items: Item[]) =>
  items.map((i) => (i.id === id ? { ...i, ...patch } : i))

export const removeItems = (ids: string[]) => (items: Item[]) => items.filter((i) => !ids.includes(i.id))

export function reorder(items: Item[], ids: string[], dir: 'forward' | 'backward' | 'front' | 'back'): Item[] {
  const sel = new Set(ids)
  if (dir === 'front') return [...items.filter((i) => !sel.has(i.id)), ...items.filter((i) => sel.has(i.id))]
  if (dir === 'back') return [...items.filter((i) => sel.has(i.id)), ...items.filter((i) => !sel.has(i.id))]
  const out = [...items]
  if (dir === 'forward') {
    for (let i = out.length - 2; i >= 0; i--) {
      if (sel.has(out[i]!.id) && !sel.has(out[i + 1]!.id)) [out[i], out[i + 1]] = [out[i + 1]!, out[i]!]
    }
  } else {
    for (let i = 1; i < out.length; i++) {
      if (sel.has(out[i]!.id) && !sel.has(out[i - 1]!.id)) [out[i], out[i - 1]] = [out[i - 1]!, out[i]!]
    }
  }
  return out
}

export function cloneItems(src: Item[], offset = 24): Item[] {
  return src.map((i) => ({ ...structuredClone(i), id: uid(), x: i.x + offset, y: i.y + offset }))
}
