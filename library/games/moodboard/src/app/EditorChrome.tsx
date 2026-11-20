import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Hand,
  ImagePlus,
  Keyboard,
  LayoutGrid,
  Map as MapIcon,
  Maximize,
  Minus,
  MousePointer2,
  MoreHorizontal,
  PenLine,
  Play,
  Plus,
  Redo2,
  StickyNote,
  Trash2,
  Type,
  Undo2,
} from 'lucide-react'

import { Button } from '../components/Button'
import { IconButton } from '../components/IconButton'
import { Link } from '../components/Link'
import { Menu, type MenuItem } from '../components/Menu'
import { Panel, Toolbar, ToolbarDivider } from '../components/Panel'
import { useToast } from '../components/Toast'
import { Wordmark } from '../components/Wordmark'
import { cx } from '../lib/cx'
import { boardPath, navigate } from '../lib/router'
import { createBoard, deleteBoard, duplicateBoard, getState, renameBoard, restoreBoard, useStore } from '../lib/store'
import type { Board } from '../lib/types'
import { DeleteDialog, NameDialog } from './BoardDialogs'

export type Tool = 'select' | 'hand'

/** Board actions shared by the editor's switcher and the boards page. */
export function useBoardActions() {
  const toast = useToast()
  const [naming, setNaming] = useState<{ mode: 'new' | 'rename'; board?: Board } | null>(null)
  const [deleting, setDeleting] = useState<Board | null>(null)

  const remove = (b: Board) => {
    const index = getState().boards.findIndex((x) => x.id === b.id)
    const wasActive = getState().activeId === b.id
    const viewing = location.pathname.startsWith(boardPath(b.id))
    deleteBoard(b.id)
    if (viewing) navigate('/boards')
    toast(`Deleted “${b.name}”`, {
      action: {
        label: 'Undo',
        onClick: () => {
          restoreBoard(b, index)
          if (wasActive) navigate(boardPath(b.id))
        },
      },
    })
  }

  const dialogs = (
    <>
      <NameDialog
        open={!!naming}
        title={naming?.mode === 'rename' ? 'Rename board' : 'New board'}
        confirm={naming?.mode === 'rename' ? 'Save' : 'Create board'}
        initial={naming?.board?.name ?? 'Untitled board'}
        onClose={() => setNaming(null)}
        onSubmit={(name) => {
          if (naming?.mode === 'rename' && naming.board) renameBoard(naming.board.id, name)
          else navigate(boardPath(createBoard(name).id))
        }}
      />
      <DeleteDialog board={deleting} onClose={() => setDeleting(null)} onConfirm={remove} />
    </>
  )

  return {
    dialogs,
    newBoard: () => setNaming({ mode: 'new' }),
    rename: (b: Board) => setNaming({ mode: 'rename', board: b }),
    askDelete: (b: Board) => setDeleting(b),
    duplicate: (b: Board) => {
      const c = duplicateBoard(b.id)
      if (c) toast(`Duplicated as “${c.name}”`)
      return c
    },
  }
}

function BoardSwitcher({ board }: { board: Board }) {
  const boards = useStore((s) => s.boards)
  const ba = useBoardActions()
  const items: MenuItem[] = [
    { type: 'label', label: 'Boards' },
    ...boards.map(
      (b): MenuItem => ({
        label: b.name,
        checked: b.id === board.id,
        icon: b.id === board.id ? <Check /> : undefined,
        onSelect: () => navigate(boardPath(b.id)),
      }),
    ),
    { type: 'separator' },
    { label: 'New board', icon: <Plus />, onSelect: ba.newBoard },
    { label: 'Rename…', icon: <PenLine />, onSelect: () => ba.rename(board) },
    {
      label: 'Duplicate',
      icon: <Copy />,
      onSelect: () => {
        const c = ba.duplicate(board)
        if (c) navigate(boardPath(c.id))
      },
    },
    { label: 'All boards', icon: <LayoutGrid />, onSelect: () => navigate('/boards') },
    { type: 'separator' },
    { label: 'Delete board', icon: <Trash2 />, danger: true, onSelect: () => ba.askDelete(board) },
  ]
  return (
    <>
      <Menu
        label="Boards"
        items={items}
        trigger={(p) => (
          <Button {...p} variant="ghost" className="min-w-0 !gap-1.5 !rounded-[8px] !pl-2.5 !pr-2 sm:!h-9" iconRight={<ChevronDown size={15} className="shrink-0 text-muted" />}>
            <span className="max-w-[38vw] truncate sm:max-w-[220px]">{board.name}</span>
          </Button>
        )}
      />
      {ba.dialogs}
    </>
  )
}

