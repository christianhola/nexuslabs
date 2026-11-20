import type { ButtonHTMLAttributes } from 'react'
import { Check } from 'lucide-react'

import { cn } from '../lib/cn'

/**
  A pill you switch on and off. As a toggle it sets aria-pressed; inside a
  role="radiogroup" pass `radio` so it reports aria-checked instead.
*/
export function ChoiceChip({ selected, radio, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean; radio?: boolean }) {
  return (
    <button
      type="button"
      role={radio ? 'radio' : undefined}
      aria-checked={radio ? selected : undefined}
      aria-pressed={radio ? undefined : selected}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-sm px-3.5 text-sm font-semibold ring-1 ring-inset transition-colors duration-150 disabled:opacity-50',
        selected ? 'bg-brand-tint text-brand-press ring-brand-bright/50' : 'bg-surface text-body ring-line hover:text-fg hover:ring-[#cfd4dc]',
        className,
      )}
      {...rest}
    >
      {selected && <Check className="size-3.5 animate-pop" aria-hidden />}
      {children}
    </button>
  )
}
