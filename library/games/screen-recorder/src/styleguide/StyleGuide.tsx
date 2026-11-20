import { ArrowRight, Clock, MessageSquare, MoreHorizontal, Plus, Search, Video } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { type ReactNode, useState } from 'react'

import { Button, ButtonLink, IconButton } from '@/components/Button'
import { useContact } from '@/components/Contact'
import { Drawer } from '@/components/Drawer'
import { Container } from '@/components/Frame'
import { ClipCard, PlaylistsHeading, SidebarRow } from '@/components/Library'
import { Logo, LogoMark, PartnerLogo } from '@/components/Logo'
import { Menu } from '@/components/Menu'
import { Modal } from '@/components/Modal'
import { Player } from '@/components/Player'
import { ScreenMock } from '@/components/ScreenMock'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import { Spinner } from '@/components/Spinner'
import { Terminal } from '@/components/Terminal'
import { useToast } from '@/components/Toast'
import { Avatar, Badge, Chip, EmptyState, Input, Kbd, Segmented, Select, Skeleton, Switch, TextArea } from '@/components/ui'
import { LOGOS, RECORDER, type Scene } from '@/content'
import { IntegrationMark } from '@/pages/Integrations'

/* Documentation data for this page only: the values mirror src/styles.css. */
const COLORS = [
  ['bg', '#0e0d0c', 'Page'],
  ['surface', '#141312', 'Cards, panels'],
  ['surface-2', '#1a1918', 'Fields, hovers'],
  ['raised', '#22201e', 'Popovers, pressed'],
  ['fg / cream', '#f4efe4', 'Text, primary fill'],
  ['muted', '#a7a197', 'Secondary text'],
  ['faint', '#8a847b', 'Meta text (AA on bg)'],
  ['ember', '#e5484d', 'Record, fills, large type'],
  ['ember-text', '#ff8a85', 'Ember text on dark (AA)'],
  ['ember-deep', '#5a1a16', 'Glow, centre rule'],
  ['folder', '#e1b345', 'Playlist glyph'],
  ['ok', '#4cc27a', 'Activity, connected'],
  ['line', 'rgb(255 244 228 / .075)', 'Hairlines'],
  ['line-strong', 'rgb(255 244 228 / .14)', 'Control rings'],
] as const

const TYPE = [
  ['Display XL', 'font-display text-[66px] leading-[72px] tracking-[-0.03em] font-medium', 'Inter Tight 500 · 66/72'],
  ['Display L', 'font-display text-[46px] leading-[1.08] tracking-[-0.035em] font-medium', 'Inter Tight 500 · 46'],
  ['Heading', 'font-display text-[30px] tracking-[-0.03em] font-semibold', 'Inter Tight 600 · 30'],
  ['Lead', 'text-[20px] leading-[29px] text-muted', 'Inter 400 · 20/29'],
  ['Body', 'text-[15px] leading-relaxed', 'Inter 400 · 15'],
  ['Small', 'text-[13px] text-muted', 'Inter 400 · 13'],
  ['Mono', 'font-mono text-[14px] leading-[19px]', 'JetBrains Mono · 14/19'],
  ['Serif accent', 'font-serif italic text-[27px]', 'Instrument Serif italic (logo strip)'],
] as const

const SPACE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
const RADII = [
  ['control', '999px'],
  ['field', '12px'],
  ['card', '14px'],
  ['panel', '18px'],
  ['section', '24px'],
] as const
const SHADOWS = [
  ['pop', 'shadow-pop'],
  ['modal', 'shadow-modal'],
  ['video', 'shadow-video'],
] as const
const MOTION = [
  ['ease-out-quint', 'cubic-bezier(.22,1,.36,1)', '0.2–0.7 s · reveals, modals'],
  ['marquee', '38 s linear ∞', 'Logo strip; pauses on hover'],
  ['rec-pulse', '1.4 s ease-in-out ∞', 'Recording dot'],
  ['caret', '1.1 s steps(1) ∞', 'Terminal caret, nav underscore'],
  ['glow', '9 s alternate ∞', 'Ember horizon behind the product shot'],
] as const

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-6 border-t border-line py-14">
      <h2 id={`${id}-h`} className="font-display text-[26px] font-semibold tracking-[-0.03em]">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-line py-5 last:border-0 md:grid-cols-[160px_1fr] md:items-center">
      <p className="text-[13px] text-faint">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

