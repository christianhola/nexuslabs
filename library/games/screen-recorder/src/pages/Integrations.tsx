import { Search } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'

import { Button } from '@/components/Button'
import { Container } from '@/components/Frame'
import { useToast } from '@/components/Toast'
import { Badge, Chip, EmptyState, Input, SearchField } from '@/components/ui'
import { type Integration, INTEGRATION_CATEGORIES, INTEGRATIONS } from '@/content'
import { cn } from '@/lib/cn'
import { actions, useStore } from '@/lib/store'
import { MarketingPage } from './Shell'

/** Invented integration marks, drawn in SVG from a glyph id and a colour. */
export function IntegrationMark({ glyph, color, size = 44 }: Pick<Integration, 'glyph' | 'color'> & { size?: number }) {
  const g = {
    ring: <circle cx="12" cy="12" r="6" fill="none" stroke={color} strokeWidth="3" />,
    bolt: <path d="M13 3 6 13h5l-1 8 7-10h-5z" fill={color} />,
    stack: (
      <g fill={color}>
        <rect x="5" y="5" width="14" height="4" rx="1.5" />
        <rect x="5" y="11" width="14" height="4" rx="1.5" opacity=".7" />
        <rect x="5" y="17" width="9" height="3" rx="1.5" opacity=".45" />
      </g>
    ),
    leaf: <path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zm0 0 7-7" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" />,
    grid: (
      <g fill={color}>
        <rect x="5" y="5" width="6" height="6" rx="1.5" />
        <rect x="13" y="5" width="6" height="6" rx="1.5" opacity=".6" />
        <rect x="5" y="13" width="6" height="6" rx="1.5" opacity=".6" />
        <rect x="13" y="13" width="6" height="6" rx="1.5" />
      </g>
    ),
    wave: <path d="M3 13c2-5 4-5 6 0s4 5 6 0 4-5 6 0" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />,
    node: (
      <g fill="none" stroke={color} strokeWidth="2.4">
        <circle cx="6" cy="16" r="3" />
        <circle cx="18" cy="8" r="3" />
        <path d="M9 16h3a3 3 0 0 0 3-3v-2" />
      </g>
    ),
    spark: <path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l3.5 3.5m5 5L18 18M18 6l-3.5 3.5m-5 5L6 18" stroke={color} strokeWidth="2.2" strokeLinecap="round" />,
  }[glyph]
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-[12px] bg-surface-2 ring-1 ring-line-strong" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55}>
        {g}
      </svg>
    </span>
  )
}

export function Integrations() {
  const connected = useStore((s) => s.connected)
  const toast = useToast()
  const [cat, setCat] = useState<(typeof INTEGRATION_CATEGORIES)[number]>('All')
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const n = q.trim().toLowerCase()
    return INTEGRATIONS.filter((i) => (cat === 'All' || i.category === cat) && (!n || `${i.name} ${i.blurb} ${i.category}`.toLowerCase().includes(n)))
  }, [cat, q])

  const [req, setReq] = useState('')
  const [reqErr, setReqErr] = useState<string | null>(null)
  const request = (e: FormEvent) => {
    e.preventDefault()
    if (req.trim().length < 2) return setReqErr('Name the tool you want us to connect.')
    toast({ title: `Thanks — we’ll let you know when ${req.trim()} is ready.` })
    setReq('')
    setReqErr(null)
  }

  const toggle = (i: Integration) => {
    const on = connected.includes(i.id)
    actions.toggleIntegration(i.id)
    toast({ title: on ? `${i.name} disconnected` : `${i.name} connected (demo)` })
  }

  return (
    <MarketingPage eyebrow="Integrations" title="Send clips where the work happens." sub="Connect your agents, tickets, chat and CRM. Every integration on this page is invented for the template: replace them with your own.">
      <Container className="pb-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1" role="group" aria-label="Category">
            {INTEGRATION_CATEGORIES.map((c) => (
              <Chip key={c} pressed={cat === c} onClick={() => setCat(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <SearchField label="Search integrations" placeholder="Search integrations" value={q} onChange={(e) => setQ(e.target.value)} className="md:ml-auto md:w-[280px]" />
        </div>

        {list.length === 0 ? (
          <EmptyState
            className="mt-8"
            icon={<Search className="size-5" />}
            title="No integrations match"
            body="Try another word, or ask us to build it below."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ('')
                  setCat('All')
                }}
              >
                Clear filters
              </Button>
            }
          />
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((i) => {
              const on = connected.includes(i.id)
              return (
                <li key={i.id} className={cn('flex flex-col rounded-[20px] bg-surface p-5 ring-1 transition-shadow', on ? 'ring-line-strong' : 'ring-line')}>
                  <div className="flex items-start gap-4">
                    <IntegrationMark glyph={i.glyph} color={i.color} />
                    <div className="min-w-0 flex-1">
                      <h2 className="flex items-center gap-2 text-[16px] font-medium">
                        {i.name}
                        {i.featured && <Badge tone="ember">Popular</Badge>}
                      </h2>
                      <p className="text-[13px] text-faint">{i.category}</p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-[14.5px] leading-relaxed text-muted">{i.blurb}</p>
                  <div className="mt-5 flex items-center justify-between">
                    {on ? <Badge tone="ok">Connected</Badge> : <span className="text-[13px] text-faint">Not connected</span>}
                    <Button size="sm" variant={on ? 'ghost' : 'secondary'} onClick={() => toggle(i)} aria-label={`${on ? 'Disconnect' : 'Connect'} ${i.name}`}>
                      {on ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        <form onSubmit={request} noValidate className="mt-12 grid items-start gap-4 rounded-[24px] bg-surface p-6 ring-1 ring-line sm:p-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[19px] font-medium tracking-[-0.02em]">Missing a tool?</h2>
            <p className="mt-1 text-[15px] text-muted">Tell us what to connect next. Or use the REST API and webhooks today.</p>
            <Input
              label="Tool name"
              hideLabel
              className="mt-4 max-w-[420px]"
              placeholder="e.g. your helpdesk"
              value={req}
              onChange={(e) => {
                setReq(e.target.value)
                setReqErr(null)
              }}
              error={reqErr}
            />
          </div>
          <Button type="submit" variant="primary" className="md:mt-[72px]">
            Request integration
          </Button>
        </form>
      </Container>
    </MarketingPage>
  )
}
