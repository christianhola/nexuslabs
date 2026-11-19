import { ButtonLink } from '../components/Button'
import { Photo } from '../components/Photo'
import { NOT_FOUND } from '../content'

export function NotFound() {
  return (
    <section className="container-page grid gap-10 pt-32 pb-24 md:grid-cols-12 md:pt-40">
      <div className="md:col-span-7">
        <p className="label-sm text-ink-2">404</p>
        <h1 className="font-display mt-5 text-[clamp(3rem,7vw,7rem)] text-balance">{NOT_FOUND.title}</h1>
        <p className="mt-6 max-w-md text-[17px] text-ink-2">{NOT_FOUND.body}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink to="/" icon>
            Back home
          </ButtonLink>
          <ButtonLink to="/portfolio" variant="outline">
            See the portfolio
          </ButtonLink>
        </div>
      </div>
      <Photo name="before" alt="A dated living room waiting for a redesign" className="aspect-[4/3] md:col-span-5" />
    </section>
  )
}
