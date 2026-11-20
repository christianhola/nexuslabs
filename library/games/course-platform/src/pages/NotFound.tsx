import { Compass } from 'lucide-react'

import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { featureLinks } from '../content'
import { Link } from '../lib/router'

export function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <span className="round grid size-16 place-items-center rounded-full bg-flame-soft text-flame-ink">
        <Compass className="size-7" aria-hidden />
      </span>
      <p className="mt-6 font-display text-[15px] font-medium text-flame-ink">404</p>
      <h1 className="mt-2 font-display text-[40px] font-medium tracking-[-0.03em] text-ink sm:text-[52px]">This lesson is not in the course</h1>
      <p className="mt-3 max-w-[460px] text-[16px] text-muted">The page you are looking for was moved, renamed or never published. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/" size="lg">
          Back to home
        </Button>
        <Button href="/contact" size="lg" variant="outline">
          Contact us
        </Button>
      </div>
      <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {featureLinks.map((f) => (
          <li key={f.href}>
            <Link href={f.href} className="inline-flex min-h-10 items-center text-[15px] text-ink underline decoration-line-strong underline-offset-4 hover:decoration-flame-strong focus-visible:outline-2 focus-visible:outline-flame-strong">
              {f.label}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
