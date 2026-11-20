import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ImagePlus, Upload } from 'lucide-react'

import { COPY, HERO_OFFSET_Y, LANDING_ITEMS, LANDING_SELECTED } from '../content'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { useToast } from '../components/Toast'
import { cx, prefersReducedMotion, uid } from '../lib/cx'
import { boardToPng, downloadBlob, fileName } from '../lib/exportPng'
import {
  center,
  clamp,
  fitCamera,
  intersects,
  itemBounds,
  normRect,
  resizeItem,
  screenToWorld,
  snapRect,
  unionRect,
  zoomAt,
  type Guide,
  type Vec,
} from '../lib/geometry'
import { storeImageFiles } from '../lib/images'
import { extractPalette } from '../lib/palette'
import { boardPath, navigate } from '../lib/router'
import {
  beginGesture,
  cloneItems,
  commit,
  endGesture,
  getState,
  removeItems,
  reorder,
  select,
  setActive,
  setCamera,
  setItemsLive,
  undo,
  redo,
  updateItem,
  useStore,
} from '../lib/store'
import type { Board, Camera, Item, NoteColor } from '../lib/types'
import { CanvasItem } from './CanvasItem'
import { ContextBar } from './ContextBar'
import { BottomTools, TopBar, ZoomBar, type Tool } from './EditorChrome'
import { Hero } from './Hero'
import { Minimap } from './Minimap'
import { SelectionLayer, HANDLES } from './SelectionLayer'
import { ShortcutsSheet } from './ShortcutsSheet'

type Gesture =
  | { type: 'pan'; sx: number; sy: number; cam: Camera }
  | { type: 'move'; start: Vec; starts: Item[]; others: ReturnType<typeof itemBounds>[]; moved: boolean; clickId: string | null }
  | { type: 'marquee'; start: Vec; base: string[] }
  | { type: 'resize'; hx: number; hy: number; starts: Item[]; group: ReturnType<typeof itemBounds> }
  | { type: 'rotate'; start: Item; c: Vec; a0: number }
  | { type: 'pinch'; d0: number; m0: Vec; cam: Camera }

let clipboard: Item[] = []

/** Zoom at which the landing composition fits the window. */
export function landingZoom(vw: number, vh: number) {
  if (vw >= 900) return clamp(vw / 1440, 0.6, 1)
  // Phones and tablets: zoom by height so the column above and below the hero fills.
  return clamp(Math.max(vw / 1440, vh / 1450), 0.34, 0.75)
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ w: typeof window !== 'undefined' ? window.innerWidth : 1440, h: typeof window !== 'undefined' ? window.innerHeight : 900 })
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

const isTyping = (t: EventTarget | null) =>
  t instanceof HTMLElement && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))

