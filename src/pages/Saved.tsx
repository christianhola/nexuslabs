import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'

import { Button, ButtonLink, IconButton } from '../components/Button'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Photo } from '../components/Photo'
import { useToast } from '../components/Toast'
import { PROJECTS, ROOMS, SAVED_PAGE } from '../content'
import { useSaved } from '../lib/store'

export function Saved() {
  const { board, ids, toggle, setNote, clear } = useSaved()
  const [confirm, setConfirm] = useState(false)
  const toast = useToast()
  const rooms = ROOMS.filter((r) => ids.includes(r.id)).sort((a, b) => board[b.id].at - board[a.id].at)

  return (
    <>
      <PageHeader label={SAVED_PAGE.label} title={SAVED_PAGE.title} intro={SAVED_PAGE.intro}>
        {rooms.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/book" icon>
              {SAVED_PAGE.share}
            </ButtonLink>
            <Button variant="outline" onClick={() => setConfirm(true)}>
              {SAVED_PAGE.clear}
            </Button>
          </div>
        )}
      </PageHeader>

      <section aria-label="Saved rooms" className="container-page pb-28">
        {rooms.length === 0 ? (
          <div className="flex flex-col items-start gap-5 rounded-[var(--radius-md)] bg-card p-8 shadow-[var(--shadow-inset)] md:p-12">
            <p className="max-w-md text-[19px] leading-snug tracking-[-0.02em]">{SAVED_PAGE.empty}</p>
            <ButtonLink to="/portfolio" icon>
              Browse the portfolio
            </ButtonLink>
          </div>
        ) : (
          <ul className="grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {rooms.map((r) => {
                const project = PROJECTS.find((p) => p.slug === r.project)!
                return (
                  <motion.li key={r.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}>
                    <div className="relative">
                      <Link to={`/portfolio/${project.slug}#${r.id}`} aria-label={`${r.name}, ${project.name}`}>
                        <Photo name={r.image} alt="" className="aspect-[4/3]" />
                      </Link>
                      <IconButton
                        tone="glass"
                        aria-label={`Remove ${r.name} from ideas board`}
                        className="absolute top-3 right-3"
                        onClick={() => {
                          toggle(r.id)
                          toast(`${r.name} removed`)
                        }}
                      >
                        <X className="size-4" strokeWidth={1.75} />
                      </IconButton>
                    </div>
                    <h2 className="mt-3 text-[19px] font-medium tracking-[-0.03em]">
                      {r.name}
                      <span className="text-muted">, {project.name}</span>
                    </h2>
                    <label htmlFor={`note-${r.id}`} className="sr-only">
                      Note for {r.name}
                    </label>
                    <textarea
                      id={`note-${r.id}`}
                      rows={2}
                      maxLength={400}
                      placeholder={SAVED_PAGE.notePlaceholder}
                      value={board[r.id].note}
                      onChange={(e) => setNote(r.id, e.target.value)}
                      className="mt-2 w-full resize-none rounded-[var(--radius-sm)] border border-line bg-card px-3 py-2 text-[15px] placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                  </motion.li>
                )
              })}
            </AnimatePresence>
          </ul>
        )}
      </section>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={SAVED_PAGE.clear} description={SAVED_PAGE.clearConfirm}>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="outline" onClick={() => setConfirm(false)}>
            Keep them
          </Button>
          <Button
            onClick={() => {
              clear()
              setConfirm(false)
              toast('Ideas board cleared')
            }}
          >
            Clear board
          </Button>
        </div>
      </Modal>
    </>
  )
}
