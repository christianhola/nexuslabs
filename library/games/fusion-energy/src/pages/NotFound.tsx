import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { LinkRow } from '../components/Controls'
import { Ship } from '../components/Ship'
import { notFound } from '../content'

export function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="ocean-wash relative isolate overflow-hidden pb-24 pt-36 sm:pt-44">
      <Container size="md" className="flex flex-col items-center text-center">
        <Ship kind="cargo" className="h-[90px] w-auto animate-float opacity-80" decorative />
        <p className="mt-8 text-[15px] font-medium text-plasma-text">Error 404</p>
        <h1 id="nf-title" className="display mt-3 text-[48px] sm:text-[64px]">
          {notFound.title}
        </h1>
        <p className="mt-4 max-w-[460px] text-[17px] text-muted">{notFound.body}</p>
        <ButtonLink href="/" size="lg" className="mt-8">
          Back to home
        </ButtonLink>
        <ul className="mt-14 w-full max-w-[520px] text-left">
          <li>
            <LinkRow href="/technology" title="Technology" body="How a compact stellarator powers a ship." />
          </li>
          <li>
            <LinkRow href="/careers" title="Careers" body="Open roles in San Francisco and Rotterdam." />
          </li>
          <li>
            <LinkRow href="/contact" title="Contact" body="Ask us anything." />
          </li>
        </ul>
      </Container>
    </section>
  )
}
