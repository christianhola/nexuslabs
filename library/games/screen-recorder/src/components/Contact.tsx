import { Check } from 'lucide-react'
import { createContext, type FormEvent, type ReactNode, useCallback, useContext, useState } from 'react'

import { Button } from './Button'
import { Modal } from './Modal'
import { Input, TextArea } from './ui'

const Ctx = createContext<() => void>(() => {})
/** Opens the "Talk to us" dialog from anywhere. */
export const useContact = () => useContext(Ctx)

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string; field?: 'email' | 'message' }

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const show = useCallback(() => {
    setStatus({ kind: 'idle' })
    setOpen(true)
  }, [])

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) })
      const body = (await res.json().catch(() => ({}))) as { error?: string; field?: 'email' | 'message' }
      if (!res.ok) return setStatus({ kind: 'error', message: body.error ?? 'Something went wrong. Try again.', field: body.field })
      setStatus({ kind: 'sent' })
    } catch {
      setStatus({ kind: 'error', message: 'You look offline. Check your connection and try again.' })
    }
  }

  const err = status.kind === 'error' ? status : null

  return (
    <Ctx.Provider value={show}>
      {children}
      <Modal open={open} onClose={() => setOpen(false)} title="Talk to us" width={480}>
        {status.kind === 'sent' ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-ok-bg text-ok">
              <Check className="size-6" />
            </span>
            <p className="text-lg font-medium">Thanks, we’ll be in touch</p>
            <p className="mt-1 text-sm text-muted">Someone from the team replies within one working day.</p>
            <Button className="mt-6" variant="secondary" onClick={() => setOpen(false)} data-autofocus>
              Close
            </Button>
          </div>
        ) : (
          <form className="space-y-4 p-5" onSubmit={submit} noValidate>
            <p className="text-sm text-muted">Tell us about your team. We’ll set up a walkthrough with your own recordings.</p>
            <Input label="Name" name="name" autoComplete="name" placeholder="Alex Rivera" />
            <Input label="Work email" name="email" type="email" autoComplete="email" placeholder="alex@company.com" error={err?.field === 'email' ? err.message : null} />
            <TextArea label="What do you want to explain better?" name="message" placeholder="Design reviews, onboarding, bug reports…" error={err?.field === 'message' ? err.message : null} />
            {err && !err.field && (
              <p role="alert" className="text-[13px] text-ember-text">
                {err.message}
              </p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" loading={status.kind === 'sending'}>
                Send
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </Ctx.Provider>
  )
}
