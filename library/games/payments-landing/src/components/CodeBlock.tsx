import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { cx } from '../lib/cx'

/** Dark code panel with a copy button. Highlights strings and keys lightly. */
export function CodeBlock({ code, title, className, language = 'json' }: { code: string; title?: string; className?: string; language?: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <div className={cx('overflow-hidden rounded-card-sm bg-navy text-on-navy', className)}>
      <div className="flex h-11 items-center justify-between border-b border-navy-line pl-4 pr-1.5">
        <span className="text-[12px] font-medium text-on-navy-muted">{title ?? language}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-10 items-center gap-1.5 rounded-control-sm px-2.5 text-[12px] font-medium text-on-navy-muted hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre tabIndex={0} aria-label={title ?? `${language} code`} className="overflow-x-auto p-4 font-mono text-[12.5px] leading-[1.7] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}

function highlight(code: string) {
  const parts = code.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(?:\.\d+)?\b|#.*$|\/\/.*$)/gm)
  return parts.map((p, i) => {
    if (!p) return null
    if (/^["']/.test(p)) {
      const isKey = /^"[^"]*"$/.test(p) && parts[i + 1]?.trimStart().startsWith(':')
      return (
        <span key={i} className={isKey ? 'text-[#9fd6dc]' : 'text-[#f2c98a]'}>
          {p}
        </span>
      )
    }
    if (/^\d/.test(p)) return <span key={i} className="text-[#c7b8f5]">{p}</span>
    if (/^(#|\/\/)/.test(p)) return <span key={i} className="text-[#8fa9b2]">{p}</span>
    return <span key={i}>{p}</span>
  })
}
