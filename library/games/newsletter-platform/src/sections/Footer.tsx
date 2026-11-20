import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { footer } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="border-t border-line bg-night pb-28 pt-16 sm:pb-16">
      <Container className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[280px] text-[15px] text-muted">{footer.blurb}</p>
        </div>
        {footer.columns.map((c) => (
          <div key={c.title}>
            <h2 className="text-[14px] font-semibold text-ink">{c.title}</h2>
            <ul className="mt-3 flex flex-col">
              {c.links.map((l) => (
                <li key={l.label}>
                  {l.href.startsWith('/') && !l.href.startsWith('/api') ? (
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-[15px] text-muted hover:text-white">
                      {l.label}
                    </Link>
                  ) : (
                    <a href={l.href} className="inline-flex min-h-10 items-center text-[15px] text-muted hover:text-white">
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container className="mt-12">
        <p className="border-t border-line pt-6 text-[13px] text-faint">{footer.legal}</p>
      </Container>
    </footer>
  )
}
