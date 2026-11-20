import type { ComponentPropsWithoutRef } from 'react'

import { cx } from '../lib/cx'

/** The page gutter: 72px at desktop like the reference, 20px on phones. */
export function Container({ className, ...rest }: ComponentPropsWithoutRef<'div'>) {
  return <div className={cx('mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-[72px]', className)} {...rest} />
}
