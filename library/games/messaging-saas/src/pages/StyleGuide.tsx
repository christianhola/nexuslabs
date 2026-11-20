import { useState } from 'react'
import type { ReactNode } from 'react'

import { Accordion } from '../components/Accordion'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import type { ButtonVariant } from '../components/Button'
import { Card } from '../components/Card'
import { CaseCard } from '../components/CaseCard'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { EmptyState } from '../components/EmptyState'
import { Checkbox, SelectField, TextArea, TextField } from '../components/Field'
import { LogoTile } from '../components/LogoTile'
import { Wordmark } from '../components/Logo'
import { Bubble, ProductCardInline } from '../components/mocks/Chat'
import { CampaignMock } from '../components/mocks/CampaignMock'
import { Notice } from '../components/Notice'
import { PlanCard } from '../components/PlanCard'
import { PostCard } from '../components/PostCard'
import { SegmentedControl } from '../components/SegmentedControl'
import { Slider } from '../components/Slider'
import { Switch } from '../components/Switch'
import { Skeleton, TypingDots } from '../components/TypingDots'
import { UrlForm } from '../components/UrlForm'
import { PageHeader } from '../components/Section'
import { caseStudies, logos, plans, posts } from '../content'
import { colorTokens, motion, radii, shadows, spacing, typeScale } from '../lib/tokens'

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-line py-14">
      <h2 id={`${id}-h`} className="mb-8 font-display text-[28px] font-medium text-white">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">{children}</p>
}

const variants: ButtonVariant[] = ['primary', 'outline', 'white', 'subtle', 'ghost']
const states = ['default', 'hover', 'focus', 'pressed', 'disabled', 'loading'] as const

