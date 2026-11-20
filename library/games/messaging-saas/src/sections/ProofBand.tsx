import { Avatar } from '../components/Avatar'
import { LogoMarquee } from '../components/LogoTile'
import { proof } from '../content'

/** The charcoal band that overlaps the hero: one-word quote, founder, and the logo marquee. */
export function ProofBand() {
  return (
    <section aria-label="Customers" className="relative z-10 -mt-[130px] rounded-t-[28px] bg-panel sm:rounded-t-[36px]">
      <div className="mx-auto grid max-w-[1440px] items-center gap-10 py-12 pl-5 sm:pl-8 lg:grid-cols-[minmax(0,500px)_1fr] lg:gap-6 lg:py-[78px] lg:pl-[72px]">
        <figure className="pr-5">
          <blockquote className="font-display text-[46px] font-medium leading-none tracking-[-0.02em] text-white sm:text-[51px]">{proof.quote}</blockquote>
          <figcaption className="mt-8 flex items-center gap-4 text-[15px] leading-[1.45] text-soft">
            <Avatar src={proof.avatar} name={proof.name} size={34} />
            <span>
              <span className="block text-white/85">{proof.name}</span>
              <span className="block text-white/85">{proof.role}</span>
            </span>
          </figcaption>
        </figure>
        <LogoMarquee />
      </div>
    </section>
  )
}
