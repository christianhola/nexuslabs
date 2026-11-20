import { useState } from 'react'
import { ClipboardList, LibraryBig, RotateCcw, Users } from 'lucide-react'

import { cx } from '../lib/cx'
import { isCurrent, Link, useLocation } from '../lib/router'
import { resetDemo } from '../lib/store'
import { Button } from './Button'
import { Container } from './Container'
import { Modal } from './Modal'
import { useToast } from './Toast'

const TABS = [
  { label: 'Assessments', href: '/assessments', icon: ClipboardList },
  { label: 'Question library', href: '/library', icon: LibraryBig },
  { label: 'Candidates', href: '/reports', icon: Users },
]

/** The hiring workspace's sub-navigation, shown above the app screens. */
export function WorkspaceBar() {
  const { path } = useLocation()
  const [confirm, setConfirm] = useState(false)
  const toast = useToast()
  return (
    <div className="border-b border-white/7 bg-surface/60">
      <Container wide className="flex items-center gap-2 overflow-x-auto py-2">
        <span className="mr-3 hidden shrink-0 items-center gap-2 text-[14px] text-muted md:inline-flex">
          <span aria-hidden className="grid size-6 place-items-center rounded-[7px] bg-brand/15 text-[12px] font-semibold text-brand-text">A</span>
          Acme hiring
        </span>
        <nav aria-label="Workspace" className="flex gap-1">
          {TABS.map((t) => {
            const on = isCurrent(t.href, path)
            return (
              <Link key={t.href} href={t.href} aria-current={on ? 'page' : undefined} className={cx('inline-flex h-10 shrink-0 items-center gap-2 rounded-[10px] px-3 text-[14.5px] transition-colors', on ? 'bg-white/8 text-fg' : 'text-muted hover:bg-white/5 hover:text-fg')}>
                <t.icon aria-hidden className={cx('size-4', on && 'text-brand-text')} />
                {t.label}
              </Link>
            )
          })}
        </nav>
        <Button variant="ghost" size="sm" className="ml-auto" icon={<RotateCcw className="size-3.5" />} onClick={() => setConfirm(true)}>
          Reset demo data
        </Button>
      </Container>
      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset demo data?" description="Removes your submitted attempts, review notes and saved assessments from this browser. The sample candidates stay.">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              resetDemo()
              setConfirm(false)
              toast('Demo data reset.')
            }}
          >
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  )
}
