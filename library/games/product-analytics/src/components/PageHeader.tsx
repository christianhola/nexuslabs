import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'

/* Inner-page header: the hero's pale sky as a gradient, eyebrow, title, lede. */
export function PageHeader({ eyebrow, title, lede, children, className, align = 'center' }: { eyebrow?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode; className?: string; align?: 'center' | 'left' }) {
  return (
    <header className={cx('relative overflow-hidden bg-[linear-gradient(180deg,#b8d5ec_0%,#d9e7ef_48%,var(--color-paper)_100%)] pb-14 pt-32 sm:pb-20 sm:pt-40', className)}>
      <div className={cx('relative mx-auto max-w-[1140px] px-5 sm:px-8', align === 'center' ? 'text-center' : '')}>
        <div className={cx('flex flex-col gap-4', align === 'center' ? 'mx-auto max-w-[720px] items-center' : 'max-w-[720px]')}>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h1 className="text-balance font-display text-[40px] font-bold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[56px]">{title}</h1>
          {lede ? <p className="text-balance text-[16px] leading-relaxed text-body sm:text-[17px]">{lede}</p> : null}
        </div>
        {children}
      </div>
    </header>
  )
}
