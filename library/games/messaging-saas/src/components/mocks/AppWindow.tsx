import type { ReactNode } from 'react'

import { cx } from '../../lib/cx'

/** The product's app chrome: traffic lights, a title and optional actions. */
export function AppWindow({ title, actions, children, className }: { title: string; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cx('overflow-hidden rounded-[18px] border border-white/[0.12] bg-[#10131d] shadow-float', className)}>
      <div className="flex h-12 items-center gap-4 border-b border-line bg-[#151925] px-4">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </span>
        <p className="truncate text-[13px] font-semibold text-soft">{title}</p>
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
      {children}
    </div>
  )
}