export function Editor({ boardId, landing = false }: { boardId?: string; landing?: boolean }) {
  const rootRef = useRef<HTMLElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const { w: vw, h: vh } = useSize(rootRef)
  const toast = useToast()

  const stored = useStore((s) => s.boards.find((b) => b.id === (boardId ?? s.activeId)))
  const storeSelection = useStore((s) => s.selection)
  const hist = useStore((s) => (stored ? s.history[stored.id] : undefined))

  const landingBoard = useMemo<Board>(
    () => ({ id: 'landing', name: COPY.brand, createdAt: 0, updatedAt: 0, items: LANDING_ITEMS, camera: { cx: 0, cy: 0, zoom: 1 } }),
    [],
  )
  const board = landing ? landingBoard : stored
  const camera: Camera = landing ? { cx: 0, cy: 0, zoom: landingZoom(vw, vh) } : (board?.camera ?? { cx: 0, cy: 0, zoom: 1 })
  const items = board?.items ?? []
  const selection = landing ? LANDING_SELECTED : storeSelection
  const selected = useMemo(() => items.filter((i) => selection.includes(i.id)), [items, selection])

  const [tool, setTool] = useState<Tool>('select')
  const [space, setSpace] = useState(false)
  const [gesture, setGestureState] = useState<Gesture['type'] | null>(null)
  const [guides, setGuides] = useState<Guide[]>([])
  const [marquee, setMarquee] = useState<ReturnType<typeof normRect> | null>(null)
  const [rotating, setRotating] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [showMinimap, setShowMinimap] = useState(() => typeof window === 'undefined' || window.innerWidth >= 768)
  const [sheet, setSheet] = useState(false)
  const [exporting, setExporting] = useState(false)

  const g = useRef<Gesture | null>(null)
  const pointers = useRef(new Map<number, Vec>())
  const camRef = useRef(camera)
  camRef.current = camera

  // Keep the store's active board in step with the URL.
  useEffect(() => {
    if (!landing && boardId && stored) setActive(boardId)
  }, [landing, boardId, stored])

  useEffect(() => {
    document.title = landing ? COPY.title : `${board?.name ?? 'Board'} — ${COPY.brand}`
  }, [landing, board?.name])

  const id = board?.id ?? ''
  const setCam = useCallback((c: Camera) => !landing && id && setCamera(id, c), [landing, id])

  const toWorld = useCallback(
    (clientX: number, clientY: number) => {
      const r = rootRef.current!.getBoundingClientRect()
      return screenToWorld({ x: clientX - r.left, y: clientY - r.top }, camRef.current, r.width, r.height)
    },
    [],
  )

  /* ---------- adding things ---------- */

  const viewCenter = () => ({ x: camRef.current.cx, y: camRef.current.cy })

  const addItems = useCallback(
    (newItems: Item[], opts: { edit?: boolean } = {}) => {
      if (!id) return
      commit(id, (its) => [...its, ...newItems])
      select(newItems.map((i) => i.id))
      if (opts.edit && newItems[0]) setEditingId(newItems[0].id)
      setTool('select')
    },
    [id],
  )

  const addFiles = useCallback(
    async (files: File[], at?: Vec) => {
      const imgs = files.filter((f) => f.type.startsWith('image/'))
      if (!imgs.length) {
        if (files.length) toast('Only image files can be added', { tone: 'error' })
        return
      }
      const ups = await storeImageFiles(imgs)
      if (!ups.length) {
        toast('That image could not be read', { tone: 'error' })
        return
      }
      const p = at ?? viewCenter()
      const max = 360
      const made = ups.map((u, i): Item => {
        const s = Math.min(1, max / Math.max(u.w, u.h))
        const w = Math.round(u.w * s)
        const h = Math.round(u.h * s)
        return { id: uid(), kind: 'image', src: u.src, alt: u.alt, x: p.x - w / 2 + i * 28, y: p.y - h / 2 + i * 28, w, h, rotation: 0 }
      })
      addItems(made)
      toast(made.length === 1 ? 'Image added' : `${made.length} images added`)
    },
    [addItems, toast],
  )

  const addNote = useCallback(() => {
    const p = viewCenter()
    const colors: NoteColor[] = ['butter', 'blush', 'sky', 'mint', 'lilac']
    addItems(
      [{ id: uid(), kind: 'note', x: p.x - 110, y: p.y - 100, w: 220, h: 200, rotation: 0, color: colors[Math.floor(Math.random() * colors.length)], text: '' }],
      { edit: true },
    )
  }, [addItems])

  const addText = useCallback(() => {
    const p = viewCenter()
    addItems([{ id: uid(), kind: 'text', x: p.x - 160, y: p.y - 26, w: 320, h: 53, rotation: 0, fontSize: 48, text: 'Heading' }], { edit: true })
  }, [addItems])

  /* ---------- selection actions ---------- */

  const sel = useCallback(() => getState().selection, [])

  const actions = useMemo(
    () => ({
      remove: () => {
        const ids = sel()
        if (!ids.length) return
        commit(id, removeItems(ids))
        select([])
      },
      duplicate: () => {
        const ids = sel()
        const src = (getState().boards.find((b) => b.id === id)?.items ?? []).filter((i) => ids.includes(i.id))
        if (!src.length) return
        const copies = cloneItems(src)
        commit(id, (its) => [...its, ...copies])
        select(copies.map((c) => c.id))
      },
      order: (dir: 'forward' | 'backward' | 'front' | 'back') => {
        const ids = sel()
        if (ids.length) commit(id, (its) => reorder(its, ids, dir))
      },
      rotate: (deg: number) => {
        const ids = sel()
        commit(id, (its) => its.map((i) => (ids.includes(i.id) ? { ...i, rotation: (((i.rotation + deg + 180) % 360) + 360) % 360 - 180 } : i)))
      },
      noteColor: (c: NoteColor) => {
        const ids = sel()
        commit(id, (its) => its.map((i) => (ids.includes(i.id) && i.kind === 'note' ? { ...i, color: c } : i)))
      },
      swatches: async () => {
        const it = (getState().boards.find((b) => b.id === id)?.items ?? []).find((i) => i.id === sel()[0])
        if (!it || it.kind !== 'image') return
        const colors = await extractPalette(it.src, 5)
        if (!colors.length) {
          toast('Could not read colours from this image', { tone: 'error' })
          return
        }
        const b = itemBounds(it)
        addItems([{ id: uid(), kind: 'swatch', x: b.x, y: b.y + b.h + 16, w: Math.max(260, Math.min(360, b.w)), h: 100, rotation: 0, colors }])
        toast('Palette extracted')
      },
      copyHex: (colors: string[]) => {
        navigator.clipboard?.writeText(colors.join(' ')).then(
          () => toast('Hex codes copied'),
          () => toast('Clipboard is blocked in this browser', { tone: 'error' }),
        )
      },
    }),
    [id, addItems, toast],
  )

  /* ---------- camera ---------- */

  const zoomBy = useCallback(
    (factor: number, anchor?: Vec) => {
      const c = camRef.current
      setCam(zoomAt(c, c.zoom * factor, anchor ?? { x: vw / 2, y: vh / 2 }, vw, vh))
    },
    [setCam, vw, vh],
  )
  const zoomTo = useCallback((z: number) => setCam(zoomAt(camRef.current, z, { x: vw / 2, y: vh / 2 }, vw, vh)), [setCam, vw, vh])
  const zoomFit = useCallback(() => {
    const r = unionRect((getState().boards.find((b) => b.id === id)?.items ?? []).map(itemBounds))
    if (r) setCam(fitCamera(r, vw, vh, vw < 640 ? 32 : 96, 2))
    else setCam({ cx: 0, cy: 0, zoom: 1 })
  }, [id, setCam, vw, vh])

  // Wheel: pinch / ctrl+wheel zooms, plain wheel and two-finger drag pan.
  useEffect(() => {
    const el = rootRef.current
    if (!el || landing) return
    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest('[data-chrome]')) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      const c = camRef.current
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0085))
        setCam(zoomAt(c, c.zoom * factor, { x: e.clientX - r.left, y: e.clientY - r.top }, r.width, r.height))
      } else {
        const k = e.deltaMode === 1 ? 16 : 1
        setCam({ ...c, cx: c.cx + (e.deltaX * k) / c.zoom, cy: c.cy + (e.deltaY * k) / c.zoom })
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [landing, setCam])

  /* ---------- pointer gestures ---------- */

  const panning = tool === 'hand' || space

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (landing || !board) return
    const target = e.target as HTMLElement
    // Ignore chrome, and events bubbling through React portals (dialogs, toasts).
    if (!rootRef.current?.contains(target) || target.closest('[data-chrome]')) return
    const focused = document.activeElement as HTMLElement | null
    if (focused?.closest('[data-chrome]')) focused.blur()
    if (editingId && !target.closest(`[data-item-id="${editingId}"]`)) (document.activeElement as HTMLElement | null)?.blur?.()
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    rootRef.current?.setPointerCapture(e.pointerId)

    // Two fingers: pinch-zoom.
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()] as [Vec, Vec]
      if (g.current?.type === 'move' || g.current?.type === 'resize') endGesture()
      g.current = { type: 'pinch', d0: Math.hypot(a.x - b.x, a.y - b.y), m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, cam: camRef.current }
      setGestureState('pinch')
      setMarquee(null)
      return
    }

    const handle = target.closest<HTMLElement>('[data-handle]')?.dataset.handle
    const itemEl = target.closest<HTMLElement>('[data-item-id]')
    const itemId = itemEl?.dataset.itemId ?? null
    const world = toWorld(e.clientX, e.clientY)
    const touchEmpty = e.pointerType === 'touch' && !itemId && !handle

    if (e.button === 1 || (e.button === 0 && panning) || touchEmpty) {
      e.preventDefault()
      g.current = { type: 'pan', sx: e.clientX, sy: e.clientY, cam: camRef.current }
      setGestureState('pan')
      return
    }
    if (e.button !== 0) return

    if (handle === 'rotate' && selected.length === 1) {
      const it = selected[0]!
      const c = center(it)
      beginGesture(id)
      g.current = { type: 'rotate', start: it, c, a0: Math.atan2(world.y - c.y, world.x - c.x) }
      setGestureState('rotate')
      setRotating(it.rotation)
      return
    }
    if (handle) {
      const hd = HANDLES.find((h) => h.id === handle)!
      beginGesture(id)
      g.current = { type: 'resize', hx: hd.hx, hy: hd.hy, starts: selected, group: unionRect(selected.map((i) => ({ x: i.x, y: i.y, w: i.w, h: i.h })))! }
      setGestureState('resize')
      return
    }
    if (itemId) {
      if (editingId === itemId) return
      let ids = selection
      if (e.shiftKey) ids = selection.includes(itemId) ? selection.filter((s) => s !== itemId) : [...selection, itemId]
      else if (!selection.includes(itemId)) ids = [itemId]
      select(ids)
      const moving = items.filter((i) => ids.includes(i.id))
      beginGesture(id)
      g.current = {
        type: 'move',
        start: world,
        starts: moving,
        others: items.filter((i) => !ids.includes(i.id)).map(itemBounds),
        moved: false,
        clickId: !e.shiftKey && selection.includes(itemId) && selection.length > 1 ? itemId : null,
      }
      setGestureState('move')
      return
    }
    // Empty canvas: marquee.
    g.current = { type: 'marquee', start: world, base: e.shiftKey ? selection : [] }
    if (!e.shiftKey) select([])
    setGestureState('marquee')
  }

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    const cur = g.current
    if (!cur || !board) return
    const world = toWorld(e.clientX, e.clientY)
    switch (cur.type) {
      case 'pan': {
        const c = cur.cam
        setCam({ ...c, cx: c.cx - (e.clientX - cur.sx) / c.zoom, cy: c.cy - (e.clientY - cur.sy) / c.zoom })
        break
      }
      case 'pinch': {
        const pts = [...pointers.current.values()]
        if (pts.length < 2) return
        const [a, b] = pts as [Vec, Vec]
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        const m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        const r = rootRef.current!.getBoundingClientRect()
        const zoomed = zoomAt(cur.cam, cur.cam.zoom * (d / cur.d0), { x: cur.m0.x - r.left, y: cur.m0.y - r.top }, vw, vh)
        setCam({ ...zoomed, cx: zoomed.cx - (m.x - cur.m0.x) / zoomed.zoom, cy: zoomed.cy - (m.y - cur.m0.y) / zoomed.zoom })
        break
      }
      case 'move': {
        let dx = world.x - cur.start.x
        let dy = world.y - cur.start.y
        if (!cur.moved && Math.hypot(dx, dy) * camRef.current.zoom < 3) return
        cur.moved = true
        let gs: Guide[] = []
        const box = unionRect(cur.starts.map(itemBounds))
        if (box && !(e.metaKey || e.ctrlKey) && cur.others.length) {
          const snap = snapRect({ ...box, x: box.x + dx, y: box.y + dy }, cur.others, 6 / camRef.current.zoom)
          dx += snap.dx
          dy += snap.dy
          gs = snap.guides
        }
        setGuides(gs)
        const byId = new Map(cur.starts.map((s) => [s.id, s]))
        setItemsLive(
          id,
          getState()
            .boards.find((b) => b.id === id)!
            .items.map((i) => {
              const s = byId.get(i.id)
              return s ? { ...i, x: s.x + dx, y: s.y + dy } : i
            }),
        )
        break
      }
      case 'marquee': {
        const r = normRect(cur.start, world)
        setMarquee(r)
        const hit = items.filter((i) => intersects(itemBounds(i), r)).map((i) => i.id)
        select([...new Set([...cur.base, ...hit])])
        break
      }
      case 'resize': {
        const all = getState().boards.find((b) => b.id === id)!.items
        if (cur.starts.length === 1) {
          const s = cur.starts[0]!
          const corner = !!(cur.hx && cur.hy)
          const keep = s.kind === 'image' || s.kind === 'swatch' ? !e.shiftKey : s.kind === 'text' ? corner : e.shiftKey
          let next = resizeItem(s, cur.hx, cur.hy, world, keep)
          if (s.kind === 'text' && cur.hx && cur.hy) next = { ...next, fontSize: Math.max(10, Math.round((s.fontSize ?? 40) * (next.w / s.w))) }
          setItemsLive(id, all.map((i) => (i.id === s.id ? next : i)))
        } else {
          // Group: uniform scale from the opposite corner.
          const gb = cur.group
          const ax = cur.hx > 0 ? gb.x : gb.x + gb.w
          const ay = cur.hy > 0 ? gb.y : gb.y + gb.h
          const sx = (cur.hx * (world.x - ax)) / gb.w
          const sy = (cur.hy * (world.y - ay)) / gb.h
          const k = Math.max(0.05, Math.max(sx, sy))
          const byId = new Map(cur.starts.map((s) => [s.id, s]))
          setItemsLive(
            id,
            all.map((i) => {
              const s = byId.get(i.id)
              if (!s) return i
              return {
                ...i,
                x: ax + (s.x - ax) * k,
                y: ay + (s.y - ay) * k,
                w: Math.max(8, s.w * k),
                h: Math.max(8, s.h * k),
                fontSize: s.fontSize ? Math.max(8, Math.round(s.fontSize * k)) : s.fontSize,
              }
            }),
          )
        }
        break
      }
      case 'rotate': {
        const a = Math.atan2(world.y - cur.c.y, world.x - cur.c.x)
        let deg = cur.start.rotation + ((a - cur.a0) * 180) / Math.PI
        deg = ((((deg + 180) % 360) + 360) % 360) - 180
        if (e.shiftKey) deg = Math.round(deg / 15) * 15
        else if (Math.abs(deg) < 3) deg = 0
        setRotating(deg)
        const all = getState().boards.find((b) => b.id === id)!.items
        setItemsLive(id, all.map((i) => (i.id === cur.start.id ? { ...i, rotation: deg } : i)))
        break
      }
    }
  }

  const onPointerUp = (e: React.PointerEvent<HTMLElement>) => {
    pointers.current.delete(e.pointerId)
    const cur = g.current
    if (cur?.type === 'pinch') {
      if (pointers.current.size === 0) {
        g.current = null
        setGestureState(null)
      }
      return
    }
    if (cur?.type === 'move' || cur?.type === 'resize' || cur?.type === 'rotate') endGesture()
    if (cur?.type === 'move' && !cur.moved && cur.clickId) select([cur.clickId])
    g.current = null
    setGestureState(null)
    setGuides([])
    setMarquee(null)
    setRotating(null)
  }

  const onDoubleClick = (e: React.MouseEvent) => {
    if (landing || !rootRef.current?.contains(e.target as Node)) return
    const itemId = (e.target as HTMLElement).closest<HTMLElement>('[data-item-id]')?.dataset.itemId
    const it = items.find((i) => i.id === itemId)
    if (it && (it.kind === 'note' || it.kind === 'text')) {
      select([it.id])
      setEditingId(it.id)
    } else if (!itemId && !(e.target as HTMLElement).closest('[data-chrome]')) {
      zoomBy(1.6, { x: e.clientX - rootRef.current!.getBoundingClientRect().left, y: e.clientY - rootRef.current!.getBoundingClientRect().top })
    }
  }

  const onEditEnd = useCallback(
    (itemId: string, text: string) => {
      setEditingId((cur) => (cur === itemId ? null : cur))
      const it = getState().boards.find((b) => b.id === id)?.items.find((i) => i.id === itemId)
      if (it && it.text !== text) commit(id, updateItem(itemId, { text }))
    },
    [id],
  )

  const onMeasure = useCallback(
    (itemId: string, h: number) => {
      const all = getState().boards.find((b) => b.id === id)?.items
      if (all) setItemsLive(id, all.map((i) => (i.id === itemId ? { ...i, h } : i)))
    },
    [id],
  )

  // With the canvas focused, Tab steps through items in reading order, then leaves.
  // Enter (with nothing selected) picks the first item; Esc deselects so Tab leaves again.
  const onCanvasKey = (e: React.KeyboardEvent) => {
    if (!items.length) return
    const order = [...items].sort((a, b) => Math.round(a.y / 200) - Math.round(b.y / 200) || a.x - b.x)
    const cur = order.findIndex((i) => i.id === getState().selection[0])
    if (cur === -1 && e.key === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      select([order[0]!.id])
      return
    }
    if (e.key !== 'Tab' || cur === -1) return
    const next = cur + (e.shiftKey ? -1 : 1)
    const it = order[next]
    if (!it) {
      select([])
      return
    }
    e.preventDefault()
    select([it.id])
    const c = center(it)
    const half = { x: vw / 2 / camRef.current.zoom - 80, y: vh / 2 / camRef.current.zoom - 80 }
    if (Math.abs(c.x - camRef.current.cx) > half.x || Math.abs(c.y - camRef.current.cy) > half.y) setCam({ ...camRef.current, cx: c.x, cy: c.y })
  }

  /* ---------- export / present ---------- */

  const exportPng = useCallback(async () => {
    const b = getState().boards.find((x) => x.id === id)
    if (!b) return
    if (!b.items.length) {
      toast('Nothing to export yet', { tone: 'error' })
      return
    }
    setExporting(true)
    try {
      const blob = await boardToPng(b)
      if (!blob) throw new Error('empty')
      downloadBlob(blob, fileName(b.name))
      toast(`Exported ${fileName(b.name)}`)
    } catch {
      toast('Export failed', { tone: 'error' })
    } finally {
      setExporting(false)
    }
  }, [id, toast])

  const present = useCallback(() => {
    const b = getState().boards.find((x) => x.id === id)
    if (!b?.items.some((i) => i.kind !== 'swatch')) {
      toast('Add something to present first', { tone: 'error' })
      return
    }
    navigate(`${boardPath(id)}/present`)
  }, [id, toast])

  /* ---------- keyboard, paste, drop ---------- */

  useEffect(() => {
    if (landing) return
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || document.querySelector('[role="dialog"]')) return
      const mod = e.metaKey || e.ctrlKey
      const k = e.key
      if (k === ' ' && !e.repeat) {
        if ((e.target as HTMLElement)?.tagName === 'BUTTON') return
        e.preventDefault()
        setSpace(true)
        return
      }
      if (mod && k.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo(id)
        else undo(id)
        return
      }
      if (mod && k.toLowerCase() === 'y') return void (e.preventDefault(), redo(id))
      if (mod && k.toLowerCase() === 'd') return void (e.preventDefault(), actions.duplicate())
      if (mod && k.toLowerCase() === 'a') return void (e.preventDefault(), select(items.map((i) => i.id)))
      if (mod && k.toLowerCase() === 'e') return void (e.preventDefault(), exportPng())
      if (mod && k.toLowerCase() === 'c') {
        clipboard = items.filter((i) => getState().selection.includes(i.id)).map((i) => structuredClone(i))
        return
      }
      if (mod && (k === '=' || k === '+')) return void (e.preventDefault(), zoomBy(1.25))
      if (mod && k === '-') return void (e.preventDefault(), zoomBy(0.8))
      if (mod && k === '0') return void (e.preventDefault(), zoomTo(1))
      if (mod) return
      if (e.shiftKey && (k === ')' || k === '0' || e.code === 'Digit0')) return void zoomTo(1)
      if (e.shiftKey && (k === '!' || e.code === 'Digit1')) return void zoomFit()
      if (k === 'Escape') {
        select([])
        setTool('select')
        return
      }
      if (k === 'Delete' || k === 'Backspace') return void (e.preventDefault(), actions.remove())
      if (k === '?') return setSheet(true)
      if (k === '}' || (e.shiftKey && k === ']')) return actions.order('front')
      if (k === '{' || (e.shiftKey && k === '[')) return actions.order('back')
      if (k === ']') return actions.order('forward')
      if (k === '[') return actions.order('backward')
      if (k.startsWith('Arrow')) {
        const ids = getState().selection
        if (!ids.length) return
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        const dx = k === 'ArrowLeft' ? -step : k === 'ArrowRight' ? step : 0
        const dy = k === 'ArrowUp' ? -step : k === 'ArrowDown' ? step : 0
        commit(id, (its) => its.map((i) => (ids.includes(i.id) ? { ...i, x: i.x + dx, y: i.y + dy } : i)))
        return
      }
      if (k === 'Enter') {
        const it = items.find((i) => i.id === getState().selection[0])
        if (it && (it.kind === 'note' || it.kind === 'text')) {
          e.preventDefault()
          setEditingId(it.id)
        }
        return
      }
      if ('vhntimp'.includes(k.toLowerCase()) && k.length === 1) e.preventDefault()
      switch (k.toLowerCase()) {
        case 'v':
          return setTool('select')
        case 'h':
          return setTool('hand')
        case 'n':
          return addNote()
        case 't':
          return addText()
        case 'i':
          return fileRef.current?.click()
        case 'm':
          return setShowMinimap((v) => !v)
        case 'p':
          return present()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') setSpace(false)
    }
    const onBlur = () => setSpace(false)
    const onPaste = (e: ClipboardEvent) => {
      if (isTyping(e.target)) return
      const files = [...(e.clipboardData?.files ?? [])].filter((f) => f.type.startsWith('image/'))
      if (files.length) {
        e.preventDefault()
        void addFiles(files)
        return
      }
      if (clipboard.length) {
        e.preventDefault()
        const copies = cloneItems(clipboard, 32)
        clipboard = copies.map((c) => structuredClone(c))
        commit(id, (its) => [...its, ...copies])
        select(copies.map((c) => c.id))
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    window.addEventListener('paste', onPaste)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('paste', onPaste)
    }
  }, [landing, id, items, actions, addNote, addText, addFiles, exportPng, present, zoomBy, zoomTo, zoomFit])

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (landing) return
    const files = [...e.dataTransfer.files]
    if (files.length) void addFiles(files, toWorld(e.clientX, e.clientY))
  }

  /* ---------- landing → editor ---------- */

  const start = () => {
    setLeaving(true)
    const target = getState().activeId || getState().boards[0]?.id
    const delay = prefersReducedMotion() ? 0 : 520
    setTimeout(() => {
      if (target) {
        const b = getState().boards.find((x) => x.id === target)
        if (b && b.id === 'spring' && b.camera.cx === 0 && b.camera.cy === 0 && b.camera.zoom === 1) setCamera(b.id, { cx: 0, cy: 0, zoom: landingZoom(window.innerWidth, window.innerHeight) })
        navigate(boardPath(target))
      } else navigate('/boards')
    }, delay)
  }

  /* ---------- render ---------- */

  if (!board) return null

  const z = camera.zoom
  let gridSize = 36 * z
  while (gridSize < 14) gridSize *= 2
  const ox = vw / 2 - camera.cx * z
  const oy = vh / 2 - camera.cy * z
  const cursor = gesture === 'pan' ? 'grabbing' : panning ? 'grab' : undefined
  const drifts = ['animate-drift-a', 'animate-drift-b', 'animate-drift-c']

  return (
    <main
      ref={rootRef}
      className={cx('dot-grid relative h-dvh w-full touch-none select-none overflow-hidden')}
      style={{ ['--grid-size' as string]: `${gridSize}px`, ['--grid-x' as string]: `${ox - gridSize / 2}px`, ['--grid-y' as string]: `${oy - gridSize / 2}px`, cursor }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={onDoubleClick}
      onDragOver={(e) => {
        if (landing || !e.dataTransfer.types.includes('Files')) return
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false)
      }}
      onDrop={onDrop}
    >
      <h1 className="sr-only">{landing ? COPY.title : board.name}</h1>
      {!landing && (
        <div
          role="region"
          tabIndex={0}
          aria-label={`${board.name} canvas, ${items.length} items. Enter selects the first item, Tab steps to the next, arrows nudge, Delete removes, Esc releases.`}
          onKeyDown={onCanvasKey}
          className="pointer-events-none absolute inset-0 z-10 rounded-[4px] focus-visible:outline-offset-[-4px]"
        />
      )}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `translate(${ox}px, ${oy}px) scale(${z})` }}
      >
        {items.map((it, i) => (
          <CanvasItem
            key={it.id}
            item={it}
            editing={editingId === it.id}
            drift={landing && !LANDING_SELECTED.includes(it.id) ? drifts[i % 3] : undefined}
            entrance={landing ? 60 + i * 55 : undefined}
            onEditEnd={onEditEnd}
            onMeasure={landing ? undefined : onMeasure}
          />
        ))}
      </div>

      <div className={cx('transition-opacity duration-300', landing && leaving && 'opacity-0')}>
        <SelectionLayer
          items={selected}
          camera={camera}
          vw={vw}
          vh={vh}
          handles={!landing && gesture !== 'move' && !editingId}
          guides={guides}
          marquee={marquee}
          rotating={rotating}
        />
      </div>

      {landing && <Hero leaving={leaving} offsetY={HERO_OFFSET_Y * landingZoom(vw, vh)} onStart={start} />}

      {!landing && (
        <>
          {!items.length && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="pointer-events-auto" data-chrome>
                <EmptyState
                  icon={<ImagePlus size={20} />}
                  title="This board is empty"
                  body={COPY.emptyCanvas}
                  action={
                    <Button variant="primary" icon={<Upload size={15} />} onClick={() => fileRef.current?.click()}>
                      Add images
                    </Button>
                  }
                />
              </div>
            </div>
          )}

          {selected.length > 0 && !gesture && !editingId && (
            <ContextBar
              items={selected}
              camera={camera}
              vw={vw}
              vh={vh}
              onOrder={actions.order}
              onDuplicate={actions.duplicate}
              onDelete={actions.remove}
              onRotate={() => actions.rotate(15)}
              onSwatches={actions.swatches}
              onNoteColor={actions.noteColor}
              onCopyHex={actions.copyHex}
              onEdit={() => setEditingId(selected[0]!.id)}
            />
          )}

          <TopBar
            board={board}
            canUndo={!!hist?.past.length}
            canRedo={!!hist?.future.length}
            onUndo={() => undo(id)}
            onRedo={() => redo(id)}
            onExport={exportPng}
            exporting={exporting}
            onPresent={present}
            onShortcuts={() => setSheet(true)}
          />
          <BottomTools tool={tool} onTool={setTool} onImage={() => fileRef.current?.click()} onNote={addNote} onText={addText} />
          <div data-chrome className="absolute bottom-4 right-4 z-30 flex flex-col items-end gap-2 max-sm:bottom-[76px] max-sm:right-3">
            {showMinimap && items.length > 0 && (
              <div className="max-md:hidden">
                <Minimap items={items} camera={camera} vw={vw} vh={vh} onNavigate={(cx, cy) => setCam({ ...camRef.current, cx, cy })} />
              </div>
            )}
            <ZoomBar
              zoom={z}
              onIn={() => zoomBy(1.25)}
              onOut={() => zoomBy(0.8)}
              onReset={() => zoomTo(1)}
              onFit={zoomFit}
              minimap={showMinimap}
              onMinimap={() => setShowMinimap((v) => !v)}
            />
          </div>

          {dragOver && (
            <div className="pointer-events-none absolute inset-3 z-40 flex animate-fade items-center justify-center rounded-[18px] border-2 border-dashed border-select bg-select-soft">
              <span className="rounded-[10px] bg-surface px-4 py-2 text-[14px] font-medium text-ink shadow-[var(--shadow-float)]">Drop images to add them</span>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            aria-hidden
            tabIndex={-1}
            onChange={(e) => {
              const files = [...(e.currentTarget.files ?? [])]
              e.currentTarget.value = ''
              if (files.length) void addFiles(files)
            }}
          />
          <ShortcutsSheet open={sheet} onClose={() => setSheet(false)} />
        </>
      )}
    </main>
  )
}
