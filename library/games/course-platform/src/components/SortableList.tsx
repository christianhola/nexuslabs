import { Reorder, useDragControls } from 'motion/react'
import { GripVertical } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  A vertical list you reorder by dragging the grip, or from the keyboard:
  focus a grip and press ArrowUp / ArrowDown (Home / End jump). Moves are
  announced in a polite live region. `onChange` receives the new order.
*/
export function SortableList<T extends { id: string }>({
  items,
  onChange,
  render,
  label,
  itemLabel,
  className,
  itemClassName,
  disabled,
}: {
  items: readonly T[]
  onChange: (next: T[]) => void
  render: (item: T, index: number) => ReactNode
  label: string
  itemLabel: (item: T) => string
  className?: string
  itemClassName?: string | ((item: T) => string)
  disabled?: boolean
}) {
  const [said, setSaid] = useState('')
  const grips = useRef(new Map<string, HTMLButtonElement | null>())

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || to === from) return
    const next = [...items]
    const [it] = next.splice(from, 1)
    next.splice(to, 0, it!)
    onChange(next)
    setSaid(`${itemLabel(it!)} moved to position ${to + 1} of ${items.length}.`)
    requestAnimationFrame(() => grips.current.get(it!.id)?.focus())
  }

  return (
    <>
      <Reorder.Group axis="y" values={items as T[]} onReorder={(n) => onChange(n)} className={cx('flex flex-col', className)} aria-label={label}>
        {items.map((item, i) => (
          <Row
            key={item.id}
            item={item}
            index={i}
            count={items.length}
            disabled={disabled}
            label={itemLabel(item)}
            className={typeof itemClassName === 'function' ? itemClassName(item) : itemClassName}
            gripRef={(el) => grips.current.set(item.id, el)}
            onKey={(dir) => move(i, dir === 'up' ? i - 1 : dir === 'down' ? i + 1 : dir === 'home' ? 0 : items.length - 1)}
            onDrop={() => setSaid(`${itemLabel(item)} dropped.`)}
          >
            {render(item, i)}
          </Row>
        ))}
      </Reorder.Group>
      <span className="sr-only" aria-live="polite">
        {said}
      </span>
    </>
  )
}

function Row<T extends { id: string }>({
  item,
  index,
  count,
  label,
  disabled,
  children,
  className,
  gripRef,
  onKey,
  onDrop,
}: {
  item: T
  index: number
  count: number
  label: string
  disabled?: boolean
  children: ReactNode
  className?: string
  gripRef: (el: HTMLButtonElement | null) => void
  onKey: (dir: 'up' | 'down' | 'home' | 'end') => void
  onDrop: () => void
}) {
  const controls = useDragControls()
  const [dragging, setDragging] = useState(false)
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => {
        setDragging(false)
        onDrop()
      }}
      className={cx('relative flex items-center gap-1 bg-card', dragging && 'z-10 shadow-pop', className)}
      style={{ position: 'relative' }}
      data-dragging={dragging || undefined}
    >
      <button
        ref={gripRef}
        type="button"
        disabled={disabled}
        aria-label={`Reorder ${label}, position ${index + 1} of ${count}. Use arrow keys to move.`}
        onPointerDown={(e) => {
          if (disabled) return
          e.preventDefault()
          controls.start(e)
        }}
        onKeyDown={(e) => {
          const map: Record<string, 'up' | 'down' | 'home' | 'end'> = { ArrowUp: 'up', ArrowDown: 'down', Home: 'home', End: 'end' }
          const dir = map[e.key]
          if (!dir) return
          e.preventDefault()
          onKey(dir)
        }}
        className="grid h-10 w-7 shrink-0 cursor-grab touch-none place-items-center rounded-[7px] text-faint hover:bg-wash-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong active:cursor-grabbing disabled:cursor-default disabled:opacity-40"
      >
        <GripVertical className="size-4" aria-hidden />
      </button>
      {children}
    </Reorder.Item>
  )
}
