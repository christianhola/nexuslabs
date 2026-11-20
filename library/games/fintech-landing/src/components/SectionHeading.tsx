import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
  className,
}: {
  eyebrow: string
  title: ReactNode
  body?: ReactNode
  align?: 'center' | 'left'
  className?: string
}) {
  return (
    <Reveal className={cx('flex flex-col gap-5', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="max-w-[760px] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] text-balance sm:text-[52px]">
        {title}
      </h2>
      {body ? <p className="max-w-[560px] text-[17px] leading-relaxed text-muted text-pretty">{body}</p> : null}
    </Reveal>
  )
}
