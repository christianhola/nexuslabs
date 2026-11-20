import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

export function Container({ children, className, size = 'lg' }: { children: ReactNode; className?: string; size?: 'md' | 'lg' | 'xl' }) {
  return <div className={cx('mx-auto w-full px-5 sm:px-8', size === 'md' ? 'max-w-[880px]' : size === 'lg' ? 'max-w-[1000px]' : 'max-w-[1500px]', className)}>{children}</div>
}
