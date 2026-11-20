import { useMemo } from 'react'

import { RotateCcw } from 'lucide-react'

import { Slider, Switch } from '../components/Field'
import { PageHeader } from '../components/PageHeader'
import { Panel } from '../components/Panel'
import { Pill } from '../components/Pill'
import { SegmentTag } from '../components/SegmentTag'
import { useToast } from '../components/Toast'
import { accounts as seed, DEFAULT_THRESHOLD, DEFAULT_WEIGHTS, FACTORS, SEGMENTS } from '../data'
import { cx } from '../lib/cx'
import { money, signed } from '../lib/format'
import { healthFill } from '../lib/healthColor'
import { current, median } from '../lib/metrics'
import { share } from '../lib/scoring'
import { useStore } from '../lib/store'

function Histogram({ scores, threshold }: { scores: number[]; threshold: number }) {
  const bins = Array.from({ length: 10 }, (_, i) => scores.filter((s) => (i === 9 ? s >= 90 : s >= i * 10 && s < i * 10 + 10)).length)
  const max = Math.max(1, ...bins)
  return (
    <div>
      <div className="relative flex h-[120px] items-end gap-1.5" role="img" aria-label={`Health distribution: ${bins.map((b, i) => `${i * 10}–${i * 10 + 9}: ${b}`).join(', ')}`}>
        {bins.map((b, i) => (
          <div key={i} className="flex h-full flex-1 flex-col justify-end">
            <span className="tnum mb-1 text-center font-mono text-[10.5px] text-muted">{b || ''}</span>
            <span className="block rounded-t-[2px] transition-[height] duration-500 ease-out" style={{ height: `${(b / max) * 92}%`, background: healthFill(i * 10 + 5) }} />
          </div>
        ))}
        <span aria-hidden="true" className="absolute inset-y-0 w-px bg-fg/70 transition-[left] duration-300" style={{ left: `${threshold}%` }} />
      </div>
      <div className="tnum mt-2 flex justify-between font-mono text-[10.5px] text-muted">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

export function Settings() {
  const { accounts, all, settings, setWeights, setThreshold, toggleSegment, resetSettings } = useStore()
  const toast = useToast()
  const w = { ...DEFAULT_WEIGHTS, ...settings.weights }
  const t = settings.threshold

  const scores = useMemo(() => accounts.map(current), [accounts])
  const baseline = useMemo(() => {
    const list = seed.filter((a) => !settings.excluded.includes(a.segment))
    return { med: Math.round(median(list.map(current))), risk: list.filter((a) => current(a) < DEFAULT_THRESHOLD).length }
  }, [settings.excluded])
  const med = Math.round(median(scores))
  const risk = scores.filter((s) => s < t).length
  const dirty = t !== DEFAULT_THRESHOLD || settings.excluded.length > 0 || FACTORS.some((f) => w[f.key] !== DEFAULT_WEIGHTS[f.key])

  const reset = () => {
    const before = settings
    resetSettings()
    toast.show({
      tone: 'info',
      title: 'Settings reset to defaults',
      action: {
        label: 'Undo',
        run: () => {
          setWeights(before.weights)
          setThreshold(before.threshold)
          for (const s of before.excluded) toggleSegment(s)
        },
      },
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Saved in this browser"
        title="Settings"
        lede="Tune how health is scored. Every change re-scores all accounts live, across every page."
        actions={
          <Pill variant="ghost" icon={<RotateCcw strokeWidth={1.75} />} onClick={reset} disabled={!dirty}>
            Reset to defaults
          </Pill>
        }
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel id="weights" title="Health score weights" meta={`Total ${FACTORS.reduce((s, f) => s + w[f.key], 0)}`} className="animate-rise [animation-delay:120ms]">
          <p className="mt-3 text-[14px] leading-relaxed text-muted">The score is a weighted blend of five factors. Weights are relative; the share each factor gets is shown on the right.</p>
          <div className="mt-7 space-y-6">
            {FACTORS.map((f) => (
              <div key={f.key}>
                <Slider
                  label={f.label}
                  value={w[f.key]}
                  min={0}
                  max={60}
                  onChange={(v) => setWeights({ ...w, [f.key]: v })}
                  display={
                    <>
                      {w[f.key]} <span aria-hidden="true" className="text-faint">·</span> {Math.round(share(w, f.key) * 100)}%
                    </>
                  }
                  aria-describedby={`hint-${f.key}`}
                />
                <p id={`hint-${f.key}`} className="mt-1 text-[12.5px] text-muted">
                  {f.hint}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <div className="space-y-8">
          <Panel id="preview" title="Live preview" meta={`${accounts.length} accounts`} className="animate-rise [animation-delay:180ms]">
            <dl className="mt-6 grid grid-cols-2 gap-6">
              <div className="border-t border-line pt-3">
                <dt className="caps text-[10px] tracking-[0.22em] text-muted">Median health</dt>
                <dd className="tnum mt-1.5 font-mono text-[30px] leading-none">{med}</dd>
                <dd className={cx('tnum mt-1.5 font-mono text-[12px]', med < baseline.med ? 'text-risk' : 'text-muted')}>{signed(med - baseline.med)} vs. default</dd>
              </div>
              <div className="border-t border-line pt-3">
                <dt className="caps text-[10px] tracking-[0.22em] text-muted">At risk</dt>
                <dd className="tnum mt-1.5 font-mono text-[30px] leading-none">{risk}</dd>
                <dd className={cx('tnum mt-1.5 font-mono text-[12px]', risk > baseline.risk ? 'text-risk' : 'text-muted')}>{signed(risk - baseline.risk)} vs. default</dd>
              </div>
            </dl>
            <div className="mt-7">
              <Histogram scores={scores} threshold={t} />
            </div>
          </Panel>

          <Panel id="threshold" title="Risk threshold" meta={`Default ${DEFAULT_THRESHOLD}`} className="animate-rise [animation-delay:220ms]">
            <Slider className="mt-6" label="Accounts under this score are at risk" value={t} min={10} max={90} onChange={setThreshold} display={t} />
            <p className="mt-3 text-[13px] text-muted">You can also drag the threshold line on the overview chart.</p>
          </Panel>
        </div>
      </div>

      <div className="mt-8">
        <Panel id="segments" title="Segments" meta="Excluded segments are hidden everywhere" className="animate-rise [animation-delay:260ms]">
          <ul className="mt-6">
            {SEGMENTS.map((s) => {
              const list = all.filter((a) => a.segment === s)
              const on = !settings.excluded.includes(s)
              const last = on && SEGMENTS.filter((x) => !settings.excluded.includes(x)).length === 1
              return (
                <li key={s} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 border-t border-line py-4 sm:grid-cols-[1fr_120px_120px_120px_auto]">
                  <span className="flex items-baseline gap-3">
                    <span className={cx('text-[15px]', !on && 'text-muted')}>{s}</span>
                    <SegmentTag className="hidden sm:inline">{`${list.length} accounts`}</SegmentTag>
                  </span>
                  <span className="tnum hidden text-right font-mono text-[13px] text-muted sm:block">{money(list.reduce((x, a) => x + a.arr, 0))}</span>
                  <span className="tnum hidden text-right font-mono text-[13px] text-muted sm:block">median {Math.round(median(list.map(current)))}</span>
                  <span className="tnum hidden text-right font-mono text-[13px] text-muted sm:block">{list.filter((a) => current(a) < t).length} at risk</span>
                  <Switch
                    checked={on}
                    disabled={last}
                    title={last ? 'At least one segment stays included' : undefined}
                    label={`Include ${s}`}
                    onChange={() => {
                      toggleSegment(s)
                      toast.show({ tone: 'info', title: on ? `${s} hidden` : `${s} included`, body: on ? 'Its accounts are excluded from every page.' : undefined })
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </Panel>
      </div>
    </>
  )
}
