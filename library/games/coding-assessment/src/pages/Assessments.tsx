import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowDown, ArrowUp, ClipboardList, Clock, Mail, Plus, Sparkles, Trash2, X } from 'lucide-react'

import { Badge, difficultyTone } from '../components/Badge'
import { Button, ButtonLink, IconButton } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { Container } from '../components/Container'
import { Input, Select, Switch, Textarea } from '../components/Field'
import { EmptyState, Notice } from '../components/Misc'
import { Modal } from '../components/Modal'
import { useToast } from '../components/Toast'
import { ROLES } from '../data'
import { ApiError, post } from '../lib/api'
import { formatDate, plural } from '../lib/format'
import { EMPTY_DRAFT, questionById, useAssessments, useDraft } from '../lib/store'
import type { Assessment } from '../lib/store'
import { validateInvites } from '../shared/validate'
import type { Errors } from '../shared/validate'

/** The assessment builder (questions come from the library) and the saved assessments with invites. */
export function Assessments() {
  const [draft, setDraft] = useDraft()
  const [saved, setSaved] = useAssessments()
  const [errors, setErrors] = useState<Errors>({})
  const [invite, setInvite] = useState<Assessment | null>(null)
  const [remove, setRemove] = useState<Assessment | null>(null)
  const toast = useToast()

  const questions = draft.questionIds.map(questionById).filter((q) => !!q)
  const total = questions.reduce((n, q) => n + q.minutes, 0)

  const move = (i: number, by: number) =>
    setDraft((d) => {
      const ids = [...d.questionIds]
      const [x] = ids.splice(i, 1)
      ids.splice(i + by, 0, x!)
      return { ...d, questionIds: ids }
    })

  const save = (e: FormEvent) => {
    e.preventDefault()
    const errs: Errors = {}
    if (draft.name.trim().length < 2) errs.name = 'Name the assessment, for example “Backend screen”.'
    if (!draft.questionIds.length) errs.questions = 'Add at least one question from the library.'
    if (total > draft.minutes) errs.minutes = `The questions need ${total} minutes. Raise the limit or remove one.`
    setErrors(errs)
    if (Object.keys(errs).length) return
    const a: Assessment = { ...draft, name: draft.name.trim(), id: `as-${Date.now().toString(36)}`, invited: [], createdAt: new Date().toISOString() }
    setSaved((s) => [a, ...s])
    setDraft({ ...EMPTY_DRAFT, questionIds: [] })
    toast(`Saved ${a.name}. Invite candidates when you are ready.`)
    setInvite(a)
  }

  return (
    <Container wide className="py-10">
      <h1 className="text-[32px] leading-tight font-normal tracking-[-0.025em]">Assessments</h1>
      <p className="mt-1 text-[15px] text-muted">Build an assessment from library questions, then invite candidates by email.</p>

      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <form onSubmit={save} noValidate className="grid grid-cols-[minmax(0,1fr)] gap-5">
            <CardHeader title="New assessment" sub="Your draft saves as you go" />
            <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Backend screen, autumn" error={errors.name} />
            <div className="grid gap-5 sm:grid-cols-2">
              <Select label="Role" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })}>
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </Select>
              <Select label="Time limit" value={String(draft.minutes)} onChange={(e) => setDraft({ ...draft, minutes: Number(e.target.value) })} error={errors.minutes}>
                {[30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </Select>
            </div>
            <Switch label="Allow the pair assistant" checked={draft.aiAllowed} onChange={(v) => setDraft({ ...draft, aiAllowed: v })} />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-[14px] font-medium">Questions</h3>
                <span className="text-[13px] text-muted">{plural(questions.length, 'question')}, {total} min</span>
              </div>
              {questions.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-line-strong px-4 py-6 text-center text-[14px] text-muted">No questions yet.</div>
              ) : (
                <ol className="flex flex-col gap-2">
                  {questions.map((q, i) => (
                    <li key={q.id} className="flex items-center gap-3 rounded-[14px] bg-surface-2 py-2 pr-2 pl-4 ring-1 ring-inset ring-line">
                      <span className="w-4 text-[13px] text-faint tabular-nums">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14.5px]">{q.title}</p>
                        <p className="text-[12.5px] text-muted">
                          {q.type}, {q.minutes} min
                        </p>
                      </div>
                      <Badge tone={difficultyTone[q.difficulty]} className="hidden sm:inline-flex">{q.difficulty}</Badge>
                      <IconButton size="sm" label={`Move ${q.title} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                        <ArrowUp className="size-4" />
                      </IconButton>
                      <IconButton size="sm" label={`Move ${q.title} down`} disabled={i === questions.length - 1} onClick={() => move(i, 1)}>
                        <ArrowDown className="size-4" />
                      </IconButton>
                      <IconButton size="sm" label={`Remove ${q.title}`} onClick={() => setDraft({ ...draft, questionIds: draft.questionIds.filter((x) => x !== q.id) })}>
                        <X className="size-4" />
                      </IconButton>
                    </li>
                  ))}
                </ol>
              )}
              {errors.questions && (
                <p role="alert" className="mt-2 text-[13px] text-danger">
                  {errors.questions}
                </p>
              )}
              <ButtonLink href="/library" variant="ghost" icon={<Plus className="size-4" />} className="mt-2 -ml-2">
                Add from library
              </ButtonLink>
            </div>
            <div className="flex justify-end gap-2 border-t pt-5">
              <Button variant="ghost" onClick={() => { setDraft({ ...EMPTY_DRAFT, questionIds: [] }); setErrors({}) }}>
                Clear
              </Button>
              <Button type="submit">Save assessment</Button>
            </div>
          </form>
        </Card>

        <div className="grid gap-4">
          <h2 className="text-[17px] font-medium">Saved</h2>
          {saved.length === 0 ? (
            <EmptyState icon={<ClipboardList className="size-5" />} title="No saved assessments" body="Save the draft on the left and it appears here, ready to send." />
          ) : (
            saved.map((a) => (
              <Card key={a.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[16.5px] font-medium">{a.name}</h3>
                    <p className="text-[13.5px] text-muted">
                      {a.role}, created {formatDate(a.createdAt)}
                    </p>
                  </div>
                  <IconButton size="sm" label={`Delete ${a.name}`} onClick={() => setRemove(a)}>
                    <Trash2 className="size-4" />
                  </IconButton>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge>{plural(a.questionIds.length, 'question')}</Badge>
                  <Badge>
                    <Clock aria-hidden className="size-3" /> {a.minutes} min
                  </Badge>
                  {a.aiAllowed && (
                    <Badge tone="brand">
                      <Sparkles aria-hidden className="size-3" /> Assistant on
                    </Badge>
                  )}
                  <Badge tone={a.invited.length ? 'info' : 'neutral'}>{plural(a.invited.length, 'invite')}</Badge>
                </div>
                <Button variant="secondary" size="sm" className="mt-4" icon={<Mail className="size-3.5" />} onClick={() => setInvite(a)}>
                  Invite candidates
                </Button>
              </Card>
            ))
          )}
        </div>
      </div>

      <InviteModal assessment={invite} onClose={() => setInvite(null)} onSent={(a, emails) => setSaved((s) => s.map((x) => (x.id === a.id ? { ...x, invited: [...new Set([...x.invited, ...emails])] } : x)))} />
      <Modal open={!!remove} onClose={() => setRemove(null)} title={`Delete ${remove?.name ?? ''}?`} description="Candidates who already have a link can still finish. This cannot be undone.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setRemove(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setSaved((s) => s.filter((x) => x.id !== remove!.id))
              toast(`Deleted ${remove!.name}.`)
              setRemove(null)
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </Container>
  )
}

function InviteModal({ assessment, onClose, onSent }: { assessment: Assessment | null; onClose: () => void; onSent: (a: Assessment, emails: string[]) => void }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const close = () => {
    setText('')
    setError('')
    onClose()
  }
  const send = async (e: FormEvent) => {
    e.preventDefault()
    if (!assessment) return
    const emails = text.split(/[\s,;]+/).filter(Boolean)
    const v = validateInvites({ assessment: assessment.name, emails })
    if (!v.ok) return setError(Object.values(v.errors)[0]!)
    setBusy(true)
    setError('')
    try {
      const r = await post<{ sent: number; emails: string[] }>('/api/invites', { assessment: assessment.name, emails })
      onSent(assessment, r.emails)
      toast(`Sent ${plural(r.sent, 'invitation')} for ${assessment.name}.`)
      close()
    } catch (err) {
      setError(err instanceof ApiError ? (Object.values(err.fields)[0] ?? err.message) : 'Could not send. Try again.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Modal open={!!assessment} onClose={close} title="Invite candidates" description={assessment ? `${assessment.name}, ${assessment.minutes} minutes. Each candidate gets a private link.` : undefined}>
      <form onSubmit={send} noValidate className="grid gap-4">
        <Textarea label="Email addresses" value={text} onChange={(e) => setText(e.target.value)} placeholder={'ada@example.com\ngrace@example.com'} error={error} hint="Separate with commas or new lines, up to 25 at a time." />
        {assessment && assessment.invited.length > 0 && <Notice>{plural(assessment.invited.length, 'candidate')} already invited.</Notice>}
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={busy} icon={<Mail className="size-4" />}>
            Send invitations
          </Button>
        </div>
      </form>
    </Modal>
  )
}
