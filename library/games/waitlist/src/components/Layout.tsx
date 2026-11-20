import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { brand, site } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Logo } from './Brand'
import { ButtonLink, Container } from './ui'

/** Slim header for inner pages (the home page has none, like the reference). */
export function SiteHeader({ cta = true }: { cta?: boolean }) {
  return (
    <header className="border-b border-line-soft bg-white/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        {cta && (
          <ButtonLink href="/" variant="secondary" size="sm" iconEnd={<ArrowRight className="size-4" aria-hidden="true" />}>
            {site.headerCta}
          </ButtonLink>
        )}
      </Container>
    </header>
  )
}

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cx('border-t border-line-soft bg-page', className)}>
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-[300px] text-small text-muted">{site.footerNote}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-1 gap-y-1 sm:justify-end">
            {site.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-10 items-center rounded-control px-2.5 text-[14px] text-muted outline-none transition-colors duration-150 is-hover:text-ink is-focus:shadow-focus"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 px-2.5 text-micro text-muted sm:text-right">
            © {new Date().getFullYear()} {brand.name}
          </p>
        </nav>
      </Container>
    </footer>
  )
}

/** Header + main + footer for every page except home. */
export function PageShell({ children, cta, tone = 'stage' }: { children: ReactNode; cta?: boolean; tone?: 'stage' | 'page' }) {
  return (
    <div className={cx('flex min-h-dvh flex-col', tone === 'stage' ? 'bg-stage' : 'bg-page')}>
      <SiteHeader cta={cta} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
