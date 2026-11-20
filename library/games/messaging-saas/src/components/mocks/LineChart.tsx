import { useId, useState } from 'react'
import type { PointerEvent } from 'react'

/** Two-series area/line chart: Relaytext (filled cobalt) against a dashed baseline. */
export function LineChart({ relay, base, height = 220, label }: { relay: number[]; base: number[]; height?: number; label: string }) {
  const W = 640
  const H = height
  const pad = { t: 16, r: 8, b: 24, l: 8 }
  const max = Math.max(...relay, ...base) * 1.12
  const x = (i: number) => pad.l + (i / (relay.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => pad.t + (1 - v / max) * (H - pad.t - pad.b)
  const path = (s: number[]) => s.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const area = `${path(relay)}L${x(relay.length - 1)},${H - pad.b}L${x(0)},${H - pad.b}Z`
  const gid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - r.left) / r.width) * W
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (relay.length - 1))
    setHover(Math.max(0, Math.min(relay.length - 1, i)))
  }

  return (
    <figure className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none overflow-visible" role="img" aria-label={label} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2f66e8" stopOpacity="0.45" />
            <stop offset="1" stopColor="#2f66e8" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={pad.l} x2={W - pad.r} y1={pad.t + f * (H - pad.t - pad.b)} y2={pad.t + f * (H - pad.t - pad.b)} stroke="rgb(255 255 255 / 0.07)" />
        ))}
        <path d={area} fill={`url(#${gid})`} className="transition-[d] duration-500" />
        <path d={path(base)} fill="none" stroke="#8b91a3" strokeWidth="2" strokeDasharray="5 6" strokeLinecap="round" />
        <path d={path(relay)} fill="none" stroke="#7aa4ff" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="rgb(255 255 255 / 0.25)" />
            <circle cx={x(hover)} cy={y(relay[hover])} r="5" fill="#fff" stroke="#2f66e8" strokeWidth="3" />
            <circle cx={x(hover)} cy={y(base[hover])} r="4" fill="#8b91a3" />
          </g>
        ) : null}
      </svg>
      {hover !== null ? (
        <div className="pointer-events-none absolute top-0 rounded-[8px] border border-line bg-panel-2 px-2.5 py-1.5 text-[12px] shadow-card" style={{ left: `clamp(0px, calc(${(x(hover) / W) * 100}% - 60px), calc(100% - 130px))` }}>
          <span className="block font-semibold text-white">${relay[hover]}k Relaytext</span>
          <span className="block text-faint">${base[hover]}k conventional</span>
        </div>
      ) : null}
      <figcaption className="sr-only">
        {label}: Relaytext from ${relay[0]}k to ${relay[relay.length - 1]}k per day, conventional SMS from ${base[0]}k to ${base[base.length - 1]}k.
      </figcaption>
    </figure>
  )
}
