import { Fingerprint } from 'lucide-react'
import { cx } from '../lib/cx'

/** The fingerprint in a lit ring that stands for "human" in the headline. */
export function FingerprintBadge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cx('round relative inline-grid shrink-0 place-items-center rounded-full', className)}>
      <span className="round absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(31_220_138/0.16),transparent_68%)]" />
      <span className="round absolute inset-[6%] rounded-full ring-1 ring-white/10" />
      <span className="round absolute inset-[18%] rounded-full ring-1 ring-brand/25" />
      <Fingerprint className="relative h-[52%] w-[52%] animate-glow text-[#7ff0c0]" strokeWidth={1.4} />
    </span>
  )
}

/** The glowing spark that stands for "AI": a four-point star with a scatter of particles. */
export function SparkBadge({ className }: { className?: string }) {
  const dots = [
    [18, 30, 1.6], [80, 22, 1.2], [86, 70, 1.8], [24, 78, 1.3], [50, 8, 1.1], [62, 90, 1.4], [8, 54, 1], [92, 46, 1.2], [36, 16, 0.9], [70, 12, 1], [14, 66, 0.9], [76, 84, 1],
  ]
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={cx('shrink-0 overflow-visible', className)}>
      <defs>
        <radialGradient id="spark-core" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e9fff4" />
          <stop offset="0.35" stopColor="#5ff2b0" />
          <stop offset="1" stopColor="#0f9e62" />
        </radialGradient>
        <filter id="spark-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="30" fill="#1fdc8a" opacity="0.35" filter="url(#spark-blur)" />
      <g className="origin-center animate-[glow_4s_ease-in-out_infinite]">
        <path d="M50 6 C54 36 64 46 94 50 C64 54 54 64 50 94 C46 64 36 54 6 50 C36 46 46 36 50 6Z" fill="url(#spark-core)" transform="rotate(-14 50 50)" />
        <path d="M50 26 C52 44 56 48 74 50 C56 52 52 56 50 74 C48 56 44 52 26 50 C44 48 48 44 50 26Z" fill="#effff7" opacity="0.7" transform="rotate(31 50 50)" />
      </g>
      {dots.map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#7ff0c0" className="animate-twinkle" style={{ animationDelay: `${(i * 0.37) % 3.6}s` }} />
      ))}
    </svg>
  )
}

/** Drifting particles and two sweeping arcs layered over the hero photograph. */
export function StageLights({ className }: { className?: string }) {
  const pts = Array.from({ length: 70 }, (_, i) => {
    const a = (i / 70) * Math.PI * 1.15 + Math.PI * 0.92
    const side = i % 2 ? 1 : -1
    const rr = 190 + ((i * 37) % 90)
    return { x: 720 + side * Math.cos(a) * rr * 1.7, y: 300 + Math.sin(a) * rr * 0.9 + ((i * 13) % 40), r: 0.8 + ((i * 7) % 10) / 10 }
  })
  return (
    <svg aria-hidden viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" className={cx('pointer-events-none', className)}>
      <defs>
        <linearGradient id="arc-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1fdc8a" stopOpacity="0" />
          <stop offset="0.5" stopColor="#7ff0c0" />
          <stop offset="1" stopColor="#1fdc8a" stopOpacity="0" />
        </linearGradient>
        <filter id="arc-glow">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#arc-glow)" fill="none" strokeLinecap="round">
        <path d="M1100 60 C1190 120 1210 210 1170 300" stroke="url(#arc-g)" strokeWidth="3" strokeDasharray="320" className="animate-sweep" />
        <path d="M330 300 C340 380 380 430 450 460" stroke="url(#arc-g)" strokeWidth="3" strokeDasharray="320" className="animate-sweep" style={{ animationDelay: '-3s' }} />
      </g>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#6fe9b6" className="animate-twinkle" style={{ animationDelay: `${(i * 0.29) % 3.6}s` }} />
      ))}
    </svg>
  )
}
