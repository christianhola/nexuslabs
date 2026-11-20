import type { TestCase } from '../data'

/*
  Runs candidate code against test cases in a throwaway Web Worker, in the
  browser. Nothing is sent to the server. Each run gets a fresh worker that is
  terminated after `timeoutMs`, so an infinite loop cannot freeze the page.
*/
export type TestResult = { id: string; label: string; hidden: boolean; pass: boolean; got?: string; expected: string; error?: string; ms: number }
export type RunResult = { results: TestResult[]; logs: string[]; error?: string; timedOut?: boolean; ms: number }

const WORKER_SOURCE = `
const fmt = (v) => { try { return v === undefined ? 'undefined' : JSON.stringify(v) } catch { return String(v) } }
const equal = (a, b) => fmt(a) === fmt(b)
self.onmessage = (e) => {
  const { code, fn, tests } = e.data
  const logs = []
  const log = (...a) => { if (logs.length < 200) logs.push(a.map((x) => typeof x === 'string' ? x : fmt(x)).join(' ')) }
  const consoleShim = { log, info: log, warn: log, error: log, debug: log }
  let target
  try {
    target = new Function('console', code + '\\n;return typeof ' + fn + ' === "function" ? ' + fn + ' : undefined;')(consoleShim)
  } catch (err) {
    self.postMessage({ error: (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err)), logs, results: [] })
    return
  }
  if (typeof target !== 'function') {
    self.postMessage({ error: 'ReferenceError: ' + fn + ' is not defined. Keep the function name from the starter code.', logs, results: [] })
    return
  }
  const results = tests.map((t) => {
    const start = performance.now()
    try {
      const args = JSON.parse(JSON.stringify(t.args))
      const got = target(...args)
      return { id: t.id, pass: equal(got, t.expected), got: fmt(got), ms: performance.now() - start }
    } catch (err) {
      return { id: t.id, pass: false, error: (err && err.name ? err.name + ': ' : '') + (err && err.message ? err.message : String(err)), ms: performance.now() - start }
    }
  })
  self.postMessage({ results, logs })
}
`

let url: string | null = null

export function runTests(code: string, fn: string, tests: TestCase[], timeoutMs = 2500): Promise<RunResult> {
  if (!url) url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }))
  const started = performance.now()
  return new Promise((resolve) => {
    const worker = new Worker(url!)
    const finish = (r: Omit<RunResult, 'ms'>) => {
      worker.terminate()
      window.clearTimeout(timer)
      resolve({ ...r, ms: Math.round(performance.now() - started) })
    }
    const merge = (raw: { id: string; pass: boolean; got?: string; error?: string; ms: number }[]) =>
      tests.map((t) => {
        const r = raw.find((x) => x.id === t.id)
        return { id: t.id, label: t.label, hidden: !!t.hidden, pass: !!r?.pass, got: r?.got, error: r?.error, expected: JSON.stringify(t.expected), ms: Math.round((r?.ms ?? 0) * 100) / 100 }
      })
    const timer = window.setTimeout(() => finish({ results: merge([]).map((r) => ({ ...r, error: 'Time limit exceeded' })), logs: [], error: `Time limit exceeded: your code ran for more than ${timeoutMs / 1000} s. Look for a loop that never ends.`, timedOut: true }), timeoutMs)
    worker.onmessage = (e: MessageEvent<{ results: { id: string; pass: boolean; got?: string; error?: string; ms: number }[]; logs: string[]; error?: string }>) => {
      const d = e.data
      finish({ results: d.error ? merge([]).map((r) => ({ ...r, error: d.error })) : merge(d.results), logs: d.logs, error: d.error })
    }
    worker.onerror = (e) => {
      e.preventDefault()
      finish({ results: merge([]), logs: [], error: e.message || 'The code could not run.' })
    }
    worker.postMessage({ code, fn, tests: tests.map((t) => ({ id: t.id, args: t.args, expected: t.expected })) })
  })
}
