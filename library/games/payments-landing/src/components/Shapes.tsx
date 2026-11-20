import { cx } from '../lib/cx'

/*
  The pale diagonal planes behind the hero and page headers. Decorative,
  pure SVG, drifting gently unless reduced motion is on.
*/
export function Shapes({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={cx('pointer-events-none absolute inset-0 size-full', className)} viewBox="0 0 1440 1000" preserveAspectRatio="xMaxYMin slice">
      <g fill="white">
        <path d="M1060 0 L1440 0 L1440 160 L1180 520 L940 520 Z" opacity="0.55" />
        <path d="M1240 300 L1440 120 L1440 760 L1120 1000 L1000 1000 Z" opacity="0.4" />
        <path d="M760 1000 L1080 620 L1260 620 L960 1000 Z" opacity="0.5" />
      </g>
    </svg>
  )
}
