import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'

export type CardTone = 'paper' | 'mint' | 'forest'

const tones: Record<CardTone, string> = {
  paper: 'bg-paper shadow-[inset_0_0_0_1px_var(--color-line)]',
  mint: 'bg-mint-2',
  forest: 'on-forest bg-forest-2 text-on-forest shadow-[inset_0_0_0_1px_var(--color-forest-line)]',
}

export function Card({ children, tone = 'paper', className, ...rest }: { children: ReactNode; tone?: CardTone; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('rounded-card', tones[tone], className)} {...rest}>
      {children}
    </div>
  )
}
