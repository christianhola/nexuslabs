import { ArrowLeft } from 'lucide-react'

import { ButtonLink } from '@/components/Button'
import { Container } from '@/components/Frame'
import { ScreenMock } from '@/components/ScreenMock'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { NOT_FOUND } from '@/content'

export function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav />
      <main className="flex-1">
        <Container className="grid items-center gap-12 py-24 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[13px] text-ember-text">404 · 0:00 / 0:00</p>
            <h1 className="mt-4 font-display text-[44px] leading-[1.05] font-medium tracking-[-0.045em] text-cream sm:text-[60px]">{NOT_FOUND.title}</h1>
            <p className="mt-4 max-w-[40ch] text-[18px] text-muted">{NOT_FOUND.body}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/" variant="primary" icon={<ArrowLeft className="size-4" />}>
                Back home
              </ButtonLink>
              <ButtonLink to="/app" variant="secondary">
                Open the library
              </ButtonLink>
            </div>
          </div>
          <div className="relative">
            <ScreenMock scene="site" presenter="maya" className="aspect-video rounded-[18px] ring-1 ring-line" />
            <div className="absolute inset-x-6 bottom-6 h-1 rounded-full bg-white/15" aria-hidden />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </div>
  )
}
