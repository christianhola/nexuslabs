import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

/* The page column: 1316px of content with a 16/24/40px gutter. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1396px] px-4 sm:px-6 lg:px-10', className)}>{children}</div>
}
