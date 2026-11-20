import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { Check, Lock, Minus, Plus, ShieldCheck, Smartphone, Landmark } from 'lucide-react'

import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { Container } from '../components/Container'
import { TextField } from '../components/Field'
import { Notice } from '../components/Notice'
import { PageHeader } from '../components/PageHeader'
import { NetworkMark } from '../components/PaymentCard'
import { Segmented } from '../components/Segmented'
import { Toggle } from '../components/Toggle'
import { Dialog } from '../components/Dialog'
import { checkout } from '../content'
import { api } from '../lib/api'
import { cx } from '../lib/cx'
import { keys, useStore } from '../lib/store'
import { cardBrand, digits, validateCheckout } from '../shared/validate'
import type { CheckoutField, CheckoutInput, Errors } from '../shared/validate'

type Theme = { accent: string; wallets: boolean; bank: boolean; compact: boolean }
const defaultTheme: Theme = { accent: 'teal', wallets: true, bank: true, compact: false }

const usd = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

function formatCard(v: string) {
  const d = digits(v).slice(0, 19)
  return cardBrand(d) === 'amex' ? d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' ')) : d.replace(/(\d{4})(?=\d)/g, '$1 ')
}
function formatExpiry(v: string) {
  const d = digits(v).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d
}

export function CheckoutPage() {
  const [theme, setTheme] = useStore<Theme>(keys.checkoutTheme, defaultTheme)
  const accent = checkout.accents.find((a) => a.id === theme.accent) ?? checkout.accents[0]
  const set = (p: Partial<Theme>) => setTheme((t) => ({ ...t, ...p }))

  return (
    <>
      <PageHeader eyebrow="Checkout" title={checkout.title} body={checkout.body} />
      <section className="relative -mt-8 pb-24">
        <Container className="grid items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Card className="lg:sticky lg:top-24">
            <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Customise</h2>
            <p className="mt-1 text-[13.5px] text-muted">Saved on this device. Everything updates live.</p>
            <fieldset className="mt-6">
              <legend className="text-[14px] font-medium text-ink-2">Brand colour</legend>
              <div className="mt-3 flex gap-2.5">
                {checkout.accents.map((a) => (
                  <label key={a.id} className="relative">
                    <input type="radio" name="accent" value={a.id} checked={theme.accent === a.id} onChange={() => set({ accent: a.id })} className="peer sr-only" />
                    <span
                      className="round grid size-10 place-items-center rounded-full ring-offset-2 transition-shadow peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:shadow-focus"
                      style={{ background: a.hex }}
                    >
                      {theme.accent === a.id && <Check className="size-4 text-white" aria-hidden />}
                    </span>
                    <span className="sr-only">{a.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 space-y-4 border-t border-line pt-6">
              <Toggle label="Wallet payments" description="Show the one-tap wallet option" checked={theme.wallets} onChange={(v) => set({ wallets: v })} />
              <Toggle label="Pay by bank" description="Lower fees for larger orders" checked={theme.bank} onChange={(v) => set({ bank: v })} />
              <Toggle label="Compact layout" description="Hide product variants" checked={theme.compact} onChange={(v) => set({ compact: v })} />
            </div>
            <div className="mt-6 border-t border-line pt-6">
              <h3 className="text-[14px] font-medium text-ink-2">Test cards</h3>
              <ul className="mt-3 space-y-2 text-[13px]">
                {checkout.testCards.map((c) => (
                  <li key={c.number} className="flex flex-col">
                    <code className="font-mono text-ink">{c.number}</code>
                    <span className="text-muted">{c.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12.5px] text-faint">Any future expiry and any 3-digit code.</p>
            </div>
          </Card>
          <CheckoutDemo accent={accent.hex} theme={theme} />
        </Container>
      </section>
    </>
  )
}

function CheckoutDemo({ accent, theme }: { accent: string; theme: Theme }) {
  const [qty, setQty] = useState<Record<string, number>>(() => Object.fromEntries(checkout.products.map((p) => [p.id, p.qty])))
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState<string | null>(null)
  const methods = checkout.methods.filter((m) => (m.id === 'wallet' ? theme.wallets : m.id === 'bank' ? theme.bank : true))
  const [method, setMethod] = useState('card')
  const activeMethod = methods.some((m) => m.id === method) ? method : 'card'
  const [form, setForm] = useState<CheckoutInput>({ email: '', name: '', card: '', expiry: '', cvc: '', postcode: '' })
  const [errors, setErrors] = useState<Errors<CheckoutField>>({})
  const [state, setState] = useState<'idle' | 'paying' | 'otp' | 'declined' | 'done'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [receipt, setReceipt] = useState<{ id: string; last4: string } | null>(null)

  const subtotal = checkout.products.reduce((s, p) => s + p.price * (qty[p.id] ?? 0), 0)
  const discount = promoApplied ? Math.round(subtotal * checkout.promo.percent) / 100 : 0
  const shipping = subtotal > 0 ? checkout.shipping : 0
  const tax = Math.round((subtotal - discount) * checkout.taxRate * 100) / 100
  const total = Math.max(0, subtotal - discount + shipping + tax)
  const brand = useMemo(() => cardBrand(form.card), [form.card])
  const style = { '--accent': accent } as CSSProperties

  function applyPromo(e: FormEvent) {
    e.preventDefault()
    if (promo.trim().toUpperCase() === checkout.promo.code) {
      setPromoApplied(true)
      setPromoError(null)
    } else {
      setPromoApplied(false)
      setPromoError(promo.trim() ? 'That code isn’t valid.' : 'Enter a promo code.')
    }
  }

  async function pay(e?: FormEvent, code?: string) {
    e?.preventDefault()
    if (state === 'paying') return
    setMessage(null)
    if (activeMethod !== 'card') {
      setState('paying')
      await new Promise((r) => setTimeout(r, 1200))
      setReceipt({ id: `pay_${Math.random().toString(36).slice(2, 12)}`, last4: activeMethod === 'bank' ? 'bank' : 'wallet' })
      setState('done')
      return
    }
    const errs = validateCheckout(form)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`co-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    if (total <= 0) {
      setMessage('Your bag is empty. Add an item to pay.')
      return
    }
    setState(code ? 'otp' : 'paying')
    setVerifying(!!code)
    const res = await api<{ status: string; id: string; last4: string }>('/api/checkout', { body: { ...form, amount: total, otp: code } })
    setVerifying(false)
    if (res.ok && res.data.status === 'requires_action') {
      setState('otp')
      return
    }
    if (res.ok && res.data.status === 'succeeded') {
      setReceipt({ id: res.data.id, last4: res.data.last4 })
      setState('done')
      return
    }
    if (res.status === 402) {
      setState('declined')
      setMessage(res.data.message ?? 'Your card was declined.')
      return
    }
    if (res.status === 422 && res.data.errors) {
      if (res.data.errors.otp) {
        setOtpError(res.data.errors.otp)
        setState('otp')
        return
      }
      setErrors(res.data.errors as Errors<CheckoutField>)
    } else setMessage(res.data.message ?? 'Something went wrong. Try again.')
    setState('idle')
  }

  function submitOtp(e: FormEvent) {
    e.preventDefault()
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Enter all 6 digits.')
      return
    }
    setOtpError(null)
    void pay(undefined, otp)
  }

  function reset() {
    setState('idle')
    setReceipt(null)
    setForm({ email: form.email, name: '', card: '', expiry: '', cvc: '', postcode: '' })
    setOtp('')
    setMessage(null)
  }

  const field = (k: CheckoutField) => ({
    id: `co-${k}`,
    value: form[k],
    error: errors[k],
    onChange: (e: { target: { value: string } }) => {
      const v = k === 'card' ? formatCard(e.target.value) : k === 'expiry' ? formatExpiry(e.target.value) : k === 'cvc' ? digits(e.target.value).slice(0, 4) : e.target.value
      setForm((f) => ({ ...f, [k]: v }))
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
    },
  })

  return (
    <div style={style} className="overflow-hidden rounded-panel bg-mist-2 p-2 sm:p-3">
      <div className="flex items-center gap-2 px-3 pb-3 pt-1 text-[12.5px] text-muted sm:px-4">
        <Lock className="size-3.5" aria-hidden />
        <span>pay.ledgerly.app/fernwood</span>
      </div>
      <div className="grid overflow-hidden rounded-card bg-white shadow-card md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="border-b border-line bg-mist-2/60 p-6 md:border-b-0 md:border-r sm:p-8">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            <span className="round grid size-7 place-items-center rounded-full text-[12px] font-bold text-white" style={{ background: accent }}>
              F
            </span>
            {checkout.merchant}
          </p>
          <p className="mt-6 text-[13px] text-muted">Total due</p>
          <p className="tabular text-[34px] font-medium tracking-[-0.03em] text-ink" aria-live="polite">
            {usd(total)}
          </p>
          <ul className="mt-6 space-y-4">
            {checkout.products.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <span aria-hidden className="size-11 shrink-0 rounded-[10px]" style={{ background: p.swatch }} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium leading-snug text-ink">{p.name}</p>
                  {!theme.compact && <p className="text-[12.5px] text-faint">{p.variant}</p>}
                </div>
                <div className="flex items-center rounded-control-sm border border-line bg-white">
                  <button
                    type="button"
                    aria-label={`Remove one ${p.name}`}
                    disabled={(qty[p.id] ?? 0) === 0 || state === 'done'}
                    onClick={() => setQty((q) => ({ ...q, [p.id]: Math.max(0, (q[p.id] ?? 0) - 1) }))}
                    className="grid size-10 place-items-center text-ink-2 disabled:opacity-40"
                  >
                    <Minus className="size-3.5" aria-hidden />
                  </button>
                  <span className="tabular w-5 text-center text-[13.5px] font-medium" aria-label={`${qty[p.id]} in bag`}>
                    {qty[p.id]}
                  </span>
                  <button
                    type="button"
                    aria-label={`Add one ${p.name}`}
                    disabled={(qty[p.id] ?? 0) >= 9 || state === 'done'}
                    onClick={() => setQty((q) => ({ ...q, [p.id]: Math.min(9, (q[p.id] ?? 0) + 1) }))}
                    className="grid size-10 place-items-center text-ink-2 disabled:opacity-40"
                  >
                    <Plus className="size-3.5" aria-hidden />
                  </button>
                </div>
                <span className="tabular w-[60px] shrink-0 text-right text-[14px] font-medium text-ink">{usd(p.price * (qty[p.id] ?? 0))}</span>
              </li>
            ))}
          </ul>
          <form onSubmit={applyPromo} noValidate className="mt-6 flex items-start gap-2">
            <TextField
              label="Promo code"
              hideLabel
              placeholder={`Promo code (try ${checkout.promo.code})`}
              className="flex-1"
              value={promo}
              onChange={(e) => setPromo(e.target.value)}
              error={promoError}
            />
            <Button type="submit" variant="outline" className="h-12">
              Apply
            </Button>
          </form>
          <dl className="mt-6 space-y-2 border-t border-line pt-4 text-[14px]">
            <Row k="Subtotal" v={usd(subtotal)} />
            {promoApplied && <Row k={`Promo ${checkout.promo.code}`} v={`− ${usd(discount)}`} accent />}
            <Row k="Shipping" v={usd(shipping)} />
            <Row k="Tax" v={usd(tax)} />
            <div className="flex justify-between border-t border-line pt-3 text-[15px] font-semibold text-ink">
              <dt>Total</dt>
              <dd className="tabular">{usd(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {state === 'done' && receipt ? (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col items-center justify-center py-10 text-center" role="status">
                <span className="round grid size-14 place-items-center rounded-full text-white" style={{ background: accent }}>
                  <Check className="size-7" aria-hidden />
                </span>
                <h2 className="mt-5 text-[24px] font-medium tracking-[-0.03em] text-ink">{checkout.success.title}</h2>
                <p className="mt-2 text-[14.5px] text-muted">
                  {usd(total)} paid. {checkout.success.body} {form.email || 'your inbox'}.
                </p>
                <p className="mt-3 font-mono text-[12.5px] text-faint">{receipt.id}</p>
                <Button className="mt-7" variant="outline" onClick={reset}>
                  {checkout.success.again}
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={pay} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-[18px] font-medium tracking-[-0.02em] text-ink">Payment</h2>
                {methods.length > 1 && (
                  <Segmented className="mt-4 w-full [&>button]:flex-1" label="Payment method" value={activeMethod} onChange={setMethod} options={methods} />
                )}
                <div className="mt-5 grid gap-4">
                  <TextField {...field('email')} type="email" label="Email" autoComplete="email" placeholder="you@example.com" />
                  {activeMethod === 'card' && (
                    <>
                      <TextField
                        {...field('card')}
                        label="Card number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 1234 1234 1234"
                        inputClassName="tabular"
                        suffix={
                          brand !== 'card' ? (
                            <span className="mr-2 text-ink" aria-hidden>
                              <NetworkMark network={brand} className={brand === 'visa' ? 'text-[15px] text-navy' : 'text-[12px]'} />
                            </span>
                          ) : undefined
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <TextField {...field('expiry')} label="Expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" />
                        <TextField {...field('cvc')} label="Security code" inputMode="numeric" autoComplete="cc-csc" placeholder="123" />
                      </div>
                      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
                        <TextField {...field('name')} label="Name on card" autoComplete="cc-name" />
                        <TextField {...field('postcode')} label="Postcode" autoComplete="postal-code" />
                      </div>
                    </>
                  )}
                  {activeMethod === 'wallet' && (
                    <p className="flex items-center gap-3 rounded-control border border-line p-4 text-[14px] text-muted">
                      <Smartphone className="size-5 text-ink-2" aria-hidden />
                      You’ll confirm on your phone with your saved wallet.
                    </p>
                  )}
                  {activeMethod === 'bank' && (
                    <p className="flex items-center gap-3 rounded-control border border-line p-4 text-[14px] text-muted">
                      <Landmark className="size-5 text-ink-2" aria-hidden />
                      Pay straight from your bank. You’ll pick it on the next screen.
                    </p>
                  )}
                </div>
                {message && (
                  <Notice tone={state === 'declined' ? 'danger' : 'warning'} className="mt-5">
                    {message}
                  </Notice>
                )}
                <button
                  type="submit"
                  aria-disabled={state === 'paying' || undefined}
                  aria-busy={state === 'paying' || undefined}
                  className="mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-control bg-[var(--accent)] text-[16px] font-medium text-white transition-[filter,transform] hover:brightness-110 active:translate-y-px aria-disabled:opacity-70"
                >
                  {state === 'paying' ? 'Processing…' : `Pay ${usd(total)}`}
                </button>
                <p className="mt-4 flex items-center justify-center gap-1.5 text-[12.5px] text-faint">
                  <ShieldCheck className="size-3.5" aria-hidden />
                  Secured by Ledgerly. Card details never touch the merchant.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={state === 'otp'} onClose={() => setState('idle')} title={checkout.otp.title} description={checkout.otp.body}>
        <form onSubmit={submitOtp} noValidate>
          <TextField
            data-autofocus
            label={checkout.otp.code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(digits(e.target.value).slice(0, 6))}
            error={otpError}
            inputClassName="tabular text-center text-[22px] tracking-[0.4em]"
          />
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setState('idle')}>
              Cancel
            </Button>
            <Button type="submit" loading={verifying}>
              Verify and pay
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{k}</dt>
      <dd className={cx('tabular', accent ? 'font-medium text-success' : 'text-ink')}>{v}</dd>
    </div>
  )
}
