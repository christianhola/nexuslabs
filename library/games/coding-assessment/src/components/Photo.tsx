import { cx } from '../lib/cx'

/** Every photograph goes through here, with its path and alt text from IMAGES in content.ts. */
export function Photo({ image, className, eager, sizes }: { image: { src: string; alt: string }; className?: string; eager?: boolean; sizes?: string }) {
  return <img src={image.src} alt={image.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : undefined} sizes={sizes} className={cx('block', className)} />
}
