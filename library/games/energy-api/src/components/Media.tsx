import { images } from '../content'
import { cx } from '../lib/cx'

/** A photograph from the `images` map, cropped to its box. */
export function Media({ name, className, priority, position }: { name: keyof typeof images; className?: string; priority?: boolean; position?: string }) {
  const img = images[name]
  return (
    <div className={cx('relative overflow-hidden rounded-media bg-mint-3', className)}>
      <img
        src={img.src}
        alt={img.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  )
}
