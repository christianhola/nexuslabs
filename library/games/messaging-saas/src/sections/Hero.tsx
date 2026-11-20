import { UrlForm } from '../components/UrlForm'
import { Container } from '../components/Container'
import { hero, images } from '../content'
import { navigate } from '../lib/router'

/** The reference hero: navy stage, kinetic render on the right, three-line promise and the URL test. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="grain relative isolate min-h-[760px] overflow-hidden bg-bg pb-44 sm:min-h-[860px] lg:min-h-[910px]">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_62%_18%,#16245c_0%,#0d1638_38%,#080b17_78%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 lg:left-[30%]">
        <img src={images.hero} alt="" fetchPriority="high" className="h-full w-full animate-[fade_1.4s_ease-out_both] object-cover object-[80%_40%] opacity-40 [mask-image:linear-gradient(90deg,transparent_0%,rgb(0_0_0/0.35)_14%,rgb(0_0_0/0.85)_34%,#000_50%)] lg:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#080b17]/60 to-transparent" />
      <Container className="relative pt-[168px] sm:pt-[216px]">
        <h1 id="hero-title" className="max-w-[640px] font-display text-[46px] font-medium leading-[1.12] tracking-[-0.022em] text-white sm:text-[62px] lg:text-[70px]">
          {hero.titleLines.map((l, i) => (
            <span key={l} className="block animate-[rise_900ms_var(--ease-brand)_both]" style={{ animationDelay: `${120 + i * 110}ms` }}>
              {l}
            </span>
          ))}
        </h1>
        <p className="mt-9 max-w-[640px] animate-[rise_900ms_var(--ease-brand)_both] text-[16px] leading-[1.42] tracking-[-0.01em] text-[#f0f2f7] [animation-delay:480ms] sm:text-[16.5px]">{hero.body}</p>
        <UrlForm className="mt-[72px] max-w-[560px] animate-[rise_900ms_var(--ease-brand)_both] [animation-delay:600ms] sm:mt-[92px]" onSubmit={(host) => navigate(`/demo?url=${encodeURIComponent(host)}`)} />
      </Container>
    </section>
  )
}
