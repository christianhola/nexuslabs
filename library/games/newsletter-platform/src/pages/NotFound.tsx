import { Button } from '../components/Button'
import { Container } from '../components/Container'

export function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-start justify-center py-24">
      <p className="text-[19px] font-medium text-pink-text">404</p>
      <h1 className="display mt-4 text-[38px] uppercase break-words text-white sm:text-[80px]">
        This page <span className="text-gradient-pink">got unsubscribed.</span>
      </h1>
      <p className="mt-6 max-w-[520px] text-[19px] text-body">The link may be old or mistyped. Try the home page, or start a fresh issue in the editor.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Button href="/" variant="white" size="lg">
          Back to home
        </Button>
        <Button href="/editor" variant="outline" size="lg">
          Open the editor
        </Button>
      </div>
    </Container>
  )
}
