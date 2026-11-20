import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Eyebrow'

type Props = {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center' | 'split'
  tone?: 'ink' | 'on-navy'
  as?: 'h1' | 'h2'
  className?: string
  id?: string
}

export function SectionHeading({ eyebrow, title, body, align = 'left', tone = 'ink', as: H = 'h2', className, id }: Props) {
  const titleCls = cx(
    'text-balance font-medium tracking-[-0.022em]',
    H === 'h1' ? 'text-[40px] leading-[1.08] sm:text-[56px]' : 'text-[32px] leading-[1.12] sm:text-[42px]',
    tone === 'on-navy' ? 'text-white' : 'text-ink',
  )
  const bodyCls = cx('text-[16px] leading-[1.6]', tone === 'on-navy' ? 'text-on-navy-muted' : 'text-muted')
  if (align === 'split') {
    return (
      <div className={cx('grid gap-6 md:grid-cols-[1.25fr_1fr] md:items-end md:gap-16', className)}>
        <div>
          {eyebrow && <Eyebrow tone={tone === 'on-navy' ? 'on-navy' : 'teal'} className="mb-4">{eyebrow}</Eyebrow>}
          <H id={id} className={titleCls}>{title}</H>
        </div>
        {body && <p className={cx(bodyCls, 'max-w-[400px] md:pb-2')}>{body}</p>}
      </div>
    )
  }
  return (
    <div className={cx(align === 'center' && 'mx-auto max-w-[720px] text-center', className)}>
      {eyebrow && <Eyebrow tone={tone === 'on-navy' ? 'on-navy' : 'teal'} className="mb-4">{eyebrow}</Eyebrow>}
      <H id={id} className={titleCls}>{title}</H>
      {body && <p className={cx(bodyCls, 'mt-4', align === 'center' ? 'mx-auto max-w-[560px]' : 'max-w-[560px]')}>{body}</p>}
    </div>
  )
}
