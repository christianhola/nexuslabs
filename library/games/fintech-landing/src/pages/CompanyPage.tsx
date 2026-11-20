import { motion } from 'motion/react'
import { ArrowUpRight, Briefcase, Eye, MapPin, ShieldCheck, Users, Zap } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { CountUp } from '../components/CountUp'
import { EmptyState } from '../components/EmptyState'
import { IconChip } from '../components/IconChip'
import { PageHeader } from '../components/PageHeader'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { SegmentedControl } from '../components/SegmentedControl'
import { company } from '../content'

const valueIcons: Record<string, ReactNode> = {
  shield: <ShieldCheck />,
  zap: <Zap />,
  eye: <Eye />,
  users: <Users />,
}

function Stats() {
  return (
    <Reveal className="mx-auto grid max-w-[960px] grid-cols-2 gap-6 sm:grid-cols-4">
      {company.stats.map((s) => (
        <div key={s.label} className="text-center">
          <CountUp value={s.value} suffix={s.suffix} className="font-display text-[40px] font-semibold tracking-[-0.04em] tabular sm:text-[44px]" />
          <div className="mt-1 text-[14px] text-muted">{s.label}</div>
        </div>
      ))}
    </Reveal>
  )
}

function Story() {
  const { story } = company
  return (
    <Section id="story">
      <SectionHeading eyebrow={story.eyebrow} title={story.title} />
      <ol className="relative mx-auto mt-14 max-w-[760px]">
        {/* the rail draws itself in as the list scrolls into view */}
        <div aria-hidden className="absolute bottom-2 left-[15px] top-2 w-[2px] overflow-hidden rounded-full bg-white/[0.08] sm:left-[119px]">
          <motion.div
            className="h-full w-full origin-top bg-[linear-gradient(to_bottom,var(--color-violet-text),var(--color-violet-soft))]"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ duration: 1.6, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
        {story.milestones.map((m, i) => (
          <motion.li
            key={m.year}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative pb-10 pl-12 last:pb-0 sm:grid sm:grid-cols-[96px_48px_1fr] sm:items-start sm:pl-0"
          >
              <div className="font-display text-[15px] font-semibold tracking-[-0.01em] text-violet-text sm:pt-[3px] sm:text-right sm:text-[17px]">{m.year}</div>
              <span
                aria-hidden
                className="absolute left-[9px] top-[5px] size-[14px] rounded-full bg-black ring-[3px] ring-violet-text round sm:static sm:mx-auto sm:mt-[6px] sm:block"
              />
              <div className="mt-1 sm:mt-0">
                <h3 className="font-display text-[20px] font-semibold tracking-[-0.025em]">{m.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted text-pretty">{m.body}</p>
              </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}

function Values() {
  const { values } = company
  return (
    <Section id="values">
      <SectionHeading eyebrow={values.eyebrow} title={values.title} />
      <div className="mx-auto mt-14 grid max-w-[1120px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {values.items.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.06} className="h-full">
            <Card interactive className="h-full">
              <IconChip tone={i === 0 ? 'violet' : 'neutral'}>{valueIcons[v.icon]}</IconChip>
              <h3 className="mt-6 font-display text-[20px] font-semibold tracking-[-0.025em]">{v.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted text-pretty">{v.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}

function Team() {
  const { team } = company
  return (
    <Section id="team">
      <SectionHeading eyebrow={team.eyebrow} title={team.title} />
      <ul className="mx-auto mt-14 grid max-w-[1120px] grid-cols-2 gap-4 md:grid-cols-4">
        {team.people.map((p, i) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            <Card interactive className="flex h-full flex-col items-center text-center">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-[-10px] rounded-full bg-[radial-gradient(closest-side,rgb(91_61_246/0.35),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 round"
                />
                <Avatar name={p.name} size={96} className="relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5 text-[16px] font-medium tracking-[-0.015em]">{p.name}</div>
              <div className="mt-1 text-[13px] text-muted">{p.role}</div>
            </Card>
          </motion.li>
        ))}
      </ul>
    </Section>
  )
}

function Careers() {
  const { careers } = company
  const [dept, setDept] = useState('All')
  const roles = careers.roles.filter((r) => dept === 'All' || r.department === dept)
  return (
    <Section id="careers">
      <SectionHeading eyebrow={careers.eyebrow} title={careers.title} body={careers.body} />
      <Reveal className="mx-auto mt-10 flex max-w-full justify-center">
        <div className="-mx-4 max-w-[calc(100%+2rem)] overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          <SegmentedControl
            label="Filter roles by department"
            value={dept}
            onChange={setDept}
            size="sm"
            options={careers.departments.map((d) => ({
              value: d,
              label: d,
            }))}
          />
        </div>
      </Reveal>
      <div className="mx-auto mt-10 max-w-[880px]">
        {roles.length ? (
          <ul className="flex flex-col gap-3">
            {roles.map((r, i) => (
              <motion.li
                key={r.title}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Card radius="card-sm" padding="none" interactive className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[17px] font-medium tracking-[-0.015em]">{r.title}</h3>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <Badge icon={<Briefcase className="size-3" aria-hidden />}>{r.department}</Badge>
                      <Badge icon={<MapPin className="size-3" aria-hidden />}>{r.location}</Badge>
                      <Badge tone="up">{r.type}</Badge>
                    </div>
                  </div>
                  <Button href={careers.applyHref} variant="outline" size="sm" className="self-start sm:self-auto" aria-label={`Apply for ${r.title}`}>
                    Apply <ArrowUpRight className="size-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" aria-hidden />
                  </Button>
                </Card>
              </motion.li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={<Briefcase />}
            title={careers.empty.title}
            body={careers.empty.body}
            action={
              <Button href={careers.applyHref} size="sm">
                Send an open application
              </Button>
            }
          />
        )}
      </div>
    </Section>
  )
}

export function CompanyPage() {
  return (
    <>
      <PageHeader eyebrow={company.eyebrow} title={company.title} body={company.body}>
        <Button href="#careers" size="lg">
          See open roles
        </Button>
        <Button href="#story" variant="ghost" size="lg">
          Our story
        </Button>
      </PageHeader>
      <Stats />
      <Story />
      <Values />
      <Team />
      <Careers />
    </>
  )
}
