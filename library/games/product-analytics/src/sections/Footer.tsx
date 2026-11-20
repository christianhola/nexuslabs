import { Logo } from '../components/Logo'
import { Container } from '../components/Container'
import { brand, footer } from '../content'
import { Link } from '../lib/router'
import { SubscribeForm } from './SubscribeForm'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper pb-10 pt-16">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_repeat(3,0.7fr)]">
          <div className="max-w-[340px]">
            <Logo mark />
            <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{footer.blurb}</p>
            <div className="mt-6">
              <SubscribeForm source="footer" label="Product updates, once a month" />
            </div>
          </div>
          {footer.columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="font-display text-[14px] font-semibold text-ink">{c.title}</h2>
              <ul className="mt-4 flex flex-col gap-1">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center rounded-[6px] text-[14.5px] text-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-leaf">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col justify-between gap-1 border-t border-line pt-6 sm:items-center text-[13.5px] text-faint sm:flex-row">
          <p>{footer.legal}</p>
          <a href={`mailto:${brand.email}`} className="inline-flex min-h-10 items-center self-start rounded-[6px] hover:text-ink focus-visible:outline-2 focus-visible:outline-leaf">
            {brand.email}
          </a>
        </div>
      </Container>
    </footer>
  )
}
