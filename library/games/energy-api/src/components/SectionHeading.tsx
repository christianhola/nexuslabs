import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Eyebrow'

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  tone = 'ink',
  as: Tag = 'h2',
  className,
  id,
}: {
  eyebrow?: ReactNode
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  tone?: 'ink' | 'forest'
  as?: 'h1' | 'h2'
  className?: string
  id?: string
}) {
  return (
    <div className={cx('max-w-[720px]', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Tag
        id={id}
        className={cx(
          'mt-3 text-balance font-medium tracking-[-0.035em]',
          Tag === 'h1' ? 'text-[44px] leading-[1.04] sm:text-[60px]' : 'text-[34px] leading-[1.08] sm:text-[46px]',
          tone === 'forest' ? 'text-on-forest' : 'text-ink',
        )}
      >
        {title}
      </Tag>
      {body && <p className={cx('mt-4 text-pretty text-[17px] leading-[1.6]', tone === 'forest' ? 'text-on-forest-muted' : 'text-muted')}>{body}</p>}
    </div>
  )
}
