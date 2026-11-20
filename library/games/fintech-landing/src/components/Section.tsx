import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Container } from './Container'

/** Page section: vertical rhythm (py-20 / sm:py-28) plus the page gutter. */
export function Section({
  id,
  children,
  className,
  containerClassName,
  tight = false,
  label,
}: {
  id?: string
  children: ReactNode
  className?: string
  containerClassName?: string
  tight?: boolean
  label?: string
}) {
  return (
    <section id={id} aria-label={label} className={cx('relative scroll-mt-24', tight ? 'py-12 sm:py-16' : 'py-20 sm:py-28', className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  )
}
