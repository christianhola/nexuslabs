import type { ReactNode } from 'react'

import { cx } from '../lib/cx'
import { Label } from './Label'

/** The opening block of every inner page: label, big tight title, intro. */
export function PageHeader({ label, title, intro, children, className }: { label: string; title: string; intro?: string; children?: ReactNode; className?: string }) {
  return (
    <header className={cx('container-page pt-32 pb-12 md:pt-40 md:pb-16', className)}>
      <Label>{label}</Label>
      <div className="mt-5 grid gap-8 lg:grid-cols-12 lg:items-end">
        <h1 className="font-display animate-rise text-[clamp(3rem,8.6vw,8.5rem)] text-balance lg:col-span-8">{title}</h1>
        {intro && <p className="max-w-md text-[17px] leading-snug text-ink-2 text-pretty lg:col-span-4 lg:pb-3">{intro}</p>}
      </div>
      {children}
    </header>
  )
}
