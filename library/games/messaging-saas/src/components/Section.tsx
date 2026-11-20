import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Container } from './Container'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx('inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-cobalt-text', className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-cobalt-text" />
      {children}
    </p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  className,
  as: H = 'h2',
}: {
  eyebrow?: string
  title: ReactNode
  body?: ReactNode
  align?: 'left' | 'center'
  className?: string
  as?: 'h1' | 'h2'
}) {
  return (
    <div className={cx('grid gap-4', align === 'center' && 'mx-auto max-w-[760px] justify-items-center text-center', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <H
        className={cx(
          'font-display font-medium tracking-[-0.025em] text-white',
          H === 'h1' ? 'text-[40px] leading-[1.06] sm:text-[56px] lg:text-[64px]' : 'text-[32px] leading-[1.1] sm:text-[44px]',
        )}
      >
        {title}
      </H>
      {body ? <p className="max-w-[620px] text-[17px] leading-[1.6] text-muted">{body}</p> : null}
    </div>
  )
}

export function Section({ className, children, contained = true, ...rest }: ComponentPropsWithoutRef<'section'> & { contained?: boolean }) {
  return (
    <section className={cx('relative py-20 sm:py-28', className)} {...rest}>
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}

/** Header for inner pages: a navy glow, eyebrow, h1 and body, then optional children. */
export function PageHeader({ eyebrow, title, body, children }: { eyebrow: string; title: ReactNode; body?: ReactNode; children?: ReactNode }) {
  return (
    <header className="grain relative overflow-hidden pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_70%_0%,#1a2f7a_0%,#0c1230_45%,transparent_80%)]" />
      <Container className="relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} body={body} />
        {children}
      </Container>
    </header>
  )
}
