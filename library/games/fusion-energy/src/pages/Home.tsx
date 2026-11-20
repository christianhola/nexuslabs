import { Audiences } from '../sections/Audiences'
import { Hero } from '../sections/Hero'
import { Milestones } from '../sections/Milestones'
import { Mission } from '../sections/Mission'
import { Why } from '../sections/Why'

export function Home() {
  return (
    <>
      <Hero />
      <Audiences />
      <Why />
      <Milestones />
      <Mission />
    </>
  )
}
