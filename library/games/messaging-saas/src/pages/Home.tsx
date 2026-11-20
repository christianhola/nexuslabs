import { DemoSection } from '../sections/DemoSection'
import { Guarantee } from '../sections/Guarantee'
import { Hero } from '../sections/Hero'
import { Pillars } from '../sections/Pillars'
import { ProductTour } from '../sections/ProductTour'
import { ProofBand } from '../sections/ProofBand'
import { Stats } from '../sections/Stats'
import { Testimonials } from '../sections/Testimonials'

export function Home() {
  return (
    <>
      <Hero />
      <ProofBand />
      <Pillars />
      <DemoSection />
      <Stats />
      <ProductTour />
      <Testimonials />
      <Guarantee />
    </>
  )
}
