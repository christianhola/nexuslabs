import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
  as: As = 'h2',
  id,
  className,
}: {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  align?: 'center' | 'left'
  as?: 'h1' | 'h2'
  id?: string
  className?: string
}) {
  return (
    <div className={cx('flex flex-col gap-4', align === 'center' ? 'mx-auto max-w-[660px] items-center text-center' : 'max-w-[620px]', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <As
        id={id}
        className={cx(
          'text-balance font-display font-bold tracking-[-0.04em] text-ink',
          As === 'h1' ? 'text-[40px] leading-[1.02] sm:text-[56px]' : 'text-[32px] leading-[1.06] sm:text-[44px]',
        )}
      >
        {title}
      </As>
      {lede ? <p className="text-balance text-[16px] leading-relaxed text-muted sm:text-[17px]">{lede}</p> : null}
    </div>
  )
}
