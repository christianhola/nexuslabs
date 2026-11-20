import { Container } from '../components/Container'
import { EmailCapture } from '../components/EmailCapture'
import { Logo } from '../components/Logo'
import { brand, footer } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="bg-navy text-on-navy">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.3fr_2fr] md:py-20">
        <div>
          <Logo tone="white" />
          <p className="mt-4 max-w-[320px] text-[15px] leading-6 text-on-navy-muted">{footer.blurb}</p>
          <p className="mb-3 mt-8 text-[14px] font-medium text-white">Product news, once a month</p>
          <EmailCapture placeholder="you@company.com" cta="Subscribe" success="Subscribed. See you next month." tone="navy" label="Email for product news" />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[14px] font-semibold text-white">{col.title}</h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center text-[14.5px] text-on-navy-muted hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
      <Container>
        <div className="flex flex-col gap-3 border-t border-navy-line py-6 text-[13px] text-on-navy-muted sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {brand.name}. {footer.legal}
        </p>
        <a href={`mailto:${brand.support}`} className="inline-flex min-h-10 items-center hover:text-white">
          {brand.support}
        </a>
        </div>
      </Container>
    </footer>
  )
}