export function TopBar({
  board,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onExport,
  exporting,
  onPresent,
  onShortcuts,
}: {
  board: Board
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onExport: () => void
  exporting: boolean
  onPresent: () => void
  onShortcuts: () => void
}) {
  return (
    <div data-chrome className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-3 sm:p-4">
      <Panel className="pointer-events-auto flex min-w-0 animate-rise items-center gap-0.5 p-1">
        <Link href="/" aria-label="Inspo home" className="flex h-10 items-center rounded-[8px] px-2.5 transition-colors hover:bg-black/[0.05] sm:h-9">
          <Wordmark size="sm" />
        </Link>
        <ToolbarDivider />
        <BoardSwitcher board={board} />
      </Panel>
      <Toolbar aria-label="Board actions" className="pointer-events-auto animate-rise [animation-delay:60ms]">
        <IconButton label="Undo" keys={['Mod', 'Z']} tooltip="bottom" disabled={!canUndo} onClick={onUndo}>
          <Undo2 size={17} />
        </IconButton>
        <IconButton label="Redo" keys={['Mod', 'Shift', 'Z']} tooltip="bottom" disabled={!canRedo} onClick={onRedo}>
          <Redo2 size={17} />
        </IconButton>
        <span className="contents max-md:hidden">
          <ToolbarDivider />
          <IconButton label="Keyboard shortcuts" keys={['?']} tooltip="bottom" onClick={onShortcuts}>
            <Keyboard size={17} />
          </IconButton>
          <IconButton label="Export PNG" keys={['Mod', 'E']} tooltip="bottom" disabled={exporting} onClick={onExport}>
            <Download size={17} className={cx(exporting && 'animate-pulse')} />
          </IconButton>
          <IconButton label="All boards" tooltip="bottom" onClick={() => navigate('/boards')}>
            <LayoutGrid size={17} />
          </IconButton>
          <Button size="sm" className="ml-1 h-9" icon={<Play size={14} className="fill-current" />} onClick={onPresent}>
            Present
          </Button>
        </span>
        <span className="contents md:hidden">
          <Menu
            label="More actions"
            align="end"
            items={[
              { label: 'Present', icon: <Play />, onSelect: onPresent },
              { label: 'Export PNG', icon: <Download />, onSelect: onExport },
              { label: 'All boards', icon: <LayoutGrid />, onSelect: () => navigate('/boards') },
              { label: 'Keyboard shortcuts', icon: <Keyboard />, onSelect: onShortcuts },
            ]}
            trigger={(p) => (
              <IconButton {...p} label="More actions" tooltip={false}>
                <MoreHorizontal size={18} />
              </IconButton>
            )}
          />
        </span>
      </Toolbar>
    </div>
  )
}

export function BottomTools({
  tool,
  onTool,
  onImage,
  onNote,
  onText,
}: {
  tool: Tool
  onTool: (t: Tool) => void
  onImage: () => void
  onNote: () => void
  onText: () => void
}) {
  return (
    <div data-chrome className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-4">
      <Toolbar aria-label="Tools" className="pointer-events-auto animate-rise gap-1 p-1.5 [animation-delay:120ms]">
        <IconButton label="Select" keys={['V']} active={tool === 'select'} onClick={() => onTool('select')}>
          <MousePointer2 size={17} />
        </IconButton>
        <IconButton label="Hand" keys={['H']} active={tool === 'hand'} onClick={() => onTool('hand')}>
          <Hand size={17} />
        </IconButton>
        <ToolbarDivider />
        <IconButton label="Add images" keys={['I']} onClick={onImage}>
          <ImagePlus size={17} />
        </IconButton>
        <IconButton label="Sticky note" keys={['N']} onClick={onNote}>
          <StickyNote size={17} />
        </IconButton>
        <IconButton label="Text" keys={['T']} onClick={onText}>
          <Type size={17} />
        </IconButton>
      </Toolbar>
    </div>
  )
}

export function ZoomBar({
  zoom,
  onIn,
  onOut,
  onReset,
  onFit,
  minimap,
  onMinimap,
}: {
  zoom: number
  onIn: () => void
  onOut: () => void
  onReset: () => void
  onFit: () => void
  minimap: boolean
  onMinimap: () => void
}) {
  return (
    <Toolbar aria-label="Zoom" className="animate-rise [animation-delay:160ms]">
      <IconButton label="Zoom out" keys={['Mod', '−']} size="sm" onClick={onOut} disabled={zoom <= 0.1001}>
        <Minus size={15} />
      </IconButton>
      <Button variant="ghost" size="sm" onClick={onReset} aria-label={`Zoom ${Math.round(zoom * 100)}%. Reset to 100%`} className="min-w-[52px] !px-1 tabular-nums text-ink-2">
        {Math.round(zoom * 100)}%
      </Button>
      <IconButton label="Zoom in" keys={['Mod', '+']} size="sm" onClick={onIn} disabled={zoom >= 3.999}>
        <Plus size={15} />
      </IconButton>
      <ToolbarDivider />
      <IconButton label="Zoom to fit" keys={['Shift', '1']} size="sm" onClick={onFit}>
        <Maximize size={14} />
      </IconButton>
      <span className="contents max-md:hidden">
        <IconButton label={minimap ? 'Hide minimap' : 'Show minimap'} keys={['M']} size="sm" active={minimap} onClick={onMinimap}>
          <MapIcon size={15} />
        </IconButton>
      </span>
    </Toolbar>
  )
}
