import { useState } from 'react'

import { CampaignMock } from '../components/mocks/CampaignMock'
import { FlowMock } from '../components/mocks/FlowMock'
import { InboxMock } from '../components/mocks/InboxMock'
import { SegmentedControl } from '../components/SegmentedControl'
import { Section, SectionHeading } from '../components/Section'
import { productTabs } from '../content'

type Tab = (typeof productTabs)[number]['id']

/** Tabs over the three live product mocks. */
export function ProductTour() {
  const [tab, setTab] = useState<Tab>('campaigns')
  const t = productTabs.find((x) => x.id === tab)!
  return (
    <Section id="tour" className="bg-[linear-gradient(180deg,#080b17_0%,#0c1230_50%,#080b17_100%)]">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <SectionHeading eyebrow="The product" title="Built for the people who run retention." />
        <SegmentedControl mode="tabs" idPrefix="tour" label="Product areas" value={tab} onChange={setTab} options={productTabs.map((p) => ({ value: p.id, label: p.label }))} />
      </div>
      <div id="tour-panel" role="tabpanel" aria-labelledby={`tour-tab-${tab}`} className="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
        <div key={tab} className="grid content-start gap-4 animate-rise">
          <h3 className="font-display text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-white">{t.title}</h3>
          <p className="text-[16px] leading-[1.6] text-muted">{t.body}</p>
          <p className="text-[13px] text-faint">This is the real interface, running in your browser. Click around.</p>
        </div>
        <div key={`${tab}-mock`} className="min-w-0 animate-rise">
          {tab === 'campaigns' ? <CampaignMock /> : tab === 'inbox' ? <InboxMock /> : <FlowMock />}
        </div>
      </div>
    </Section>
  )
}
