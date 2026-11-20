import { Cta } from '../sections/Cta'
import { Faq } from '../sections/Faq'
import { Features } from '../sections/Features'
import { Footer } from '../sections/Footer'
import { Hero } from '../sections/Hero'
import { Nav } from '../sections/Nav'
import { Pricing } from '../sections/Pricing'
import { Proof } from '../sections/Proof'
import { Steps } from '../sections/Steps'
import { Testimonials } from '../sections/Testimonials'

// The marketing page: a stack of sections. Copy lives in src/content.ts.
export function Landing() {
  return (
    <>
      <Nav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Proof />
        <Features />
        <Steps />
        <Testimonials />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
