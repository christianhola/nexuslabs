import { useId } from 'react'

import { cx } from '../lib/cx'

/*
  Shows any photo through a thermal-camera gradient map: dark tones read
  hot (white and yellow), light tones cool to orange and red. Pass any image
  from `photos` in content.ts; the effect is pure SVG filter, so swapping the
  photo keeps the look.
*/
export function ThermalImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={cx('overflow-hidden', className ?? 'relative')}>
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <filter id={`thermal-${id}`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" />
          <feGaussianBlur stdDeviation="3" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="1 1 1 1 0.95 0.75" />
            <feFuncG type="table" tableValues="0.98 0.9 0.68 0.42 0.2 0.08" />
            <feFuncB type="table" tableValues="0.85 0.45 0.16 0.05 0.03 0.12" />
          </feComponentTransfer>
        </filter>
      </svg>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="h-full w-full scale-110 object-cover" style={{ filter: `url(#thermal-${id})` }} />
    </div>
  )
}
