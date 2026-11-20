import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/** The page column. Matches the reference: 1300px wide with generous side margins. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-[min(1300px,calc(100%-40px))] sm:w-[min(1300px,calc(100%-2*clamp(32px,9.4vw,150px)))]', className)}>{children}</div>
}

/**
 * Hairline frame: two vertical rules just outside the column, the way the
 * reference draws its page. `center` adds the faint ember centre rule.
 */
export function FrameLines({ center, className }: { center?: boolean; className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 hidden sm:block', className)} aria-hidden>
      <div className="absolute inset-y-0 left-1/2 w-[min(1406px,calc(100%-2*clamp(32px,6.1vw,97px)))] -translate-x-1/2 border-x border-line" />
      {center && <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-ember-deep/0 via-ember-deep/70 to-ember-deep/0" />}
    </div>
  )
}

export function SectionHead({ eyebrow, title, sub, className, align = 'left' }: { eyebrow?: string; title: string; sub?: string; className?: string; align?: 'left' | 'center' }) {
  return (
    <div className={cn(align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && <p className="mb-4 text-[13px] font-medium tracking-[0.02em] text-ember-text">{eyebrow}</p>}
      <h2 className={cn('font-display text-[34px] leading-[1.08] font-medium tracking-[-0.035em] text-balance sm:text-[46px]', align === 'center' ? 'mx-auto max-w-[20ch]' : 'max-w-[22ch]')}>{title}</h2>
      {sub && <p className={cn('mt-4 text-[17px] leading-[1.5] text-muted sm:text-[19px]', align === 'center' ? 'mx-auto max-w-[52ch]' : 'max-w-[52ch]')}>{sub}</p>}
    </div>
  )
}
