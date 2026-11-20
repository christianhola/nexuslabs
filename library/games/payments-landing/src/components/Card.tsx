import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type CardTone = 'white' | 'mist' | 'navy' | 'teal' | 'outline'

const tones: Record<CardTone, string> = {
  white: 'bg-white shadow-card',
  mist: 'bg-mist-2',
  navy: 'bg-navy-2 text-on-navy ring-1 ring-navy-line',
  teal: 'bg-teal text-white',
  outline: 'border border-line bg-white',
}

export function Card({
  tone = 'white',
  padding = 'md',
  className,
  children,
  ...rest
}: { tone?: CardTone; padding?: 'none' | 'sm' | 'md' | 'lg'; children: ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const pad = { none: '', sm: 'p-5', md: 'p-6 sm:p-8', lg: 'p-8 sm:p-16' }[padding]
  return (
    <div className={cx('rounded-card', tones[tone], pad, className)} {...rest}>
      {children}
    </div>
  )
}
