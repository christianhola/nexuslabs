import { useState } from 'react'
import { Move, Plus, RotateCcw, Trash2 } from 'lucide-react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Card, CardTitle } from '../components/Card'
import { ChoiceChip } from '../components/ChoiceChip'
import { Dialog } from '../components/Dialog'
import { Field, Input } from '../components/Field'
import { Segmented } from '../components/Segmented'
import { useToast } from '../components/Toast'
import { floors } from '../data'
import { todayKey } from '../lib/dates'
import { useActions, useAppState } from '../lib/store'
import { PageHeader } from './AppShell'
import { FloorPlan } from './FloorPlan'

const FEATURES = ['Monitor', 'Dual monitor', 'Standing']

/** Floor plan editor: add, drag, nudge, relabel and remove desks. */
export function Admin() {
  const state = useAppState()
  const { addDesk, moveDesk, updateDesk, removeDesk, resetPlan, resetDemo } = useActions()
  const toast = useToast()
  const [floorId, setFloorId] = useState('ground')
  const [selected, setSelected] = useState<string>()
  const [confirm, setConfirm] = useState<null | 'delete' | 'reset' | 'demo'>(null)
  const sel = state.desks.find((d) => d.id === selected)
  const upcoming = sel ? state.bookings.filter((b) => b.resourceId === sel.id && b.date >= todayKey()).length : 0
  const count = state.desks.filter((d) => d.floorId === floorId).length

  return (
    <div className="mx-auto max-w-[1180px]">
      <PageHeader
        title="Floor plan editor"
        sub={`${count} desks on the ${floors.find((f) => f.id === floorId)?.name.toLowerCase()} · changes save as you go`}
        actions={
          <>
            <Button variant="outline" size="sm" icon={<RotateCcw className="size-3.5" aria-hidden />} onClick={() => setConfirm('reset')}>
              Reset plan
            </Button>
            <Button
              size="sm"
              icon={<Plus className="size-3.5" aria-hidden />}
              onClick={() => {
                const d = addDesk(floorId)
                setSelected(d.id)
                toast({ tone: 'success', title: `Desk ${d.id} added`, body: 'Drag it into place, or use the arrow keys.' })
              }}
            >
              Add desk
            </Button>
          </>
        }
      />
      <div className="mb-4">
        <Segmented label="Floor" value={floorId} onChange={(v) => (setFloorId(v), setSelected(undefined))} options={floors.map((f) => ({ value: f.id, label: f.name }))} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto blueprint bg-canvas p-3 sm:p-4">
            <FloorPlan
              edit
              className="min-w-[860px] md:min-w-[680px]"
              floorId={floorId}
              desks={state.desks}
              selected={selected}
              onDesk={(d) => setSelected(d.id)}
              onMove={(id, x, y, done) => moveDesk(id, x, y, !done)}
            />
          </div>
          <p className="flex items-center gap-1.5 border-t border-line-soft px-4 py-3 text-xs text-muted">
            <Move aria-hidden className="size-3.5" /> Drag desks to move them. With a desk focused, arrow keys nudge it (Shift for bigger steps).
          </p>
        </Card>

        <Card className="h-fit p-4">
          <CardTitle>{sel ? `Desk ${sel.id}` : 'Select a desk'}</CardTitle>
          {!sel ? (
            <p className="mt-2 text-xs text-muted">Click a desk on the plan to edit its zone and equipment, or remove it.</p>
          ) : (
            <div className="mt-3 grid gap-4">
              <Field label="Zone" hint="Shown on the floor map and in booking details.">
                {(p) => <Input {...p} value={sel.zone} onChange={(e) => updateDesk(sel.id, { zone: e.target.value })} />}
              </Field>
              <fieldset className="grid gap-1.5">
                <legend className="mb-1.5 text-xs font-semibold text-body">Equipment</legend>
                <div className="flex flex-wrap gap-1.5">
                  {FEATURES.map((f) => {
                    const on = sel.features.includes(f)
                    return (
                      <ChoiceChip
                        key={f}
                        selected={on}
                        className="h-8 px-2.5 text-xs max-md:h-10"
                        onClick={() => updateDesk(sel.id, { features: on ? sel.features.filter((x) => x !== f) : [...sel.features, f] })}
                      >
                        {f}
                      </ChoiceChip>
                    )
                  })}
                </div>
              </fieldset>
              <p className="text-xs text-muted tabular-nums">
                Position {sel.x}, {sel.y} · {upcoming ? <Badge tone="amber">{upcoming} upcoming bookings</Badge> : 'no upcoming bookings'}
              </p>
              <Button variant="danger" size="sm" icon={<Trash2 className="size-3.5" aria-hidden />} onClick={() => setConfirm('delete')}>
                Remove desk
              </Button>
            </div>
          )}
          <div className="mt-5 border-t border-line-soft pt-4">
            <p className="text-xs text-muted">Demo data lives in this browser.</p>
            <Button variant="ghost" size="sm" className="mt-1 -ml-3 max-md:h-10" onClick={() => setConfirm('demo')}>
              Reset all demo data
            </Button>
          </div>
        </Card>
      </div>

      <Dialog
        open={confirm !== null}
        onClose={() => setConfirm(null)}
        size="sm"
        title={confirm === 'delete' ? `Remove desk ${sel?.id}?` : confirm === 'reset' ? 'Reset the floor plan?' : 'Reset all demo data?'}
        description={
          confirm === 'delete'
            ? upcoming
              ? `${upcoming} upcoming booking${upcoming === 1 ? '' : 's'} on this desk will be cancelled.`
              : 'It has no upcoming bookings.'
            : confirm === 'reset'
              ? 'Every desk goes back to its original place. Bookings stay.'
              : 'Bookings, your week plan, the floor plan and onboarding all go back to the start.'
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Keep it
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (confirm === 'delete' && sel) {
                  removeDesk(sel.id)
                  toast({ tone: 'info', title: `Desk ${sel.id} removed` })
                  setSelected(undefined)
                } else if (confirm === 'reset') {
                  resetPlan()
                  toast({ tone: 'info', title: 'Floor plan reset' })
                } else if (confirm === 'demo') {
                  resetDemo()
                  toast({ tone: 'info', title: 'Demo data reset' })
                }
                setConfirm(null)
              }}
            >
              {confirm === 'delete' ? 'Remove' : 'Reset'}
            </Button>
          </>
        }
      />
    </div>
  )
}
