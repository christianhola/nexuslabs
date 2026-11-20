import { Check, Clock, Laptop, PlayCircle, RotateCcw, Smartphone, Users } from 'lucide-react'
import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'

import { Avatar, Stars } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { Field, Input } from '../components/Field'
import { Modal } from '../components/Modal'
import { Notice } from '../components/Notice'
import { Segmented } from '../components/Segmented'
import { Toggle } from '../components/Toggle'
import { accentOptions, images, people, storefrontCourses, storefrontDefaults, testimonials } from '../content'
import type { StorefrontCourse } from '../content'
import { cx } from '../lib/cx'
import { useStored } from '../lib/storage'
import { useForm } from '../lib/useForm'
import { validateEnroll } from '../lib/validate'

/*
  Storefront designer: edit your school's shop on the left and see it on
  the right, on desktop or phone. Settings persist (coursekit:storefront).
  "Enroll" runs a demo checkout through /api/enroll; no payment is taken.
*/
type Settings = typeof storefrontDefaults

export function StorefrontPage() {
  const [s, setS] = useStored<Settings>('storefront', storefrontDefaults)
  const [device, setDevice] = useStored<'desktop' | 'mobile'>('storefront-device', 'desktop')
  const [buying, setBuying] = useState<StorefrontCourse | null>(null)
  const patch = (p: Partial<Settings>) => setS((x) => ({ ...x, ...p }))
  const accent = accentOptions.find((a) => a.hex === s.accent) ?? accentOptions[0]
  const slug = s.schoolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'your-school'

  return (
    <div className="bg-canvas pb-20">
      <div className="border-b border-line bg-paper">
        <Container className="py-8">
          <p className="text-[14px] text-flame-ink">Storefront</p>
          <h1 className="mt-1 font-display text-[34px] font-medium tracking-[-0.025em] text-ink">Your school, your brand</h1>
          <p className="mt-1 max-w-[620px] text-[15px] text-muted">Change the name, colour and layout and watch the shop update. This is what learners see at your own domain.</p>
        </Container>
      </div>
      <Container className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="lg:sticky lg:top-[120px]">
          <h2 className="font-display text-[17px] font-medium text-ink">Design</h2>
          <div className="mt-5 flex flex-col gap-5">
            <Field label="School name" error={s.schoolName.trim().length < 2 ? 'Use at least 2 characters.' : undefined}>
              {(ctl) => <Input {...ctl} maxLength={40} value={s.schoolName} onChange={(e) => patch({ schoolName: e.target.value })} />}
            </Field>
            <Field label="Headline" hint={`${s.headline.length} / 70`}>
              {(ctl) => <Input {...ctl} maxLength={70} value={s.headline} onChange={(e) => patch({ headline: e.target.value })} />}
            </Field>
            <fieldset>
              <legend className="font-display text-[14px] font-medium text-ink">Brand colour</legend>
              <div role="radiogroup" aria-label="Brand colour" className="mt-2 flex gap-2">
                {accentOptions.map((a) => (
                  <button
                    key={a.hex}
                    type="button"
                    role="radio"
                    aria-checked={a.hex === s.accent}
                    aria-label={a.name}
                    title={a.name}
                    onClick={() => patch({ accent: a.hex })}
                    className={cx('round grid size-10 place-items-center rounded-full ring-offset-2 transition-shadow focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flame-strong', a.hex === s.accent ? 'ring-2 ring-ink' : 'ring-1 ring-line')}
                    style={{ background: a.hex }}
                  >
                    {a.hex === s.accent ? <Check className="size-4 text-white" strokeWidth={3} aria-hidden /> : null}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <span className="font-display text-[14px] font-medium text-ink">Course layout</span>
              <Segmented label="Course layout" tone="white" size="sm" value={s.layout} onChange={(layout) => patch({ layout })} options={[{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'List' }]} className="w-fit" />
            </div>
            <div className="flex flex-col gap-1">
              <Toggle checked={s.showReviews} onChange={(showReviews) => patch({ showReviews })} label="Show reviews" />
              <Toggle checked={s.showInstructor} onChange={(showInstructor) => patch({ showInstructor })} label="Show instructor" />
            </div>
            <Button variant="ghost" onClick={() => setS(storefrontDefaults)} icon={<RotateCcw className="size-4" aria-hidden />} className="self-start">
              Reset design
            </Button>
          </div>
        </Card>

        <section aria-label="Storefront preview" className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="truncate text-[14px] text-muted">
              Preview of <span className="font-mono text-ink">{slug}.coursekit.app</span>
            </p>
            <Segmented
              label="Preview device"
              tone="white"
              size="sm"
              value={device}
              onChange={setDevice}
              options={[
                { value: 'desktop', label: 'Desktop' },
                { value: 'mobile', label: 'Phone' },
              ]}
            />
          </div>
          <div className={cx('mx-auto overflow-hidden border border-line bg-paper shadow-float transition-[max-width] duration-500 ease-[var(--ease-brand)]', device === 'mobile' ? 'max-w-[390px] rounded-[32px]' : 'max-w-full rounded-[var(--radius-card)]')}>
            <div className="flex items-center gap-2 border-b border-line bg-wash px-4 py-2.5" aria-hidden>
              {device === 'desktop' ? <Laptop className="size-4 text-faint" /> : <Smartphone className="size-4 text-faint" />}
              <span className="round mx-auto truncate rounded-full bg-card px-4 py-1 font-mono text-[12px] text-muted">{slug}.coursekit.app</span>
            </div>
            <Shop s={s} accent={accent} mobile={device === 'mobile'} onBuy={setBuying} />
          </div>
        </section>
      </Container>
      <Checkout course={buying} accent={accent} onClose={() => setBuying(null)} school={s.schoolName} />
    </div>
  )
}

function Shop({ s, accent, mobile, onBuy }: { s: Settings; accent: (typeof accentOptions)[number]; mobile: boolean; onBuy: (c: StorefrontCourse) => void }) {
  const vars = { '--sf': accent.hex, '--sf-strong': accent.strong } as CSSProperties
  const list = s.layout === 'list'
  const teacher = people[0]
  return (
    <div style={vars} className="@container">
      <div className="flex items-center justify-between px-6 py-4">
        <span className="font-display text-[17px] font-medium text-ink">{s.schoolName || 'Your school'}</span>
        <span className="text-[13px] text-muted">{storefrontCourses.length} courses</span>
      </div>
      <div className={cx('mx-4 rounded-[18px] px-6 py-10', mobile ? 'text-left' : 'text-center')} style={{ background: `color-mix(in srgb, ${accent.hex} 10%, white)` }}>
        <h2 className={cx('mx-auto max-w-[560px] text-balance font-display font-medium tracking-[-0.025em] text-ink', mobile ? 'text-[28px] leading-tight' : 'text-[38px] leading-[1.1]')}>{s.headline || 'Your headline here'}</h2>
        <p className={cx('mt-3 text-[15px] text-muted', !mobile && 'mx-auto max-w-[460px]')}>Hands-on courses with a community of makers. Start free with any preview lesson.</p>
      </div>
      <div className={cx('grid gap-4 p-4 sm:p-6', list || mobile ? 'grid-cols-1' : 'grid-cols-1 @[640px]:grid-cols-2 @[900px]:grid-cols-3')}>
        {storefrontCourses.map((c) => (
          <article key={c.id} className={cx('overflow-hidden rounded-[16px] border border-line bg-card', list && !mobile && 'flex')}>
            <img src={images.covers[c.cover]} alt="" className={cx('object-cover', list && !mobile ? 'h-auto w-[220px] shrink-0' : 'aspect-[3/2] w-full')} loading="lazy" />
            <div className="flex flex-1 flex-col p-4">
              <div className="flex items-center gap-2">
                <Badge tone={c.level === 'Expert' ? 'flame' : 'indigo'} size="xs">
                  {c.level}
                </Badge>
                <span className="flex items-center gap-1 text-[12.5px] text-muted">
                  <PlayCircle className="size-3.5" aria-hidden /> {c.lessons} lessons
                </span>
                <span className="flex items-center gap-1 text-[12.5px] text-muted">
                  <Clock className="size-3.5" aria-hidden /> {c.hours} h
                </span>
              </div>
              <h3 className="mt-2 font-display text-[17px] font-medium text-ink">{c.title}</h3>
              {s.showReviews ? (
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
                  <Stars value={c.rating} size={12} /> {c.rating} <span className="flex items-center gap-1"><Users className="size-3.5" aria-hidden />{c.students.toLocaleString('en-US')}</span>
                </p>
              ) : null}
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="font-display text-[20px] font-medium text-ink">${c.price}</span>
                <button
                  type="button"
                  onClick={() => onBuy(c)}
                  className="inline-flex h-10 items-center rounded-[10px] px-4 font-display text-[14px] font-medium text-white transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sf-strong)]"
                  style={{ background: 'var(--sf-strong)' }}
                  aria-label={`Enroll in ${c.title}`}
                >
                  Enroll
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {s.showInstructor ? (
        <div className="mx-4 mb-4 flex items-center gap-4 rounded-[16px] border border-line p-5 sm:mx-6 sm:mb-6">
          <Avatar src={teacher.src} name={teacher.name} size={56} ring={false} />
          <div>
            <p className="font-display text-[16px] font-medium text-ink">Taught by {teacher.name}</p>
            <p className="text-[14px] text-muted">Designer and potter. 12 years of teaching, 9,000 students.</p>
          </div>
        </div>
      ) : null}
      {s.showReviews ? (
        <figure className="mx-4 mb-6 rounded-[16px] p-5 sm:mx-6" style={{ background: `color-mix(in srgb, ${accent.hex} 8%, white)` }}>
          <Stars />
          <blockquote className="mt-2 text-[15px] text-ink">“{testimonials[2].quote}”</blockquote>
          <figcaption className="mt-2 text-[13px] text-muted">{people[2].name}</figcaption>
        </figure>
      ) : null}
    </div>
  )
}

function Checkout({ course, accent, onClose, school }: { course: StorefrontCourse | null; accent: (typeof accentOptions)[number]; onClose: () => void; school: string }) {
  const nameRef = useRef<HTMLInputElement>(null)
  const f = useForm<{ name: string; email: string; courseId: string; plan: string }, { order: string }>({
    initial: { name: '', email: '', courseId: '', plan: 'full' },
    url: '/api/enroll',
    validate: validateEnroll,
  })
  const close = () => {
    onClose()
    window.setTimeout(f.reset, 250)
  }
  const shown = course ?? storefrontCourses[0]
  if (course && f.values.courseId !== course.id) f.set('courseId', course.id)
  const instalment = Math.ceil(shown.price / 3)
  return (
    <Modal open={!!course} onClose={close} title={f.status === 'success' ? 'You are enrolled' : `Enroll in ${shown.title}`} description={f.status === 'success' ? undefined : `${school || 'Your school'}: demo checkout, no card is charged`} initialFocus={nameRef}>
      {f.status === 'success' ? (
        <div className="flex flex-col gap-4">
          <Notice tone="ok" title={`Order ${f.result?.order}`}>
            We sent a magic link to {f.values.email}. Lesson 1 is ready when you are.
          </Notice>
          <Button onClick={close} className="self-end">
            Done
          </Button>
        </div>
      ) : (
        <form ref={f.form} onSubmit={f.submit} noValidate className="flex flex-col gap-4">
          <Field label="Full name" error={f.errors.name}>
            {(ctl) => <Input {...ctl} ref={nameRef} autoComplete="name" value={f.values.name} onChange={(e) => f.set('name', e.target.value)} />}
          </Field>
          <Field label="Email" error={f.errors.email}>
            {(ctl) => <Input {...ctl} type="email" autoComplete="email" value={f.values.email} onChange={(e) => f.set('email', e.target.value)} />}
          </Field>
          <fieldset>
            <legend className="font-display text-[14px] font-medium text-ink">How do you want to pay?</legend>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {[
                { v: 'full', l: `Pay $${shown.price} once` },
                { v: 'plan', l: `3 payments of $${instalment}` },
              ].map((o) => (
                <label key={o.v} className={cx('flex min-h-12 cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 text-[14px] text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-flame-strong', f.values.plan === o.v ? 'border-flame-strong bg-flame-soft' : 'border-line-strong')}>
                  <input type="radio" name="plan" value={o.v} checked={f.values.plan === o.v} onChange={() => f.set('plan', o.v)} className="size-4 accent-[var(--color-flame-strong)]" />
                  {o.l}
                </label>
              ))}
            </div>
          </fieldset>
          {f.status === 'error' && f.message ? <Notice tone="bad">{f.message}</Notice> : null}
          <button
            type="submit"
            disabled={f.status === 'submitting'}
            className="mt-1 inline-flex h-12 items-center justify-center rounded-[10px] font-display text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flame-strong disabled:opacity-70"
            style={{ background: accent.strong }}
          >
            {f.status === 'submitting' ? 'Processing…' : f.values.plan === 'plan' ? `Pay $${instalment} today` : `Pay $${shown.price}`}
          </button>
        </form>
      )}
    </Modal>
  )
}
