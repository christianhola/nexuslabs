import type { ReactNode } from 'react'
import { Container } from './Container'
import { Eyebrow } from './SectionHeading'
import { cx } from '../lib/cx'

/** The heading block at the top of inner pages, under a soft teal glow. */
export function PageIntro({ eyebrow, title, sub, children, className, align = 'center' }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; children?: ReactNode; className?: string; align?: 'center' | 'left' }) {
  return (
    <section className={cx('relative isolate overflow-hidden pt-16 pb-12 sm:pt-20', className)}>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,#0c302c_0%,#071615_45%,transparent_80%)]" />
      <div aria-hidden className="grid-lines absolute inset-0 -z-10" />
      <Container className={align === 'center' ? 'text-center' : ''}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className={cx('mt-3 text-balance text-[38px] leading-[1.05] font-normal tracking-[-0.03em] text-stage sm:text-[56px]', align === 'center' && 'mx-auto max-w-[820px]')}>{title}</h1>
        {sub && <p className={cx('mt-4 text-pretty text-[17px] leading-relaxed text-muted sm:text-[18px]', align === 'center' ? 'mx-auto max-w-[600px]' : 'max-w-[640px]')}>{sub}</p>}
        {children}
      </Container>
    </section>
  )
}
