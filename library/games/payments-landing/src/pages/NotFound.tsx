import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { Shapes } from '../components/Shapes'
import { nav, notFound } from '../content'
import { Link } from '../lib/router'

export function NotFound() {
  return (
    <section className="relative overflow-hidden bg-mist pb-24 pt-36 sm:pt-44">
      <Shapes />
      <Container className="relative max-w-[760px] text-center">
        <p className="tabular text-[120px] font-medium leading-none tracking-[-0.06em] text-teal sm:text-[160px]" aria-hidden>
          404
        </p>
        <h1 className="mt-4 text-[34px] font-medium tracking-[-0.035em] text-ink sm:text-[44px]">{notFound.title}</h1>
        <p className="mx-auto mt-4 max-w-[440px] text-[16px] leading-[1.6] text-muted">{notFound.body}</p>
        <ButtonLink href="/" size="lg" className="mt-8" icon={<ArrowRight className="size-4" aria-hidden />}>
          Back to home
        </ButtonLink>
        <ul className="mt-10 flex flex-wrap justify-center gap-2">
          {nav.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="inline-flex h-10 items-center rounded-control-sm bg-white px-4 text-[14px] font-medium text-ink-2 shadow-card hover:text-ink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
