import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { Button } from '../../components/Button'
import { Field, Input, Select, Textarea } from '../../components/Field'
import { Modal } from '../../components/Modal'
import { TagInput } from '../../components/TagInput'
import { useToast } from '../../components/Toast'
import { KINDS } from '../../content'
import type { Kind } from '../../content'
import { shortDate } from '../../lib/dates'
import { guessFromUrl, isValidUrl, normaliseUrl, useLibrary } from '../../lib/library'
import { Link, navigate } from '../../lib/router'
import { tagVocabulary } from '../../lib/search'

type Errors = Partial<Record<'url' | 'title' | 'why', string>>

/** Save a link: URL (title and type guessed from it), a line of why, tags, collection. */
export function SaveDialog({ open, onClose, collectionId }: { open: boolean; onClose: () => void; collectionId?: string | null }) {
  const lib = useLibrary()
  const toast = useToast()
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)
  const [why, setWhy] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [col, setCol] = useState<string>('')
  const [kind, setKind] = useState<Kind>('article')
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setUrl('')
    setTitle('')
    setTitleTouched(false)
    setWhy('')
    setTags([])
    setCol(collectionId ?? '')
    setKind('article')
    setErrors({})
    setBusy(false)
  }, [open, collectionId])

  const vocab = useMemo(() => tagVocabulary(lib.items), [lib.items])
  const duplicate = useMemo(() => {
    if (!isValidUrl(url)) return null
    const n = normaliseUrl(url).replace(/\/$/, '')
    return lib.items.find((i) => i.url.replace(/\/$/, '') === n) ?? null
  }, [url, lib.items])

  const onUrl = (v: string) => {
    setUrl(v)
    if (errors.url) setErrors((e) => ({ ...e, url: undefined }))
    if (isValidUrl(v)) {
      const g = guessFromUrl(normaliseUrl(v))
      if (!titleTouched) setTitle(g.title)
      setKind(g.kind)
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (!url.trim()) next.url = 'Paste the link you want to keep.'
    else if (!isValidUrl(url)) next.url = 'That does not look like a link. Try https://…'
    if (!title.trim()) next.title = 'Give it a title you would recognise.'
    if (why.trim().length < 3) next.why = 'One line of why is what makes it findable later.'
    setErrors(next)
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0]
      document.getElementById(`save-${first}`)?.focus()
      return
    }
    setBusy(true)
    // A real app would unfurl the page here; the pause shows the loading state.
    window.setTimeout(() => {
      const item = lib.addItem({ url, title, why, tags, collectionId: col || null, kind })
      setBusy(false)
      onClose()
      const where = col ? lib.collections.find((c) => c.id === col)?.name : 'My shelf'
      toast(`Saved to ${where}`, { label: 'View', onClick: () => navigate(`/app/item/${item.id}`) })
    }, 450)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save a link"
      description="Paste it, say why, and get on with your day."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="save-form" variant="lime" loading={busy}>
            {busy ? 'Saving' : 'Save to shelf'}
          </Button>
        </>
      }
    >
      <form id="save-form" onSubmit={submit} noValidate className="flex flex-col gap-5">
        <Field id="save-url" label="Link" error={errors.url} hint={duplicate ? undefined : 'Articles, images, videos, products, typefaces, tools.'}>
          {({ id, describedBy, invalid }) => (
            <Input id={id} type="url" inputMode="url" value={url} onChange={(e) => onUrl(e.target.value)} placeholder="https://" aria-invalid={invalid} aria-describedby={describedBy} autoComplete="off" />
          )}
        </Field>
        {duplicate && (
          <p className="-mt-3 rounded-md bg-lime-soft px-3 py-2 text-[14px] text-leaf" role="status">
            You already saved this on {shortDate(duplicate.savedAt)}.{' '}
            <Link href={`/app/item/${duplicate.id}`} onClick={onClose} className="font-semibold underline underline-offset-2">
              Open it
            </Link>
          </p>
        )}
        <Field id="save-title" label="Title" error={errors.title}>
          {({ id, describedBy, invalid }) => (
            <Input id={id}
             
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setTitleTouched(true)
                if (errors.title) setErrors((x) => ({ ...x, title: undefined }))
              }}
              aria-invalid={invalid}
              aria-describedby={describedBy}
              maxLength={120}
            />
          )}
        </Field>
        <Field id="save-why" label="Why you saved it" error={errors.why} hint="Future you will search for this sentence.">
          {({ id, describedBy, invalid }) => (
            <Textarea id={id}
             
              value={why}
              onChange={(e) => {
                setWhy(e.target.value)
                if (errors.why) setErrors((x) => ({ ...x, why: undefined }))
              }}
              placeholder="For the pricing page hero"
              aria-invalid={invalid}
              aria-describedby={describedBy}
              maxLength={280}
            />
          )}
        </Field>
        <TagInput value={tags} onChange={setTags} suggestions={vocab} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="save-collection" label="Collection">
            {({ id }) => (
              <Select id={id} value={col} onChange={(e) => setCol(e.target.value)}>
                <option value="">None (My shelf)</option>
                {lib.collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <Field id="save-kind" label="Type">
            {({ id }) => (
              <Select id={id} value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
                {(Object.keys(KINDS) as Kind[]).map((k) => (
                  <option key={k} value={k}>
                    {KINDS[k]}
                  </option>
                ))}
              </Select>
            )}
          </Field>
        </div>
      </form>
    </Modal>
  )
}
