import { Hero } from '../sections/Hero'
import { Cta, Frontline, IntegrationsTeaser, LogoStrip, Modules, Showcase, Testimonial } from '../sections/HomeSections'

export function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <Modules />
      <Frontline />
      <Showcase />
      <Testimonial />
      <IntegrationsTeaser />
      <Cta />
    </>
  )
}
