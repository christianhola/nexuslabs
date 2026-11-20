import { useMemo, useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'

import { cx } from '../lib/cx'
import { tokenize } from '../lib/highlight'

/*
  A light code editor: a transparent <textarea> stacked over a highlighted
  <pre> in one grid cell, so the browser handles caret, selection, undo and
  IME. Tab indents; press Escape first to move focus out with Tab.
*/
export function CodeEditor({ value, onChange, onPaste, readOnly, label, className, minLines = 18 }: { value: string; onChange?: (v: string) => void; onPaste?: (chars: number) => void; readOnly?: boolean; label: string; className?: string; minLines?: number }) {
  const ta = useRef<HTMLTextAreaElement>(null)
  const escaped = useRef(false)
  const lines = Math.max(value.split('\n').length, minLines)
  const tokens = useMemo(() => tokenize(value), [value])

  const insert = (text: string) => {
    const el = ta.current
    if (!el) return
    // execCommand keeps the native undo stack; fall back if it is unavailable.
    if (!document.execCommand?.('insertText', false, text)) {
      el.setRangeText(text, el.selectionStart, el.selectionEnd, 'end')
      onChange?.(el.value)
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return
    if (e.key === 'Escape') {
      escaped.current = true
      return
    }
    if (e.key === 'Tab' && !escaped.current && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault()
      const el = e.currentTarget
      if (e.shiftKey) {
        const start = el.value.lastIndexOf('\n', el.selectionStart - 1) + 1
        if (el.value.slice(start, start + 2) === '  ') {
          el.setSelectionRange(start, start + 2)
          insert('')
        }
      } else insert('  ')
      return
    }
    escaped.current = false
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      const el = e.currentTarget
      const lineStart = el.value.lastIndexOf('\n', el.selectionStart - 1) + 1
      const line = el.value.slice(lineStart, el.selectionStart)
      const indent = line.match(/^\s*/)?.[0] ?? ''
      const extra = /[{[(]\s*$/.test(line) ? '  ' : ''
      e.preventDefault()
      insert('\n' + indent + extra)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => onPaste?.(e.clipboardData.getData('text').length)

  return (
    <div className={cx('scrollbar-thin relative flex overflow-auto bg-[#061012] ring-inset ring-brand/60 has-[textarea:focus-visible]:ring-2', className)}>
      <div aria-hidden className="code-layer sticky left-0 z-10 shrink-0 bg-[#061012] py-4 pr-3 pl-4 text-right text-[#6f8682] select-none">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div className="relative grid min-w-0 flex-1">
        <pre aria-hidden className="code-layer pointer-events-none col-start-1 row-start-1 m-0 min-h-full py-4 pr-6 pl-1 text-[#d9e6e2]" style={{ minHeight: lines * 22 + 32 }}>
          {tokens.map((t, i) => (t.t === 'ws' || t.t === 'id' ? t.v : <span key={i} className={`tok-${t.t}`}>{t.v}</span>))}
          {'\n'}
        </pre>
        <textarea
          ref={ta}
          aria-label={label}
          value={value}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          onPaste={handlePaste}
          className="code-layer code-input col-start-1 row-start-1 m-0 h-full w-full overflow-hidden bg-transparent py-4 pr-6 pl-1 focus-visible:outline-none"
        />
      </div>
    </div>
  )
}
