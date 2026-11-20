import { useEffect, useState } from 'react'
import { Copy, Download, LayoutGrid, MoreHorizontal, PenLine, Play, Plus, RotateCcw, Trash2 } from 'lucide-react'

import { COPY } from '../content'
import { Button } from '../components/Button'
import { Dialog } from '../components/Dialog'
import { EmptyState } from '../components/EmptyState'
import { IconButton } from '../components/IconButton'
import { Link } from '../components/Link'
import { Menu } from '../components/Menu'
import { useToast } from '../components/Toast'
import { Wordmark } from '../components/Wordmark'
import { relativeTime } from '../lib/cx'
import { boardToPng, downloadBlob, fileName } from '../lib/exportPng'
import { boardPath, navigate } from '../lib/router'
import { resetDemo, useStore } from '../lib/store'
import type { Board } from '../lib/types'
import { BoardThumb } from './BoardThumb'
import { useBoardActions } from './EditorChrome'

function BoardCard({ board, index, actions }: { board: Board; index: number; actions: ReturnType<typeof useBoardActions> }) {
  const toast = useToast()
  const count = board.items.length
  const exportIt = async () => {
    const blob = count ? await boardToPng(board) : null
    if (!blob) return toast('Nothing to export yet', { tone: 'error' })
    downloadBlob(blob, fileName(board.name))
    toast(`Exported ${fileName(board.name)}`)
  }
  return (
    <li className="group relative animate-rise" style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}>
      <Link
        href={boardPath(board.id)}
        className="block overflow-hidden rounded-[var(--radius-panel)] bg-surface shadow-[var(--shadow-card)] ring-1 ring-black/[0.04] transition-[box-shadow,transform] duration-200 ease-[var(--ease-out)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lift)]"
      >
        <BoardThumb board={board} className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-[1.015]" />
        <div className="border-t border-line px-4 pb-3.5 pt-3">
          <h2 className="truncate pr-10 text-[15px] font-medium tracking-[-0.01em] text-ink">{board.name}</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            {count} {count === 1 ? 'item' : 'items'} · edited {relativeTime(board.updatedAt)}
          </p>
        </div>
      </Link>
      <div className="absolute bottom-3 right-2.5">
        <Menu
          label={`${board.name} actions`}
          align="end"
          side="top"
          items={[
            { label: 'Open', icon: <LayoutGrid />, onSelect: () => navigate(boardPath(board.id)) },
            { label: 'Present', icon: <Play />, disabled: !count, onSelect: () => navigate(`${boardPath(board.id)}/present`) },
            { label: 'Export PNG', icon: <Download />, disabled: !count, onSelect: exportIt },
            { type: 'separator' },
            { label: 'Rename…', icon: <PenLine />, onSelect: () => actions.rename(board) },
            { label: 'Duplicate', icon: <Copy />, onSelect: () => actions.duplicate(board) },
            { type: 'separator' },
            { label: 'Delete…', icon: <Trash2 />, danger: true, onSelect: () => actions.askDelete(board) },
          ]}
          trigger={(p) => (
            <IconButton {...p} label={`More actions for ${board.name}`} tooltip={false} size="sm">
              <MoreHorizontal size={17} />
            </IconButton>
          )}
        />
      </div>
    </li>
  )
}

/** Grid of every board with live thumbnails. */
export function BoardsPage() {
  const boards = useStore((s) => s.boards)
  const actions = useBoardActions()
  const [resetting, setResetting] = useState(false)
  const toast = useToast()

  useEffect(() => {
    document.title = `${COPY.boardsTitle} — ${COPY.brand}`
  }, [])

  return (
    <div className="dot-grid min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" aria-label="Inspo home" className="flex min-h-10 items-center rounded-[8px] px-1">
            <Wordmark size="md" className="!text-[26px]" />
          </Link>
          <Button icon={<Plus size={16} />} onClick={actions.newBoard}>
            New board
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-10 sm:px-6">
        <div className="mb-7 animate-rise">
          <h1 className="text-[34px] font-medium leading-[1.1] tracking-[-0.035em] text-ink sm:text-[40px]">{COPY.boardsTitle}</h1>
          <p className="mt-1.5 text-[15px] text-muted">{COPY.boardsSubtitle}</p>
        </div>

        {boards.length ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b, i) => (
              <BoardCard key={b.id} board={b} index={i} actions={actions} />
            ))}
            <li className="animate-rise" style={{ animationDelay: `${Math.min(boards.length, 8) * 50}ms` }}>
              <button
                type="button"
                onClick={actions.newBoard}
                className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-panel)] border-2 border-dashed border-line-strong text-[14px] font-medium text-muted transition-colors duration-150 hover:border-ink/30 hover:bg-white/60 hover:text-ink"
              >
                <Plus size={20} />
                New board
              </button>
            </li>
          </ul>
        ) : (
          <EmptyState
            className="py-24"
            icon={<LayoutGrid size={20} />}
            title="No boards yet"
            body={COPY.emptyBoards}
            action={
              <Button icon={<Plus size={16} />} onClick={actions.newBoard}>
                New board
              </Button>
            }
          />
        )}
      </main>

      <footer className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-6 text-[13px] text-muted sm:px-6">
        <span>Inspo saves boards in this browser only.</span>
        <nav aria-label="Footer" className="flex items-center gap-1">
          <Link href="/styleguide" className="flex min-h-10 items-center rounded-[6px] px-2 underline-offset-2 hover:text-ink hover:underline">
            Style guide
          </Link>
          <button type="button" onClick={() => setResetting(true)} className="flex min-h-10 items-center gap-1.5 rounded-[6px] px-2 hover:text-ink">
            <RotateCcw size={13} /> Reset demo boards
          </button>
        </nav>
      </footer>

      {actions.dialogs}
      <Dialog
        open={resetting}
        onClose={() => setResetting(false)}
        title="Reset demo boards?"
        description="This replaces every board with the three demo boards. Images you uploaded stay in storage but are no longer placed."
        footer={
          <>
            <Button variant="secondary" data-autofocus onClick={() => setResetting(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                resetDemo()
                setResetting(false)
                toast('Demo boards restored')
              }}
            >
              Reset
            </Button>
          </>
        }
      />
    </div>
  )
}
