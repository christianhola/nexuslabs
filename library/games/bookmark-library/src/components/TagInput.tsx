import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'

import { slugify } from '../lib/library'

/** Tag editor: Enter or comma adds, Backspace on empty removes the last, suggestions below. */
export function TagInput({ value, onChange, suggestions, label = 'Tags' }: { value: string[]; onChange: (tags: string[]) => void; suggestions: string[]; label?: string }) {
  const id = useId()
  const [draft, setDraft] = useState('')
  const add = (raw: string) => {
    const t = slugify(raw).slice(0, 24)
    if (t && !value.includes(t) && value.length < 8) onChange([...value, t])
    setDraft('')
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (draft.trim()) add(draft)
    } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1))
  }
  const q = slugify(draft)
  const offer = suggestions.filter((s) => !value.includes(s) && (!q || s.startsWith(q))).slice(0, 6)
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[14px] font-medium text-ink-2">
        {label}
      </label>
      <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-md bg-white px-2 py-1.5 shadow-[inset_0_0_0_1px_var(--color-line-2)] focus-within:shadow-[inset_0_0_0_1.5px_var(--color-ink)]">
        {value.map((t) => (
          <span key={t} className="inline-flex h-10 items-center gap-1 rounded-xs bg-chip pr-1 pl-2.5 sm:h-8 text-[14px] text-ink-2">
            {t}
            <button type="button" aria-label={`Remove tag ${t}`} onClick={() => onChange(value.filter((x) => x !== t))} className="grid size-10 place-items-center rounded-xs sm:size-6 text-subtle hover:bg-chip-2 hover:text-ink">
              <X aria-hidden className="size-3.5" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => draft.trim() && add(draft)}
          placeholder={value.length ? '' : 'typography, colour…'}
          aria-describedby={`${id}-hint`}
          className="h-10 min-w-[120px] flex-1 sm:h-8 bg-transparent px-1.5 text-[15px] outline-none placeholder:text-subtle focus-visible:outline-none"
        />
      </div>
      <p id={`${id}-hint`} className="sr-only">
        Press Enter or comma to add a tag.
      </p>
      {offer.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {offer.map((s) => (
            <button key={s} type="button" onClick={() => add(s)} className="inline-flex h-10 items-center gap-1 rounded-xs px-2.5 text-[13px] sm:h-8 text-muted shadow-[inset_0_0_0_1px_var(--color-line)] hover:bg-chip hover:text-ink">
              <Plus aria-hidden className="size-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
