import { ArrowDown, Check, Megaphone, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardHeader } from '../components/Card'
import { Container } from '../components/Container'
import { CountUp } from '../components/CountUp'
import { EmptyState } from '../components/EmptyState'
import { Field, Input, Select } from '../components/Field'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Slider } from '../components/Slider'
import { toast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { adOffers, boosts, monetizeCopy, payouts as seedPayouts } from '../content'
import { useStored } from '../lib/storage'

type OfferState = Record<string, 'accepted' | 'declined'>
type Payout = { id: string; date: string; amount: number; status: string }

const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export function MonetizePage() {
  const [balance, setBalance] = useStored('balance', 2563)
  const [history, setHistory] = useStored<Payout[]>('payouts', seedPayouts)
  const [offers, setOffers] = useStored<OfferState>('offers', {})
  const [paid, setPaid] = useStored('paid', { on: true, price: 8, conversion: 3 })
  const [boostOn, setBoostOn] = useStored<Record<string, boolean>>('boosts', { b1: true, b2: true, b3: false })
  const [withdrawOpen, setWithdrawOpen] = useState(false)

  const open = adOffers.filter((o) => !offers[o.id])
  const accepted = adOffers.filter((o) => offers[o.id] === 'accepted')
  const scheduled = accepted.reduce((s, o) => s + o.est, 0)
  const paidSubs = Math.round((372096 * paid.conversion) / 100)
  const paidMonthly = paid.on ? paidSubs * paid.price : 0
  const boostMonthly = boosts.filter((b) => boostOn[b.id]).reduce((s, b) => s + b.perSub * b.subs * 4, 0)

  const decide = (id: string, v: 'accepted' | 'declined', sponsor: string) => {
    setOffers((o) => ({ ...o, [id]: v }))
    toast(v === 'accepted' ? `${sponsor} placement accepted` : `${sponsor} offer declined`)
  }

  return (
    <>
      <PageHeader eyebrow={monetizeCopy.title} title="Get paid for your writing" intro={monetizeCopy.intro} />
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr_1fr]">
          <Card id="payout" className="scroll-mt-28 p-6">
            <p className="text-[14px] text-muted">{monetizeCopy.balanceLabel}</p>
            <p className="mt-1 text-[44px] font-medium tabular-nums tracking-[-0.03em] text-white">
              <CountUp key={balance} value={balance} format={money} duration={0.8} />
            </p>
            <p className="text-[14px] text-muted">{monetizeCopy.nextPayout}</p>
            <Button variant="outline" className="mt-6 w-full" icon={<ArrowDown className="size-4" />} onClick={() => setWithdrawOpen(true)} disabled={balance < 10}>
              Withdraw earnings
            </Button>
            {balance < 10 ? <p className="mt-2 text-[13px] text-muted">The minimum withdrawal is $10.</p> : null}
          </Card>
          <Card className="p-6">
            <p className="text-[14px] text-muted">Scheduled from sponsors</p>
            <p className="mt-1 text-[44px] font-medium tabular-nums tracking-[-0.03em] text-white">{money(scheduled)}</p>
            <p className="text-[14px] text-muted">
              {accepted.length} accepted {accepted.length === 1 ? 'placement' : 'placements'}
            </p>
          </Card>
          <Card className="p-6">
            <p className="text-[14px] text-muted">Estimated monthly, subscriptions and boosts</p>
            <p className="mt-1 text-[44px] font-medium tabular-nums tracking-[-0.03em] text-white">{money(paidMonthly + boostMonthly)}</p>
            <p className="text-[14px] text-muted">Inkwell takes 0% of subscriptions</p>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card>
            <CardHeader title="Ad network offers" action={open.length ? <Badge tone="pink">{open.length} open</Badge> : null} />
            {open.length ? (
              <ul className="divide-y divide-line">
                {open.map((o) => (
                  <li key={o.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
                    <span className="grid size-11 shrink-0 place-items-center rounded-[10px] text-[15px] font-bold text-white" style={{ background: `hsl(${o.hue} 55% 42%)` }} aria-hidden>
                      {o.sponsor[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-[16px] font-semibold text-ink">
                        {o.sponsor} <Badge>{o.category}</Badge>
                      </p>
                      <p className="mt-0.5 text-[14px] text-muted">{o.brief}</p>
                      <p className="mt-1 text-[13px] text-faint">
                        {o.placement} placement, ${o.cpm} CPM, about <span className="text-body">${o.est.toLocaleString('en-US')}</span> per issue
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" icon={<X className="size-4" />} onClick={() => decide(o.id, 'declined', o.sponsor)} aria-label={`Decline ${o.sponsor}`}>
                        Decline
                      </Button>
                      <Button variant="white" size="sm" icon={<Check className="size-4" />} onClick={() => decide(o.id, 'accepted', o.sponsor)} aria-label={`Accept ${o.sponsor}`}>
                        Accept
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-5">
                <EmptyState
                  icon={<Megaphone />}
                  title="You’re all caught up"
                  body="New sponsor offers arrive every Monday. We’ll email you when they do."
                  action={
                    <Button variant="outline" icon={<RotateCcw className="size-4" />} onClick={() => setOffers({})}>
                      Reset demo offers
                    </Button>
                  }
                />
              </div>
            )}
          </Card>

          <Card>
            <CardHeader title="Paid subscriptions" />
            <div className="flex flex-col gap-6 p-5">
              <Toggle checked={paid.on} onChange={(on) => setPaid((p) => ({ ...p, on }))} label="Offer a paid tier" description="Paid readers get every issue in full plus the archive." />
              <fieldset disabled={!paid.on} className="flex flex-col gap-5 disabled:opacity-45">
                <legend className="sr-only">Paid tier settings</legend>
                <Slider label="Monthly price" min={3} max={20} value={paid.price} onChange={(price) => setPaid((p) => ({ ...p, price }))} display={`$${paid.price}/mo`} />
                <Slider label="Readers who upgrade" min={0.5} max={10} step={0.5} value={paid.conversion} onChange={(conversion) => setPaid((p) => ({ ...p, conversion }))} display={`${paid.conversion}%`} />
                <p className="rounded-[10px] bg-panel-2 px-4 py-3 text-[14px] text-body">
                  About <strong className="text-white">{paidSubs.toLocaleString('en-US')}</strong> paid readers, or <strong className="text-white">{money(paidMonthly)}</strong> a month.
                </p>
              </fieldset>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Boosts" action={<span className="text-[13px] text-muted">Other writers pay you per reader you send</span>} />
            <ul className="divide-y divide-line">
              {boosts.map((b) => (
                <li key={b.id} className="px-5 py-4">
                  <Toggle checked={!!boostOn[b.id]} onChange={(v) => setBoostOn((s) => ({ ...s, [b.id]: v }))} label={b.name} description={`$${b.perSub.toFixed(2)} per reader, about ${b.subs} readers a week`} />
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <CardHeader title="Payouts" />
            <div className="overflow-x-auto">
              <table className="w-full text-[14px]">
                <caption className="sr-only">Payout history</caption>
                <thead className="border-b border-line text-left text-muted">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {history.map((p) => (
                    <tr key={p.id}>
                      <td className="px-5 py-3 text-body">{p.date}</td>
                      <td className="px-5 py-3">
                        <Badge tone={p.status === 'Paid' ? 'ok' : 'warn'} dot>
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-white">{money(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Container>
      <Withdraw
        open={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        balance={balance}
        onDone={(amount, method) => {
          setBalance((b) => Number((b - amount).toFixed(2)))
          setHistory((h) => [{ id: `w${Date.now()}`, date: 'Today', amount, status: 'Processing' }, ...h])
          toast(`${money(amount)} on its way to your ${method}`)
        }}
      />
    </>
  )
}

function Withdraw({ open, onClose, balance, onDone }: { open: boolean; onClose: () => void; balance: number; onDone: (amount: number, method: string) => void }) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank account')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const n = Number(amount)
    const err = !amount.trim() || Number.isNaN(n) ? 'Enter an amount.' : n < 10 ? 'The minimum withdrawal is $10.' : n > balance ? `You can withdraw up to ${money(balance)}.` : null
    setError(err)
    if (err) return
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      onDone(n, method)
      setAmount('')
      onClose()
    }, 900)
  }
  return (
    <Modal open={open} onClose={onClose} width="sm" title="Withdraw earnings" description={`Available: ${money(balance)}. Transfers take 1 to 3 working days.`}>
      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Field label="Amount (USD)" error={error ?? undefined}>
          {(f) => (
            <div className="flex gap-2">
              <Input id={f.id} aria-describedby={f.describedBy} invalid={f.invalid} inputMode="decimal" data-autofocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} placeholder="0.00" />
              <Button type="button" variant="outline" onClick={() => setAmount(String(balance))}>
                Max
              </Button>
            </div>
          )}
        </Field>
        <Field label="Send to">
          {(f) => (
            <Select id={f.id} value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="bank account">Bank account ending 4402</option>
              <option value="debit card">Debit card ending 1187</option>
            </Select>
          )}
        </Field>
        <Button type="submit" variant="pink" loading={busy} className="w-full">
          Withdraw
        </Button>
      </form>
    </Modal>
  )
}
