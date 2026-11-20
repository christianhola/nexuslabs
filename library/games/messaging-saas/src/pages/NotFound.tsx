import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { Bubble } from '../components/mocks/Chat'
import { notFound } from '../content'
import { Link } from '../lib/router'

export function NotFound() {
  return (
    <section className="grain relative overflow-hidden pb-24 pt-40">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_70%_20%,#16245c,transparent_70%)]" />
      <Container className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-6">
          <p className="font-display text-[15px] font-semibold uppercase tracking-[0.14em] text-cobalt-text">Error 404</p>
          <h1 className="font-display text-[44px] font-medium leading-[1.06] tracking-[-0.025em] text-white sm:text-[64px]">{notFound.title}</h1>
          <p className="max-w-[520px] text-[17px] leading-[1.6] text-muted">{notFound.body}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="/" arrow size="lg">
              Back home
            </Button>
            <Button href="/faq" variant="subtle" size="lg">
              Read the FAQ
            </Button>
          </div>
        </div>
        <div className="mx-auto grid w-full max-w-[360px] gap-2.5 rounded-[28px] border border-line bg-panel p-5" aria-hidden>
          <Bubble from="shopper">Where did the page go?</Bubble>
          <Bubble from="brand">Not sure, but these still work: Pricing, Features, Blog.</Bubble>
          <Bubble from="shopper">HOME</Bubble>
        </div>
      </Container>
      <Container className="mt-14">
        <nav aria-label="Popular pages" className="flex flex-wrap gap-2">
          {[
            ['Features', '/features'],
            ['Pricing', '/pricing'],
            ['Customers', '/customers'],
            ['Blog', '/blog'],
            ['Test our AI', '/demo'],
          ].map(([l, h]) => (
            <Link key={h} href={h} className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-[14px] text-soft hover:bg-white hover:text-bg">
              {l}
            </Link>
          ))}
        </nav>
      </Container>
    </section>
  )
}
