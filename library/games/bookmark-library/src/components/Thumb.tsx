import type { Item } from '../content'
import { IMAGES } from '../content'
import { cx } from '../lib/cx'

const SWATCH: Record<Item['swatch'], string> = {
  sand: 'bg-sw-sand',
  lilac: 'bg-sw-lilac',
  sky: 'bg-sw-sky',
  sage: 'bg-sw-sage',
  blush: 'bg-sw-blush',
}

/** An item's picture: its photo if it has one, else a soft swatch. */
export function Thumb({ item, className, eager }: { item: Pick<Item, 'image' | 'swatch'>; className?: string; eager?: boolean }) {
  if (item.image)
    return (
      <span className={cx('block overflow-hidden', SWATCH[item.swatch], className)}>
        <img src={IMAGES[item.image]} alt="" loading={eager ? 'eager' : 'lazy'} decoding="async" className="size-full object-cover" />
      </span>
    )
  return <span aria-hidden className={cx('block', SWATCH[item.swatch], className)} />
}
