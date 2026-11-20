import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import { cx } from '../lib/cx'

/* Dark code panel with a language label and a copy button. */
export function CodeBlock({ code, lang, className }: { code: string; lang: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    // Show feedback at once; a blocked clipboard should not leave the button silent.
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
    navigator.clipboard?.writeText(code).catch(() => undefined)
  }
  return (
    <div className={cx('overflow-hidden rounded-[var(--radius-card-sm)] bg-night text-on-dark', className)}>
      <div className="flex items-center justify-between border-b border-white/10 py-1 pl-4 pr-1">
        <span className="font-mono text-[12px] text-white/70">{lang}</span>
        <button
          type="button"
          onClick={copy}
          className="round inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[12.5px] text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-lime"
        >
          {copied ? <Check className="size-3.5 text-lime" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed" tabIndex={0} aria-label={`${lang} code`}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
