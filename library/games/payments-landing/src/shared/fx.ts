/*
  Currencies, demo mid-market rates and the pricing rules for transfers.
  Shared by the page (instant estimates) and the Worker (`GET /api/quote`,
  `POST /api/transfers`), so both always agree on fees and the total.

  Rates are demo values, quoted per 1 USD, with a small time-based drift so
  the quote visibly moves. Replace `midRate` with a call to your FX provider.
*/

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'JPY' | 'INR' | 'MXN' | 'SGD' | 'BRL'

export type Currency = {
  code: CurrencyCode
  name: string
  symbol: string
  /** Decimal places shown and charged in this currency. */
  decimals: number
  /** Accent colour for the currency badge. */
  tint: string
  /** Typical arrival for transfers into this currency. */
  arrival: string
}

export const currencies: Currency[] = [
  { code: 'USD', name: 'US dollar', symbol: '$', decimals: 2, tint: '#0b3647', arrival: 'in seconds' },
  { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, tint: '#1f6f79', arrival: 'in seconds' },
  { code: 'GBP', name: 'British pound', symbol: '£', decimals: 2, tint: '#4a3f8f', arrival: 'in seconds' },
  { code: 'CAD', name: 'Canadian dollar', symbol: 'C$', decimals: 2, tint: '#a3352e', arrival: 'within 1 hour' },
  { code: 'AUD', name: 'Australian dollar', symbol: 'A$', decimals: 2, tint: '#7a5a12', arrival: 'within 1 hour' },
  { code: 'JPY', name: 'Japanese yen', symbol: '¥', decimals: 0, tint: '#8c2f4f', arrival: 'by tomorrow' },
  { code: 'INR', name: 'Indian rupee', symbol: '₹', decimals: 2, tint: '#9a4a12', arrival: 'within 2 hours' },
  { code: 'MXN', name: 'Mexican peso', symbol: 'MX$', decimals: 2, tint: '#1d6a42', arrival: 'in minutes' },
  { code: 'SGD', name: 'Singapore dollar', symbol: 'S$', decimals: 2, tint: '#6b3a8a', arrival: 'in minutes' },
  { code: 'BRL', name: 'Brazilian real', symbol: 'R$', decimals: 2, tint: '#2f6b2a', arrival: 'in minutes' },
]

const perUsd: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.9218,
  GBP: 0.7864,
  CAD: 1.3842,
  AUD: 1.5231,
  JPY: 151.62,
  INR: 83.412,
  MXN: 17.083,
  SGD: 1.3457,
  BRL: 5.0124,
}

export const MIN_SEND_USD = 1
export const MAX_SEND_USD = 1_000_000
/** Seconds a quote is guaranteed for. */
export const QUOTE_LOCK_SECONDS = 30

export function isCurrency(code: unknown): code is CurrencyCode {
  return typeof code === 'string' && code in perUsd
}

export function currency(code: CurrencyCode): Currency {
  return currencies.find((c) => c.code === code)!
}

/** Small deterministic drift (±0.15%) that changes every 10 seconds. */
function drift(code: CurrencyCode, at: number) {
  if (code === 'USD') return 1
  const bucket = Math.floor(at / 10_000)
  let h = bucket * 2654435761
  for (const ch of code) h = (h ^ ch.charCodeAt(0)) * 16777619
  const unit = ((h >>> 0) % 1000) / 1000 // 0..1
  return 1 + (unit - 0.5) * 0.003
}

/** Mid-market rate: how many `to` one `from` buys at time `at`. */
export function midRate(from: CurrencyCode, to: CurrencyCode, at = Date.now()): number {
  const a = perUsd[from] * drift(from, at)
  const b = perUsd[to] * drift(to, at)
  return b / a
}

export type Speed = 'instant' | 'standard'

export type Quote = {
  from: CurrencyCode
  to: CurrencyCode
  /** Amount the sender pays, including fees. */
  sendAmount: number
  /** Fixed fee plus percentage fee, in the send currency. */
  fee: number
  feeFixed: number
  feePercent: number
  /** Amount converted after fees. */
  converted: number
  rate: number
  receiveAmount: number
  speed: Speed
  arrival: string
  quotedAt: number
  expiresAt: number
}

/** Rounds to a currency's decimals. */
export function roundTo(value: number, code: CurrencyCode) {
  const f = 10 ** currency(code).decimals
  return Math.round(value * f) / f
}

/**
 * Prices a transfer. Fees: 0.45% (0.65% for instant cross-currency) plus a
 * fixed fee worth about $0.50, and nothing at all for same-currency sends.
 */
export function quote(from: CurrencyCode, to: CurrencyCode, sendAmount: number, speed: Speed = 'instant', at = Date.now()): Quote {
  const same = from === to
  const feePercent = same ? 0 : speed === 'instant' ? 0.65 : 0.45
  const feeFixed = same ? 0 : roundTo(0.5 * midRate('USD', from, at), from)
  const fee = roundTo(sendAmount * (feePercent / 100) + feeFixed, from)
  const converted = Math.max(0, sendAmount - fee)
  const rate = same ? 1 : midRate(from, to, at)
  const receiveAmount = roundTo(converted * rate, to)
  const arrival = same || speed === 'instant' ? currency(to).arrival : 'in 1 to 2 business days'
  return {
    from,
    to,
    sendAmount: roundTo(sendAmount, from),
    fee,
    feeFixed,
    feePercent,
    converted: roundTo(converted, from),
    rate,
    receiveAmount,
    speed,
    arrival,
    quotedAt: at,
    expiresAt: at + QUOTE_LOCK_SECONDS * 1000,
  }
}

/** What a typical high-street bank would charge: 3% markup plus $15. */
export function bankEstimate(from: CurrencyCode, to: CurrencyCode, sendAmount: number, at = Date.now()) {
  const fee = 15 * midRate('USD', from, at)
  const rate = midRate(from, to, at) * 0.97
  return roundTo(Math.max(0, sendAmount - fee) * rate, to)
}

/** Send amount limits expressed in a currency. */
export function limits(code: CurrencyCode) {
  const r = midRate('USD', code, 0)
  return { min: roundTo(MIN_SEND_USD * r, code), max: roundTo(MAX_SEND_USD * r, code) }
}

export function formatMoney(value: number, code: CurrencyCode, opts: { symbol?: boolean } = {}) {
  const c = currency(code)
  const n = value.toLocaleString('en-US', { minimumFractionDigits: c.decimals, maximumFractionDigits: c.decimals })
  return opts.symbol === false ? `${n} ${code}` : `${c.symbol}${n}`
}

export function formatRate(rate: number) {
  return rate >= 100 ? rate.toFixed(2) : rate >= 10 ? rate.toFixed(3) : rate.toFixed(4)
}
