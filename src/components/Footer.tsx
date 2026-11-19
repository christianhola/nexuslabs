import { Link } from 'react-router'

import { BRAND, FOOTER } from '../content'
import { Label } from './Label'
import { NewsletterForm } from './NewsletterForm'

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-snow">
      <div className="container-page grid gap-12 pt-20 pb-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.04em] text-balance">{FOOTER.newsletterTitle}</h2>
          <p className="mt-3 max-w-sm text-[15px] text-snow-muted">{FOOTER.newsletterBody}</p>
          <NewsletterForm className="mt-6 max-w-md" />
        </div>
        {FOOTER.columns.map((col) => (
          <div key={col.title} className="md:col-span-2 md:col-start-auto">
            <Label tone="light">{col.title}</Label>
            <ul className="mt-4 flex flex-col">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="inline-flex min-h-10 items-center text-[15px] transition-opacity hover:opacity-60">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="md:col-span-3">
          <Label tone="light">Visit</Label>
          <address className="mt-4 flex flex-col gap-1 text-[15px] not-italic">
            {BRAND.address.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className="mt-3 text-snow-muted">{BRAND.hours}</span>
            <a href={`mailto:${BRAND.email}`} className="mt-3 inline-flex min-h-10 items-center hover:opacity-60">
              {BRAND.email}
            </a>
            <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`} className="inline-flex min-h-10 items-center hover:opacity-60">
              {BRAND.phone}
            </a>
          </address>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-night-line py-5 text-[13px] text-snow-muted sm:flex-row sm:justify-between">
        <p>{FOOTER.legal}</p>
        <p>
          Photography generated for this template. <Link to="/styleguide" className="underline underline-offset-2 hover:text-snow">Style guide</Link>
        </p>
      </div>
      {/* Drawn from a pseudo-element so it stays decoration, out of the text and contrast tree. */}
      <p aria-hidden data-text={BRAND.wordmark} className="wordmark -mb-[0.02em] px-2 text-center text-[clamp(4.5rem,21.4vw,22rem)] text-snow/[0.08] select-none before:content-[attr(data-text)]" />
    </footer>
  )
}
