import { Cta } from '../sections/Cta'
import { Faq } from '../sections/Faq'
import { Hero } from '../sections/Hero'
import { Metrics } from '../sections/Metrics'
import { Pillars } from '../sections/Pillars'
import { PricingTeaser } from '../sections/PricingTeaser'
import { Testimonial } from '../sections/Testimonial'

export function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <Metrics />
      <Testimonial />
      <PricingTeaser />
      <Faq />
      <Cta />
    </>
  )
}
