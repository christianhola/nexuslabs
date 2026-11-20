import { Button } from '../components/Button'
import { ConversationDemo } from '../components/mocks/ConversationDemo'
import { Section, SectionHeading } from '../components/Section'
import { conversationDemo } from '../content'

export function DemoSection() {
  return (
    <Section id="try" className="overflow-hidden">
      <div aria-hidden className="absolute left-1/2 top-1/2 -z-10 size-[900px] -translate-x-1/4 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#15286a_0%,transparent_60%)] opacity-70" />
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_minmax(0,420px)] lg:gap-24">
        <div className="grid gap-8">
          <SectionHeading eyebrow={conversationDemo.eyebrow} title={conversationDemo.title} body={conversationDemo.body} />
          <ul className="grid max-w-[520px] gap-4 text-[15px] text-soft">
            <li className="flex gap-4 border-t border-line pt-4">
              <span className="font-display text-[15px] font-semibold text-cobalt-text">01</span> A YES checks out on the saved card and follows up with one relevant pick.
            </li>
            <li className="flex gap-4 border-t border-line pt-4">
              <span className="font-display text-[15px] font-semibold text-cobalt-text">02</span> A question gets a specific answer, not a link to the help centre.
            </li>
            <li className="flex gap-4 border-t border-line pt-4">
              <span className="font-display text-[15px] font-semibold text-cobalt-text">03</span> STOP, in any phrasing, opts out instantly and everywhere.
            </li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button href="/demo" arrow size="lg">
              Test on your store
            </Button>
            <Button href="/features" variant="subtle" size="lg">
              See all features
            </Button>
          </div>
        </div>
        <ConversationDemo />
      </div>
    </Section>
  )
}
