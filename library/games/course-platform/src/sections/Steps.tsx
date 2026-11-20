import { motion } from 'motion/react'
import { BadgeDollarSign } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { images, steps } from '../content'

export function Steps() {
  return (
    <section aria-labelledby="steps-title" className="py-20 lg:py-28">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <Reveal className="relative">
          <img src={images.creatorStudio} alt="A creator recording a video lesson in a bright home studio" className="aspect-[4/3] w-full rounded-[var(--radius-panel)] object-cover" loading="lazy" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-[14px] border border-line bg-card p-3 pr-5 shadow-float sm:left-8"
          >
            <span className="grid size-10 place-items-center rounded-[10px] bg-flame-soft text-flame-ink">
              <BadgeDollarSign className="size-5" aria-hidden />
            </span>
            <span>
              <span className="block text-[12.5px] text-muted">New enrolment</span>
              <span className="block font-display text-[16px] font-medium text-ink">Brand Identity Basics, $149</span>
            </span>
          </motion.div>
        </Reveal>
        <div>
          <Reveal>
            <SectionHeading align="left" id="steps-title" eyebrow={steps.eyebrow} title={steps.title} />
          </Reveal>
          <ol className="mt-10 flex flex-col gap-4">
            {steps.items.map((s, i) => (
              <li key={s.n}>
                <Reveal delay={i * 0.06} className="rounded-[var(--radius-card)] border border-line bg-card p-5 shadow-card">
                  <Badge tone="indigo">{s.n}</Badge>
                  <h3 className="mt-3 font-display text-[18px] font-medium text-ink">{s.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{s.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
