import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Compass } from 'lucide-react'

export function NotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <p className="font-display text-[96px] font-semibold leading-none tracking-[-0.06em] text-ink sm:text-[140px]">404</p>
      <h1 className="mt-4 font-display text-[32px] font-semibold tracking-[-0.035em] text-ink sm:text-[40px]">This branch does not grow anywhere</h1>
      <p className="mt-3 max-w-[48ch] text-[17px] text-muted">The page you were looking for has moved or never existed. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/product" variant="soft">
          See the product
        </Button>
      </div>
      <EmptyState className="mt-14 max-w-xl" icon={<Compass />} title="Looking for a person?" body="Our team directory lives inside the app. Try the live preview on the product page." action={<Button href="/product#directory" variant="outline" size="sm">Open the directory</Button>} />
    </Container>
  )
}
