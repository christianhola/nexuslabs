import type { ComponentPropsWithoutRef } from 'react'

import { cx } from '../lib/cx'

export type CardTone = 'panel' | 'tile' | 'glass'

const tones: Record<CardTone, string> = {
  panel: 'bg-panel border border-line',
  tile: 'bg-tile border border-white/[0.11]',
  glass: 'bg-white/[0.04] border border-white/[0.1] backdrop-blur-md',
}

export function Card({ tone = 'panel', className, ...rest }: ComponentPropsWithoutRef<'div'> & { tone?: CardTone }) {
  return <div className={cx('rounded-card shadow-card', tones[tone], className)} {...rest} />
}
