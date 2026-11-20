import { cx, modKey } from '../lib/cx'

const glyph: Record<string, string> = { Mod: modKey, Shift: '⇧', Delete: '⌫', Arrows: '←↑↓→' }

/** A keyboard key. `Mod` renders as ⌘ on Apple platforms and Ctrl elsewhere. */
export function Kbd({ k, tone = 'light', className }: { k: string; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <kbd
      className={cx(
        'inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] px-1.5 font-sans text-[11.5px] font-medium',
        tone === 'light'
          ? 'bg-surface text-ink-2 shadow-[inset_0_0_0_1px_var(--color-line-strong),0_1px_0_var(--color-line-strong)]'
          : 'bg-white/15 text-white',
        className,
      )}
    >
      {glyph[k] ?? k}
    </kbd>
  )
}

export function KeyCombo({ keys, tone }: { keys: string[]; tone?: 'light' | 'dark' }) {
  return (
    <span className="inline-flex items-center gap-1">
      {keys.map((k) =>
        k === 'drag' ? (
          <span key={k} className="text-[12px] text-faint">
            + drag
          </span>
        ) : (
          <Kbd key={k} k={k} tone={tone} />
        ),
      )}
    </span>
  )
}
