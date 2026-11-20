import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { DotColumns } from '../components/DotColumns'
import { Reveal } from '../components/Reveal'

const columns = [
  { left: 980, top: 40, height: 200, delay: -1 },
  { left: 1043, top: 120, height: 180, delay: -3 },
  { left: 1180, top: 70, height: 240, delay: -2 },
  { left: 1243, top: 20, height: 160, delay: -4 },
]

export function Cta({ title = 'Put every home on the grid’s side', body = 'Start in the sandbox today, or talk to us about bringing your customers’ devices online.' }: { title?: string; body?: string }) {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden py-24 sm:py-32">
      <DotColumns columns={columns} />
      <Container className="relative">
        <Reveal>
          <h2 id="cta-title" className="max-w-[640px] text-balance text-[40px] font-medium leading-[1.02] tracking-[-0.04em] sm:text-[60px]">
            {title}
          </h2>
          <p className="mt-5 max-w-[520px] text-[17px] leading-[1.6] text-muted">{body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/contact" size="sm">
              Talk to our team
            </ButtonLink>
            <ButtonLink href="/docs" size="sm" variant="outline">
              Read the quickstart
            </ButtonLink>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
