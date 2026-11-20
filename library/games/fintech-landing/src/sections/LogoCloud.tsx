import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { logos } from '../content'

// Each wordmark gets a small geometric glyph so the strip reads as logos.
const glyphs = [
  <circle key="c" cx="9" cy="9" r="7" />,
  <rect key="r" x="2" y="2" width="14" height="14" rx="3" />,
  <path key="t" d="M9 2l7 14H2z" />,
  <path key="d" d="M9 1l8 8-8 8-8-8z" />,
]

export function LogoCloud() {
  const row = [...logos, ...logos]
  return (
    <section className="relative border-y border-white/[0.06] py-12">
      <Container>
        <Reveal>
          <p className="text-center text-[14px] text-faint">Powering finance for 12,000+ fast-growing companies</p>
        </Reveal>
      </Container>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused]">
          {row.map((name, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[#7c7c83] transition-colors duration-300 hover:text-white">
              <svg viewBox="0 0 18 18" className="size-[18px] fill-current" aria-hidden>
                {glyphs[i % glyphs.length]}
              </svg>
              <span className="font-display text-[22px] font-semibold tracking-[-0.03em]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
