import type { HTMLAttributes, ReactNode } from 'react'

import { cx } from '../lib/cx'

/* White surface with a hairline and a soft shadow. `wash` for nested panels. */
export function Card({
  children,
  className,
  tone = 'white',
  pad = 'md',
  ...rest
}: { children: ReactNode; tone?: 'white' | 'wash' | 'flame' | 'dark'; pad?: 'none' | 'sm' | 'md' | 'lg' } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx(
        'rounded-[var(--radius-card)] border',
        tone === 'white' && 'border-line bg-card shadow-card',
        tone === 'wash' && 'border-transparent bg-wash',
        tone === 'flame' && 'border-transparent bg-flame-soft',
        tone === 'dark' && 'border-white/10 bg-night text-on-dark',
        pad === 'sm' && 'p-4',
        pad === 'md' && 'p-6',
        pad === 'lg' && 'p-7 sm:p-9',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
