import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'

/* White surface with a hairline and soft shadow. `tone="wash"` for nested. */
export function Card({
  children,
  className,
  tone = 'white',
  pad = 'md',
  ...rest
}: { children: ReactNode; tone?: 'white' | 'wash' | 'dark'; pad?: 'none' | 'sm' | 'md' | 'lg' } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'rounded-[var(--radius-card)] border',
        tone === 'white' && 'border-line bg-card shadow-card',
        tone === 'wash' && 'border-transparent bg-wash',
        tone === 'dark' && 'border-white/10 bg-night text-on-dark',
        pad === 'sm' && 'p-4',
        pad === 'md' && 'p-6',
        pad === 'lg' && 'p-8 sm:p-10',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
