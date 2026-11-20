import { Accordion } from '../components/Accordion'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { faq } from '../content'

export function Faq() {
  return (
    <Section id="faq">
      <SectionHeading eyebrow={faq.eyebrow} title={faq.title} />
      <Reveal className="mx-auto mt-12 max-w-[760px]">
        <Accordion items={faq.items} />
      </Reveal>
    </Section>
  )
}
