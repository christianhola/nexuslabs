import { useId, useState } from 'react'

import { IMAGES, type ImageKey } from '../content'
import { cx } from '../lib/cx'

/** Drag (or arrow-key) slider revealing the "after" photograph over the "before". */
export function BeforeAfter({ before, after, label, className }: { before: ImageKey; after: ImageKey; label: string; className?: string }) {
  const [pos, setPos] = useState(50)
  const id = useId()
  return (
    <div className={cx('relative aspect-[3/2] overflow-hidden rounded-[var(--radius-sm)] bg-paper-2 select-none', className)}>
      <img src={IMAGES[before]} alt="Before the redesign" className="absolute inset-0 size-full object-cover" loading="lazy" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <img src={IMAGES[after]} alt="After the redesign" className="absolute inset-0 size-full object-cover" loading="lazy" />
      </div>
      <span className="round absolute top-3 left-3 rounded-full bg-snow/90 px-3 py-1 text-[12px] font-medium text-ink">Before</span>
      <span className="round absolute top-3 right-3 rounded-full bg-ink/85 px-3 py-1 text-[12px] font-medium text-snow">After</span>
      <div className="pointer-events-none absolute inset-y-0 w-px bg-snow" style={{ left: `${pos}%` }}>
        <span className="round absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-snow text-ink shadow-[var(--shadow-card)]">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-valuetext={`${100 - pos}% after`}
        className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
      />
      <span className="pointer-events-none absolute inset-0 rounded-[var(--radius-sm)] peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-snow" />
    </div>
  )
}
