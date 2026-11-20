import { AvatarStack, Container, LiveDot } from '../components/ui'
import { Reveal } from '../components/Reveal'
import { form, press } from '../content'
import { useWaitlistCount } from '../lib/count'

// Placeholder wordmarks: each outlet gets its own type treatment so the row
// reads like real logos. Swap for SVG logos you have rights to.
const styles = [
  'font-bold tracking-[-0.04em]',
  'font-semibold italic tracking-[-0.02em]',
  'font-extrabold uppercase tracking-[0.06em] text-[15px]',
  'font-medium tracking-[-0.01em] [font-variant:small-caps]',
  'font-semibold tracking-[0.01em]',
]

/** Social proof strip right under the fold: press wordmarks and the live count. */
export function Press() {
  const count = useWaitlistCount()
  return (
    <section aria-label="Press and social proof" className="border-y border-line-soft bg-page">
      <Container className="py-10 lg:py-12">
        <Reveal className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-micro font-medium uppercase tracking-[0.12em] text-muted">{press.label}</p>
            <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3">
              {press.outlets.map((name, i) => (
                <li key={name} className={`text-[17px] text-muted transition-colors duration-150 hover:text-ink ${styles[i % styles.length]}`}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex shrink-0 flex-col gap-3 lg:items-end">
            <figure className="max-w-[420px] lg:text-right">
              <blockquote className="text-copy font-medium text-ink">{press.quote}</blockquote>
              <figcaption className="mt-1 text-small text-muted">— {press.quoteSource}</figcaption>
            </figure>
            {count !== null && count > 0 && (
              <p className="inline-flex items-center gap-2.5 text-small text-muted">
                <AvatarStack people={['JD', 'AK', 'SM', 'RT']} />
                <LiveDot />
                <span>
                  <span className="font-medium text-ink tabular-nums">{count.toLocaleString()}</span> {count === 1 ? form.waitingOne : form.waitingMany}
                </span>
              </p>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
