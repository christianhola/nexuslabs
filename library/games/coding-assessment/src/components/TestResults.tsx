import { CircleCheck, CircleX, FlaskConical, Lock } from 'lucide-react'

import type { RunResult } from '../lib/runner'
import { cx } from '../lib/cx'
import { EmptyState, Notice, Skeleton } from './Misc'

/** The results list under the editor: idle, running, error and per-test states. */
export function TestResults({ run, running, className }: { run: RunResult | null; running: boolean; className?: string }) {
  if (running)
    return (
      <div className={cx('grid gap-2', className)} role="status" aria-busy="true" aria-label="Running tests">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-11" />
        ))}
      </div>
    )
  if (!run)
    return <EmptyState className={cx('py-8', className)} icon={<FlaskConical className="size-5" />} title="No runs yet" body="Run your code to check it against the visible tests. Hidden tests run when you submit." />
  const visible = run.results.filter((r) => !r.hidden)
  const passed = visible.filter((r) => r.pass).length
  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2" role="status">
        <p className="text-[15px] font-medium">
          <span className={passed === visible.length ? 'text-brand-text' : 'text-amber'}>
            {passed} of {visible.length} passed
          </span>
          <span className="ml-2 text-[13px] font-normal text-faint">{run.ms} ms</span>
        </p>
      </div>
      {run.error && (
        <Notice tone="error" title={run.timedOut ? 'Time limit exceeded' : 'Your code threw an error'} className="mb-3">
          <code className="font-mono text-[13px] break-words">{run.error}</code>
        </Notice>
      )}
      <ul className="grid gap-2">
        {visible.map((r) => (
          <li key={r.id} className="rounded-[12px] bg-surface-2 px-3.5 py-2.5 ring-1 ring-inset ring-line">
            <div className="flex items-center gap-2.5">
              {r.pass ? <CircleCheck aria-hidden className="size-4 shrink-0 text-brand-text" /> : <CircleX aria-hidden className="size-4 shrink-0 text-danger" />}
              <span className="sr-only">{r.pass ? 'Passed:' : 'Failed:'}</span>
              <span className="min-w-0 flex-1 truncate text-[14px]">{r.label}</span>
              <span className="text-[12.5px] text-faint tabular-nums">{r.ms} ms</span>
            </div>
            {!r.pass && !run.error && (
              <dl className="mt-2 grid grid-cols-[72px_1fr] gap-x-2 gap-y-1 font-mono text-[12.5px]">
                <dt className="text-faint">Expected</dt>
                <dd className="break-all text-brand-text">{r.expected}</dd>
                <dt className="text-faint">Got</dt>
                <dd className="break-all text-danger">{r.error ?? r.got}</dd>
              </dl>
            )}
          </li>
        ))}
        <li className="flex items-center gap-2.5 px-3.5 py-1 text-[13.5px] text-faint">
          <Lock aria-hidden className="size-3.5" />
          {run.results.length - visible.length} hidden tests run on submit
        </li>
      </ul>
    </div>
  )
}

export function ConsoleOutput({ run }: { run: RunResult | null }) {
  if (!run || !run.logs.length) return <p className="px-1 py-6 text-center text-[14px] text-faint">console.log output from your last run appears here.</p>
  return (
    <pre className="scrollbar-thin max-h-64 overflow-auto rounded-[12px] bg-[#061012] p-3 font-mono text-[12.5px] leading-5 text-muted ring-1 ring-inset ring-line">
      {run.logs.join('\n')}
    </pre>
  )
}
