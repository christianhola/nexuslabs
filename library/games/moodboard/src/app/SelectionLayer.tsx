import { center, itemBounds, unionRect, worldToScreen, type Guide } from '../lib/geometry'
import type { Camera, Item, Rect } from '../lib/types'

export const HANDLES = [
  { id: 'nw', hx: -1, hy: -1, cursor: 'nwse-resize' },
  { id: 'n', hx: 0, hy: -1, cursor: 'ns-resize' },
  { id: 'ne', hx: 1, hy: -1, cursor: 'nesw-resize' },
  { id: 'e', hx: 1, hy: 0, cursor: 'ew-resize' },
  { id: 'se', hx: 1, hy: 1, cursor: 'nwse-resize' },
  { id: 's', hx: 0, hy: 1, cursor: 'ns-resize' },
  { id: 'sw', hx: -1, hy: 1, cursor: 'nesw-resize' },
  { id: 'w', hx: -1, hy: 0, cursor: 'ew-resize' },
] as const

const ROTATE_CURSOR = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 12a7 7 0 1 1 2.05 4.95" fill="none" stroke="white" stroke-width="4" stroke-linecap="round"/><path d="M5 12a7 7 0 1 1 2.05 4.95" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round"/><path d="M2.5 9.5 5 13l3.2-2.8" fill="none" stroke="black" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
)}") 12 12, crosshair`

type Props = {
  items: Item[]
  camera: Camera
  vw: number
  vh: number
  /** Show resize handles and rotate zones. */
  handles: boolean
  guides: Guide[]
  marquee: Rect | null
  rotating: number | null
}

function Handle({ id, x, y, cursor, active }: { id: string; x: string; y: string; cursor: string; active: boolean }) {
  return (
    <span
      data-handle={active ? id : undefined}
      className="absolute size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] border border-select bg-white"
      style={{ left: x, top: y, cursor, pointerEvents: active ? 'auto' : 'none' }}
    >
      {active && <span className="absolute -inset-[7px]" />}
    </span>
  )
}

const pct = (v: number) => `${(v + 1) * 50}%`

/** Selection boxes, handles, snap guides and the marquee, drawn in screen space. */
export function SelectionLayer({ items, camera, vw, vh, handles, guides, marquee, rotating }: Props) {
  const z = camera.zoom
  const single = items.length === 1 ? items[0]! : null
  const group = items.length > 1 ? unionRect(items.map(itemBounds)) : null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {single &&
        (() => {
          const c = worldToScreen(center(single), camera, vw, vh)
          const w = single.w * z
          const h = single.h * z
          return (
            <div
              className="absolute border border-select"
              style={{ left: c.x - w / 2, top: c.y - h / 2, width: w, height: h, transform: single.rotation ? `rotate(${single.rotation}deg)` : undefined }}
            >
              {handles &&
                (['nw', 'ne', 'se', 'sw'] as const).map((id) => {
                  const hd = HANDLES.find((x) => x.id === id)!
                  return (
                    <span
                      key={`r-${id}`}
                      data-handle="rotate"
                      className="pointer-events-auto absolute size-5"
                      style={{
                        left: hd.hx < 0 ? -32 : undefined,
                        right: hd.hx > 0 ? -32 : undefined,
                        top: hd.hy < 0 ? -32 : undefined,
                        bottom: hd.hy > 0 ? -32 : undefined,
                        cursor: ROTATE_CURSOR,
                      }}
                    />
                  )
                })}
              {HANDLES.map((hd) =>
                // Side handles only when the box is big enough to tell them apart.
                (hd.hx === 0 && w < 48) || (hd.hy === 0 && h < 48) ? null : (
                  <Handle key={hd.id} id={hd.id} x={pct(hd.hx)} y={pct(hd.hy)} cursor={hd.cursor} active={handles} />
                ),
              )}
              {rotating !== null && (
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-[5px] bg-select px-1.5 py-0.5 text-[11px] font-medium text-white tabular-nums">
                  {Math.round(rotating)}°
                </span>
              )}
            </div>
          )
        })()}

      {group && (
        <>
          {items.map((it) => {
            const c = worldToScreen(center(it), camera, vw, vh)
            return (
              <div
                key={it.id}
                className="absolute border border-select/60"
                style={{ left: c.x - (it.w * z) / 2, top: c.y - (it.h * z) / 2, width: it.w * z, height: it.h * z, transform: it.rotation ? `rotate(${it.rotation}deg)` : undefined }}
              />
            )
          })}
          {(() => {
            const p = worldToScreen(group, camera, vw, vh)
            return (
              <div className="absolute border border-select" style={{ left: p.x, top: p.y, width: group.w * z, height: group.h * z }}>
                {HANDLES.filter((h) => h.hx && h.hy).map((hd) => (
                  <Handle key={hd.id} id={hd.id} x={pct(hd.hx)} y={pct(hd.hy)} cursor={hd.cursor} active={handles} />
                ))}
              </div>
            )
          })()}
        </>
      )}

      {guides.map((g, i) => {
        if (g.axis === 'x') {
          const a = worldToScreen({ x: g.at, y: g.from }, camera, vw, vh)
          return <div key={i} className="absolute w-px bg-guide" style={{ left: a.x, top: a.y, height: (g.to - g.from) * z }} />
        }
        const a = worldToScreen({ x: g.from, y: g.at }, camera, vw, vh)
        return <div key={i} className="absolute h-px bg-guide" style={{ left: a.x, top: a.y, width: (g.to - g.from) * z }} />
      })}

      {marquee &&
        (() => {
          const a = worldToScreen(marquee, camera, vw, vh)
          return <div className="absolute border border-select bg-select-soft" style={{ left: a.x, top: a.y, width: marquee.w * z, height: marquee.h * z }} />
        })()}
    </div>
  )
}
