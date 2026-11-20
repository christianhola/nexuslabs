import { Cta } from '../sections/Cta'
import { Faq } from '../sections/Faq'
import { Finding } from '../sections/Finding'
import { Hero } from '../sections/Hero'
import { Saving } from '../sections/Saving'

export function Home() {
  return (
    <>
      <Hero />
      <Finding />
      <Saving />
      <Faq />
      <Cta />
    </>
  )
}
