import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/** The page column. `wide` is the full-bleed media frame (40px inset at desktop). */
export function Container({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className={cx('mx-auto w-full max-w-[1440px]', wide ? 'px-3 sm:px-5 lg:px-10' : 'px-5 sm:px-8 lg:px-16 xl:px-[106px]', className)}>
      {children}
    </div>
  )
}
