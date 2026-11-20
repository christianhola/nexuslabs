import { Logo } from '../components/Logo'
import { FOOTER } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)] gap-12 px-5 py-16 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[30ch] text-[15px] leading-[1.6] text-muted">{FOOTER.blurb}</p>
        </div>
        {FOOTER.columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <p className="text-[13px] tracking-[0.08em] text-subtle uppercase">{col.title}</p>
            <ul className="mt-4 flex flex-col gap-1">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="-mx-2 inline-flex h-10 items-center rounded-sm px-2 text-[15px] text-ink-2 hover:bg-chip hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="mx-auto flex max-w-[1200px] flex-wrap justify-between gap-2 border-t border-line px-5 py-6 text-[14px] text-subtle sm:px-8">
        <span>© {new Date().getFullYear()} Keepsake. A Freebuff starter.</span>
        <span>Made for people who save too much.</span>
      </div>
    </footer>
  )
}
