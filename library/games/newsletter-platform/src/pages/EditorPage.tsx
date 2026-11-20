import { AlignLeft, ArrowDown, ArrowUp, Eye, Heading2, Image as ImageIcon, Minus, Monitor, MousePointerClick, Pilcrow, Plus, Quote, RotateCcw, Send, Smartphone, SquarePen, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'

import { Badge } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Select } from '../components/Field'
import { IssuePreview } from '../components/IssuePreview'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Segmented } from '../components/Segmented'
import { toast } from '../components/Toast'
import type { Block, BlockType, ImageKey, Issue } from '../content'
import { accents, blockLabels, defaultIssue, editorCopy, images } from '../content'
import { cx } from '../lib/cx'
import { newId, useDraft, words } from '../lib/draft'
import { validateEmail } from '../lib/validate'

const blockIcons: Record<BlockType, ReactNode> = {
  heading: <Heading2 />,
  paragraph: <Pilcrow />,
  image: <ImageIcon />,
  quote: <Quote />,
  button: <MousePointerClick />,
  divider: <Minus />,
}

function blank(type: BlockType): Block {
  const id = newId()
  if (type === 'image') return { id, type, image: 'desk' }
  if (type === 'button') return { id, type, text: 'Read more', href: '' }
  if (type === 'divider') return { id, type }
  return { id, type, text: '' }
}

const ta = 'block min-h-10 w-full resize-none bg-transparent [field-sizing:content] placeholder:text-[#9c97a6] focus:outline-none'

