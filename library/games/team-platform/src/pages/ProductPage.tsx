import { useState } from 'react'

import { ChatMock } from '../components/ChatMock'
import { Container } from '../components/Container'
import { Directory } from '../components/Directory'
import { FeedMock } from '../components/FeedMock'
import { Icon } from '../components/Icon'
import { OrgChart } from '../components/OrgChart'
import { PulseMock } from '../components/PulseMock'
import { PageHeader, SectionHeading } from '../components/SectionHeading'
import { ShiftList, TaskList } from '../components/TasksMock'
import { Button } from '../components/Button'
import { productMenu, productPage } from '../content'
import type { Person } from '../content'
import { Link, navigate } from '../lib/router'

const S = productPage.sections

export function ProductPage() {
  const [focus, setFocus] = useState<{ id: string; n: number } | null>(null)
  const [prefill, setPrefill] = useState<string>()

  const showInChart = (id: string) => {
    setFocus((f) => ({ id, n: (f?.n ?? 0) + 1 }))
    navigate('/product#org-chart')
  }
  const message = (p: Person) => {
    setPrefill(`Hi ${p.name.split(' ')[0]}, `)
    navigate('/product#chat')
    window.setTimeout(() => document.querySelector<HTMLInputElement>('#chat input')?.focus({ preventScroll: true }), 450)
  }

  return (
    <>
      <Container>
        <PageHeader eyebrow={productPage.eyebrow} title={productPage.title} body={productPage.body}>
          <nav aria-label="Modules" className="flex flex-wrap gap-2">
            {productMenu.map((m) => (
              <Link key={m.href} href={m.href} className="inline-flex h-10 items-center gap-2 rounded-[9px] border border-line bg-card px-3.5 text-[14.5px] font-medium text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-ink">
                <Icon name={m.icon} className="size-4" />
                {m.label}
              </Link>
            ))}
          </nav>
        </PageHeader>
      </Container>

      <Container as="section" id="org-chart" className="scroll-mt-24 py-12">
        <SectionHeading eyebrow={S.orgChart.eyebrow} title={S.orgChart.title} body={S.orgChart.body} />
        <div className="mt-8">
          <OrgChart key={focus?.n ?? 0} focusId={focus?.id} onMessage={message} />
        </div>
      </Container>

      <Container as="section" id="directory" className="scroll-mt-24 py-12">
        <SectionHeading eyebrow={S.directory.eyebrow} title={S.directory.title} body={S.directory.body} />
        <div className="mt-8">
          <Directory onShowInChart={showInChart} onMessage={message} />
        </div>
      </Container>

      <section className="mt-12 bg-backdrop py-20">
        <Container className="grid gap-14 lg:grid-cols-2 lg:gap-10">
          <div id="news" className="scroll-mt-24">
            <SectionHeading eyebrow={S.news.eyebrow} title={S.news.title} body={S.news.body} />
            <div className="mt-8">
              <FeedMock />
            </div>
          </div>
          <div id="chat" className="scroll-mt-24">
            <SectionHeading eyebrow={S.chat.eyebrow} title={S.chat.title} body={S.chat.body} />
            <div className="mt-8">
              <ChatMock prefill={prefill} />
            </div>
          </div>
        </Container>
      </section>

      <Container as="section" id="tasks" className="scroll-mt-24 py-20">
        <SectionHeading eyebrow={S.tasks.eyebrow} title={S.tasks.title} body={S.tasks.body} />
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <TaskList />
          <ShiftList />
        </div>
      </Container>

      <Container as="section" id="surveys" className="scroll-mt-24 grid items-start gap-10 pb-16 lg:grid-cols-[1fr_460px]">
        <SectionHeading eyebrow={S.surveys.eyebrow} title={S.surveys.title} body={S.surveys.body} />
        <PulseMock />
      </Container>

      <Container as="section" className="py-12">
        <div className="grid gap-4 rounded-[28px] border-[1.5px] border-ink p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:items-center">
          <h2 className="font-display text-[28px] font-semibold leading-tight tracking-[-0.03em] text-ink">Secure by design</h2>
          {productPage.security.map((s) => (
            <div key={s.title} className="flex gap-3">
              <Icon name={s.icon} className="mt-0.5 size-5 shrink-0 text-ink" />
              <div>
                <h3 className="text-[15.5px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1 text-[14.5px] leading-snug text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <p className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">Want to see it with your own org chart?</p>
          <Button href="/demo" arrow>
            Book a demo
          </Button>
        </div>
      </Container>
    </>
  )
}
