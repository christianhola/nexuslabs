import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Container({ children, className, as: As = 'div', id }: { children: ReactNode; className?: string; as?: 'div' | 'section' | 'header' | 'footer'; id?: string }) {
  return (
    <As id={id} className={cx('mx-auto w-full max-w-[1264px] px-4 sm:px-6 lg:px-8', className)}>
      {children}
    </As>
  )
}
