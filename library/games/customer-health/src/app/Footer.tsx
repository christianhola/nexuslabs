import { Link } from '../components/Link'

const link = 'caps inline-flex min-h-10 items-center text-[10px] tracking-[0.2em] text-muted transition-colors hover:text-fg sm:min-h-0'

export function Footer({ onOpenShortcuts, onOpenGuide }: { onOpenShortcuts: () => void; onOpenGuide: () => void }) {
  return (
    <footer className="mx-auto mt-4 flex max-w-[1304px] flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-line-soft px-4 py-5 sm:px-8">
      <span className="caps text-[10px] tracking-[0.2em] text-muted">Customer health · seeded data, today = Nov 11 ’26</span>
      <div className="flex flex-wrap items-center gap-x-6">
        <Link to="/styleguide" className={link}>
          Style guide
        </Link>
        <button type="button" onClick={onOpenShortcuts} className={`${link} cursor-pointer`}>
          Shortcuts
        </button>
        <button type="button" onClick={onOpenGuide} className={`${link} cursor-pointer`}>
          Template guide
        </button>
      </div>
    </footer>
  )
}
