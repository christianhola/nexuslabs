import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { CreditCard, Landmark, Check, ReceiptText } from 'lucide-react'

import { hero } from '../content'
import { wait } from '../lib/api'
import { cx } from '../lib/cx'
import { Button } from './Button'
import { PaymentCard } from './PaymentCard'
import { RadioCard } from './RadioCard'

const w = hero.widget

/*
  The hero's live invoice: choose a method, press Pay, watch it process and
  settle. The card face floats over the corner like the reference.
*/
export function PayWidget({ className }: { className?: string }) {
  const [method, setMethod] = useState('card')
  const [state, setState] = useState<'idle' | 'paying' | 'paid'>('idle')

  async function pay() {
    setState('paying')
    await wait(1300)
    setState('paid')
  }

  const amount = w.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

  return (
    <div className={cx('relative', className)}>
      <div className="relative w-full max-w-[372px] rounded-[22px] bg-white p-5 shadow-float sm:p-6">
        <div className="flex items-center gap-3 pr-[120px]">
          <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-teal text-white">
            <ReceiptText className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-ink">{w.payer}</p>
            <p className="truncate text-[12px] text-faint">{w.payerEmail}</p>
          </div>
        </div>

        <div className="mt-5 rounded-control border border-line p-4 pr-[96px]">
          <p className="text-[11.5px] text-faint">
            {w.invoiceLabel} {w.invoiceNumber}
          </p>
          <p className="tabular mt-1 text-[27px] font-medium tracking-[-0.03em] text-ink">{amount}</p>
          <p className="text-[11.5px] text-faint">{w.due}</p>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {state === 'paid' ? (
            <motion.div
              key="paid"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-3 flex flex-col items-center rounded-control bg-teal-50 px-4 py-5 text-center"
              role="status"
            >
              <span className="round grid size-11 animate-pulse-ring place-items-center rounded-full bg-teal-ink text-white">
                <Check className="size-5" aria-hidden />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-ink">
                {w.paid} {amount}
              </p>
              <p className="mt-1 text-[12.5px] leading-5 text-muted">{w.paidNote}</p>
            </motion.div>
          ) : (
            <motion.fieldset key="methods" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 space-y-2.5" disabled={state === 'paying'}>
              <legend className="sr-only">Payment method</legend>
              {w.methods.map((m) => (
                <RadioCard
                  key={m.id}
                  name="hero-method"
                  value={m.id}
                  checked={method === m.id}
                  onChange={setMethod}
                  label={m.label}
                  detail={m.detail}
                  size="sm"
                  icon={m.id === 'card' ? <CreditCard className="size-4" aria-hidden /> : <Landmark className="size-4" aria-hidden />}
                />
              ))}
            </motion.fieldset>
          )}
        </AnimatePresence>

        {state === 'paid' ? (
          <Button variant="outline" block className="mt-4" onClick={() => setState('idle')}>
            {w.again}
          </Button>
        ) : (
          <Button variant="dark" block className="mt-4" loading={state === 'paying'} onClick={pay}>
            {state === 'paying' ? w.paying : `${w.pay} ${amount}`}
          </Button>
        )}
      </div>

      <motion.div
        aria-hidden={method !== 'card'}
        animate={{ opacity: method === 'card' ? 1 : 0.35, rotate: method === 'card' ? 0 : 4, y: method === 'card' ? 0 : 10 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -right-6 -top-11 max-[420px]:right-0 max-[420px]:w-[150px] sm:-right-10"
      >
        <div className="animate-float-slow">
          <PaymentCard label={w.cardLabel} last4={w.cardNumber} className="max-[420px]:w-[150px]" />
        </div>
      </motion.div>
    </div>
  )
}
