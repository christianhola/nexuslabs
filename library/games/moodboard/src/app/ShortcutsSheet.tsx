import { SHORTCUTS } from '../content'
import { Dialog } from '../components/Dialog'
import { KeyCombo } from '../components/Kbd'
import { Link } from '../components/Link'

/** The keyboard shortcuts sheet (press ?). */
export function ShortcutsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Keyboard shortcuts" description="Pinch or Ctrl-scroll to zoom; scroll or two-finger drag to pan." size="lg">
      <div className="grid gap-x-8 gap-y-5 pb-3 sm:grid-cols-3">
        {SHORTCUTS.map((g) => (
          <section key={g.group}>
            <h3 className="mb-2 text-[11.5px] font-medium uppercase tracking-[0.06em] text-faint">{g.group}</h3>
            <ul className="flex flex-col">
              {g.items.map((s) => (
                <li key={s.label} className="flex min-h-8 items-center justify-between gap-3 text-[13.5px] text-ink-2">
                  <span>{s.label}</span>
                  <KeyCombo keys={s.keys} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="border-t border-line pb-2 pt-3 text-[12.5px] text-muted">
        Building on Inspo? See the{' '}
        <Link href="/styleguide" onClick={onClose} className="text-ink underline underline-offset-2">
          style guide
        </Link>
        .
      </p>
    </Dialog>
  )
}
