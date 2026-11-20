import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { FolderX, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button, ButtonLink, IconButton } from '../../components/Button'
import { EmptyState } from '../../components/EmptyState'
import { Field, Input, Textarea } from '../../components/Field'
import { Modal } from '../../components/Modal'
import { useToast } from '../../components/Toast'
import { APP } from '../../content'
import { useLibrary } from '../../lib/library'
import { navigate } from '../../lib/router'
import { useShell } from './AppShell'
import { ItemsView } from './ItemsView'

export function CollectionPage({ id }: { id: string }) {
  const lib = useLibrary()
  const toast = useToast()
  const { openSave } = useShell()
  const col = lib.collections.find((c) => c.id === id)
  const base = useMemo(() => lib.items.filter((i) => i.collectionId === id), [lib.items, id])
  const [editing, setEditing] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (col) document.title = `${col.name} | Keepsake`
  }, [col])

  if (!col)
    return (
      <div className="px-4 py-10 sm:px-8">
        <EmptyState icon={<FolderX aria-hidden className="size-5" />} title="That collection is gone" body="It may have been deleted. Its saves are still on your shelf." action={<ButtonLink href="/app" variant="soft">Back to My shelf</ButtonLink>} />
      </div>
    )

  const openEdit = () => {
    setName(col.name)
    setDesc(col.description)
    setError(undefined)
    setEditing(true)
  }
  const saveEdit = (e: FormEvent) => {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError('Name the collection.')
    if (lib.collections.some((c) => c.id !== col.id && c.name.toLowerCase() === n.toLowerCase())) return setError('Another collection already has that name.')
    lib.updateCollection(col.id, { name: n, description: desc.trim() })
    setEditing(false)
    toast('Collection updated')
  }

  return (
    <>
      <ItemsView
        key={id}
        base={base}
        title={col.name}
        searchLabel={`Search ${col.name}`}
        subtitle={
          <>
            {col.description || 'No description yet.'} <span className="text-subtle">· {base.length} saved</span>
          </>
        }
        actions={
          <>
            <IconButton label="Rename collection" variant="soft" size="sm" className="h-10 w-10" onClick={openEdit}>
              <Pencil aria-hidden className="size-4" />
            </IconButton>
            <IconButton label="Delete collection" variant="soft" size="sm" className="h-10 w-10" onClick={() => setConfirm(true)}>
              <Trash2 aria-hidden className="size-4" />
            </IconButton>
          </>
        }
        empty={{
          ...APP.emptyCollection,
          action: (
            <Button variant="lime" icon={<Plus aria-hidden className="size-4" />} onClick={() => openSave(col.id)}>
              Save into {col.name}
            </Button>
          ),
        }}
      />
      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        size="sm"
        title="Edit collection"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="submit" form="edit-col" variant="dark">
              Save changes
            </Button>
          </>
        }
      >
        <form id="edit-col" onSubmit={saveEdit} noValidate className="flex flex-col gap-5">
          <Field label="Name" error={error}>
            {({ id: fid, describedBy, invalid }) => (
              <Input
                id={fid}
                value={name}
                maxLength={40}
                onChange={(e) => {
                  setName(e.target.value)
                  setError(undefined)
                }}
                aria-invalid={invalid}
                aria-describedby={describedBy}
              />
            )}
          </Field>
          <Field label="Description" optional>
            {({ id: fid }) => <Textarea id={fid} value={desc} maxLength={160} onChange={(e) => setDesc(e.target.value)} />}
          </Field>
        </form>
      </Modal>
      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        size="sm"
        title={`Delete ${col.name}?`}
        description={`The collection goes. Its ${base.length} ${base.length === 1 ? 'save stays' : 'saves stay'} on your shelf.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const snapshot = { col, ids: base.map((i) => i.id) }
                lib.removeCollection(col.id)
                setConfirm(false)
                navigate('/app')
                toast(`Deleted ${snapshot.col.name}`, {
                  label: 'Undo',
                  onClick: () => {
                    lib.restoreCollection(snapshot.col, snapshot.ids)
                    navigate(`/app/c/${snapshot.col.id}`)
                  },
                })
              }}
            >
              Delete collection
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-muted">Search will stop recognising “{col.name}” as a filter.</p>
      </Modal>
    </>
  )
}
