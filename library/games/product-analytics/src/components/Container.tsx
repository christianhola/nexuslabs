import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* The page column: 1076px like the reference, 20px gutters on phones. */
export function Container({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cx('mx-auto w-full px-5 sm:px-8', wide ? 'max-w-[1240px]' : 'max-w-[1140px]', className)}>{children}</div>
}
