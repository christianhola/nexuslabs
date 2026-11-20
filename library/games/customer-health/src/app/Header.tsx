import { Activity, Moon, Sun } from 'lucide-react'

import { Link } from '../components/Link'
import { Pill } from '../components/Pill'
import { copy } from '../data'
import { money } from '../lib/format'
import type { Theme } from '../lib/theme'

type HeaderProps = {
  count: number
  arr: number
  theme: Theme
  onToggleTheme: () => void
  onOpenGuide: () => void
}

export function Header({ count, arr, theme, onToggleTheme, onOpenGuide }: HeaderProps) {
  return (
    <header className="flex animate-rise flex-wrap items-center justify-between gap-x-6 gap-y-4">
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-7 gap-y-1.5">
        <h1 className="font-serif text-[30px] leading-none font-normal tracking-[-0.012em] sm:text-[34px]">
          <Link to="/" className="flex min-h-10 items-center gap-3 rounded-[4px]">
            <Activity className="size-[25px] translate-y-px" strokeWidth={1.6} aria-hidden="true" />
            {copy.title}
          </Link>
        </h1>
        <p className="caps tnum text-[11px] text-muted sm:text-[12px]">
          {count} accounts <span aria-hidden="true" className="text-faint">/</span> {money(arr)} ARR
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Pill variant="outline" onClick={onOpenGuide}>
          Template guide
        </Pill>
        <Pill
          variant="solid"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          icon={theme === 'dark' ? <Sun strokeWidth={1.75} /> : <Moon strokeWidth={1.75} />}
          className="min-w-[94px]"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </Pill>
      </div>
    </header>
  )
}
