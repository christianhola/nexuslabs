import { Cta } from '../sections/Cta'
import { Developers } from '../sections/Developers'
import { Hero } from '../sections/Hero'
import { LogoStrip } from '../sections/LogoStrip'
import { Platform } from '../sections/Platform'
import { Scheduler } from '../sections/Scheduler'
import { Stats } from '../sections/Stats'
import { UseCasesTeaser } from '../sections/UseCasesTeaser'

export function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Platform />
      <Scheduler />
      <Developers />
      <Stats />
      <UseCasesTeaser />
      <Cta />
    </>
  )
}
