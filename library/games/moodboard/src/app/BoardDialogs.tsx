import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { Input } from '../components/Input'
import type { Board } from '../lib/types'

/** Name a new board or rename an existing one. */
export function NameDialog({
  open,
  title,
  initial,
  confirm,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  initial: string
  confirm: string
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState<string>()
  useEffect(() => {
    if (open) {
      setName(initial)
      setError(undefined)
    }
  }, [open, initial])
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const v = name.trim()
    if (!v) return setError('Give the board a name.')
    if (v.length > 60) return setError('Keep it under 60 characters.')
    onSubmit(v)
    onClose()
  }
  return (
    <Dialog open={open} onClose={onClose} title={title}>
      <form id="name-form" onSubmit={submit} noValidate className="pb-1">
        <Input
          label="Board name"
          data-autofocus
          value={name}
          maxLength={80}
          onChange={(e) => {
            setName(e.target.value)
            setError(undefined)
          }}
          onFocus={(e) => e.currentTarget.select()}
          error={error}
        />
      </form>
      <div className="flex justify-end gap-2 pb-2 pt-5">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="name-form">
          {confirm}
        </Button>
      </div>
    </Dialog>
  )
}

/** Confirm before deleting a board. */
export function DeleteDialog({ board, onClose, onConfirm }: { board: Board | null; onClose: () => void; onConfirm: (b: Board) => void }) {
  return (
    <Dialog
      open={!!board}
      onClose={onClose}
      title="Delete board?"
      description={board ? `“${board.name}” and its ${board.items.length} items will be removed from this browser.` : undefined}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} data-autofocus>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              if (board) onConfirm(board)
              onClose()
            }}
          >
            Delete board
          </Button>
        </>
      }
    />
  )
}
