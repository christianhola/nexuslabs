import { CountUp } from '../components/CountUp'
import { EmailCapture } from '../components/EmailCapture'
import { HeroIso } from '../components/HeroIso'
import { Container } from '../components/Container'
import { Squiggle } from '../components/Squiggle'
import { Stars } from '../components/Stars'
import { heroStats } from '../content'
import { useLang } from '../lib/lang'

export function Hero() {
  const { t } = useLang()
  return (
    <Container as="section" className="grid items-center gap-10 pb-16 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,520px)_1fr] lg:gap-6 lg:pb-24 lg:pt-[78px]">
      <div>
        <h1 className="font-display text-[48px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink sm:text-[62px] lg:text-[70px]">
          {t.heroBefore ? `${t.heroBefore} ` : ''}
          <span className="relative inline-block whitespace-nowrap">
            {t.heroAccent}
            <Squiggle />
          </span>
          {t.heroAfter ? ` ${t.heroAfter}` : ''}
        </h1>
        <p className="mt-7 max-w-[440px] text-pretty text-[18px] leading-[1.62] text-body sm:text-[19.5px]">{t.heroBody}</p>
        <EmailCapture className="mt-10" placeholder={t.emailPlaceholder} cta={t.bookDemo} source="hero" />

        <dl className="mt-[70px] grid max-w-[456px] grid-cols-2 border-b border-line">
          <div className="pb-7 pr-6 flex flex-col-reverse justify-end">
            <dt className="mt-3 text-[15.5px] text-body">{t.stat1}</dt>
            <dd className="font-display text-[40px] font-medium leading-none tracking-[-0.045em] text-ink sm:text-[42px]">
              <CountUp value={heroStats.active.value} decimals={1} suffix="%" />
            </dd>
          </div>
          <div className="border-l border-line pb-7 pl-7 flex flex-col-reverse justify-end">
            <dt className="mt-3 text-[15.5px] text-body">{t.stat2}</dt>
            <dd className="font-display text-[40px] font-medium leading-none tracking-[-0.045em] text-ink sm:text-[42px]">
              <CountUp value={heroStats.daily.value} prefix="~" suffix="k" />
            </dd>
          </div>
        </dl>
        <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1">
          <Stars value={heroStats.rating} />
          <span className="text-[15px] font-semibold text-ink">{heroStats.rating}</span>
          <span className="text-[14px] text-faint">{t.rating}</span>
        </p>
      </div>
      <div className="mx-auto w-full max-w-[540px] lg:-mt-4 lg:ml-auto lg:mr-[26px]">
        <HeroIso />
      </div>
    </Container>
  )
}
