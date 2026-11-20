import { ButtonLink } from '../components/Button'
import { PageIntro } from '../components/PageIntro'

export function NotFound() {
  return (
    <PageIntro eyebrow="Error 404" title="This page failed its tests" sub="The address does not match any page. It may have moved, or the link has a typo." className="pb-32">
      <div className="mt-6 font-mono text-[14px] text-muted">
        <span className="text-danger">✕</span> expected <span className="text-brand-text">a page</span>, got <span className="text-danger">undefined</span>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/demo" variant="secondary">
          Try the sample challenge
        </ButtonLink>
      </div>
    </PageIntro>
  )
}
