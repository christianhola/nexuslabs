import { Closing } from '../sections/Closing'
import { EarnAndMeasure, Grow, Podcast } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { NewsletterSection } from '../sections/NewsletterSection'
import { Testimonials } from '../sections/Testimonials'
import { Trusted } from '../sections/Trusted'

// The landing page is a stack of sections; reorder or delete lines freely.
export function Home() {
  return (
    <>
      <Hero />
      <Trusted />
      <NewsletterSection />
      <Grow />
      <Podcast />
      <EarnAndMeasure />
      <Testimonials />
      <Closing />
    </>
  )
}
