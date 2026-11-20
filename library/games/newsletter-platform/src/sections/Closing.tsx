import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { closing } from '../content'

export function Closing() {
  return (
    <section className="py-16 lg:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[var(--radius-card-lg)] border border-line bg-[radial-gradient(70%_120%_at_50%_120%,rgb(229_72_191/0.35),transparent_60%),radial-gradient(60%_90%_at_10%_0%,rgb(88_52_160/0.35),transparent_60%),var(--color-panel)] px-6 py-16 text-center sm:py-24">
          <h2 className="display mx-auto max-w-[900px] text-[40px] uppercase text-white sm:text-[64px]">{closing.title}</h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[18px] text-body">{closing.body}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={closing.primary.href} variant="white" size="lg">
              {closing.primary.label}
            </Button>
            <Button href={closing.secondary.href} variant="outline" size="lg">
              {closing.secondary.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
