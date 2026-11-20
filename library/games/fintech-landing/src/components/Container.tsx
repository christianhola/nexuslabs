import type { ReactNode } from 'react'

import { cx } from '../lib/cx'

// Page gutter: 45px on desktop like the reference, 16px on phones.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-[1440px] px-4 sm:px-8 lg:px-[45px]', className)}>{children}</div>
}