const STATES = [
  ['Default', undefined],
  ['Hover', 'hover'],
  ['Focus', 'focus'],
  ['Pressed', 'active'],
] as const

export function StyleGuide() {
  const reduce = useReducedMotion()
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [sw, setSw] = useState(true)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [sel, setSel] = useState(RECORDER.cameras[0])
  const [time, setTime] = useState(46)
  const [playing, setPlaying] = useState(false)
  const toast = useToast()
  const contact = useContact()

  return (
    <div className="min-h-dvh">
      <SiteNav />
      <Container className="py-16">
        <p className="text-[13px] font-medium text-ember-text">Design system</p>
        <h1 className="mt-3 font-display text-[48px] leading-tight font-medium tracking-[-0.04em] text-cream sm:text-[60px]">Clipwise style guide</h1>
        <p className="mt-4 max-w-[60ch] text-[17px] text-muted">Every token and component used in the template, rendered by the real components. Hover, focus and pressed states are pinned with a <code className="font-mono text-[14px] text-fg">data-force</code> attribute.</p>
        <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2">
          {['colour', 'type', 'space', 'radii', 'motion', 'buttons', 'fields', 'controls', 'library', 'overlays', 'media', 'states'].map((s) => (
            <a key={s} href={`#${s}`} className="rounded-full px-3 py-1.5 text-[13px] text-muted capitalize ring-1 ring-line hover:text-fg pointer-coarse:py-2.5">
              {s}
            </a>
          ))}
        </nav>

        <Block id="colour" title="Colour">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {COLORS.map(([name, hex, use]) => (
              <li key={name} className="overflow-hidden rounded-[14px] ring-1 ring-line">
                <div className="h-16" style={{ background: hex }} />
                <div className="bg-surface px-3 py-2.5">
                  <p className="text-sm font-medium">{name}</p>
                  <p className="font-mono text-[12px] text-muted">{hex}</p>
                  <p className="text-[12px] text-faint">{use}</p>
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block id="type" title="Type">
          {TYPE.map(([name, cls, spec]) => (
            <div key={name} className="grid gap-2 border-b border-line py-5 last:border-0 md:grid-cols-[200px_1fr] md:items-baseline">
              <div>
                <p className="text-sm">{name}</p>
                <p className="text-[12px] text-faint">{spec}</p>
              </div>
              <p className={`${cls} min-w-0 truncate`}>Show the work, skip the meeting.</p>
            </div>
          ))}
        </Block>

        <Block id="space" title="Spacing, radii and shadows">
          <div className="space-y-2">
            {SPACE.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="w-12 font-mono text-[12px] text-muted">{s}px</span>
                <span className="h-3 rounded-full bg-cream/70" style={{ width: s * 2 }} />
              </div>
            ))}
          </div>
          <div id="radii" className="mt-10 flex flex-wrap gap-4">
            {RADII.map(([n, r]) => (
              <div key={n} className="text-center">
                <div className="size-20 bg-surface-2 ring-1 ring-line-strong" style={{ borderRadius: r }} />
                <p className="mt-2 text-[12px] text-muted">
                  {n} · {r}
                </p>
              </div>
            ))}
            {SHADOWS.map(([n, cls]) => (
              <div key={n} className="text-center">
                <div className={`size-20 rounded-[14px] bg-surface ${cls}`} />
                <p className="mt-2 text-[12px] text-muted">shadow-{n}</p>
              </div>
            ))}
          </div>
        </Block>

        <Block id="motion" title="Motion">
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="secondary" onClick={() => setReplay((r) => r + 1)}>
              Replay
            </Button>
            <motion.div key={replay} initial={reduce ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="rounded-[14px] bg-surface px-4 py-3 text-sm ring-1 ring-line">
              Reveal · 0.7 s ease-out-quint
            </motion.div>
            <span className="inline-flex items-center gap-2 text-sm">
              <span key={`p${replay}`} className="size-3 animate-rec-pulse rounded-full bg-ember" /> rec-pulse
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-sm">
              caret <span key={`c${replay}`} className="inline-block h-4 w-2 animate-caret bg-muted" />
            </span>
          </div>
          <table className="mt-8 w-full text-left text-[14px]">
            <tbody>
              {MOTION.map(([n, v, use]) => (
                <tr key={n} className="border-b border-line last:border-0">
                  <th scope="row" className="py-3 pr-4 font-mono text-[13px] font-normal">
                    {n}
                  </th>
                  <td className="py-3 pr-4 font-mono text-[12px] text-muted">{v}</td>
                  <td className="py-3 text-muted">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-[13px] text-faint">Reduced motion stops the marquee, pulses, glow, Ken Burns zoom and reveals.</p>
        </Block>

        <Block id="buttons" title="Buttons">
          {(['primary', 'secondary', 'ghost', 'record', 'danger'] as const).map((v) => (
            <Row key={v} label={v}>
              {STATES.map(([label, force]) => (
                <Button key={label} variant={v} data-force={force}>
                  {label}
                </Button>
              ))}
              <Button variant={v} disabled>
                Disabled
              </Button>
              <Button variant={v} loading>
                Loading
              </Button>
            </Row>
          ))}
          <Row label="Sizes">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary">Medium</Button>
            <Button variant="primary" size="lg">
              Get started free
            </Button>
            <ButtonLink to="/app" variant="secondary" iconRight={<ArrowRight className="size-4" />}>
              Link button
            </ButtonLink>
          </Row>
          <Row label="Icon button">
            {STATES.map(([label, force]) => (
              <IconButton key={label} label={`${label} icon button`} data-force={force}>
                <MoreHorizontal className="size-4" />
              </IconButton>
            ))}
            <IconButton label="Disabled icon button" disabled>
              <Plus className="size-4" />
            </IconButton>
          </Row>
        </Block>

        <Block id="fields" title="Fields">
          <div className="grid gap-6 md:grid-cols-2">
            <Input label="Default" placeholder="you@company.com" />
            <Input label="Hint" placeholder="Playlist name" hint="Up to 60 characters." />
            <Input label="Focus (pinned)" defaultValue="Design Reviews" data-force="focus" />
            <Input label="Error" defaultValue="not-an-email" error="Enter a valid work email." />
            <Input label="Disabled" placeholder="Disabled" disabled />
            <Select label="Camera" value={sel} onChange={setSel} options={RECORDER.cameras} icon={<Video className="size-4" />} />
            <TextArea label="Comment" placeholder="Add a comment…" className="md:col-span-2" />
          </div>
        </Block>

        <Block id="controls" title="Chips, badges and toggles">
          <Row label="Chip">
            <Chip icon={<Clock className="size-3.5" />}>Default</Chip>
            <Chip data-force="hover">Hover</Chip>
            <Chip data-force="focus">Focus</Chip>
            <Chip pressed icon={<Clock className="size-3.5" />}>
              Pressed
            </Chip>
            <Chip disabled>Disabled</Chip>
          </Row>
          <Row label="Badge">
            <Badge>1,341</Badge>
            <Badge tone="ok">103</Badge>
            <Badge tone="ember">Popular</Badge>
            <Badge tone="outline">4K</Badge>
          </Row>
          <Row label="Switch">
            <Switch checked={sw} onChange={setSw} label="Example switch" />
            <Switch checked={false} onChange={() => {}} label="Off switch" />
            <Switch checked onChange={() => {}} label="Focused switch" data-force="focus" />
            <Switch checked={false} onChange={() => {}} label="Disabled switch" disabled />
          </Row>
          <Row label="Segmented">
            <Segmented
              label="Example"
              value={seg}
              onChange={setSeg}
              options={[
                { id: 'a', label: 'Monthly' },
                { id: 'b', label: 'Annual' },
                { id: 'c', label: 'Custom' },
              ]}
            />
          </Row>
          <Row label="Avatar · Kbd · Spinner">
            <Avatar initials="TM" />
            <Avatar initials="ML" image="/images/presenter-hero.webp" size={36} />
            <Kbd>⌘</Kbd>
            <Kbd>/</Kbd>
            <Spinner className="size-5 text-muted" />
          </Row>
        </Block>

        <Block id="library" title="Library">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <div className="rounded-[16px] bg-[#121110] p-2 ring-1 ring-line">
              <SidebarRow row={{ id: 'a', label: 'My Clips', count: 1341, icon: 'mine', active: true, onClick: () => {} }} />
              <SidebarRow row={{ id: 'b', label: 'Watched', count: 155, icon: 'watched', onClick: () => {} }} />
              <SidebarRow row={{ id: 'c', label: 'Activity', count: 103, icon: 'activity', tone: 'ok', onClick: () => {} }} />
              <PlaylistsHeading count={3} onAdd={() => toast({ title: 'New playlist' })} />
              <SidebarRow row={{ id: 'd', label: 'Founder Updates', count: 8, icon: 'playlist', onClick: () => {} }} />
              <SidebarRow row={{ id: 'e', label: 'Design Reviews', count: 0, icon: 'playlist', onClick: () => {} }} />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <ClipCard to="/v/rec-homepage" title="Homepage Walkthrough" scene="site" presenter="maya" duration="3m" ago="10h ago" />
              <ClipCard layout="stacked" to="/v/rec-bug" title="Mention dropdown won’t scroll" scene="board" presenter="ruth" duration="2m" ago="3h ago" views={6} comments={2} unwatched />
            </div>
          </div>
          <p className="mt-10 mb-4 text-[13px] text-faint">Screen scenes</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {(['site', 'dashboard', 'code', 'doc', 'board', 'deck'] as Scene[]).map((s) => (
              <figure key={s}>
                <ScreenMock scene={s} presenter="theo" className="aspect-video rounded-[12px] ring-1 ring-line" />
                <figcaption className="mt-2 text-[12px] text-muted">{s}</figcaption>
              </figure>
            ))}
          </div>
        </Block>

        <Block id="overlays" title="Overlays">
          <Row label="Triggers">
            <Button variant="secondary" onClick={() => setModal(true)}>
              Open modal
            </Button>
            <Button variant="secondary" onClick={() => setDrawer(true)}>
              Open drawer
            </Button>
            <Menu
              label="Example menu"
              items={[
                { id: '1', label: 'Copy link', onSelect: () => toast({ title: 'Link copied' }) },
                { id: '2', label: 'Rename', onSelect: () => {} },
                { id: 's', separator: true },
                { id: '3', label: 'Delete', danger: true, onSelect: () => toast({ title: 'Deleted', action: { label: 'Undo', run: () => {} } }) },
              ]}
              trigger={(p) => (
                <Button {...p} variant="secondary">
                  Open menu
                </Button>
              )}
            />
            <Button variant="secondary" onClick={() => toast({ title: 'Saved “Homepage Walkthrough”', action: { label: 'Open', run: () => {} } })}>
              Show toast
            </Button>
            <Button variant="secondary" onClick={contact}>
              Contact form
            </Button>
          </Row>
        </Block>

        <Block id="media" title="Player, terminal and marks">
          <div className="grid gap-6 lg:grid-cols-2">
            <Player scene="site" presenter="maya" duration={184} time={time} onTime={setTime} playing={playing} onPlaying={setPlaying} speed={1} onSpeed={() => {}} chapters={[{ t: 0, title: 'Intro' }, { t: 46, title: 'Product shot' }, { t: 102, title: 'Logos' }]} markers={[{ id: 'm', t: 52, initials: 'RA', label: 'Ruth' }]} />
            <Terminal className="max-h-[420px]" />
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-8">
            <Logo />
            <LogoMark size={40} />
            {LOGOS.map((l) => (
              <PartnerLogo key={l} id={l} />
            ))}
            <IntegrationMark glyph="spark" color="#e5484d" />
            <IntegrationMark glyph="node" color="#ff8a4c" />
          </div>
        </Block>

        <Block id="states" title="Empty, loading and error">
          <div className="grid gap-6 md:grid-cols-3">
            <EmptyState icon={<Search className="size-5" />} title="No clips match" body="Try a different word, or clear the search." action={<Button variant="secondary">Clear search</Button>} />
            <div className="rounded-[18px] p-5 ring-1 ring-line" role="status" aria-label="Loading example">
              <Skeleton className="aspect-video w-full rounded-[14px]" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
            <div className="rounded-[18px] p-5 ring-1 ring-line">
              <Input label="Comment" defaultValue="" error="Write something first." />
              <p className="mt-4 flex items-center gap-2 text-sm text-muted">
                <MessageSquare className="size-4" /> Inline errors use ember-text.
              </p>
            </div>
          </div>
        </Block>
      </Container>
      <SiteFooter />

      <Modal open={modal} onClose={() => setModal(false)} title="Example modal" width={440} footer={<Button variant="primary" onClick={() => setModal(false)}>Done</Button>}>
        <p className="p-5 text-sm text-muted">Focus is trapped here. Esc or the scrim closes it and focus returns to the trigger.</p>
      </Modal>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Example drawer">
        <p className="p-5 text-sm text-muted">The mobile nav and the library sidebar on phones use this sheet.</p>
      </Drawer>
    </div>
  )
}
