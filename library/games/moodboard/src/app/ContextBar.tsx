import { ArrowDownToLine, ArrowUpToLine, Copy, Palette, PenLine, RotateCw, Trash2, Clipboard } from 'lucide-react'

import { NOTE_COLORS } from '../content'
import { IconButton } from '../components/IconButton'
import { Toolbar, ToolbarDivider } from '../components/Panel'
import { cx } from '../lib/cx'
import { itemBounds, unionRect, worldToScreen } from '../lib/geometry'
import type { Camera, Item, NoteColor } from '../lib/types'

type Props = {
  items: Item[]
  camera: Camera
  vw: number
  vh: number
  onOrder: (dir: 'forward' | 'backward' | 'front' | 'back') => void
  onDuplicate: () => void
  onDelete: () => void
  onRotate: () => void
  onSwatches: () => void
  onNoteColor: (c: NoteColor) => void
  onCopyHex: (colors: string[]) => void
  onEdit: () => void
}

/** Floating actions for the current selection, pinned above it. */
export function ContextBar({ items, camera, vw, vh, onOrder, onDuplicate, onDelete, onRotate, onSwatches, onNoteColor, onCopyHex, onEdit }: Props) {
  const box = unionRect(items.map(itemBounds))
  if (!box) return null
  const tl = worldToScreen(box, camera, vw, vh)
  const w = box.w * camera.zoom
  const h = box.h * camera.zoom
  const barH = 44
  const above = tl.y - barH - 14 > 64
  const top = above ? tl.y - barH - 14 : Math.min(vh - 140, tl.y + h + 14)
  const left = Math.min(Math.max(tl.x + w / 2, 180), vw - 180)
  const one = items.length === 1 ? items[0]! : null

  return (
    <div
      data-chrome
      className="pointer-events-none absolute z-30 -translate-x-1/2 animate-pop max-sm:bottom-[136px] max-sm:left-1/2 sm:left-[var(--bar-x)] sm:top-[var(--bar-y)]"
      style={{ ['--bar-x' as string]: `${left}px`, ['--bar-y' as string]: `${Math.max(64, top)}px` }}
    >
      <Toolbar aria-label="Selection actions" className="no-scrollbar pointer-events-auto max-sm:max-w-[calc(100vw-24px)] max-sm:overflow-x-auto">
        {one?.kind === 'note' && (
          <>
            <div role="radiogroup" aria-label="Note colour" className="flex items-center gap-1 px-1.5">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={one.color === c.id}
                  aria-label={c.label}
                  onClick={() => onNoteColor(c.id)}
                  className={cx(
                    'size-[22px] rounded-full ring-1 ring-inset ring-black/10 transition-transform duration-150 hover:scale-110',
                    one.color === c.id && 'outline-2 outline-offset-2 outline-select',
                  )}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
            <ToolbarDivider />
          </>
        )}
        {(one?.kind === 'note' || one?.kind === 'text') && (
          <IconButton label="Edit text" keys={['Enter']} size="sm" onClick={onEdit}>
            <PenLine size={16} />
          </IconButton>
        )}
        {one?.kind === 'image' && (
          <IconButton label="Extract colours" size="sm" onClick={onSwatches}>
            <Palette size={16} />
          </IconButton>
        )}
        {one?.kind === 'swatch' && (
          <IconButton label="Copy hex codes" size="sm" onClick={() => onCopyHex(one.colors ?? [])}>
            <Clipboard size={16} />
          </IconButton>
        )}
        <IconButton label="Rotate 15°" size="sm" onClick={onRotate}>
          <RotateCw size={16} />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Bring forward" keys={[']']} size="sm" onClick={() => onOrder('forward')}>
          <ArrowUpToLine size={16} />
        </IconButton>
        <IconButton label="Send backward" keys={['[']} size="sm" onClick={() => onOrder('backward')}>
          <ArrowDownToLine size={16} />
        </IconButton>
        <IconButton label="Duplicate" keys={['Mod', 'D']} size="sm" onClick={onDuplicate}>
          <Copy size={16} />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Delete" keys={['Delete']} size="sm" tone="danger" onClick={onDelete}>
          <Trash2 size={16} />
        </IconButton>
      </Toolbar>
    </div>
  )
}
