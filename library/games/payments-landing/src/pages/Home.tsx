import { Cta } from '../sections/Cta'
import { Features } from '../sections/Features'
import { Hero } from '../sections/Hero'
import { Insights } from '../sections/Insights'
import { Mission } from '../sections/Mission'
import { PlansTeaser } from '../sections/PlansTeaser'
import { Steps } from '../sections/Steps'
import { Why } from '../sections/Why'

export function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Insights />
      <Steps />
      <Mission />
      <Why />
      <PlansTeaser />
      <Cta />
    </>
  )
}
