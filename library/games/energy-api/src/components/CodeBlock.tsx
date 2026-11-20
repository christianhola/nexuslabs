import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'

import { cx } from '../lib/cx'

/*
  A tiny highlighter: strings, comments, numbers and a few keywords. Enough
  for short docs snippets without shipping a full grammar.
*/
const TOKEN = /(\/\/[^\n]*|#[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:const|await|import|from|async|function|return|new|def|print|for|in|if|export|curl)\b|\b\d+(?:\.\d+)?\b|-[A-Z]\b|--[a-z-]+)/g

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of code.matchAll(TOKEN)) {
    const t = m[0]
    const i = m.index ?? 0
    if (i > last) out.push(code.slice(last, i))
    const cls = t.startsWith('//') || (t.startsWith('#') && !t.startsWith('#!'))
      ? 'text-[#8ea38a] italic'
      : /^["'`]/.test(t)
        ? 'text-volt'
        : /^\d/.test(t)
          ? 'text-[#f2c57c]'
          : /^-/.test(t)
            ? 'text-[#9fd3c7]'
            : 'text-[#c3b5f5]'
    out.push(
      <span key={i} className={cls}>
        {t}
      </span>,
    )
    last = i + t.length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

export function CopyButton({ text, className, label = 'Copy code' }: { text: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(0)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          // Clipboard blocked (permissions or an insecure origin): the code is still selectable.
        }
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), 1600)
      }}
      className={cx('inline-flex h-10 items-center gap-1.5 rounded-control-sm px-3 text-[13px] font-medium text-on-forest-muted transition-colors hover:bg-forest-3 hover:text-on-forest', className)}
    >
      {copied ? <Check className="size-4 text-volt" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

export function CodeBlock({
  code,
  title,
  header,
  className,
  copy = true,
  panel,
}: {
  code: string
  title?: ReactNode
  header?: ReactNode
  className?: string
  copy?: boolean
  /** When the header holds <Tabs>, pass its idBase and value so the code is the tab panel. */
  panel?: { idBase: string; value: string }
}) {
  return (
    <div className={cx('on-forest overflow-hidden rounded-card-sm bg-forest text-on-forest shadow-[inset_0_0_0_1px_var(--color-forest-line)]', className)}>
      {(title || header || copy) && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-forest-line pl-4 pr-1.5">
          <div className="flex min-w-0 items-center gap-3 text-[13px] text-on-forest-muted">{header ?? <span className="font-mono">{title}</span>}</div>
          {copy && <CopyButton text={code} />}
        </div>
      )}
      <pre
        tabIndex={0}
        id={panel ? `${panel.idBase}-panel` : undefined}
        role={panel ? 'tabpanel' : undefined}
        aria-labelledby={panel ? `${panel.idBase}-tab-${panel.value}` : undefined}
        aria-label={panel ? undefined : 'Code'}
        className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-[1.7] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-volt">
        <code>{highlight(code)}</code>
      </pre>
    </div>
  )
}
