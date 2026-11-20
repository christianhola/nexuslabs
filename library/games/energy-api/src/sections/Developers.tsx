import { ArrowRight, Check } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { CodeBlock } from '../components/CodeBlock'
import { Container } from '../components/Container'
import { Reveal } from '../components/Reveal'
import { SectionHeading } from '../components/SectionHeading'
import { Tabs, useIdBase } from '../components/Tabs'
import { developers } from '../content'
import { snippets } from '../lib/snippets'
import type { Lang } from '../lib/snippets'
import { keys, useStore } from '../lib/store'

export function Developers() {
  const [lang, setLang] = useStore<Lang>(keys.docsLang, 'node')
  const idBase = useIdBase()
  return (
    <section aria-labelledby="dev-title" className="px-3 sm:px-5 lg:px-10">
      <div className="on-forest mx-auto max-w-[1360px] rounded-panel bg-forest py-20 text-on-forest sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 [&>*]:min-w-0">
            <Reveal>
              <SectionHeading id="dev-title" tone="forest" eyebrow={developers.eyebrow} title={developers.title} body={developers.body} />
              <ul className="mt-8 space-y-3">
                {developers.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[15.5px]">
                    <span className="round grid size-6 place-items-center rounded-full bg-forest-3 text-volt">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
              <ButtonLink href={developers.link.href} variant="volt" className="mt-9" icon={<ArrowRight className="size-4" aria-hidden />}>
                {developers.link.label}
              </ButtonLink>
            </Reveal>
            <Reveal delay={0.1}>
              <CodeBlock
                code={snippets.read[lang]}
                header={
                  <Tabs
                    label="Language"
                    idBase={idBase}
                    tone="forest"
                    value={lang}
                    onChange={setLang}
                    items={[
                      { value: 'curl', label: 'cURL' },
                      { value: 'node', label: 'Node' },
                      { value: 'python', label: 'Python' },
                    ]}
                    className="-ml-2"
                  />
                }
                panel={{ idBase, value: lang }}
                className="shadow-float"
              />
            </Reveal>
          </div>
        </Container>
      </div>
    </section>
  )
}
