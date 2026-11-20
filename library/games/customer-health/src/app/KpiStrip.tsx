import { Kpi } from '../components/Kpi'
import { money, moneyDelta, signed } from '../lib/format'
import type { Kpis } from '../lib/metrics'

/** Four KPIs between two heavy rules. Deltas turn orange when they are bad news. */
export function KpiStrip({ k, range }: { k: Kpis; range: number }) {
  const cell = 'border-line sm:min-h-[150px]'
  const vs = `vs. ${range} weeks ago`
  return (
    <section
      aria-label="Key metrics"
      className="grid grid-cols-2 border-y-2 border-rule sm:grid-cols-4 [&>*:nth-child(-n+2)]:border-b sm:[&>*:nth-child(-n+2)]:border-b-0"
    >
      <Kpi className={`${cell} border-r`} label="ARR at risk" value={k.arrAtRisk} format={money} note={`${moneyDelta(k.arrAtRiskDelta)} ${vs}`} alert={k.arrAtRiskDelta > 0} delay={80} />
      <Kpi
        className={`${cell} sm:border-r`}
        label="Accounts at risk"
        value={k.accountsAtRisk}
        format={(n) => String(Math.round(n))}
        note={`${signed(k.accountsAtRiskDelta)} ${vs}`}
        alert={k.accountsAtRiskDelta > 0}
        delay={140}
      />
      <Kpi
        className={`${cell} border-r`}
        label="Median health"
        value={k.medianHealth}
        format={(n) => String(Math.round(n))}
        note={`${signed(k.medianHealthDelta)} ${vs}`}
        alert={k.medianHealthDelta < 0}
        delay={200}
      />
      <Kpi className={cell} label="Renewals · next 90 days" value={k.renewals90Arr} format={money} note={`${k.renewals90Count} accounts`} delay={260} />
    </section>
  )
}
