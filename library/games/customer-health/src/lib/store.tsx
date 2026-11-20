import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react'

import {
  accounts as seed,
  DEFAULT_RANGE,
  DEFAULT_THRESHOLD,
  DEFAULT_WEIGHTS,
  isoFromToday,
  SEGMENTS,
  type Account,
  type Activity,
  type Range,
  type Segment,
} from '../data'
import { rescore, type Weights } from './scoring'
import { usePersistentState } from './storage'

/*
  App state in one context. Everything the user changes is persisted to
  localStorage (keys prefixed "customer-health:"); everything else is derived.

  seed accounts -> logged touches -> re-scored by the weights -> filtered by
  the included segments = `accounts`, which every page reads.
*/

type Settings = { weights: Weights; threshold: number; excluded: Segment[] }
const DEFAULT_SETTINGS: Settings = { weights: DEFAULT_WEIGHTS, threshold: DEFAULT_THRESHOLD, excluded: [] }

type Store = {
  /** Included segments only, re-scored. */
  accounts: Account[]
  /** Every account, re-scored (for counts in Settings). */
  all: Account[]
  byId: (id: string) => Account | undefined
  settings: Settings
  setThreshold: (t: number) => void
  setWeights: (w: Weights) => void
  toggleSegment: (s: Segment) => void
  resetSettings: () => void
  range: Range
  setRange: (r: Range) => void
  notes: Record<string, Activity[]>
  addNote: (id: string, text: string, kind?: Activity['kind']) => void
  removeNote: (id: string, noteId: string) => void
  logTouch: (id: string) => void
  undoTouch: (id: string, previous: number) => void
  checks: Record<string, string[]>
  toggleCheck: (playbook: string, account: string, step: string) => void
  resetChecks: (playbook: string, account: string) => void
  assignees: Record<string, string>
  setAssignee: (playbook: string, step: string, person: string) => void
  columns: string[] | null
  setColumns: (c: string[]) => void
}

const Ctx = createContext<Store | null>(null)

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside <StoreProvider>')
  return s
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [touches, setTouches] = usePersistentState<Record<string, number>>('touches', {})
  const [settings, setSettings] = usePersistentState<Settings>('settings', DEFAULT_SETTINGS)
  const [range, setRange] = usePersistentState<Range>('range', DEFAULT_RANGE)
  const [notes, setNotes] = usePersistentState<Record<string, Activity[]>>('notes', {})
  const [checks, setChecks] = usePersistentState<Record<string, string[]>>('checks', {})
  const [assignees, setAssignees] = usePersistentState<Record<string, string>>('assignees', {})
  const [columns, setColumns] = usePersistentState<string[] | null>('columns', null)

  const all = useMemo(() => {
    const touched = seed.map((a) => (touches[a.id] === undefined ? a : { ...a, lastTouchDays: touches[a.id]! }))
    return rescore(touched, { ...DEFAULT_WEIGHTS, ...settings.weights })
  }, [touches, settings.weights])
  const accounts = useMemo(() => (settings.excluded.length ? all.filter((a) => !settings.excluded.includes(a.segment)) : all), [all, settings.excluded])
  const index = useMemo(() => new Map(all.map((a) => [a.id, a])), [all])

  const addNote = useCallback(
    (id: string, text: string, kind: Activity['kind'] = 'note') =>
      setNotes((n) => ({ ...n, [id]: [{ id: `${id}-${Date.now()}`, kind, date: isoFromToday(0), author: 'You', text }, ...(n[id] ?? [])] })),
    [setNotes],
  )

  const store: Store = {
    accounts,
    all,
    byId: (id) => index.get(id),
    settings,
    setThreshold: useCallback((t: number) => setSettings((s) => ({ ...s, threshold: t })), [setSettings]),
    setWeights: (w) => setSettings((s) => ({ ...s, weights: w })),
    toggleSegment: (seg) =>
      setSettings((s) => {
        const excluded = s.excluded.includes(seg) ? s.excluded.filter((x) => x !== seg) : [...s.excluded, seg]
        // Keep at least one segment.
        return excluded.length >= SEGMENTS.length ? s : { ...s, excluded }
      }),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
    range,
    setRange,
    notes,
    addNote,
    removeNote: (id, noteId) => setNotes((n) => ({ ...n, [id]: (n[id] ?? []).filter((x) => x.id !== noteId) })),
    logTouch: useCallback(
      (id: string) => {
        setTouches((t) => ({ ...t, [id]: 0 }))
        addNote(id, 'Logged a customer touch', 'touch')
      },
      [setTouches, addNote],
    ),
    undoTouch: (id, previous) => {
      setTouches((t) => ({ ...t, [id]: previous }))
      setNotes((n) => {
        const list = n[id] ?? []
        const i = list.findIndex((x) => x.kind === 'touch')
        return i < 0 ? n : { ...n, [id]: list.filter((_, j) => j !== i) }
      })
    },
    checks,
    toggleCheck: (pb, acct, step) =>
      setChecks((c) => {
        const key = `${pb}:${acct}`
        const cur = c[key] ?? []
        return { ...c, [key]: cur.includes(step) ? cur.filter((x) => x !== step) : [...cur, step] }
      }),
    resetChecks: (pb, acct) =>
      setChecks((c) => {
        const next = { ...c }
        delete next[`${pb}:${acct}`]
        return next
      }),
    assignees,
    setAssignee: (pb, step, person) => setAssignees((a) => ({ ...a, [`${pb}:${step}`]: person })),
    columns,
    setColumns,
  }

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}
