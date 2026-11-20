import { ButtonLink } from '../components/Button'
import { Container } from '../components/Container'
import { DotColumns } from '../components/DotColumns'

const columns = [
  { left: 860, top: 60, height: 260, delay: 0 },
  { left: 923, top: 200, height: 160, delay: -2 },
  { left: 1120, top: 120, height: 280, delay: -3 },
]

export function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <DotColumns columns={columns} />
      <Container className="relative py-28 sm:py-36">
        <p className="text-[15px] font-medium text-muted">Error 404</p>
        <h1 className="mt-3 max-w-[640px] text-[44px] font-medium leading-[1.02] tracking-[-0.042em] sm:text-[64px]">This circuit is open</h1>
        <p className="mt-5 max-w-[460px] text-[17px] leading-[1.6] text-muted">The page you followed does not exist or has moved. Try one of these instead.</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/" size="sm">
            Back to home
          </ButtonLink>
          <ButtonLink href="/devices" size="sm" variant="outline">
            Browse devices
          </ButtonLink>
          <ButtonLink href="/docs" size="sm" variant="outline">
            Quickstart
          </ButtonLink>
        </div>
      </Container>
    </section>
  )
}
