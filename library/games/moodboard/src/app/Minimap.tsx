import { useRef } from 'react'

import { NOTE_COLORS } from '../content'
import { Panel } from '../components/Panel'
import { itemBounds, screenToWorld, unionRect } from '../lib/geometry'
import type { Camera, Item } from '../lib/types'

const W = 196
const H = 124

/** Overview of the whole board. Click or drag to move the view. */
export function Minimap({ items, camera, vw, vh, onNavigate }: { items: Item[]; camera: Camera; vw: number; vh: number; onNavigate: (cx: number, cy: number) => void }) {
  const ref = useRef<SVGSVGElement>(null)
  const tl = screenToWorld({ x: 0, y: 0 }, camera, vw, vh)
  const view = { x: tl.x, y: tl.y, w: vw / camera.zoom, h: vh / camera.zoom }
  const b = unionRect([view, ...items.map(itemBounds)])!
  const pad = Math.max(b.w, b.h) * 0.06
  const box = { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 }
  const s = Math.min(W / box.w, H / box.h)
  const ox = (W - box.w * s) / 2
  const oy = (H - box.h * s) / 2
  const tx = (x: number) => ox + (x - box.x) * s
  const ty = (y: number) => oy + (y - box.y) * s

  const go = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    onNavigate((e.clientX - r.left - ox) / s + box.x, (e.clientY - r.top - oy) / s + box.y)
  }

  return (
    <Panel tone="solid" className="overflow-hidden p-1.5">
      <svg
        ref={ref}
        width={W}
        height={H}
        role="img"
        aria-label="Board overview. Click to move the view."
        className="block cursor-pointer touch-none rounded-[9px] bg-canvas"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          go(e)
        }}
        onPointerMove={(e) => e.buttons && go(e)}
      >
        {items.map((it) => (
          <rect
            key={it.id}
            x={tx(it.x)}
            y={ty(it.y)}
            width={Math.max(1.5, it.w * s)}
            height={Math.max(1.5, it.h * s)}
            rx={1.5}
            transform={it.rotation ? `rotate(${it.rotation} ${tx(it.x + it.w / 2)} ${ty(it.y + it.h / 2)})` : undefined}
            fill={it.kind === 'note' ? (NOTE_COLORS.find((n) => n.id === it.color)?.hex ?? '#fff1a8') : it.kind === 'text' ? '#bdbdbd' : '#d2d2d2'}
            stroke={it.kind === 'note' ? 'rgb(0 0 0 / 0.12)' : 'none'}
          />
        ))}
        <rect x={tx(view.x)} y={ty(view.y)} width={view.w * s} height={view.h * s} rx={3} fill="rgb(79 110 247 / 0.08)" stroke="#4f6ef7" strokeWidth={1.5} />
      </svg>
    </Panel>
  )
}
