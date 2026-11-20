import { Button } from '../components/Button'
import { images, nav } from '../content'
import { Link, useLocation } from '../lib/router'

export function NotFound() {
  const { path } = useLocation()
  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-40 pt-32" aria-labelledby="nf-h">
      <img src={images.loneTree} alt="" className="absolute inset-0 -z-10 size-full object-cover object-[30%_60%]" decoding="async" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(245_247_242/0.92),rgb(245_247_242/0.6)_45%,transparent_75%)] max-md:bg-[linear-gradient(180deg,rgb(245_247_242/0.92),rgb(245_247_242/0.7)_55%,transparent)]" />
      <div className="mx-auto w-full max-w-[1140px] sm:px-3">
        <div className="max-w-[460px]">
          <p className="font-display text-[14px] font-semibold text-leaf">Error 404</p>
          <h1 id="nf-h" className="mt-3 font-display text-[44px] font-bold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[60px]">
            This page wandered off
          </h1>
          <p className="mt-4 text-[16px] leading-relaxed text-body">
            Nothing lives at <code className="rounded-[6px] bg-white/70 px-1.5 py-0.5 font-mono text-[14px] text-ink">{path}</code>. It may have moved, or the link has a typo.
          </p>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button href="/" arrow>
              Back to home
            </Button>
            <Button href="/docs" variant="dark">
              Search the docs
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-1 text-[14.5px]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="inline-flex min-h-10 items-center rounded font-medium text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-leaf">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