function BlockEditor({ b, issue, onChange }: { b: Block; issue: Issue; onChange: (p: Partial<Block>) => void }) {
  const serif = issue.font === 'serif'
  switch (b.type) {
    case 'heading':
      return <textarea aria-label="Heading" rows={1} value={b.text} onChange={(e) => onChange({ text: e.target.value })} placeholder="Heading" className={cx(ta, 'text-[22px] font-semibold leading-tight', serif ? 'font-serif' : 'font-display font-bold')} />
    case 'paragraph':
      return <textarea aria-label="Paragraph" rows={2} value={b.text} onChange={(e) => onChange({ text: e.target.value })} placeholder="Write something…" className={cx(ta, 'text-[16px] leading-[1.65]')} />
    case 'quote':
      return (
        <div className="border-l-[3px] pl-4" style={{ borderColor: issue.accent }}>
          <textarea aria-label="Quote" rows={1} value={b.text} onChange={(e) => onChange({ text: e.target.value })} placeholder="A line worth quoting" className={cx(ta, 'font-serif text-[18px] italic leading-snug')} />
        </div>
      )
    case 'image':
      return (
        <div>
          <img src={images[b.image ?? 'desk']} alt="" className="aspect-[3/2] w-full rounded-[6px] object-cover" />
          <label className="mt-2 flex items-center gap-2 text-[13px] text-[#5b5765]">
            Image
            <select value={b.image} onChange={(e) => onChange({ image: e.target.value as ImageKey })} className="h-10 rounded-[6px] border border-[#d9d4cd] bg-white px-2 text-[13px] text-paper-ink focus:outline-2 focus:outline-pink sm:h-8">
              {Object.keys(images).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>
        </div>
      )
    case 'divider':
      return <hr className="mx-auto my-3 w-16 border-t-2" style={{ borderColor: issue.accent }} />
    case 'button': {
      const bad = !!b.href && !/^https?:\/\/[^\s.]+\.[^\s]+$/.test(b.href)
      return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <input aria-label="Button label" value={b.text} onChange={(e) => onChange({ text: e.target.value })} className="h-11 rounded-[6px] px-4 text-[15px] font-semibold text-white placeholder:text-white/85 focus:outline-2 focus:outline-offset-2 focus:outline-pink" style={{ background: issue.accent }} placeholder="Button" />
          <div className="flex-1">
            <input aria-label="Button link" aria-invalid={bad || undefined} value={b.href} onChange={(e) => onChange({ href: e.target.value })} placeholder="https://example.com" className="h-11 w-full rounded-[6px] border border-[#d9d4cd] bg-white px-3 font-mono text-[13px] text-paper-ink focus:outline-2 focus:outline-pink aria-invalid:border-[#c0362c]" />
            {bad ? <p className="mt-1 text-[12px] font-medium text-[#b42318]">Use a full link starting with https://</p> : null}
          </div>
        </div>
      )
    }
  }
}

export function EditorPage() {
  const [issue, setIssue] = useDraft()
  const [view, setView] = useState<'write' | 'preview'>('write')
  const [device, setDevice] = useState<'desktop' | 'mobile' | 'text'>('desktop')
  const [saving, setSaving] = useState(false)
  const [testOpen, setTestOpen] = useState(false)
  const [schedOpen, setSchedOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setSaving(true)
    const h = setTimeout(() => setSaving(false), 600)
    return () => clearTimeout(h)
  }, [issue])

  const patch = (p: Partial<Issue>) => setIssue((i) => ({ ...i, ...p }))
  const patchBlock = (id: string, p: Partial<Block>) => setIssue((i) => ({ ...i, blocks: i.blocks.map((b) => (b.id === id ? { ...b, ...p } : b)) }))
  const move = (idx: number, d: -1 | 1) =>
    setIssue((i) => {
      const blocks = [...i.blocks]
      const [b] = blocks.splice(idx, 1)
      blocks.splice(idx + d, 0, b)
      return { ...i, blocks }
    })
  const remove = (id: string) => setIssue((i) => ({ ...i, blocks: i.blocks.filter((b) => b.id !== id) }))
  const add = (type: BlockType) => {
    const b = blank(type)
    setIssue((i) => ({ ...i, blocks: [...i.blocks, b] }))
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-block="${b.id}"] textarea, [data-block="${b.id}"] input, [data-block="${b.id}"] select`)?.focus())
  }

  const count = words(issue)

  return (
    <>
      <PageHeader
        eyebrow={editorCopy.title}
        title="Write your next issue"
        intro={editorCopy.intro}
        actions={
          <>
            <span className="inline-flex min-w-[76px] items-center gap-2 text-[14px] text-muted" role="status">
              <span className={cx('round size-2 rounded-full', saving ? 'bg-warn' : 'bg-ok')} aria-hidden />
              {saving ? editorCopy.saving : editorCopy.saved}
            </span>
            <Button variant="outline" icon={<Send className="size-4" />} onClick={() => setTestOpen(true)}>
              {editorCopy.sendTest}
            </Button>
            <Button onClick={() => setSchedOpen(true)} disabled={!issue.title.trim() || issue.blocks.length === 0}>
              {editorCopy.publish}
            </Button>
          </>
        }
      />
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="flex flex-col gap-4 lg:sticky lg:top-[108px] lg:self-start">
            <Card className="p-4">
              <h2 className="text-[14px] font-semibold text-ink">Add a block</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(Object.keys(blockLabels) as BlockType[]).map((t) => (
                  <button key={t} type="button" onClick={() => add(t)} className="flex h-11 items-center gap-2 rounded-[8px] border border-line bg-night-2 px-3 text-[14px] text-body transition-colors hover:border-line-strong hover:text-white [&_svg]:size-4 [&_svg]:text-pink-text">
                    {blockIcons[t]}
                    {blockLabels[t]}
                  </button>
                ))}
              </div>
            </Card>
            <Card className="p-4">
              <h2 className="text-[14px] font-semibold text-ink">Brand</h2>
              <p className="mt-3 text-[13px] text-muted" id="accent-l">
                Accent colour
              </p>
              <div role="radiogroup" aria-labelledby="accent-l" className="mt-2 flex gap-2">
                {accents.map((a) => (
                  <button key={a.value} type="button" role="radio" aria-checked={issue.accent === a.value} aria-label={a.name} title={a.name} onClick={() => patch({ accent: a.value })} className="round grid size-10 place-items-center rounded-full ring-offset-2 ring-offset-panel aria-checked:ring-2 aria-checked:ring-white sm:size-9" style={{ background: a.value }} />
                ))}
              </div>
              <p className="mt-4 text-[13px] text-muted">Typeface</p>
              <Segmented
                label="Typeface"
                size="sm"
                className="mt-2 w-full [&>button]:flex-1"
                value={issue.font}
                onChange={(font) => patch({ font })}
                options={[
                  { value: 'serif', label: 'Serif' },
                  { value: 'sans', label: 'Sans' },
                ]}
              />
            </Card>
            <Card className="p-4 text-[14px]">
              <dl className="grid grid-cols-2 gap-3">
                <div>
                  <dt className="text-muted">Words</dt>
                  <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-white">{count}</dd>
                </div>
                <div>
                  <dt className="text-muted">Read time</dt>
                  <dd className="mt-0.5 text-[20px] font-semibold tabular-nums text-white">{Math.max(1, Math.round(count / 230))} min</dd>
                </div>
              </dl>
              <Button variant="ghost" size="sm" className="mt-3 w-full" icon={<RotateCcw className="size-4" />} onClick={() => setResetOpen(true)}>
                Reset to sample
              </Button>
            </Card>
          </aside>

          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Segmented
                label="Editor view"
                value={view}
                onChange={setView}
                options={[
                  { value: 'write', label: 'Write', icon: <SquarePen /> },
                  { value: 'preview', label: 'Preview', icon: <Eye /> },
                ]}
              />
              {view === 'preview' ? (
                <Segmented
                  label="Preview device"
                  size="sm"
                  value={device}
                  onChange={setDevice}
                  options={[
                    { value: 'desktop', label: 'Desktop', icon: <Monitor /> },
                    { value: 'mobile', label: 'Phone', icon: <Smartphone /> },
                    { value: 'text', label: 'Plain text', icon: <AlignLeft /> },
                  ]}
                />
              ) : (
                <Badge tone="violet">{issue.blocks.length} blocks</Badge>
              )}
            </div>

            <div className="rounded-[var(--radius-card-lg)] border border-line bg-[radial-gradient(120%_70%_at_50%_0%,rgb(88_52_160/0.25),transparent_60%),var(--color-panel)] p-3 sm:p-8">
              {view === 'preview' ? (
                <IssuePreview issue={issue} mode={device} />
              ) : (
                <div className="issue mx-auto max-w-[680px] rounded-[10px] bg-paper px-4 py-8 text-paper-ink sm:px-12">
                  <textarea aria-label="Title" rows={1} value={issue.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Give it a title" className={cx(ta, 'text-[32px] font-semibold leading-[1.1] tracking-[-0.02em]', issue.font === 'serif' ? 'font-serif' : 'font-display font-extrabold')} />
                  {!issue.title.trim() ? <p className="mt-1 text-[13px] font-medium text-[#b42318]">Add a title before you schedule.</p> : null}
                  <textarea aria-label="Subtitle" rows={1} value={issue.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Subtitle (shows in the inbox preview)" className={cx(ta, 'mt-2 text-[17px] text-[#5b5765]')} />
                  <div className="mt-5 border-t border-[#e6e2dc] pt-3">
                    {issue.blocks.length === 0 ? (
                      <div className="py-6 [&_*]:!text-center">
                        <div className="rounded-[12px] bg-night p-1">
                          <EmptyState icon={<Pilcrow />} title="Your issue is empty" body="Add a paragraph to start writing, or pick a template." action={<Button onClick={() => add('paragraph')} icon={<Plus className="size-4" />}>Add a paragraph</Button>} />
                        </div>
                      </div>
                    ) : null}
                    <ol className="flex flex-col">
                      {issue.blocks.map((b, i) => (
                        <li key={b.id} data-block={b.id} className="group relative -mx-3 rounded-[8px] px-3 py-2 transition-colors focus-within:bg-[#f1ede6] hover:bg-[#f4f1eb]">
                          <BlockEditor b={b} issue={issue} onChange={(p) => patchBlock(b.id, p)} />
                          <div className="mt-1 flex justify-end gap-0.5 sm:invisible sm:absolute sm:right-1 sm:top-1 sm:z-10 sm:mt-0 sm:rounded-[10px] sm:bg-panel sm:p-0.5 sm:shadow-[var(--shadow-pop)] sm:group-focus-within:visible sm:group-hover:visible">
                            <IconButton label={`Move ${blockLabels[b.type].toLowerCase()} up`} disabled={i === 0} onClick={() => move(i, -1)} className="bg-panel-2 !text-body">
                              <ArrowUp />
                            </IconButton>
                            <IconButton label={`Move ${blockLabels[b.type].toLowerCase()} down`} disabled={i === issue.blocks.length - 1} onClick={() => move(i, 1)} className="bg-panel-2 !text-body">
                              <ArrowDown />
                            </IconButton>
                            <IconButton label={`Delete ${blockLabels[b.type].toLowerCase()}`} onClick={() => remove(b.id)} className="bg-panel-2 !text-body hover:!text-bad">
                              <Trash2 />
                            </IconButton>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>

      <SendTest open={testOpen} onClose={() => setTestOpen(false)} />
      <Schedule open={schedOpen} onClose={() => setSchedOpen(false)} title={issue.title} />
      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        width="sm"
        title="Reset the draft?"
        description="This replaces your draft with the sample issue. It can’t be undone."
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)}>
              Keep editing
            </Button>
            <Button
              variant="pink"
              onClick={() => {
                setIssue(defaultIssue)
                setResetOpen(false)
                toast('Draft reset to the sample issue')
              }}
            >
              Reset draft
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-body">Your title, blocks and brand settings go back to the sample.</p>
      </Modal>
    </>
  )
}

function SendTest({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const err = validateEmail(email)
    setError(err)
    if (err) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onClose()
      toast(`Test sent to ${email.trim()}`)
    }, 900)
  }
  return (
    <Modal open={open} onClose={onClose} width="sm" title="Send a test" description="We send the issue exactly as subscribers will see it.">
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Send to" error={error ?? undefined}>
          {(f) => <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} type="email" autoComplete="email" data-autofocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />}
        </Field>
        <Button type="submit" loading={busy} className="w-full">
          Send test
        </Button>
      </form>
    </Modal>
  )
}

function Schedule({ open, onClose, title }: { open: boolean; onClose: () => void; title: string }) {
  const [when, setWhen] = useState('tomorrow-08')
  const [audience, setAudience] = useState('all')
  const [busy, setBusy] = useState(false)
  const labels: Record<string, string> = { now: 'right now', 'tomorrow-08': 'tomorrow at 8:00', 'friday-07': 'Friday at 7:00' }
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule issue"
      description={`“${title || 'Untitled issue'}” goes to your list.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            loading={busy}
            onClick={() => {
              setBusy(true)
              setTimeout(() => {
                setBusy(false)
                onClose()
                toast(`Scheduled for ${labels[when]}`)
              }, 900)
            }}
          >
            Schedule
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Send">
          {(f) => (
            <Select id={f.id} value={when} onChange={(e) => setWhen(e.target.value)}>
              <option value="now">Now</option>
              <option value="tomorrow-08">Tomorrow, 8:00 in each reader’s time zone</option>
              <option value="friday-07">Friday, 7:00 in each reader’s time zone</option>
            </Select>
          )}
        </Field>
        <Field label="Audience" hint="Paid readers get the full issue; free readers see the preview.">
          {(f) => (
            <Select id={f.id} aria-describedby={f.describedBy} value={audience} onChange={(e) => setAudience(e.target.value)}>
              <option value="all">Everyone (372,096)</option>
              <option value="paid">Paid only (8,412)</option>
              <option value="free">Free only (363,684)</option>
            </Select>
          )}
        </Field>
      </div>
    </Modal>
  )
}
