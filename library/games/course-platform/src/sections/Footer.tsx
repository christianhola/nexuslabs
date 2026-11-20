import { Container } from '../components/Container'
import { Logo } from '../components/Logo'
import { brand, footer } from '../content'
import { Link } from '../lib/router'
import { SubscribeForm } from './SubscribeForm'

export function Footer() {
  return (
    <footer className="border-t border-line bg-wash">
      <Container className="grid grid-cols-1 gap-12 py-16 lg:grid-cols-[1.3fr_2fr_1.3fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-[280px] text-[14.5px] leading-relaxed text-muted">{footer.blurb}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-display text-[14px] font-medium text-ink">{col.title}</h2>
              <ul className="mt-3 flex flex-col">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-[14.5px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong sm:min-h-9">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h2 className="font-display text-[16px] font-medium text-ink">{footer.newsletter.title}</h2>
          <p className="mb-4 mt-1 text-[14px] text-muted">{footer.newsletter.body}</p>
          <SubscribeForm />
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.legal}</p>
          <p>{brand.domain}</p>
        </Container>
      </div>
    </footer>
  )
}
