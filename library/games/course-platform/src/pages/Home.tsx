import { Cta } from '../sections/Cta'
import { Experience } from '../sections/Experience'
import { Features } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { Steps } from '../sections/Steps'
import { Teams } from '../sections/Teams'
import { Testimonials } from '../sections/Testimonials'
import { TrustedBy } from '../sections/TrustedBy'

export function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Experience />
      <Features />
      <Steps />
      <Teams />
      <Testimonials />
      <Cta />
    </>
  )
}
