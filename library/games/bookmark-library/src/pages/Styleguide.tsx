import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Inbox, Plus, Sparkles, Star } from 'lucide-react'

import { Accordion } from '../components/Accordion'
import { Button, IconButton } from '../components/Button'
import { Chip, ChipButton, Tag } from '../components/Chip'
import { EmailCapture } from '../components/EmailCapture'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Select, Textarea } from '../components/Field'
import { ItemCard } from '../components/ItemCard'
import { ItemRow } from '../components/ItemRow'
import { Kbd } from '../components/Kbd'
import { Logo, Mark } from '../components/Logo'
import { Modal } from '../components/Modal'
import { NavItem } from '../components/NavItem'
import { PlanCard } from '../components/PlanCard'
import { MenuItem, Popover } from '../components/Popover'
import { QueryChips } from '../components/QueryChips'
import { SearchBox } from '../components/SearchBox'
import { Eyebrow } from '../components/SectionHeading'
import { Segmented } from '../components/Segmented'
import { Skeleton } from '../components/Skeleton'
import { TagInput } from '../components/TagInput'
import { Thumb } from '../components/Thumb'
import { useToast } from '../components/Toast'
import { FAQ, PLANS } from '../content'
import { seedLibrary } from '../lib/library'
import { parseQuery } from '../lib/search'

const COLOURS: Array<[string, string, string]> = [
  ['canvas', '#efefea', 'Frame around the page'],
  ['paper', '#f8f8f5', 'Page background'],
  ['panel', '#fbfbf9', 'App panels, cards'],
  ['chip', '#ecece7', 'Chips, soft buttons'],
  ['chip-2', '#e2e2dc', 'Active chip, pressed'],
  ['line', '#e5e5df', 'Hairlines'],
  ['line-2', '#d6d6cf', 'Input borders'],
  ['ink', '#121212', 'Headings, primary text'],
  ['ink-2', '#34362f', 'Secondary text'],
  ['muted', '#5d6058', 'Body copy (6.0:1)'],
  ['subtle', '#686b63', 'Labels, dates (5.0:1)'],
  ['faint', '#a3a59e', 'Decoration only'],
  ['lime', '#8ee55a', 'Brand fill, highlight'],
  ['lime-hover', '#7fdc48', 'Lime hover'],
  ['lime-soft', '#e5f8d6', 'Lime tint'],
  ['leaf', '#2f6a12', 'Lime-family text (6.3:1)'],
  ['danger', '#b42318', 'Errors, delete'],
  ['danger-soft', '#fdecea', 'Error tint'],
]

const TYPE: Array<[string, string, string]> = [
  ['Display', 'text-[clamp(50px,6.7vw,100px)] font-bold tracking-[-0.052em] leading-[0.98]', '100 / 98% / -5.2%'],
  ['H2', 'text-[60px] font-bold tracking-[-0.045em] leading-none', '60 / 100% / -4.5%'],
  ['H3', 'text-[30px] font-bold tracking-[-0.04em] leading-[1.1]', '30 / 110% / -4%'],
  ['Title', 'text-[20px] font-semibold tracking-[-0.025em]', '20 / semibold'],
  ['Lead', 'text-[20px] leading-[1.75] text-muted', '20 / 175%'],
  ['Item title', 'text-[17px] font-medium tracking-[-0.015em]', '17 / medium'],
  ['Body', 'text-[15px] leading-[1.55]', '15 / 155%'],
  ['Small', 'text-[14px] text-muted', '14'],
  ['Label', 'text-[12px] tracking-[0.08em] uppercase text-subtle', '12 / caps / +8%'],
]

