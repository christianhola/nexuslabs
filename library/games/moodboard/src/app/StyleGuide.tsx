import { useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, Download, Hand, ImagePlus, LayoutGrid, MousePointer2, PenLine, Play, Plus, StickyNote, Trash2, Type } from 'lucide-react'

import { COPY, NOTE_COLORS, seedBoards } from '../content'
import { Button, buttonClasses, type ButtonSize, type ButtonVariant } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { EmptyState } from '../components/EmptyState'
import { IconButton } from '../components/IconButton'
import { Input } from '../components/Input'
import { Kbd, KeyCombo } from '../components/Kbd'
import { Link } from '../components/Link'
import { Menu } from '../components/Menu'
import { Panel, Toolbar, ToolbarDivider } from '../components/Panel'
import { Spinner } from '../components/Spinner'
import { Swatch } from '../components/Swatch'
import { ToastView, useToast } from '../components/Toast'
import { Tooltip } from '../components/Tooltip'
import { Wordmark } from '../components/Wordmark'
import { cx } from '../lib/cx'
import type { Item } from '../lib/types'
import { BoardThumb } from './BoardThumb'
import { CanvasItem, ItemImage } from './CanvasItem'
import { SelectionLayer } from './SelectionLayer'

const COLORS: { name: string; token: string; hex: string; use: string }[] = [
  { name: 'Canvas', token: '--color-canvas', hex: '#f9f9f9', use: 'Page and board background' },
  { name: 'Dot', token: '--color-dot', hex: '#c9c9c9', use: 'Grid dots' },
  { name: 'Surface', token: '--color-surface', hex: '#ffffff', use: 'Cards, panels, menus' },
  { name: 'Surface 2', token: '--color-surface-2', hex: '#f3f3f3', use: 'Hover fills' },
  { name: 'Surface 3', token: '--color-surface-3', hex: '#ebebeb', use: 'Pressed, image placeholder' },
  { name: 'Ink', token: '--color-ink', hex: '#141414', use: 'Text, primary button' },
  { name: 'Ink 2', token: '--color-ink-2', hex: '#3d3d3d', use: 'Icons, labels' },
  { name: 'Muted', token: '--color-muted', hex: '#6b6b6b', use: 'Secondary text (AA on white)' },
  { name: 'Faint', token: '--color-faint', hex: '#707070', use: 'Placeholders, captions (AA on canvas)' },
  { name: 'Select', token: '--color-select', hex: '#4f6ef7', use: 'Selection, focus, marquee' },
  { name: 'Guide', token: '--color-guide', hex: '#f2416b', use: 'Snap guides' },
  { name: 'Danger', token: '--color-danger', hex: '#d92d3a', use: 'Delete, errors' },
  { name: 'Success', token: '--color-success', hex: '#1f8a4c', use: 'Confirmations' },
]

const TYPE: { name: string; cls: string; spec: string; sample: string }[] = [
  { name: 'Wordmark', cls: 'text-[108px] font-medium leading-none tracking-[-0.055em]', spec: '108 / 500 / −5.5%', sample: 'Inspo' },
  { name: 'Canvas heading', cls: 'text-[48px] font-semibold leading-[1.1] tracking-[-0.03em]', spec: '48 / 600 / −3%', sample: 'Spring / Summer' },
  { name: 'Page title', cls: 'text-[40px] font-medium leading-[1.1] tracking-[-0.035em]', spec: '40 / 500 / −3.5%', sample: 'Your boards' },
  { name: 'Tagline', cls: 'text-[27px] leading-[1.25] tracking-[-0.012em]', spec: '27 / 400', sample: COPY.tagline },
  { name: 'Dialog title', cls: 'text-[19px] font-medium tracking-[-0.02em]', spec: '19 / 500', sample: 'Rename board' },
  { name: 'Note', cls: 'text-[17px] leading-[1.42]', spec: '17 / 400 / 1.42', sample: 'Painted florals next to glossy fashion.' },
  { name: 'Card title', cls: 'text-[15px] font-medium tracking-[-0.01em]', spec: '15 / 500', sample: 'Studio interiors' },
  { name: 'Body', cls: 'text-[14px] leading-[1.45]', spec: '14 / 400 / 1.45', sample: 'Every board saves to this browser as you work.' },
  { name: 'Meta', cls: 'text-[13px] text-muted', spec: '13 / 400 / muted', sample: '9 items · edited 2 h ago' },
  { name: 'Label', cls: 'text-[11.5px] font-medium uppercase tracking-[0.06em] text-faint', spec: '11.5 / 500 / caps', sample: 'Boards' },
]