export function StyleGuide() {
  const [replay, setReplay] = useState(0)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [sw, setSw] = useState(true)
  const [chk, setChk] = useState(true)
  const [sl, setSl] = useState(40)
  return (
    <>
      <PageHeader eyebrow="Design system" title="Relaytext style guide" body="Tokens and every component, rendered by the real components the site uses. States are pinned with data-force." />
      <Container className="pb-24">
        <nav aria-label="Style guide sections" className="flex flex-wrap gap-2 pb-8">
          {['colour', 'type', 'space', 'radii', 'shadows', 'motion', 'buttons', 'fields', 'controls', 'feedback', 'chat', 'cards', 'mocks'].map((s) => (
            <a key={s} href={`#${s}`} className="inline-flex h-10 items-center rounded-full border border-line-strong px-4 text-[14px] capitalize text-soft hover:bg-white hover:text-bg">
              {s}
            </a>
          ))}
        </nav>

        <Block id="colour" title="Colour">
          <div className="grid gap-10">
            {colorTokens.map((g) => (
              <div key={g.group}>
                <Label>{g.group}</Label>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                  {g.items.map((c) => (
                    <li key={c.name} className="overflow-hidden rounded-[14px] border border-line">
                      <span className="block h-20" style={{ background: c.hex }} />
                      <span className="grid gap-0.5 p-3 text-[13px]">
                        <span className="font-semibold text-white">{c.name}</span>
                        <span className="font-mono text-faint">{c.hex}</span>
                        <span className="text-muted">{c.use}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Block>

        <Block id="type" title="Type scale">
          <div className="grid gap-6">
            {typeScale.map((t) => (
              <div key={t.name} className="grid gap-2 border-b border-line pb-6 lg:grid-cols-[220px_1fr] lg:items-baseline">
                <div>
                  <p className="text-[14px] font-semibold text-white">{t.name}</p>
                  <p className="text-[12px] text-faint">{t.spec}</p>
                </div>
                <p className={`${t.cls} min-w-0 truncate text-white`}>Text that talks back</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="space" title="Spacing">
          <ul className="grid gap-3">
            {spacing.map((s) => (
              <li key={s} className="flex items-center gap-4 text-[13px] text-muted">
                <span className="w-12 font-mono">{s}px</span>
                <span className="h-3 max-w-full rounded-sm bg-cobalt" style={{ width: s * 2.5 }} />
              </li>
            ))}
          </ul>
        </Block>

        <Block id="radii" title="Radii">
          <ul className="flex flex-wrap gap-6">
            {radii.map((r) => (
              <li key={r.name} className="grid justify-items-center gap-2 text-[13px]">
                <span className="size-24 border border-line-strong bg-panel" style={{ borderRadius: r.value.split(' ')[0] }} />
                <span className="font-semibold text-white">{r.name}</span>
                <span className="font-mono text-faint">{r.value}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="shadows" title="Shadows">
          <ul className="flex flex-wrap gap-8">
            {shadows.map((s) => (
              <li key={s.name} className={`grid size-36 place-items-center rounded-card bg-panel-2 text-[14px] font-semibold text-white ${s.cls}`}>
                {s.name}
              </li>
            ))}
          </ul>
        </Block>

        <Block id="motion" title="Motion">
          <Button variant="subtle" onClick={() => setReplay((r) => r + 1)} className="mb-8">
            Replay animations
          </Button>
          <ul key={replay} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {motion.map((m) => (
              <li key={m.name} className="grid gap-3 rounded-card border border-line bg-panel p-5">
                <div className="grid h-24 place-items-center overflow-hidden">
                  {m.name === 'typing' ? <TypingDots /> : m.name === 'marquee' ? <span className="flex w-max animate-marquee gap-2">{[...logos, ...logos].map((_, i) => <span key={i} className="h-8 w-14 rounded-[6px] bg-tile" />)}</span> : <span className={`size-14 rounded-[14px] bg-cobalt ${m.cls}`} />}
                </div>
                <p className="text-[14px] font-semibold text-white">{m.name}</p>
                <p className="text-[12px] text-faint">{m.spec}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-faint">Easing: ease-brand cubic-bezier(0.22, 1, 0.36, 1); durations 150 / 240 / 600ms. Reduced motion turns all of these off.</p>
        </Block>

        <Block id="buttons" title="Buttons">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr>
                  <th className="pb-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">Variant</th>
                  {states.map((s) => (
                    <th key={s} className="pb-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {variants.map((v) => (
                  <tr key={v}>
                    <th className="py-3 pr-4 text-[14px] font-semibold capitalize text-white">{v}</th>
                    {states.map((s) => (
                      <td key={s} className="py-3 pr-3">
                        <Button
                          variant={v}
                          size="sm"
                          arrow={v === 'primary' || v === 'outline'}
                          force={s === 'hover' || s === 'focus' || s === 'pressed' ? s : undefined}
                          disabled={s === 'disabled'}
                          loading={s === 'loading'}
                        >
                          Get started
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Label>Sizes</Label>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg" arrow>
              Large
            </Button>
          </div>
        </Block>

        <Block id="fields" title="Fields">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid gap-5">
              <TextField label="Default" placeholder="you@brand.com" />
              <TextField label="Hover" placeholder="you@brand.com" force="hover" />
              <TextField label="Focus" placeholder="you@brand.com" force="focus" />
              <TextField label="With hint" placeholder="yourbrand.com" hint="We use it to draft your first campaign." />
              <TextField label="Error" defaultValue="jess@" error="Enter a valid email, like you@brand.com." />
              <TextField label="Disabled" placeholder="Not editable" disabled />
            </div>
            <div className="grid content-start gap-5">
              <SelectField label="Select" placeholder="Choose a range" defaultValue="" options={[{ value: 'a', label: 'Under 10,000' }, { value: 'b', label: '10,000 to 50,000' }]} />
              <SelectField label="Select error" placeholder="Choose a range" defaultValue="" error="Choose your list size." options={[{ value: 'a', label: 'Under 10,000' }]} />
              <TextArea label="Text area" placeholder="Anything we should know?" />
              <Checkbox label="Checked" checked={chk} onChange={setChk} />
              <Checkbox label="Unchecked, hover" checked={false} onChange={() => {}} force="hover" />
              <Checkbox label="Error" checked={false} onChange={() => {}} error="Accept the terms to continue." />
              <Checkbox label="Disabled" checked={false} onChange={() => {}} disabled />
            </div>
          </div>
          <div className="mt-10 grid gap-6">
            <Label>URL test (hero)</Label>
            <UrlForm onSubmit={() => {}} />
            <UrlForm onSubmit={() => {}} error="Enter a URL like yourbrand.com." initial="not a url" />
            <UrlForm onSubmit={() => {}} loading initial="havencoffee.com" />
          </div>
        </Block>

        <Block id="controls" title="Controls">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="grid content-start gap-6">
              <Label>Segmented control</Label>
              <SegmentedControl label="Example" value={seg} onChange={setSeg} options={[{ value: 'a', label: 'Monthly' }, { value: 'b', label: 'Yearly' }, { value: 'c', label: 'Custom' }]} />
              <SegmentedControl size="sm" label="Example small" value={seg} onChange={setSeg} options={[{ value: 'a', label: '7d' }, { value: 'b', label: '30d' }, { value: 'c', label: '90d' }]} />
              <Label>Switch</Label>
              <div className="flex items-center gap-4">
                <Switch label="On" checked={sw} onChange={setSw} />
                <Switch label="Off" checked={false} onChange={() => {}} />
                <Switch label="Focus" checked onChange={() => {}} force="focus" />
                <Switch label="Disabled" checked={false} onChange={() => {}} disabled />
              </div>
              <Slider label="Slider" value={sl} min={0} max={100} step={1} onChange={setSl} format={(n) => `${n}%`} />
            </div>
            <div>
              <Label>Accordion</Label>
              <Accordion defaultOpen="a" items={[{ id: 'a', title: 'Open item', body: 'Answers sit here, in muted body text.' }, { id: 'b', title: 'Closed item', body: 'Hidden until opened.' }]} />
            </div>
          </div>
        </Block>

        <Block id="feedback" title="Feedback and status">
          <div className="grid gap-4 lg:grid-cols-3">
            <Notice tone="info" title="Info">Your number is being registered.</Notice>
            <Notice tone="success" title="Success">Thanks, we’ll be in touch.</Notice>
            <Notice tone="error" title="Error">Check the highlighted fields.</Notice>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {(['neutral', 'cobalt', 'cherry', 'saffron', 'mint'] as const).map((t) => (
              <Badge key={t} tone={t}>
                {t}
              </Badge>
            ))}
            <Badge tone="mint" dot>
              Live
            </Badge>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <EmptyState title="Empty state" body="Shown when a filter or list has nothing in it." />
            <Card className="grid content-start gap-3 p-6">
              <Label>Loading</Label>
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-5/6" />
              <TypingDots />
            </Card>
            <Card className="grid content-start gap-4 p-6">
              <Label>Avatars and count-up</Label>
              <div className="flex items-center gap-2">
                <Avatar src={posts[0].author.avatar} name={posts[0].author.name} size={44} />
                {(['cobalt', 'cherry', 'saffron', 'mint'] as const).map((t) => (
                  <Avatar key={t} name="Jess Moreno" tone={t} size={44} />
                ))}
              </div>
              <p className="font-display text-[48px] font-medium text-white">
                <CountUp key={replay} value={20} prefix="+" suffix="%" />
              </p>
            </Card>
          </div>
        </Block>

        <Block id="chat" title="Chat">
          <div className="grid max-w-[420px] gap-2.5 rounded-[24px] border border-line bg-[#0b0e18] p-5">
            <Bubble from="brand" meta="10:02">
              Outgoing brand message
            </Bubble>
            <Bubble from="shopper" meta="10:03">
              Incoming shopper reply
            </Bubble>
            <Bubble from="brand">
              With a product
              <ProductCardInline name="Kenya Nyeri, 340g" price="$16.00" tone="cherry" />
            </Bubble>
          </div>
          <div className="mt-8">
            <Label>Wordmarks</Label>
            <div className="flex flex-wrap items-center gap-4">
              <Wordmark />
              <Wordmark size="sm" />
              {logos.slice(0, 4).map((l) => (
                <LogoTile key={l.name} logo={l} />
              ))}
            </div>
          </div>
        </Block>

        <Block id="cards" title="Cards">
          <div className="grid gap-6 lg:grid-cols-3">
            <PlanCard plan={plans[0]} annual={false} discount={0.15} />
            <PlanCard plan={plans[1]} annual discount={0.15} />
            <CaseCard study={caseStudies[0]} />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <PostCard post={posts[0]} />
            <PostCard post={posts[1]} />
          </div>
        </Block>

        <Block id="mocks" title="Product mocks">
          <CampaignMock compact />
        </Block>
      </Container>
    </>
  )
}
