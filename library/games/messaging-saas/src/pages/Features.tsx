import { Check, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card } from '../components/Card'
import { ConversationDemo } from '../components/mocks/ConversationDemo'
import { FlowMock } from '../components/mocks/FlowMock'
import { InboxMock } from '../components/mocks/InboxMock'
import { PicksMock } from '../components/mocks/PicksMock'
import { Container } from '../components/Container'
import { PageHeader, Section, SectionHeading } from '../components/Section'
import { featuresPage as f, pillars } from '../content'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { Guarantee } from '../sections/Guarantee'
import { Integrations } from '../sections/Integrations'

function Feature({ id, eyebrow, title, body, points, visual, flip }: { id: string; eyebrow: string; title: string; body: string; points: string[]; visual: ReactNode; flip?: boolean }) {
  return (
    <Section id={id} className="border-t border-line">
      <div className={cx('grid items-center gap-12 lg:gap-16', flip ? 'lg:grid-cols-[1fr_minmax(0,420px)]' : 'lg:grid-cols-[minmax(0,420px)_1fr]')}>
        <div className={cx('grid gap-6', flip && 'lg:order-2')}>
          <SectionHeading eyebrow={eyebrow} title={title} body={body} />
          <ul className="grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] text-soft">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-cobalt-text" strokeWidth={2.6} /> {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0">{visual}</div>
      </div>
    </Section>
  )
}

export function Features() {
  const [ttb, recs, twoWay] = pillars
  return (
    <>
      <PageHeader eyebrow={f.eyebrow} title={f.title} body={f.body}>
        <nav aria-label="On this page" className="no-scrollbar mt-12 flex gap-2 overflow-x-auto">
          {f.sections.map((s) => (
            <Link key={s.id} href={`#${s.id}`} className="inline-flex h-10 shrink-0 items-center rounded-full border border-line-strong px-4 text-[14px] text-soft transition-colors hover:bg-white hover:text-bg">
              {s.label}
            </Link>
          ))}
        </nav>
      </PageHeader>
      <Feature id={ttb.id} eyebrow={ttb.eyebrow} title={ttb.title} body={ttb.body} points={ttb.points} visual={<ConversationDemo />} />
      <Feature id={recs.id} eyebrow={recs.eyebrow} title={recs.title} body={recs.body} points={recs.points} visual={<PicksMock />} flip />
      <Feature id="inbox" eyebrow={twoWay.eyebrow} title={twoWay.title} body={twoWay.body} points={twoWay.points} visual={<InboxMock />} />
      <Feature
        id="flows"
        eyebrow="Flows"
        title="Automations that hold a conversation."
        body="Reorder, cart, browse and win-back flows that branch on what people reply. Run a test shopper through any flow before it goes live."
        points={['Branch on YES, questions or silence', 'Quiet hours and frequency caps built in', 'Holdout on every flow by default']}
        visual={<FlowMock />}
        flip
      />
      <Section id="compliance" className="border-t border-line">
        <SectionHeading eyebrow="Compliance" title="Consent and quiet hours, enforced, not suggested." body="Texting is regulated. Relaytext makes the compliant path the only path." />
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {f.compliance.map((c) => (
            <li key={c.title}>
              <Card className="grid h-full gap-3 p-6">
                <ShieldCheck aria-hidden className="size-6 text-saffron" />
                <h3 className="font-display text-[19px] font-medium text-white">{c.title}</h3>
                <p className="text-[15px] leading-[1.6] text-muted">{c.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
      <div className="border-t border-line">
        <Integrations />
      </div>
      <Container>
        <div className="h-px bg-line" />
      </Container>
      <Guarantee />
    </>
  )
}
