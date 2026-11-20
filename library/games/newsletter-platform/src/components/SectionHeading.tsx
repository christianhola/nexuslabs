import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Eyebrow } from './Badge'

/* Eyebrow, all-caps display heading and an optional lede, as in the hero. */
export function SectionHeading({ eyebrow, title, body, className, as: Tag = 'h2', size = 'lg' }: { eyebrow?: string; title: ReactNode; body?: ReactNode; className?: string; as?: 'h1' | 'h2'; size?: 'lg' | 'md' }) {
  return (
    <div className={cx('max-w-[820px]', className)}>
      {eyebrow ? <Eyebrow className="mb-4">{eyebrow}</Eyebrow> : null}
      <Tag className={cx('display text-balance uppercase text-white', size === 'lg' ? 'text-[40px] sm:text-[52px] lg:text-[60px]' : 'text-[34px] sm:text-[44px]')}>{title}</Tag>
      {body ? <p className="mt-6 max-w-[640px] text-[18px] leading-[1.55] text-body sm:text-[21px]">{body}</p> : null}
    </div>
  )
}
