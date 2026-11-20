import type { Chip as QueryChip } from '../lib/search'
import { Chip, ChipButton } from './Chip'

/** "Searching  [tag: typography] [saved 8 to 20 Aug] [Website redesign]". Click a chip to drop that filter. */
export function QueryChips({ chips, off, onToggle, label = 'Searching' }: { chips: QueryChip[]; off: Set<string>; onToggle?: (id: string) => void; label?: string }) {
  if (!chips.length) return null
  return (
    <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label={onToggle ? "Filters read from your search" : "How the sentence was read"}>
      <span className="mr-1 text-[14px] text-muted">{label}</span>
      {chips.map((c) => {
        const isOff = off.has(c.id)
        const tone = isOff ? 'off' : c.type === 'collection' ? 'active' : 'soft'
        if (!onToggle)
          return (
            <Chip key={c.id} tone={tone} className={c.type === 'collection' ? 'text-ink' : undefined}>
              {c.label}
            </Chip>
          )
        return (
          <ChipButton
            key={c.id}
            tone={tone}
            aria-pressed={!isOff}
            title={isOff ? `Use filter ${c.label}` : `Drop filter ${c.label}`}
            onClick={() => onToggle(c.id)}
            className={c.type === 'collection' && !isOff ? 'text-ink' : undefined}
          >
            {c.label}
          </ChipButton>
        )
      })}
    </div>
  )
}