const SPACE = [4, 6, 8, 12, 16, 24, 32, 48]
const RADII = [
  { name: 'Note', v: '6px' },
  { name: 'Control', v: 'var(--radius-control)', px: '7px' },
  { name: 'Card', v: 'var(--radius-card)', px: '11px' },
  { name: 'Panel', v: 'var(--radius-panel)', px: '14px' },
  { name: 'Pill', v: '999px' },
]
const SHADOWS = ['card', 'card-lift', 'panel', 'float']
const DURATIONS = [
  { name: 'fast', v: 'var(--duration-fast)', ms: 120, use: 'Hover, press' },
  { name: 'base', v: 'var(--duration-base)', ms: 200, use: 'Menus, toasts' },
  { name: 'slow', v: 'var(--duration-slow)', ms: 420, use: 'Cards, page entrance' },
  { name: 'hero', v: 'var(--duration-hero)', ms: 650, use: 'Landing → editor' },
]
const EASES = [
  { name: 'out', v: 'var(--ease-out)', curve: 'cubic-bezier(0.22, 1, 0.36, 1)' },
  { name: 'spring', v: 'var(--ease-spring)', curve: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
  { name: 'in-out', v: 'var(--ease-in-out)', curve: 'cubic-bezier(0.65, 0, 0.35, 1)' },
]

const SECTIONS = [
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['space', 'Spacing & radii'],
  ['elevation', 'Elevation'],
  ['motion', 'Motion'],
  ['button', 'Button'],
  ['icon-button', 'IconButton & Toolbar'],
  ['inputs', 'Input'],
  ['menu', 'Menu & Dialog'],
  ['feedback', 'Toast, Spinner, Tooltip, Kbd'],
  ['swatch', 'Swatch & EmptyState'],
  ['canvas', 'Canvas items'],
  ['boards', 'Board thumbnail'],
] as const

function Section({ id, title, intro, children }: { id: string; title: string; intro: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-line py-12 first:border-t-0 first:pt-2">
      <h2 id={`${id}-h`} className="text-[24px] font-medium tracking-[-0.025em] text-ink">
        {title}
      </h2>
      <p className="mt-1 max-w-[62ch] text-[14px] leading-[1.5] text-muted">{intro}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Demo({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11.5px] font-medium uppercase tracking-[0.06em] text-faint">{label}</span>
      <div className={cx('flex flex-wrap items-center gap-3', className)}>{children}</div>
    </div>
  )
}

const ITEM_DEMOS: Item[] = [
  { id: 'sg-img', kind: 'image', src: 'lib:peony', alt: 'Painted peony', x: 0, y: 0, w: 150, h: 150, rotation: 0 },
  { id: 'sg-note', kind: 'note', color: 'butter', text: 'Keep the pink.', x: 0, y: 0, w: 150, h: 150, rotation: -2 },
  { id: 'sg-text', kind: 'text', text: 'Heading', fontSize: 40, x: 0, y: 0, w: 170, h: 44, rotation: 0 },
  { id: 'sg-swatch', kind: 'swatch', colors: ['#d9878f', '#b3263f', '#3e9c80', '#e9c27a'], x: 0, y: 0, w: 230, h: 100, rotation: 0 },
]

export function StyleGuide() {
  const toast = useToast()
  const [dialog, setDialog] = useState(false)
  const [replay, setReplay] = useState(0)
  const [name, setName] = useState('Spring campaign')

  useEffect(() => {
    document.title = `Style guide — ${COPY.brand}`
  }, [])

  const variants: ButtonVariant[] = ['primary', 'secondary', 'ghost', 'danger']
  const sizes: ButtonSize[] = ['sm', 'md', 'lg']
  const demoBoard = seedBoards()[1]!

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-baseline gap-3">
            <Link href="/" aria-label="Inspo home" className="flex min-h-10 items-center rounded-[8px] px-1">
              <Wordmark size="md" className="!text-[26px]" />
            </Link>
            <span className="text-[14px] text-muted">Style guide</span>
          </div>
          <Link href="/boards" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
            <LayoutGrid size={15} />
            Boards
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-10 px-4 sm:px-6">
        <nav aria-label="Sections" className="sticky top-16 hidden h-[calc(100dvh-64px)] w-[200px] shrink-0 overflow-y-auto py-8 lg:block">
          <ul className="flex flex-col gap-0.5">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="block rounded-[7px] px-2.5 py-1.5 text-[13.5px] text-muted transition-colors hover:bg-black/[0.04] hover:text-ink">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="min-w-0 flex-1 pb-24 pt-8">
          <div className="mb-10">
            <h1 className="text-[40px] font-medium leading-[1.1] tracking-[-0.035em] text-ink">Inspo design system</h1>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.5] text-muted">
              Quiet chrome so the pictures do the talking: an off-white dotted canvas, black ink, white frosted panels and a single selection blue. Everything below is rendered by
              the real components in <code className="rounded bg-surface-3 px-1 py-0.5 text-[13px] text-ink-2">src/components</code>; tokens live in{' '}
              <code className="rounded bg-surface-3 px-1 py-0.5 text-[13px] text-ink-2">src/styles.css</code>.
            </p>
          </div>

          <Section id="colour" title="Colour" intro="Neutral greys carry the interface. Blue only ever means selection or focus; pink only ever means a snap guide.">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {COLORS.map((c) => (
                <li key={c.token} className="overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] ring-1 ring-black/[0.04]">
                  <div className="h-16 border-b border-line" style={{ background: `var(${c.token})` }} />
                  <div className="p-3">
                    <p className="text-[14px] font-medium text-ink">{c.name}</p>
                    <p className="font-mono text-[11.5px] text-muted">
                      {c.hex} · {c.token}
                    </p>
                    <p className="mt-1 text-[12.5px] text-muted">{c.use}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-8 text-[15px] font-medium text-ink">Note paper</h3>
            <div className="flex flex-wrap gap-3">
              {NOTE_COLORS.map((c) => (
                <div key={c.id} className="flex h-20 w-28 flex-col justify-end rounded-[6px] p-2.5 text-[12px] shadow-[var(--shadow-card)] ring-1 ring-black/[0.05]" style={{ background: c.hex }}>
                  <span className="font-medium text-ink">{c.label}</span>
                  <span className="font-mono text-[11px] text-ink-2">{c.hex}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="type" title="Type" intro="Google Sans throughout, set tight. Display sizes get negative tracking; small caps labels get positive.">
            <ul className="flex flex-col divide-y divide-line">
              {TYPE.map((t) => (
                <li key={t.name} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
                  <div className="w-[150px] shrink-0">
                    <p className="text-[13px] font-medium text-ink">{t.name}</p>
                    <p className="font-mono text-[11.5px] text-muted">{t.spec}</p>
                  </div>
                  <p className={cx('min-w-0 break-words text-ink', t.cls)}>{t.sample}</p>
                </li>
              ))}
            </ul>
          </Section>

          <Section id="space" title="Spacing & radii" intro="A 4px base with a few half steps for dense toolbars. Radii grow with the size of the surface.">
            <div className="flex flex-wrap items-end gap-4">
              {SPACE.map((s) => (
                <div key={s} className="flex flex-col items-center gap-1.5">
                  <div className="bg-select/70" style={{ width: s, height: s }} />
                  <span className="font-mono text-[11.5px] text-muted">{s}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {RADII.map((r) => (
                <div key={r.name} className="flex flex-col items-center gap-2">
                  <div className="size-20 bg-surface shadow-[var(--shadow-card)] ring-1 ring-black/[0.06]" style={{ borderRadius: r.v }} />
                  <span className="text-[12.5px] text-ink">{r.name}</span>
                  <span className="font-mono text-[11px] text-muted">{r.px ?? r.v}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section id="elevation" title="Elevation" intro="Cards sit just above the canvas; floating chrome gets a hairline ring; dragged and modal surfaces lift highest.">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
              {SHADOWS.map((s) => (
                <div key={s} className="flex h-28 flex-col justify-end rounded-[var(--radius-card)] bg-surface p-3" style={{ boxShadow: `var(--shadow-${s})` }}>
                  <span className="font-mono text-[12px] text-ink-2">--shadow-{s}</span>
                </div>
              ))}
              <div className="frost flex h-28 flex-col justify-end rounded-[var(--radius-panel)] p-3 shadow-[var(--shadow-float)]">
                <span className="font-mono text-[12px] text-ink-2">.frost</span>
              </div>
            </div>
          </Section>

          <Section id="motion" title="Motion" intro="Things ease out and settle; menus pop with a slight spring. With reduced motion every animation collapses to a fade or nothing.">
            <Button variant="secondary" size="sm" onClick={() => setReplay((r) => r + 1)} icon={<Play size={14} />}>
              Replay
            </Button>
            <div key={replay} className="mt-5 grid gap-6 lg:grid-cols-2">
              <div className="flex flex-col gap-3">
                {DURATIONS.map((d) => (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="w-[120px] shrink-0 font-mono text-[12px] text-ink-2">
                      {d.name} · {d.ms}ms
                    </span>
                    <div className="relative h-8 flex-1 rounded-[7px] bg-surface-3">
                      <span
                        className="absolute left-1 top-1 size-6 rounded-[5px] bg-ink [animation-fill-mode:both]"
                        style={{ animation: `sg-slide ${d.v} var(--ease-out) both` }}
                      />
                    </div>
                    <span className="hidden w-[120px] text-[12px] text-muted sm:block">{d.use}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {EASES.map((e) => (
                  <div key={e.name} className="flex items-center gap-3">
                    <span className="w-[120px] shrink-0 font-mono text-[12px] text-ink-2">ease-{e.name}</span>
                    <div className="relative h-8 flex-1 rounded-[7px] bg-surface-3">
                      <span className="absolute left-1 top-1 size-6 rounded-full bg-select" style={{ animation: `sg-slide 900ms ${e.v} both` }} />
                    </div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-3 pt-2">
                  {['animate-rise', 'animate-pop', 'animate-fade', 'animate-drift-a'].map((a) => (
                    <div key={a} className="flex flex-col items-center gap-1.5">
                      <div className={cx('size-14 rounded-[var(--radius-card)] bg-[#d9878f] shadow-[var(--shadow-card)]', a)} />
                      <span className="font-mono text-[11px] text-muted">{a.replace('animate-', '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <style>{`@keyframes sg-slide { from { left: 4px } to { left: calc(100% - 28px) } }`}</style>
          </Section>

          <Section
            id="button"
            title="Button"
            intro="Primary is the black “Get Started” button: one per view. Secondary for alternatives, ghost inside dense chrome, danger only to confirm destruction. Loading keeps the width and blocks clicks."
          >
            <div className="flex flex-col gap-6">
              <Demo label="Variants">
                {variants.map((v) => (
                  <Button key={v} variant={v}>
                    {v[0]!.toUpperCase() + v.slice(1)}
                  </Button>
                ))}
              </Demo>
              <Demo label="Sizes">
                {sizes.map((s) => (
                  <Button key={s} size={s}>
                    Size {s}
                  </Button>
                ))}
                <Button size="lg" iconRight={<ArrowRight size={15} />}>
                  {COPY.cta}
                </Button>
              </Demo>
              {variants.map((v) => (
                <Demo key={v} label={`${v} · default / hover / focus-visible / pressed / disabled / loading`}>
                  <Button variant={v}>Default</Button>
                  <Button variant={v} className={cx(v === 'primary' && '!bg-[#2a2a2a]', v === 'secondary' && '!bg-surface-2', v === 'ghost' && '!bg-black/[0.05]', v === 'danger' && '!bg-[#c02633]')}>
                    Hover
                  </Button>
                  <Button variant={v} className="outline-2 outline-offset-2 outline-select">
                    Focus
                  </Button>
                  <Button variant={v} className={cx('scale-[0.97]', v === 'primary' && '!bg-black', v === 'secondary' && '!bg-surface-3', v === 'ghost' && '!bg-black/[0.09]', v === 'danger' && '!bg-[#a81f2b]')}>
                    Pressed
                  </Button>
                  <Button variant={v} disabled>
                    Disabled
                  </Button>
                  <Button variant={v} loading>
                    Saving
                  </Button>
                </Demo>
              ))}
              <Demo label="With icon">
                <Button icon={<Plus size={16} />}>New board</Button>
                <Button variant="secondary" icon={<Download size={15} />}>
                  Export PNG
                </Button>
                <Button size="sm" icon={<Play size={14} className="fill-current" />}>
                  Present
                </Button>
              </Demo>
            </div>
          </Section>

          <Section
            id="icon-button"
            title="IconButton & Toolbar"
            intro="Every icon-only control is an IconButton: it requires a label (its accessible name and tooltip) and can show a shortcut. Group them in a Toolbar; a pressed tool gets the ink fill."
          >
            <div className="flex flex-col gap-6">
              <Demo label="States: default / pressed tool / danger / disabled / focus">
                <IconButton label="Select" keys={['V']}>
                  <MousePointer2 size={17} />
                </IconButton>
                <IconButton label="Hand" active>
                  <Hand size={17} />
                </IconButton>
                <IconButton label="Delete" tone="danger">
                  <Trash2 size={17} />
                </IconButton>
                <IconButton label="Undo (nothing to undo)" disabled>
                  <PenLine size={17} />
                </IconButton>
                <IconButton label="Focused" className="outline-2 outline-offset-2 outline-select">
                  <Type size={17} />
                </IconButton>
              </Demo>
              <Demo label="Sizes: md (36, 40 on touch) / sm (32)">
                <IconButton label="Medium">
                  <ImagePlus size={17} />
                </IconButton>
                <IconButton label="Small" size="sm">
                  <ImagePlus size={15} />
                </IconButton>
                <div className="rounded-[10px] bg-ink p-1">
                  <IconButton label="On dark" tone="dark">
                    <Play size={16} />
                  </IconButton>
                </div>
              </Demo>
              <Demo label="Toolbar (the editor's bottom bar)">
                <Toolbar aria-label="Demo tools">
                  <IconButton label="Select" keys={['V']} active>
                    <MousePointer2 size={17} />
                  </IconButton>
                  <IconButton label="Hand" keys={['H']}>
                    <Hand size={17} />
                  </IconButton>
                  <ToolbarDivider />
                  <IconButton label="Add images" keys={['I']}>
                    <ImagePlus size={17} />
                  </IconButton>
                  <IconButton label="Sticky note" keys={['N']}>
                    <StickyNote size={17} />
                  </IconButton>
                  <IconButton label="Text" keys={['T']}>
                    <Type size={17} />
                  </IconButton>
                </Toolbar>
                <Panel className="px-4 py-3 text-[13px] text-muted">Panel · frost</Panel>
                <Panel tone="solid" radius="card" className="px-4 py-3 text-[13px] text-muted">
                  Panel · solid · card radius
                </Panel>
              </Demo>
            </div>
          </Section>

          <Section id="inputs" title="Input" intro="Always labelled. Hints sit under the field; an error replaces the hint, turns the ring red and is announced through aria-describedby.">
            <div className="grid max-w-[720px] gap-5 sm:grid-cols-2">
              <Input label="Board name" placeholder="Untitled board" />
              <Input label="With a value" value={name} onChange={(e) => setName(e.target.value)} hint="Up to 60 characters." />
              <Input label="Error" defaultValue="" error="Give the board a name." />
              <Input label="Disabled" defaultValue="Read only" disabled />
            </div>
          </Section>

          <Section id="menu" title="Menu & Dialog" intro="Menus open on click, move with the arrow keys and close on Esc or outside click. Dialogs trap focus, close on Esc and return focus to their opener.">
            <div className="flex flex-wrap items-start gap-3">
              <Menu
                label="Demo menu"
                items={[
                  { type: 'label', label: 'Boards' },
                  { label: 'Spring campaign', checked: true, onSelect: () => toast('Picked Spring campaign') },
                  { label: 'Studio interiors', checked: false, onSelect: () => toast('Picked Studio interiors') },
                  { type: 'separator' },
                  { label: 'Rename…', icon: <PenLine />, onSelect: () => toast('Rename') },
                  { label: 'Disabled item', icon: <Download />, disabled: true, onSelect: () => {} },
                  { label: 'Delete board', icon: <Trash2 />, danger: true, onSelect: () => toast('Delete', { tone: 'error' }) },
                ]}
                trigger={(p) => (
                  <Button {...p} variant="secondary">
                    Open menu
                  </Button>
                )}
              />
              <Button variant="secondary" onClick={() => setDialog(true)}>
                Open dialog
              </Button>
            </div>
            <Dialog
              open={dialog}
              onClose={() => setDialog(false)}
              title="Delete board?"
              description="“Spring campaign” and its 10 items will be removed from this browser."
              footer={
                <>
                  <Button variant="secondary" data-autofocus onClick={() => setDialog(false)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => setDialog(false)}>
                    Delete board
                  </Button>
                </>
              }
            />
          </Section>

          <Section id="feedback" title="Toast, Spinner, Tooltip, Kbd" intro="Toasts confirm what just happened, bottom centre, and offer Undo when it helps. Tooltips appear after a short hover delay or instantly on keyboard focus.">
            <div className="flex flex-col gap-6">
              <Demo label="Toasts">
                <ToastView toast={{ message: 'Image added', tone: 'default' }} />
                <ToastView toast={{ message: 'Deleted “Spring campaign”', tone: 'default', action: { label: 'Undo', onClick: () => {} } }} />
                <ToastView toast={{ message: 'Export failed', tone: 'error' }} />
                <Button size="sm" variant="secondary" onClick={() => toast('Palette extracted')}>
                  Show a toast
                </Button>
                <Button size="sm" variant="secondary" onClick={() => toast('That image could not be read', { tone: 'error' })}>
                  Show an error
                </Button>
              </Demo>
              <Demo label="Spinner">
                <Spinner />
                <Spinner size={24} className="text-select" />
              </Demo>
              <Demo label="Tooltip (hover or Tab to these)">
                <Tooltip label="Present" keys={['P']}>
                  <Button variant="secondary" size="sm">
                    Top
                  </Button>
                </Tooltip>
                <Tooltip label="Export PNG" keys={['Mod', 'E']} side="bottom">
                  <Button variant="secondary" size="sm">
                    Bottom
                  </Button>
                </Tooltip>
              </Demo>
              <Demo label="Kbd">
                <Kbd k="Mod" />
                <Kbd k="Shift" />
                <Kbd k="Z" />
                <KeyCombo keys={['Mod', 'Shift', 'Z']} />
                <KeyCombo keys={['Space', 'drag']} />
              </Demo>
            </div>
          </Section>

          <Section id="swatch" title="Swatch & EmptyState" intro="Swatches show a colour with its hex; given onCopy they become buttons. EmptyState fills any blank board or list with one clear next step.">
            <div className="flex max-w-[420px] gap-2">
              {['#d9878f', '#b3263f', '#3e9c80', '#e9c27a', '#1d1d1f'].map((h) => (
                <Swatch key={h} hex={h} onCopy={(x) => navigator.clipboard?.writeText(x).then(() => toast(`Copied ${x}`), () => toast('Clipboard is blocked', { tone: 'error' }))} />
              ))}
            </div>
            <div className="mt-3 flex max-w-[260px] gap-1.5">
              {['#efe6da', '#d8c4ab', '#a07c5a', '#2e2b27'].map((h) => (
                <Swatch key={h} hex={h} size="sm" />
              ))}
            </div>
            <Panel tone="solid" className="mt-6 py-10">
              <EmptyState
                icon={<ImagePlus size={20} />}
                title="This board is empty"
                body={COPY.emptyCanvas}
                action={<Button icon={<Plus size={16} />}>Add images</Button>}
              />
            </Panel>
          </Section>

          <Section
            id="canvas"
            title="Canvas items"
            intro="What lives on a board: image cards (radius 11, card shadow), sticky notes in six papers, free text and extracted palettes. Selection is a 1px blue box with 9px square handles."
          >
            <div className="dot-grid flex flex-wrap items-start gap-10 rounded-[var(--radius-panel)] p-8 ring-1 ring-line">
              {ITEM_DEMOS.map((it) => (
                <div key={it.id} className="relative" style={{ width: it.w, height: it.h }}>
                  <CanvasItem item={{ ...it, x: 0, y: 0 }} editing={false} />
                </div>
              ))}
              <div className="relative size-[150px]">
                <CanvasItem item={{ ...ITEM_DEMOS[0]!, id: 'sg-sel', src: 'lib:vase' }} editing={false} />
                <div className="absolute -inset-3">
                  <SelectionLayer
                    items={[{ ...ITEM_DEMOS[0]!, x: 0, y: 0 }]}
                    camera={{ cx: 75, cy: 75, zoom: 1 }}
                    vw={174}
                    vh={174}
                    handles={false}
                    guides={[]}
                    marquee={null}
                    rotating={null}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-6">
              <Demo label="Image · loading / missing">
                <div className="size-24 overflow-hidden rounded-[var(--radius-card)]">
                  <ItemImage src="lib:peony" alt="" demo="loading" />
                </div>
                <div className="size-24 overflow-hidden rounded-[var(--radius-card)]">
                  <ItemImage src="lib:nope" alt="" demo="missing" />
                </div>
              </Demo>
              <Demo label="Wordmark">
                <Wordmark size="sm" />
                <Wordmark size="md" />
              </Demo>
            </div>
          </Section>

          <Section id="boards" title="Board thumbnail" intro="A live, scaled copy of a board's items, used on the boards page. It re-renders as the board changes.">
            <div className="max-w-[360px] overflow-hidden rounded-[var(--radius-panel)] bg-surface shadow-[var(--shadow-card)] ring-1 ring-black/[0.04]">
              <BoardThumb board={demoBoard} />
              <div className="border-t border-line px-4 py-3">
                <p className="text-[15px] font-medium text-ink">{demoBoard.name}</p>
                <p className="text-[13px] text-muted">{demoBoard.items.length} items</p>
              </div>
            </div>
          </Section>
        </main>
      </div>
    </div>
  )
}
