import { NOTE_COLORS } from '../content'
import { cx } from '../lib/cx'
import { itemBounds, unionRect } from '../lib/geometry'
import type { Board } from '../lib/types'
import { ItemImage } from './CanvasItem'

/**
 * A live miniature of a board, scaled with container-query units so it
 * stays crisp at any card width.
 */
export function BoardThumb({ board, className }: { board: Board; className?: string }) {
  const b = unionRect(board.items.map(itemBounds))
  if (!b) {
    return (
      <div className={cx('dot-grid flex aspect-[16/10] items-center justify-center', className)} style={{ ['--grid-size' as string]: '14px' }}>
        <span className="text-[13px] text-faint">Empty board</span>
      </div>
    )
  }
  // Fit the content into a 16:10 box with a little air around it.
  const ratio = 16 / 10
  let w = b.w * 1.12
  let h = b.h * 1.12
  if (w / h > ratio) h = w / ratio
  else w = h * ratio
  const ox = b.x + b.w / 2 - w / 2
  const oy = b.y + b.h / 2 - h / 2
  const pc = (v: number, of: number) => `${(v / of) * 100}%`
  return (
    <div
      className={cx('dot-grid relative aspect-[16/10] overflow-hidden', className)}
      style={{ containerType: 'inline-size', ['--grid-size' as string]: '14px' }}
      aria-hidden
    >
      {board.items.map((it) => (
        <div
          key={it.id}
          className="absolute"
          style={{
            left: pc(it.x - ox, w),
            top: pc(it.y - oy, h),
            width: pc(it.w, w),
            height: pc(it.h, h),
            transform: it.rotation ? `rotate(${it.rotation}deg)` : undefined,
          }}
        >
          {it.kind === 'image' && (
            <div className="h-full w-full overflow-hidden rounded-[3px] shadow-[0_1px_3px_rgb(0_0_0/0.12)]">
              <ItemImage src={it.src} alt="" />
            </div>
          )}
          {it.kind === 'note' && (
            <div className="h-full w-full rounded-[2px] shadow-[0_1px_3px_rgb(0_0_0/0.12)]" style={{ background: NOTE_COLORS.find((c) => c.id === it.color)?.hex }} />
          )}
          {it.kind === 'text' && (
            <div
              className="truncate font-semibold leading-[1.1] tracking-[-0.03em] text-ink"
              style={{ fontSize: `${((it.fontSize ?? 40) / w) * 100}cqw` }}
            >
              {it.text}
            </div>
          )}
          {it.kind === 'swatch' && (
            <div className="flex h-full w-full gap-[6%] rounded-[3px] bg-white p-[3%]">
              {(it.colors ?? []).map((c, i) => (
                <span key={i} className="h-3/4 flex-1 rounded-[1px]" style={{ background: c }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
