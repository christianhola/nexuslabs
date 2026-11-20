import type { ReactNode } from 'react'
import { cx } from '../lib/cx'

export function Container({ children, className, wide }: { children: ReactNode; className?: string; wide?: boolean }) {
  return <div className={cx('mx-auto w-full px-4 sm:px-6 lg:px-8', wide ? 'max-w-[1360px]' : 'max-w-[1200px]', className)}>{children}</div>
}