const SPACE = [4, 8, 12, 16, 20, 24, 32, 48, 72, 120]
const RADII: Array<[string, string]> = [['xs', '6px'], ['sm', '8px'], ['md', '10px'], ['lg', '14px'], ['xl', '18px'], ['2xl', '24px'], ['frame', '22px']]
const SHADOWS: Array<[string, string]> = [['card', 'shadow-card'], ['pop', 'shadow-pop'], ['lime', 'shadow-lime'], ['inset', 'shadow-inset']]
const MOTION: Array<[string, string, string]> = [
  ['rise', 'animate-rise', '640ms ease-out-soft: hero lines, sections'],
  ['swipe', 'animate-swipe', '700ms: the lime highlight wipe'],
  ['pop', 'animate-pop', '260ms spring: dialogs, toasts, menus'],
  ['fade', 'animate-fade', '400ms: backdrops, grid items'],
  ['caret', 'animate-caret', '1s steps: the demo caret'],
  ['shimmer', 'skeleton', '1.4s linear: loading skeletons'],
]
const STATES = ['default', 'hover', 'focus', 'pressed', 'disabled', 'loading'] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-14">
      <h2 id={id} className="mb-8 text-[30px] font-bold tracking-[-0.04em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2.5 text-[12px] tracking-[0.08em] text-subtle uppercase">{label}</p>
      {children}
    </div>
  )
}

