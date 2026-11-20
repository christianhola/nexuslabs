import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/*
  Renders children at a fixed design size and scales them down to fit the
  available width, so a dense product mock keeps its proportions on phones.
*/
export function ScaledFrame({ width, height, children, className, inertBelow = 0 }: { width: number; height: number; children: ReactNode; className?: string; inertBelow?: number }) {
  const box = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, e.contentRect.width / width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])
  return (
    <div ref={box} className={className} style={{ height: height * scale, overflow: 'hidden' }} inert={scale < inertBelow || undefined} aria-hidden={scale < inertBelow || undefined}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}
