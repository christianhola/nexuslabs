import type { ElementType, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type CardVariant = 'surface' | 'raised' | 'featured' | 'glass'

const variants: Record<CardVariant, string> = {
  surface: 'bg-surface',
  raised: 'bg-surface-2',
  featured: 'bg-[linear-gradient(180deg,#1d1640_0%,#0f0d1c_60%)] [--depth-edge:rgb(109_85_255/0.45)]',
  glass: 'bg-white/[0.03]',
}

const pads = { none: '', sm: 'p-4', md: 'p-6 sm:p-7', lg: 'p-7 sm:p-10' }

/**
 * Bordered surface with the `depth` edge. `interactive` adds the hover lift
 * used on tiles and links; `as` swaps the element (article, figure, li...).
 */
export function Card({
  children,
  variant = 'surface',
  padding = 'md',
  radius = 'card',
  interactive = false,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode
  variant?: CardVariant
  padding?: keyof typeof pads
  radius?: 'card' | 'card-sm'
  interactive?: boolean
  as?: ElementType
  className?: string
}) {
  return (
    <Tag
      className={cx(
        'depth relative',
        radius === 'card' ? 'rounded-card' : 'rounded-card-sm',
        variants[variant],
        pads[padding],
        interactive && 'group transition-[background-color,transform] duration-300 hover:bg-surface-2',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
