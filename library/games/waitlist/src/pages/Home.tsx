import { useEffect } from 'react'

import { SiteFooter } from '../components/Layout'
import { brand } from '../content'
import { scrollToHash, useTitle } from '../lib/router'
import { Faq } from '../sections/Faq'
import { Features } from '../sections/Features'
import { Founder } from '../sections/Founder'
import { Intro } from '../sections/Intro'
import { Press } from '../sections/Press'
import { Referrals } from '../sections/Referrals'
import { Showcase } from '../sections/Showcase'

export function Home() {
  useTitle(`${brand.name} — Coming soon`)
  // A deep link like /#faq: scroll once the sections exist.
  useEffect(() => {
    if (window.location.hash) requestAnimationFrame(() => scrollToHash(window.location.hash))
  }, [])

  return (
    <>
      <main id="main" className="overflow-x-clip">
        {/* Above the fold: the reference composition, untouched. */}
        <div className="grid min-h-dvh lg:grid-cols-[40%_60%]">
          <Intro />
          <Showcase />
        </div>
        <Press />
        <Features />
        <Referrals />
        <Founder />
        <Faq />
      </main>
      <SiteFooter />
    </>
  )
}
