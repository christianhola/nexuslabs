import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[14px] font-medium text-brand-text', className)}>
      <span aria-hidden className="h-px w-6 bg-brand/70" />
      {children}
    </p>
  )
}

export function SectionHeading({ eyebrow, title, sub, align = 'center', className, as: H = 'h2' }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; align?: 'center' | 'left'; className?: string; as?: 'h1' | 'h2' }) {
  return (
    <div className={cx(align === 'center' ? 'mx-auto max-w-[720px] text-center' : 'max-w-[640px]', className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <H className="mt-3 text-balance text-[34px] font-normal leading-[1.08] tracking-[-0.025em] text-stage sm:text-[48px]">{title}</H>
      {sub && <p className="mt-4 text-pretty text-[17px] leading-relaxed text-muted">{sub}</p>}
    </div>
  )
}