export function Styleguide() {
  const lib = useMemo(() => seedLibrary(), [])
  const toast = useToast()
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [seg, setSeg] = useState<'a' | 'b' | 'c'>('a')
  const [tags, setTags] = useState(['typography', 'colour'])
  const parsed = useMemo(() => parseQuery('typography I saved about two weeks ago for the redesign', lib.items, lib.collections), [lib])
  const item = lib.items[0]
  const plain = lib.items.find((i) => !i.image) ?? item

  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-10 pb-24 sm:px-8">
      <Eyebrow icon={<Sparkles aria-hidden className="size-4" />}>Design system</Eyebrow>
      <h1 className="mt-6 text-[clamp(44px,6vw,80px)] leading-[0.98] font-bold tracking-[-0.05em]">Keepsake style guide</h1>
      <p className="mt-5 max-w-[60ch] text-[18px] leading-[1.6] text-muted">Tokens live in src/styles.css; every sample below is the real component from src/components. Hover, focus and pressed are pinned with data-force.</p>

      <Section id="sg-colour" title="Colour">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {COLOURS.map(([name, hex, use]) => (
            <li key={name}>
              <span className="block h-20 rounded-lg ring-1 ring-line" style={{ background: hex }} />
              <p className="mt-2 text-[14px] font-medium">{name}</p>
              <p className="text-[13px] text-subtle tabular-nums">{hex}</p>
              <p className="text-[13px] text-muted">{use}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-type" title="Type">
        <p className="mb-6 text-[15px] text-muted">Inter Tight, 400 to 800. Tighten tracking as size grows.</p>
        <div className="flex flex-col divide-y divide-line">
          {TYPE.map(([name, cls, spec]) => (
            <div key={name} className="grid grid-cols-[minmax(0,1fr)] items-baseline gap-2 py-4 md:grid-cols-[140px_1fr_180px]">
              <span className="text-[13px] text-subtle">{name}</span>
              <span className={`${cls} min-w-0 truncate`}>Everything you saved</span>
              <span className="text-[13px] text-subtle tabular-nums">{spec}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sg-space" title="Spacing, radii, shadows">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-3">
          <Cell label="Spacing (px)">
            <ul className="flex flex-col gap-2">
              {SPACE.map((s) => (
                <li key={s} className="flex items-center gap-3 text-[13px] text-subtle tabular-nums">
                  <span className="w-8">{s}</span>
                  <span className="h-3 rounded-xs bg-lime" style={{ width: s * 2 }} />
                </li>
              ))}
            </ul>
          </Cell>
          <Cell label="Radii">
            <ul className="grid grid-cols-4 gap-3">
              {RADII.map(([n, v]) => (
                <li key={n} className="text-center">
                  <span className="block aspect-square bg-chip ring-1 ring-line-2" style={{ borderRadius: v }} />
                  <span className="mt-1.5 block text-[12px] text-subtle">
                    {n} {v}
                  </span>
                </li>
              ))}
            </ul>
          </Cell>
          <Cell label="Shadows">
            <ul className="grid grid-cols-2 gap-4">
              {SHADOWS.map(([n, cls]) => (
                <li key={n} className={`grid h-20 place-items-center rounded-lg bg-paper text-[13px] text-muted ${cls}`}>
                  {n}
                </li>
              ))}
            </ul>
          </Cell>
        </div>
      </Section>

      <Section id="sg-motion" title="Motion">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="dark" size="sm" onClick={() => setReplay((r) => r + 1)}>
            Replay motion
          </Button>
          <p className="text-[14px] text-muted">Ease out-soft cubic-bezier(.2,.7,.2,1); spring cubic-bezier(.34,1.4,.64,1). Durations 140 / 240 / 520 ms. Reduced motion turns all of it off.</p>
        </div>
        <ul key={replay} className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOTION.map(([n, cls, use]) => (
            <li key={n} className="rounded-lg bg-panel p-5 ring-1 ring-line">
              <div className="grid grid-cols-[minmax(0,1fr)] h-20 place-items-center">
                {n === 'swipe' ? (
                  <span className="relative inline-block px-3 text-[32px] font-bold tracking-[-0.04em]">
                    <span aria-hidden className="absolute inset-0 animate-swipe rounded-[10px] bg-lime" />
                    <span className="relative">finally</span>
                  </span>
                ) : n === 'caret' ? (
                  <span className="flex items-center text-[20px]">
                    typing
                    <span className="ml-px h-6 w-[1.5px] animate-caret bg-ink" />
                  </span>
                ) : (
                  <span className={`block h-12 w-24 rounded-md ${n === 'shimmer' ? 'skeleton' : `bg-lime ${cls}`}`} />
                )}
              </div>
              <p className="mt-3 text-[14px] font-medium">{n}</p>
              <p className="text-[13px] text-muted">{use}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-brand" title="Brand">
        <div className="flex flex-wrap items-center gap-10">
          <Logo />
          <Mark className="size-12" />
          <span className="rounded-lg bg-ink p-3 text-paper">
            <Mark className="size-10" />
          </span>
          <Eyebrow icon={<Sparkles aria-hidden className="size-4" />}>Bookmarks with memory</Eyebrow>
        </div>
      </Section>

      <Section id="sg-buttons" title="Buttons">
        <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Button states table">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="pb-3 text-[12px] font-normal tracking-[0.08em] text-subtle uppercase">
                  Variant
                </th>
                {STATES.map((s) => (
                  <th key={s} scope="col" className="pb-3 text-[12px] font-normal tracking-[0.08em] text-subtle uppercase">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(['lime', 'dark', 'soft', 'outline', 'ghost', 'danger'] as const).map((v) => (
                <tr key={v}>
                  <th scope="row" className="py-2 pr-4 text-[14px] font-medium">
                    {v}
                  </th>
                  {STATES.map((s) => (
                    <td key={s} className="py-2 pr-3">
                      <Button variant={v} size="sm" force={s === 'hover' || s === 'focus' || s === 'pressed' ? s : undefined} disabled={s === 'disabled'} loading={s === 'loading'}>
                        {v === 'danger' ? 'Delete' : 'Save'}
                      </Button>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex flex-wrap items-end gap-4">
          <Cell label="Sizes">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="lime" size="sm">
                Small
              </Button>
              <Button variant="lime" size="md">
                Medium
              </Button>
              <Button variant="lime" size="lg" iconEnd={<ArrowRight aria-hidden className="size-4.5" />}>
                Join waitlist
              </Button>
            </div>
          </Cell>
          <Cell label="Icon buttons">
            <div className="flex items-center gap-2">
              <IconButton label="Add">
                <Plus aria-hidden className="size-4.5" />
              </IconButton>
              <IconButton label="Add (hover)" force="hover">
                <Plus aria-hidden className="size-4.5" />
              </IconButton>
              <IconButton label="Add (focus)" force="focus">
                <Plus aria-hidden className="size-4.5" />
              </IconButton>
              <IconButton label="Favourite" variant="soft">
                <Star aria-hidden className="size-4.5" />
              </IconButton>
              <IconButton label="Disabled" variant="soft" disabled>
                <Star aria-hidden className="size-4.5" />
              </IconButton>
            </div>
          </Cell>
        </div>
      </Section>

      <Section id="sg-chips" title="Chips and tags">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2">
          <Cell label="Chip tones">
            <div className="flex flex-wrap gap-2">
              <Chip>soft</Chip>
              <Chip tone="active">active</Chip>
              <Chip tone="off">off</Chip>
              <Chip tone="lime">lime</Chip>
              <Chip tone="outline">outline</Chip>
            </div>
          </Cell>
          <Cell label="Chip button states">
            <div className="flex flex-wrap gap-2">
              <ChipButton>default</ChipButton>
              <ChipButton force="hover">hover</ChipButton>
              <ChipButton force="focus">focus</ChipButton>
              <ChipButton force="pressed">pressed</ChipButton>
              <ChipButton disabled>disabled</ChipButton>
              <ChipButton removable>removable</ChipButton>
            </div>
          </Cell>
          <Cell label="Query chips (read from a sentence)" className="md:col-span-2">
            <QueryChips chips={parsed.chips} off={new Set([parsed.chips[1]?.id ?? ''])} />
          </Cell>
          <Cell label="Tags">
            <div className="flex gap-1.5">
              <Tag>typography</Tag>
              <Tag>colour</Tag>
              <Tag>motion</Tag>
            </div>
          </Cell>
          <Cell label="Keys">
            <div className="flex gap-1.5">
              <Kbd>/</Kbd>
              <Kbd>N</Kbd>
              <Kbd>Esc</Kbd>
            </div>
          </Cell>
        </div>
      </Section>

      <Section id="sg-forms" title="Forms">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
          <Field label="Default" hint="Hint text">
            {({ id, describedBy }) => <Input id={id} aria-describedby={describedBy} placeholder="https://" />}
          </Field>
          <Field label="Hover">
            {({ id }) => <Input id={id} force="hover" defaultValue="type.example" />}
          </Field>
          <Field label="Focus">
            {({ id }) => <Input id={id} force="focus" defaultValue="type.example/specimen" />}
          </Field>
          <Field label="Error" error="That does not look like a link.">
            {({ id, describedBy, invalid }) => <Input id={id} aria-invalid={invalid} aria-describedby={describedBy} defaultValue="not a link" />}
          </Field>
          <Field label="Disabled">
            {({ id }) => <Input id={id} disabled defaultValue="Read only" />}
          </Field>
          <Field label="Select">
            {({ id }) => (
              <Select id={id} defaultValue="b">
                <option value="a">None (My shelf)</option>
                <option value="b">Website redesign</option>
              </Select>
            )}
          </Field>
          <Field label="Textarea" className="md:col-span-2">
            {({ id }) => <Textarea id={id} defaultValue="For the pricing page hero." />}
          </Field>
          <TagInput value={tags} onChange={setTags} suggestions={['typography', 'colour', 'motion', 'layout', 'photography']} />
        </div>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-2">
          <Cell label="Search box: empty, filled">
            <div className="flex flex-col gap-2 rounded-xl bg-paper px-6 py-2 ring-1 ring-line">
              <SearchBox aria-label="Search sample" placeholder="Search in your own words" />
              <SearchBox aria-label="Search sample filled" value="fonts from last week" onChange={() => {}} onClear={() => {}} />
            </div>
          </Cell>
          <Cell label="Search box (compact): default, hover, focus">
            <div className="flex flex-col gap-2">
              <SearchBox size="md" aria-label="Compact search" placeholder="Filter" />
              <SearchBox size="md" force="hover" aria-label="Compact search hover" placeholder="Filter" />
              <SearchBox size="md" force="focus" aria-label="Compact search focus" placeholder="Filter" />
            </div>
          </Cell>
          <Cell label="Email capture: default">
            <EmailCapture />
          </Cell>
          <Cell label="Email capture: loading, error">
            <div className="flex flex-col gap-2">
              <EmailCapture forceState="loading" />
              <EmailCapture forceState="error" />
            </div>
          </Cell>
          <Cell label="Email capture: dark" className="md:col-span-2">
            <div className="rounded-xl bg-ink p-6">
              <EmailCapture tone="dark" />
            </div>
          </Cell>
          <Cell label="Segmented">
            <Segmented
              label="Sample"
              value={seg}
              onChange={setSeg}
              options={[
                { value: 'a', label: 'Monthly' },
                { value: 'b', label: 'Yearly' },
                { value: 'c', label: 'Lifetime' },
              ]}
            />
          </Cell>
        </div>
      </Section>

      <Section id="sg-library" title="Library components">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[274px_1fr]">
          <Cell label="Nav item: default, hover, focus, active">
            <div className="flex flex-col gap-1 rounded-xl bg-panel p-3 ring-1 ring-line">
              <NavItem href="/app/today" label="Today" />
              <NavItem href="/app/favourites" label="Favourites" count={6} force="hover" />
              <NavItem href="/app/c/brand-refresh" label="Brand refresh" count={5} square={false} force="focus" />
              <NavItem href="/app" label="My shelf" count={24} active />
            </div>
          </Cell>
          <Cell label="Item row: default, hover, focus, active">
            <div className="flex flex-col rounded-xl bg-paper p-2 ring-1 ring-line">
              <ItemRow item={item} href={`/app/item/${item.id}`} />
              <ItemRow item={plain} href={`/app/item/${plain.id}`} force="hover" />
              <ItemRow item={lib.items[2]} href={`/app/item/${lib.items[2].id}`} force="focus" />
              <ItemRow item={lib.items[3]} href={`/app/item/${lib.items[3].id}`} active />
            </div>
          </Cell>
        </div>
        <Cell label="Item card: default, hover, focus, no image" className="mt-10">
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            <li>
              <ItemCard item={item} onFavourite={() => toast('Favourite toggled')} collectionName="Website redesign" />
            </li>
            <li>
              <ItemCard item={lib.items[6]} force="hover" onFavourite={() => toast('Favourite toggled')} />
            </li>
            <li>
              <ItemCard item={lib.items[8]} force="focus" onFavourite={() => toast('Favourite toggled')} />
            </li>
            <li>
              <ItemCard item={plain} onFavourite={() => toast('Favourite toggled')} />
            </li>
          </ul>
        </Cell>
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-3">
          <Cell label="Thumbs">
            <div className="flex gap-2">
              {(['sand', 'lilac', 'sky', 'sage', 'blush'] as const).map((s) => (
                <Thumb key={s} item={{ swatch: s }} className="h-10 w-14 rounded-md" />
              ))}
              <Thumb item={{ image: 'ceramics', swatch: 'sage' }} className="h-10 w-14 rounded-md" />
            </div>
          </Cell>
          <Cell label="Loading skeleton">
            <div className="flex flex-col gap-2 rounded-xl p-4 ring-1 ring-line">
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-full" />
            </div>
          </Cell>
          <Cell label="Empty state">
            <EmptyState icon={<Inbox aria-hidden className="size-5" />} title="Nothing saved yet" body="Paste a link and add a line of why." className="py-8" />
          </Cell>
        </div>
      </Section>

      <Section id="sg-overlays" title="Overlays and feedback">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="dark" onClick={() => setModal(true)}>
            Open a dialog
          </Button>
          <Button variant="soft" onClick={() => toast('Saved to My shelf', { label: 'View', onClick: () => {} })}>
            Show a toast
          </Button>
          <Popover label="Open a menu" align="left" trigger={<span className="px-3 text-[15px]">Open a menu</span>}>
            {(close) => (
              <>
                <MenuItem onClick={close}>Reset demo data</MenuItem>
                <MenuItem tone="danger" onClick={close}>
                  Start empty
                </MenuItem>
              </>
            )}
          </Popover>
        </div>
        <Modal open={modal} onClose={() => setModal(false)} title="A dialog" description="Focus is trapped here; Esc or the backdrop closes it." size="sm" footer={<Button variant="dark" onClick={() => setModal(false)}>Done</Button>}>
          <p className="text-[15px] text-muted">Dialogs use the pop motion and return focus to whatever opened them.</p>
        </Modal>
      </Section>

      <Section id="sg-marketing" title="Marketing components">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} yearly />
          ))}
        </div>
        <div className="mt-10">
          <Accordion items={FAQ.slice(0, 3)} />
        </div>
      </Section>
    </div>
  )
}
