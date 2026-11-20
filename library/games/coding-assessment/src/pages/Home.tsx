import { Community } from '../sections/Community'
import { Cta } from '../sections/Cta'
import { Features } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { Logos } from '../sections/Logos'
import { Solutions } from '../sections/Solutions'
import { Stats } from '../sections/Stats'
import { Testimonials } from '../sections/Testimonials'

export function Home() {
  return (
    <>
      <Hero />
      <Logos />
      <Solutions />
      <Stats />
      <Features />
      <Community />
      <Testimonials />
      <Cta />
    </>
  )
}
