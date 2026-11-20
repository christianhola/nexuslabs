import { Logo } from '../components/Logo'
import { Container } from '../components/Container'
import { brand, footer } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="border-t border-ink/[0.08] pb-10 pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[280px] text-[15px] leading-6 text-muted">{footer.blurb}</p>
            <a href={`mailto:${brand.salesEmail}`} className="mt-4 inline-flex min-h-10 items-center text-[15px] font-medium underline decoration-ink/25 underline-offset-4 hover:decoration-ink">
              {brand.salesEmail}
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-[14px] font-medium text-ink">{col.title}</h2>
                <ul className="mt-3 space-y-0.5">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-10 items-center text-[14.5px] text-muted transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-14 border-t border-ink/[0.08] pt-6 text-[13px] text-muted">{footer.legal}</p>
      </Container>
    </footer>
  )
}
