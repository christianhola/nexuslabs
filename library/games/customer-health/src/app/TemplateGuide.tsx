import type { ReactNode } from 'react'

import { Overlay } from '../components/Overlay'

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_1fr] gap-x-3 border-t border-line pt-5">
      <span className="tnum font-mono text-[12px] text-risk">{String(n).padStart(2, '0')}</span>
      <div>
        <h3 className="text-[15px] font-medium">{title}</h3>
        <div className="mt-1.5 space-y-2 text-[14px] leading-relaxed text-muted">{children}</div>
      </div>
    </li>
  )
}

const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded-[3px] bg-fg/[0.07] px-1 py-px font-mono text-[12.5px] text-fg">{children}</code>
)

export function TemplateGuide({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Overlay open={open} onClose={onClose} label="Template guide" kind="modal">
      <div className="px-6 pt-8 pb-8 sm:px-9">
        <p className="caps text-[10.5px] text-muted">Template guide</p>
        <h2 className="mt-2 pr-8 font-serif text-[28px] leading-tight font-normal tracking-[-0.01em]">Plug in your own accounts</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-muted">
          Everything on this page is computed from one array of accounts. The 160 you see are seeded and deterministic; replace them and
          every KPI, the chart and the watchlist follow.
        </p>

        <ol className="mt-7 space-y-5">
          <Step n={1} title="Match the Account shape">
            <p>
              Each account needs a name, a segment, <Code>arr</Code> in dollars, <Code>history</Code> (13 weekly health scores, oldest
              first) and <Code>earlier</Code> (the 13 before that), <Code>seatUtilization</Code> (0–1), <Code>seats</Code>,{' '}
              <Code>lastTouchDays</Code>, a <Code>renewal</Code> date, an <Code>owner</Code>, a signup <Code>cohort</Code> and{' '}
              <Code>factors</Code> (offsets per score factor; zeros are fine). The type lives in <Code>src/data.ts</Code>.
            </p>
            <pre className="scroll-thin overflow-x-auto rounded-[4px] border border-line bg-bg/60 p-3.5 font-mono text-[12px] leading-relaxed text-fg">
{`{ id: 'acct-001', name: 'Fenwick Legal', segment: 'Enterprise',
  arr: 720000, history: [55, 57, …, 24, 22],
  seatUtilization: 0.31, lastTouchDays: 29,
  renewal: '2027-05-24', owner: 'Priya Raman' }`}
            </pre>
          </Step>
          <Step n={2} title="Load it">
            <p>
              Quickest: export <Code>accounts</Code> from your CRM or warehouse as JSON and import it in <Code>src/data.ts</Code>. Live: add{' '}
              <Code>GET /api/accounts</Code> in <Code>src/worker/index.ts</Code> (query your warehouse, a D1 table or your CRM API there,
              so keys stay server-side) and fetch it in <Code>src/App.tsx</Code>.
            </p>
          </Step>
          <Step n={3} title="Check the definitions">
            <p>
              <span className="text-fg">ARR at risk</span> sums accounts under the threshold. <span className="text-fg">Drawdown</span> is
              points below the 13-week peak. <span className="text-fg">Runway</span> is weeks until the threshold at the two-week slope.
              Deltas compare with the date range in the top bar (4, 8 or 13 weeks). All of it is in <Code>src/lib/metrics.ts</Code>.
            </p>
          </Step>
          <Step n={4} title="Tune it">
            <p>
              Drag the risk threshold (or focus it and use the arrow keys) to see the KPIs recompute. Set the default with{' '}
              <Code>DEFAULT_THRESHOLD</Code>. Colours and type are tokens at the top of <Code>src/styles.css</Code>.
            </p>
          </Step>
        </ol>
      </div>
    </Overlay>
  )
}
