import { Logo } from '../components/Logo'
import { NewsletterForm } from '../components/NewsletterForm'
import { FOOTER } from '../content'
import { Link } from '../lib/router'

export function Footer() {
  return (
    <footer className="border-t border-white/7 bg-[#040809]">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-16 sm:px-6 md:grid-cols-[1.3fr_2fr] lg:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{FOOTER.blurb}</p>
          <h2 className="mt-8 mb-3 text-[15px] font-medium">{FOOTER.newsletter.title}</h2>
          <NewsletterForm />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[14px] font-medium text-fg">{col.title}</h2>
              <ul className="mt-3 grid gap-1">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="inline-flex min-h-10 items-center rounded-md text-[15px] text-muted transition-colors hover:text-white sm:min-h-8">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] border-t border-white/6 px-4 py-6 text-[13.5px] text-faint sm:px-6 lg:px-8">{FOOTER.legal}</div>
    </footer>
  )
}
