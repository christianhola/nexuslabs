import { Accordion } from '../components/Accordion'
import { SectionHeading } from '../components/SectionHeading'
import { FAQ } from '../content'

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-6 py-[120px]">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-5 sm:px-8 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionHeading id="faq-title" align="left" eyebrow="FAQ" title="Questions, answered" />
        <Accordion items={FAQ} />
      </div>
    </section>
  )
}
