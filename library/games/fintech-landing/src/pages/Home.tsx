import { Blog } from '../sections/Blog'
import { Controls } from '../sections/Controls'
import { Cta } from '../sections/Cta'
import { Faq } from '../sections/Faq'
import { Features } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { LogoCloud } from '../sections/LogoCloud'
import { Pricing } from '../sections/Pricing'
import { Testimonials } from '../sections/Testimonials'

// The landing page: a stack of sections. Delete or reorder lines to change it.
export function Home() {
  return (
    <>
      <Hero />
      <LogoCloud />
      <Features />
      <Controls />
      <Pricing />
      <Testimonials />
      <Blog />
      <Faq />
      <Cta />
    </>
  )
}
