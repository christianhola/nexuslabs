import { pricing } from '../content'
import { cx } from '../lib/cx'
import { SegmentedControl } from './SegmentedControl'

/** Monthly / Yearly switch with the "Save 20%" chip, shared by both pricing views. */
export function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (yearly: boolean) => void }) {
  return (
    <SegmentedControl
      label="Billing period"
      value={yearly ? 'yearly' : 'monthly'}
      onChange={(v) => onChange(v === 'yearly')}
      options={[
        { value: 'monthly', label: 'Monthly' },
        {
          value: 'yearly',
          label: 'Yearly',
          badge: (
            <span className={cx('rounded-full px-2 py-0.5 text-[11px] round', yearly ? 'bg-white/20' : 'bg-up/15 text-[#4ade80]')}>{pricing.yearlyNote}</span>
          ),
        },
      ]}
    />
  )
}
