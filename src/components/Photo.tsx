import { useState, type ImgHTMLAttributes } from 'react'

import { IMAGES, type ImageKey } from '../content'
import { cx } from '../lib/cx'

/** Every photograph on the site: resolves through IMAGES and fades in on load. */
export function Photo({
  name,
  alt,
  className,
  imgClassName,
  eager,
  ...rest
}: { name: ImageKey; alt: string; className?: string; imgClassName?: string; eager?: boolean } & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className'>) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={cx(!/\b(absolute|fixed)\b/.test(className ?? '') && 'relative', 'overflow-hidden bg-paper-2', !loaded && 'skeleton', className)}>
      <img
        src={IMAGES[name]}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        ref={(el) => {
          if (el?.complete && el.naturalWidth) setLoaded(true)
        }}
        className={cx('size-full object-cover transition-opacity duration-[var(--duration-slow)]', loaded ? 'opacity-100' : 'opacity-0', imgClassName)}
        {...rest}
      />
    </div>
  )
}
