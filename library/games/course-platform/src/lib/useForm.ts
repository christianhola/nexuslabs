import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

import { postJson } from './api'

/*
  One form hook for every Worker-backed form: values, client validation with
  the shared rules (src/lib/validate.ts), the POST, server field errors and
  a status of idle | submitting | success | error. On a failed submit focus
  moves to the first invalid field.
*/
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function useForm<T extends Record<string, unknown>, R = unknown>({
  initial,
  validate,
  url,
  onSuccess,
}: {
  initial: T
  validate: (v: T) => Partial<Record<keyof T, string>>
  url: string
  onSuccess?: (data: R, values: T) => void
}) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<R | null>(null)
  const form = useRef<HTMLFormElement>(null)

  const focusFirst = () =>
    requestAnimationFrame(() => {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    })

  const set = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    if (status === 'submitting') return
    const local = validate(values)
    const bad = Object.values(local).some(Boolean)
    setErrors(local)
    if (bad) {
      setStatus('error')
      setMessage('Check the highlighted fields.')
      focusFirst()
      return
    }
    setStatus('submitting')
    setMessage('')
    const res = await postJson<R>(url, values)
    if (res.ok) {
      setStatus('success')
      setResult(res.data)
      onSuccess?.(res.data, values)
    } else {
      setStatus('error')
      setMessage(res.error)
      if (res.errors) {
        setErrors(res.errors as Partial<Record<keyof T, string>>)
        focusFirst()
      }
    }
  }

  const reset = () => {
    setValues(initial)
    setErrors({})
    setStatus('idle')
    setMessage('')
    setResult(null)
  }

  return { values, set, errors, status, message, result, submit, reset, form }
}
