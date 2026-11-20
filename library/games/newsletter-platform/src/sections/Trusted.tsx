import { PublisherMarquee } from '../components/PublisherLogos'
import { publishers, trusted } from '../content'

export function Trusted() {
  return (
    <section aria-labelledby="trusted-h" className="pb-20 pt-6 lg:pb-24">
      <h2 id="trusted-h" className="px-4 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink sm:text-[15px]">
        {trusted}
      </h2>
      <div className="mx-auto mt-12 max-w-[1400px]">
        <PublisherMarquee publishers={publishers} />
      </div>
    </section>
  )
}
