import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { Eyebrow } from '../components/SectionHeading'

export function NotFound() {
  return (
    <section aria-labelledby="nf-title" className="mx-auto flex max-w-[640px] flex-col items-center px-5 pt-[88px] pb-36 text-center">
      <Eyebrow>404</Eyebrow>
      <h1 id="nf-title" className="mt-6 text-[clamp(44px,6vw,80px)] leading-[0.98] font-bold tracking-[-0.05em]">
        We did not keep <span className="rounded-[0.2em] bg-lime px-[0.15em]">that</span> one
      </h1>
      <p className="mt-6 text-[18px] text-muted">The page you asked for is not here. Maybe it was never saved.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/" variant="dark" size="lg">
          Back home
        </ButtonLink>
        <ButtonLink href="/app" variant="soft" size="lg" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
          Search your shelf
        </ButtonLink>
      </div>
    </section>
  )
}
