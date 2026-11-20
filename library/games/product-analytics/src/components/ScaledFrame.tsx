import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/*
  Lays a fixed-size UI (the product mock) out at its natural width and
  scales it down to fit the column, so it keeps desktop density at every
  width. Below `interactiveFrom` px the content is inert (a picture of the
  product), because scaled controls would be too small to tap.
*/
export function ScaledFrame({ width, height, children, className, interactiveFrom = 640, label }: { width: number; height: number; children: ReactNode; className?: string; interactiveFrom?: number; label: string }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.7)
  const [w, setW] = useState(width * 0.7)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => {
      const cw = e!.contentRect.width
      setW(cw)
      setScale(cw / width)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  const inert = w < interactiveFrom
  return (
    <div ref={box} className={cx('relative w-full', className)} style={{ height: height * scale }} role="group" aria-label={label}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width, height, transform: `scale(${scale})` }} inert={inert} aria-hidden={inert || undefined}>
        {children}
      </div>
    </div>
  )
}
