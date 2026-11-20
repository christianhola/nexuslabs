import { ArrowLeft } from 'lucide-react'

import { PageShell } from '../components/Layout'
import { Reveal } from '../components/Reveal'
import { ButtonLink, Container } from '../components/ui'
import { notFound } from '../content'
import { useTitle } from '../lib/router'

export function NotFound() {
  useTitle('Page not found')
  return (
    <PageShell cta={false} tone="page">
      <Container className="grid min-h-[60dvh] place-items-center py-20">
        <Reveal className="text-center">
          <p className="text-[96px] font-bold leading-none tracking-[-0.06em] text-accent-strong sm:text-[128px]">404</p>
          <h1 className="mt-4 text-[28px] font-bold tracking-[-0.035em] text-ink sm:text-title">{notFound.title}</h1>
          <p className="mx-auto mt-3 max-w-[420px] text-lead text-muted">{notFound.body}</p>
          <ButtonLink href="/" className="mt-8" icon={<ArrowLeft className="size-4" aria-hidden="true" />}>
            {notFound.cta}
          </ButtonLink>
        </Reveal>
      </Container>
    </PageShell>
  )
}
