import { Card } from '../components/Card'
import { Section, SectionHeading } from '../components/Section'
import { integrations } from '../content'

export function Integrations({ id = 'integrations' }: { id?: string }) {
  return (
    <Section id={id}>
      <SectionHeading eyebrow="Integrations" title="Plugs into the stack you already run." body="Two-way sync with your store, payments, helpdesk and data tools. Setup takes an afternoon." />
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {integrations.map((it, i) => (
          <li key={it.name}>
            <Card tone="tile" className="flex h-full items-start gap-4 p-5">
              <span aria-hidden className={['grid size-11 shrink-0 place-items-center rounded-[10px] font-display text-[14px] font-bold', ['bg-cobalt text-white', 'bg-[#c42a1e] text-white', 'bg-saffron text-bg'][i % 3]].join(' ')}>
                {it.abbr}
              </span>
              <span className="grid gap-1">
                <span className="text-[15px] font-semibold text-white">{it.name}</span>
                <span className="text-[14px] leading-snug text-muted">{it.body}</span>
              </span>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
