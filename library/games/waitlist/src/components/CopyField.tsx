import { Check, Copy } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cx } from '../lib/cx'
import { Button, Input } from './ui'

/** Read-only value with a Copy button, e.g. a share link. */
export function CopyField({
  value,
  label,
  copyLabel = 'Copy link',
  copiedLabel = 'Copied',
  className,
}: {
  value: string
  /** Accessible name of the field. */
  label: string
  copyLabel?: string
  copiedLabel?: string
  className?: string
}) {
  const id = useId()
  const field = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Clipboard API blocked (http, iframe): fall back to a selection copy.
      field.current?.select()
      document.execCommand?.('copy')
    }
    setCopied(true)
  }

  return (
    <div className={cx('flex gap-2.5', className)}>
      <Input ref={field} id={id} readOnly tone="subtle" value={value} aria-label={label} onFocus={(e) => e.currentTarget.select()} className="flex-1" />
      <Button
        onClick={copy}
        className="w-[132px] px-0"
        icon={copied ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      >
        {copied ? copiedLabel : copyLabel}
      </Button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? `${copiedLabel} to clipboard` : ''}
      </span>
    </div>
  )
}
