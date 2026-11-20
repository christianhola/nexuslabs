import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ImageOff } from 'lucide-react'

import { NOTE_COLORS } from '../content'
import { Swatch } from '../components/Swatch'
import { cx } from '../lib/cx'
import { useImageSrc } from '../lib/images'
import type { Item } from '../lib/types'

const noteBg = (c?: string) => NOTE_COLORS.find((n) => n.id === c)?.hex ?? NOTE_COLORS[0]!.hex

/** The picture inside an image card, with loading and missing states. */
export function ItemImage({ src, alt, className, demo }: { src?: string; alt?: string; className?: string; demo?: 'loading' | 'missing' }) {
  const real = useImageSrc(src)
  const url = demo ? null : real.url
  const status = demo ?? real.status
  const [loaded, setLoaded] = useState(false)
  if (status === 'missing')
    return (
      <div className={cx('flex h-full w-full flex-col items-center justify-center gap-2 bg-surface-3 text-ink-2', className)}>
        <ImageOff size={22} />
        <span className="text-[12px]">Image unavailable</span>
      </div>
    )
  return (
    <div className={cx('relative h-full w-full bg-surface-3', className)}>
      {!loaded && <div aria-hidden className="absolute inset-0 animate-pulse bg-gradient-to-br from-surface-3 to-surface-2" />}
      {url && (
        <img
          src={url}
          alt={alt ?? ''}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className={cx('pointer-events-none h-full w-full select-none object-cover transition-opacity duration-300', loaded ? 'opacity-100' : 'opacity-0')}
        />
      )}
    </div>
  )
}

type Props = {
  item: Item
  editing: boolean
  drift?: string
  entrance?: number
  onEditEnd?: (id: string, text: string) => void
  onMeasure?: (id: string, h: number) => void
}

/** One card on the canvas, in world units. The parent applies the camera. */
export const CanvasItem = memo(function CanvasItem({ item, editing, drift, entrance, onEditEnd, onMeasure }: Props) {
  return (
    <div
      data-item-id={item.id}
      className={cx('absolute', drift)}
      style={{
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.kind === 'text' ? undefined : item.h,
        minHeight: item.kind === 'text' ? item.h : undefined,
        transform: item.rotation ? `rotate(${item.rotation}deg)` : undefined,
        animationDelay: drift ? `${-((item.x + item.y) % 7)}s` : undefined,
      }}
    >
      <div
        className={cx('h-full w-full', entrance !== undefined && 'animate-rise')}
        style={entrance !== undefined ? { animationDelay: `${entrance}ms` } : undefined}
      >
        {item.kind === 'image' && (
          <div className="h-full w-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <ItemImage src={item.src} alt={item.alt} />
          </div>
        )}
        {item.kind === 'note' && <Note item={item} editing={editing} onEditEnd={onEditEnd} />}
        {item.kind === 'text' && <TextBlock item={item} editing={editing} onEditEnd={onEditEnd} onMeasure={onMeasure} />}
        {item.kind === 'swatch' && (
          <div className="flex h-full w-full gap-1.5 rounded-[var(--radius-card)] bg-surface p-2 shadow-[var(--shadow-card)]">
            {(item.colors ?? []).map((c, i) => (
              <Swatch key={i} hex={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

function EditArea({ item, className, style, onEditEnd }: { item: Item; className: string; style?: React.CSSProperties; onEditEnd?: Props['onEditEnd'] }) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.focus()
    el.select()
  }, [])
  return (
    <textarea
      ref={ref}
      aria-label={item.kind === 'note' ? 'Note text' : 'Text'}
      defaultValue={item.text}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        e.stopPropagation()
        if (e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))) ref.current?.blur()
      }}
      onBlur={(e) => onEditEnd?.(item.id, e.currentTarget.value)}
      className={cx('block w-full resize-none bg-transparent outline-none', className)}
      style={style}
    />
  )
}

function Note({ item, editing, onEditEnd }: { item: Item; editing: boolean; onEditEnd?: Props['onEditEnd'] }) {
  return (
    <div
      className="flex h-full w-full flex-col rounded-[6px] p-[18px] shadow-[0_1px_2px_rgb(0_0_0/0.06),0_10px_24px_-12px_rgb(0_0_0/0.3)]"
      style={{ background: noteBg(item.color) }}
    >
      {editing ? (
        <EditArea item={item} onEditEnd={onEditEnd} className="h-full text-[17px] leading-[1.42] text-ink" />
      ) : (
        <p className="whitespace-pre-wrap break-words text-[17px] leading-[1.42] text-ink">
          {item.text || <span className="text-ink/40">Double-click to write</span>}
        </p>
      )}
    </div>
  )
}

function TextBlock({ item, editing, onEditEnd, onMeasure }: { item: Item; editing: boolean; onEditEnd?: Props['onEditEnd']; onMeasure?: Props['onMeasure'] }) {
  const ref = useRef<HTMLDivElement>(null)
  const fs = item.fontSize ?? 40
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !onMeasure) return
    const ro = new ResizeObserver(() => {
      const h = el.offsetHeight
      if (Math.abs(h - item.h) > 1) onMeasure(item.id, h)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [item.id, item.h, onMeasure])
  const style = { fontSize: fs, lineHeight: 1.1, letterSpacing: '-0.03em' }
  return (
    <div ref={ref} className="font-semibold text-ink">
      {editing ? (
        <EditArea
          item={item}
          onEditEnd={onEditEnd}
          className="field-sizing-content min-h-[1.1em] overflow-hidden font-semibold text-ink"
          style={style}
        />
      ) : (
        <p className="whitespace-pre-wrap break-words" style={style}>
          {item.text || <span className="text-ink/30">Text</span>}
        </p>
      )}
    </div>
  )
}
