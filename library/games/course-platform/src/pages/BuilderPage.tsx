import { AnimatePresence, motion } from 'motion/react'
import { BookOpen, Check, Copy, Eye, FolderPlus, Lock, PencilLine, Plus, Radio, RotateCcw, Trash2, Unlock } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button, IconButton } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Select, Textarea, control } from '../components/Field'
import { LessonTypeIcon } from '../components/LessonTypeIcon'
import { Modal } from '../components/Modal'
import { Notice } from '../components/Notice'
import { Segmented } from '../components/Segmented'
import { SortableList } from '../components/SortableList'
import { useToast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { images, lessonTypes, seedCourse } from '../content'
import type { Course, Lesson, LessonType, Module } from '../content'
import { postJson } from '../lib/api'
import { copyText } from '../lib/clipboard'
import { cx } from '../lib/cx'
import { Link } from '../lib/router'
import { useStored } from '../lib/storage'
import { validatePublish } from '../lib/validate'

/*
  The live course builder. The whole outline is kept in this browser
  (localStorage key coursekit:course): drag modules and lessons by their
  grips (or focus a grip and use the arrow keys), edit a lesson on the
  right, preview it as a learner, run a live quiz and publish through
  /api/courses/publish.
*/
const uid = () => Math.random().toString(36).slice(2, 9)
const quizCode = () => Array.from({ length: 6 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('')

export function BuilderPage() {
  const [course, setCourse] = useStored<Course>('course', seedCourse)
  const [selectedId, setSelectedId] = useStored<string | null>('builder-selected', 'l2')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [publishing, setPublishing] = useState(false)
  const toast = useToast()

  const all = useMemo(() => course.modules.flatMap((m) => m.lessons.map((l) => ({ ...l, moduleId: m.id }))), [course])
  const selected = all.find((l) => l.id === selectedId) ?? null
  const totals = { modules: course.modules.length, lessons: all.length, minutes: all.reduce((n, l) => n + l.minutes, 0), free: all.filter((l) => l.free).length }

  const update = (fn: (c: Course) => Course) => setCourse((c) => ({ ...fn(c), status: c.status === 'published' ? 'published' : 'draft' }))
  const setModules = (modules: Module[]) => update((c) => ({ ...c, modules }))
  const patchModule = (id: string, patch: Partial<Module>) => setModules(course.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  const patchLesson = (id: string, patch: Partial<Lesson>) => setModules(course.modules.map((m) => ({ ...m, lessons: m.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)) })))

  const addLesson = (moduleId: string) => {
    const l: Lesson = { id: uid(), title: 'Untitled lesson', type: 'video', minutes: 5, free: false, body: '' }
    setModules(course.modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...m.lessons, l] } : m)))
    setSelectedId(l.id)
    setMode('edit')
    requestAnimationFrame(() => document.querySelector<HTMLInputElement>('[data-lesson-title]')?.focus())
  }
  const addModule = () => {
    const m: Module = { id: uid(), title: `Module ${course.modules.length + 1}`, lessons: [] }
    setModules([...course.modules, m])
    requestAnimationFrame(() => document.getElementById(`module-${m.id}`)?.focus())
  }
  const removeLesson = (id: string) => {
    const before = course.modules
    const l = all.find((x) => x.id === id)
    setModules(course.modules.map((m) => ({ ...m, lessons: m.lessons.filter((x) => x.id !== id) })))
    if (selectedId === id) setSelectedId(null)
    toast(`Deleted “${l?.title ?? 'lesson'}”`, {
      action: {
        label: 'Undo',
        run: () => {
          setModules(before)
          setSelectedId(id)
        },
      },
    })
  }
  const removeModule = (id: string) => {
    const before = course.modules
    const m = course.modules.find((x) => x.id === id)
    setModules(course.modules.filter((x) => x.id !== id))
    if (m?.lessons.some((l) => l.id === selectedId)) setSelectedId(null)
    toast(`Deleted module “${m?.title ?? ''}”`, { action: { label: 'Undo', run: () => setModules(before) } })
  }
  const moveLesson = (id: string, toModule: string) => {
    const l = all.find((x) => x.id === id)
    if (!l || l.moduleId === toModule) return
    const { moduleId: _from, ...lesson } = l
    void _from
    setModules(course.modules.map((m) => (m.id === toModule ? { ...m, lessons: [...m.lessons.filter((x) => x.id !== id), lesson] } : { ...m, lessons: m.lessons.filter((x) => x.id !== id) })))
    toast(`Moved to ${course.modules.find((m) => m.id === toModule)?.title}`)
  }
  const reset = () => {
    const before = course
    setCourse(seedCourse)
    setSelectedId('l2')
    toast('Demo course restored', { action: { label: 'Undo', run: () => setCourse(before) } })
  }

  return (
    <div className="bg-canvas pb-20">
      <div className="border-b border-line bg-paper">
        <Container className="flex flex-col gap-4 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <nav aria-label="Breadcrumb" className="text-[13.5px] text-muted">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link href="/analytics" className="rounded-[4px] hover:text-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
                    Courses
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="truncate text-ink">
                  Builder
                </li>
              </ol>
            </nav>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <h1 className="sr-only">Course builder</h1>
              <label htmlFor="course-title" className="sr-only">
                Course title
              </label>
              <input
                id="course-title"
                value={course.title}
                onChange={(e) => update((c) => ({ ...c, title: e.target.value }))}
                className="-ml-2 h-12 min-w-0 max-w-full rounded-[10px] border border-transparent bg-transparent px-2 font-display text-[26px] font-medium tracking-[-0.02em] text-ink hover:border-line-strong focus:border-flame-strong focus:outline-none focus:ring-4 focus:ring-flame/20 [field-sizing:content] sm:min-w-[240px] sm:text-[30px]"
              />
              <Badge tone={course.status === 'published' ? 'ok' : 'warn'} size="md" dot>
                {course.status === 'published' ? 'Published' : 'Draft'}
              </Badge>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented label="Builder mode" tone="white" size="sm" value={mode} onChange={setMode} options={[{ value: 'edit', label: 'Edit' }, { value: 'preview', label: 'Learner preview' }]} />
            <Button variant="ghost" icon={<RotateCcw className="size-4" aria-hidden />} onClick={reset}>
              Reset demo
            </Button>
            <Button onClick={() => setPublishing(true)} icon={<Radio className="size-4" aria-hidden />}>
              {course.status === 'published' ? 'Publish changes' : 'Publish'}
            </Button>
          </div>
        </Container>
      </div>

      <Container className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[380px_1fr]">
        <section aria-labelledby="outline-title" className="lg:sticky lg:top-[120px]">
          <Card pad="none" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
              <h2 id="outline-title" className="font-display text-[16px] font-medium text-ink">
                Outline
              </h2>
              <p className="text-[13px] text-muted">
                {totals.modules} modules, {totals.lessons} lessons, {totals.minutes} min
              </p>
            </div>
            {course.modules.length === 0 ? (
              <div className="p-4">
                <EmptyState icon={<BookOpen />} title="Start your outline" body="Add a module, then drop lessons into it." action={<Button onClick={addModule} icon={<FolderPlus className="size-4" aria-hidden />}>Add module</Button>} />
              </div>
            ) : (
              <SortableList
                items={course.modules}
                onChange={setModules}
                label="Modules"
                itemLabel={(m) => m.title}
                className="divide-y divide-line"
                itemClassName="items-start px-2 py-2"
                render={(m, mi) => (
                  <ModuleBlock
                    module={m}
                    index={mi}
                    selectedId={selectedId}
                    onSelect={(id) => {
                      setSelectedId(id)
                    }}
                    onRename={(title) => patchModule(m.id, { title })}
                    onLessons={(lessons) => patchModule(m.id, { lessons })}
                    onAdd={() => addLesson(m.id)}
                    onRemove={() => removeModule(m.id)}
                  />
                )}
              />
            )}
            <div className="border-t border-line p-3">
              <Button variant="soft" className="w-full" onClick={addModule} icon={<FolderPlus className="size-4" aria-hidden />}>
                Add module
              </Button>
            </div>
          </Card>
          <p className="mt-3 px-1 text-[13px] text-faint">Drag the grips to reorder. With a keyboard, focus a grip and press the arrow keys.</p>
        </section>

        <div className="flex min-w-0 flex-col gap-6">
          <AnimatePresence mode="wait" initial={false}>
            {!selected ? (
              <motion.div key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState icon={<PencilLine />} title="Pick a lesson to edit" body="Choose a lesson in the outline, or add a new one to a module." />
              </motion.div>
            ) : mode === 'edit' ? (
              <motion.div key={'e' + selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <LessonEditor lesson={selected} moduleId={selected.moduleId} modules={course.modules} onPatch={(p) => patchLesson(selected.id, p)} onMove={(to) => moveLesson(selected.id, to)} onDelete={() => removeLesson(selected.id)} />
              </motion.div>
            ) : (
              <motion.div key={'p' + selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <LessonPreview lesson={selected} course={course} all={all} onPick={setSelectedId} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card>
              <h2 className="font-display text-[17px] font-medium text-ink">Pricing</h2>
              <p className="mt-1 text-[14px] text-muted">What learners pay on your storefront.</p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[130px_1fr]">
                <Field label="Price (USD)" hint="0 makes the course free.">
                  {(ctl) => (
                    <Input {...ctl} type="number" min={0} max={10000} inputMode="numeric" value={Number.isFinite(course.price) ? course.price : ''} onChange={(e) => update((c) => ({ ...c, price: e.target.value === '' ? NaN : Number(e.target.value) }))} />
                  )}
                </Field>
                <Field label="Subtitle">
                  {(ctl) => <Input {...ctl} value={course.subtitle} onChange={(e) => update((c) => ({ ...c, subtitle: e.target.value }))} />}
                </Field>
              </div>
              <p className="mt-4 text-[13.5px] text-muted">
                {totals.free} free preview {totals.free === 1 ? 'lesson' : 'lessons'}. Learners can watch these before they buy.
              </p>
            </Card>
            <LiveQuizzes lessons={all.filter((l) => l.type === 'quiz')} onPick={(id) => { setSelectedId(id); setMode('edit') }} />
          </div>
        </div>
      </Container>

      <PublishDialog
        open={publishing}
        onClose={() => setPublishing(false)}
        course={course}
        onPublished={(at) => {
          setCourse((c) => ({ ...c, status: 'published', publishedAt: at }))
          toast('Course published to your storefront')
        }}
      />
    </div>
  )
}

function ModuleBlock({
  module: m,
  index,
  selectedId,
  onSelect,
  onRename,
  onLessons,
  onAdd,
  onRemove,
}: {
  module: Module
  index: number
  selectedId: string | null
  onSelect: (id: string) => void
  onRename: (t: string) => void
  onLessons: (l: Lesson[]) => void
  onAdd: () => void
  onRemove: () => void
}) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1">
        <label htmlFor={`module-${m.id}`} className="sr-only">
          Module {index + 1} title
        </label>
        <span className="shrink-0 text-[12px] text-faint">{index + 1}.</span>
        <input
          id={`module-${m.id}`}
          value={m.title}
          onChange={(e) => onRename(e.target.value)}
          placeholder="Module title"
          className="h-10 min-w-0 flex-1 rounded-[8px] border border-transparent bg-transparent px-1.5 font-display text-[15px] font-medium text-ink placeholder:text-faint hover:border-line-strong focus:border-flame-strong focus:outline-none focus:ring-2 focus:ring-flame/20"
        />
        <IconButton label={`Add a lesson to ${m.title || 'this module'}`} size="sm" onClick={onAdd}>
          <Plus />
        </IconButton>
        <IconButton label={`Delete module ${m.title}`} size="sm" onClick={onRemove}>
          <Trash2 />
        </IconButton>
      </div>
      {m.lessons.length === 0 ? (
        <button type="button" onClick={onAdd} className="mb-1 mt-1 flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] border border-dashed border-line-strong text-[13.5px] text-muted hover:border-flame-strong hover:text-flame-ink focus-visible:outline-2 focus-visible:outline-flame-strong">
          <Plus className="size-4" aria-hidden />
          No lessons yet. Add the first one
        </button>
      ) : (
        <SortableList
          items={m.lessons}
          onChange={onLessons}
          label={`Lessons in ${m.title}`}
          itemLabel={(l) => l.title}
          className="mt-0.5 gap-0.5"
          itemClassName={(l) => cx('rounded-[10px] pr-1', l.id === selectedId ? 'bg-flame-soft' : 'hover:bg-wash')}
          render={(l) => (
            <button
              type="button"
              onClick={() => onSelect(l.id)}
              aria-current={l.id === selectedId ? 'true' : undefined}
              className="flex min-h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[8px] py-1.5 pr-1 text-left focus-visible:outline-2 focus-visible:outline-flame-strong"
            >
              <LessonTypeIcon type={l.type} />
              <span className={cx('min-w-0 flex-1 truncate text-[14px]', l.id === selectedId ? 'font-medium text-ink' : 'text-body')}>{l.title || 'Untitled lesson'}</span>
              {l.free ? <Badge tone="flame" size="xs">Free</Badge> : null}
              <span className="w-11 text-right text-[12.5px] tabular-nums text-faint">{l.minutes} min</span>
            </button>
          )}
        />
      )}
    </div>
  )
}

function LessonEditor({ lesson, moduleId, modules, onPatch, onMove, onDelete }: { lesson: Lesson; moduleId: string; modules: Module[]; onPatch: (p: Partial<Lesson>) => void; onMove: (to: string) => void; onDelete: () => void }) {
  const titleError = !lesson.title.trim() ? 'Give the lesson a title.' : undefined
  return (
    <Card pad="lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <LessonTypeIcon type={lesson.type} className="size-10 rounded-[11px] [&_svg]:size-5" />
          <div>
            <p className="text-[13px] text-muted">Editing lesson</p>
            <h2 className="font-display text-[20px] font-medium tracking-[-0.015em] text-ink">{lesson.title || 'Untitled lesson'}</h2>
          </div>
        </div>
        <Button variant="ghost" onClick={onDelete} icon={<Trash2 className="size-4" aria-hidden />} className="text-bad hover:bg-bad-soft">
          Delete
        </Button>
      </div>
      <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Lesson title" error={titleError} className="sm:col-span-2">
          {(ctl) => <Input {...ctl} data-lesson-title value={lesson.title} onChange={(e) => onPatch({ title: e.target.value })} />}
        </Field>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <span className="font-display text-[14px] font-medium text-ink">
            Lesson type
          </span>
          <Segmented<LessonType> label="Lesson type" tone="white" value={lesson.type} onChange={(type) => onPatch({ type })} options={lessonTypes} className="w-fit max-w-full flex-wrap" />
        </div>
        <Field label="Length (minutes)">
          {(ctl) => <Input {...ctl} type="number" min={1} max={240} value={lesson.minutes} onChange={(e) => onPatch({ minutes: Math.max(1, Math.min(240, Number(e.target.value) || 1)) })} />}
        </Field>
        <Field label="Module">
          {(ctl) => (
            <Select {...ctl} value={moduleId} onChange={(e) => onMove(e.target.value)}>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title || 'Untitled module'}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field label={lesson.type === 'quiz' ? 'Instructions' : lesson.type === 'assignment' ? 'Brief' : 'Lesson notes'} hint={`${lesson.body.length} / 1,000`} className="sm:col-span-2">
          {(ctl) => <Textarea {...ctl} maxLength={1000} value={lesson.body} onChange={(e) => onPatch({ body: e.target.value })} placeholder="What will learners do or take away?" />}
        </Field>
      </div>
      <div className="mt-5 flex items-center justify-between rounded-[12px] bg-wash p-3 pl-4">
        <span className="flex items-center gap-2.5 text-[14px] text-body">
          {lesson.free ? <Unlock className="size-4 text-flame-ink" aria-hidden /> : <Lock className="size-4 text-faint" aria-hidden />}
          Free preview: anyone can watch this before buying
        </span>
        <Toggle checked={lesson.free} onChange={(free) => onPatch({ free })} label="Free preview" showLabel={false} />
      </div>
    </Card>
  )
}

function LessonPreview({ lesson, course, all, onPick }: { lesson: Lesson; course: Course; all: (Lesson & { moduleId: string })[]; onPick: (id: string) => void }) {
  const i = all.findIndex((l) => l.id === lesson.id)
  const prev = all[i - 1]
  const next = all[i + 1]
  return (
    <Card pad="none" className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-line px-5 py-3 text-[13px] text-muted">
        <span className="flex items-center gap-2">
          <Eye className="size-4" aria-hidden /> Learner view
        </span>
        <span>
          Lesson {i + 1} of {all.length}
        </span>
      </div>
      {lesson.type === 'video' ? (
        <div className="relative aspect-video bg-night">
          <img src={images.creatorStudio} alt="" className="size-full object-cover opacity-80" />
          <span className="round absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-flame-ink shadow-float" aria-hidden>
            <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-current"><path d="M7 4v16l13-8z" /></svg>
          </span>
          <span className="absolute bottom-3 right-3 rounded-[6px] bg-black/60 px-2 py-1 text-[12px] text-white">{lesson.minutes}:00</span>
        </div>
      ) : null}
      <div className="p-6 sm:p-8">
        <p className="text-[13px] text-flame-ink">{course.title}</p>
        <h2 className="mt-1 font-display text-[26px] font-medium tracking-[-0.02em] text-ink">{lesson.title || 'Untitled lesson'}</h2>
        <p className="mt-3 max-w-[640px] text-[15.5px] leading-relaxed text-body">{lesson.body || 'This lesson has no notes yet. Switch to Edit to add some.'}</p>
        {lesson.type === 'quiz' ? <Notice className="mt-5" title="Quiz">Learners answer here, or join live with a code when you run it as a session.</Notice> : null}
        {lesson.type === 'assignment' ? <Notice className="mt-5" title="Assignment">Learners upload their work and share it in the course group for feedback.</Notice> : null}
        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <Button variant="outline" disabled={!prev} onClick={() => prev && onPick(prev.id)}>
            Previous
          </Button>
          <Button disabled={!next} onClick={() => next && onPick(next.id)} icon={<Check className="size-4" aria-hidden />}>
            Complete and continue
          </Button>
        </div>
      </div>
    </Card>
  )
}

function LiveQuizzes({ lessons, onPick }: { lessons: Lesson[]; onPick: (id: string) => void }) {
  const [codes, setCodes] = useStored<Record<string, string>>('quiz-codes', {})
  const [copied, setCopied] = useState<string | null>(null)
  const toast = useToast()
  const copy = async (code: string) => {
    if (await copyText(code)) {
      setCopied(code)
      window.setTimeout(() => setCopied(null), 1600)
    } else toast('Copy is blocked here. Select the code instead.')
  }
  return (
    <Card id="quizzes">
      <h2 className="font-display text-[17px] font-medium text-ink">Live quizzes</h2>
      <p className="mt-1 text-[14px] text-muted">Start a session and share the code. Learners join from any device.</p>
      {lessons.length === 0 ? (
        <p className="mt-4 rounded-[12px] bg-wash p-4 text-[14px] text-muted">No quiz lessons yet. Set a lesson’s type to Quiz to run it live.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {lessons.map((l) => {
            const code = codes[l.id]
            return (
              <li key={l.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-line p-3">
                <button type="button" onClick={() => onPick(l.id)} className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-[8px] text-left focus-visible:outline-2 focus-visible:outline-flame-strong">
                  <LessonTypeIcon type="quiz" />
                  <span className="truncate text-[14px] text-ink">{l.title}</span>
                </button>
                {code ? (
                  <span className="flex items-center gap-1">
                    <span className={cx(control, 'inline-flex h-10 w-auto items-center font-mono tracking-[0.15em]')} aria-label={`Join code ${code.split('').join(' ')}`}>
                      {code}
                    </span>
                    <IconButton label={copied === code ? 'Copied' : 'Copy join code'} onClick={() => copy(code)}>
                      {copied === code ? <Check /> : <Copy />}
                    </IconButton>
                    <Button size="sm" variant="ghost" onClick={() => setCodes((c) => { const n = { ...c }; delete n[l.id]; return n })}>
                      End
                    </Button>
                  </span>
                ) : (
                  <Button size="sm" variant="soft" onClick={() => setCodes((c) => ({ ...c, [l.id]: quizCode() }))}>
                    Start session
                  </Button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function PublishDialog({ open, onClose, course, onPublished }: { open: boolean; onClose: () => void; course: Course; onPublished: (at: string) => void }) {
  const [state, setState] = useState<{ s: 'idle' | 'loading' | 'done' | 'error'; msg?: string; url?: string }>({ s: 'idle' })
  const go = useRef<HTMLButtonElement>(null)
  const problems = validatePublish(course)
  const close = () => {
    onClose()
    window.setTimeout(() => setState({ s: 'idle' }), 250)
  }
  const publish = async () => {
    setState({ s: 'loading' })
    const res = await postJson<{ url: string; publishedAt: string }>('/api/courses/publish', course)
    if (res.ok) {
      setState({ s: 'done', url: res.data.url })
      onPublished(res.data.publishedAt)
    } else setState({ s: 'error', msg: res.error })
  }
  const lessons = course.modules.reduce((n, m) => n + m.lessons.length, 0)
  return (
    <Modal open={open} onClose={close} title={state.s === 'done' ? 'Your course is live' : 'Publish this course?'} description={state.s === 'done' ? 'Learners can find it on your storefront now.' : 'It goes on your storefront and enrolled learners get the update.'} initialFocus={problems.length ? undefined : go}>
      {state.s === 'done' ? (
        <div className="flex flex-col gap-4">
          <Notice tone="ok" title="Published">
            {course.title} is available at <span className="font-mono">coursekit.app{state.url}</span>
          </Notice>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              Keep editing
            </Button>
            <Button href="/storefront" onClick={close}>
              View storefront
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-2 rounded-[12px] bg-wash p-4 text-[14px]">
            <li className="flex justify-between"><span className="text-muted">Title</span><span className="max-w-[60%] truncate text-ink">{course.title || 'Untitled'}</span></li>
            <li className="flex justify-between"><span className="text-muted">Content</span><span className="text-ink">{course.modules.length} modules, {lessons} lessons</span></li>
            <li className="flex justify-between"><span className="text-muted">Price</span><span className="text-ink">{Number.isFinite(course.price) ? (course.price === 0 ? 'Free' : `$${course.price}`) : 'Not set'}</span></li>
          </ul>
          {problems.length ? (
            <Notice tone="bad" title="Fix these first">
              <ul className="list-disc pl-4">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Notice>
          ) : null}
          {state.s === 'error' ? <Notice tone="bad">{state.msg}</Notice> : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button ref={go} onClick={publish} loading={state.s === 'loading'} disabled={problems.length > 0}>
              Publish now
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
