import { FOOTER } from '@/content'
import { Link } from '@/lib/router'
import { Container } from './Frame'
import { Logo } from './Logo'

export function SiteFooter() {
  return (
    <footer className="relative border-t border-line">
      <Container className="grid gap-10 py-14 sm:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link to="/" className="inline-block rounded-full py-1" aria-label="Clipwise home">
            <Logo size="sm" />
          </Link>
          <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-muted">{FOOTER.blurb}</p>
        </div>
        {FOOTER.columns.map((col) => (
          <div key={col.title}>
            <p className="text-[13px] font-medium text-fg">{col.title}</p>
            <ul className="mt-3 space-y-0.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="inline-block py-1.5 text-sm text-muted transition-colors hover:text-fg pointer-coarse:py-2.5">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="border-t border-line py-6 text-[13px] text-faint">{FOOTER.legal}</Container>
    </footer>
  )
}

