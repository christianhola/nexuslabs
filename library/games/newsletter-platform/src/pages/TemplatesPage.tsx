import { LayoutTemplate, Search } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { Container } from '../components/Container'
import { EmptyState } from '../components/EmptyState'
import { Input, Select } from '../components/Field'
import { IssuePreview } from '../components/IssuePreview'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { TemplateCard } from '../components/TemplateCard'
import { toast } from '../components/Toast'
import type { Template } from '../content'
import { templateCategories, templates } from '../content'
import { cx } from '../lib/cx'
import { newId } from '../lib/draft'
import { navigate, useLocation } from '../lib/router'
import { write } from '../lib/storage'

type Sort = 'popular' | 'name'

export function TemplatesPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const cat = (templateCategories as readonly string[]).includes(params.get('category') ?? '') ? (params.get('category') as string) : 'All'
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('popular')
  const [open, setOpen] = useState<Template | null>(null)
  // Keep the last template so the dialog's content stays put while it animates out.
  const last = useRef<Template | null>(null)
  if (open) last.current = open
  const shown = open ?? last.current

  const setCat = (c: string) => navigate(c === 'All' ? '/templates' : `/templates?category=${encodeURIComponent(c)}`, { replace: true })

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return templates
      .filter((t) => cat === 'All' || t.category === cat)
      .filter((t) => !s || `${t.name} ${t.description} ${t.category}`.toLowerCase().includes(s))
      .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b.uses - a.uses))
  }, [q, cat, sort])

  const use = (t: Template) => {
    write('draft', { ...t.issue, accent: t.accent, font: t.font, blocks: t.issue.blocks.map((b) => ({ ...b, id: newId() })) })
    setOpen(null)
    navigate('/editor')
    toast(`Loaded the ${t.name} template`)
  }

  return (
    <>
      <PageHeader eyebrow="Templates" title="Start from a layout readers love" intro="Every template is a real issue you can edit. Pick one to open it in the editor with your brand applied." />
      <Container className="pb-24">
        <div className="flex flex-col gap-4 border-b border-line pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label="Category" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {templateCategories.map((c) => (
              <button key={c} type="button" aria-pressed={cat === c} onClick={() => setCat(c)} className={cx('h-10 shrink-0 rounded-[8px] border px-4 text-[14px] font-medium transition-colors', cat === c ? 'border-white bg-white text-night' : 'border-line-strong text-body hover:border-[#4d4858] hover:text-white')}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 lg:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <label htmlFor="tpl-q" className="sr-only">
                Search templates
              </label>
              <Input id="tpl-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search templates" className="pl-9" />
            </div>
            <label htmlFor="tpl-sort" className="sr-only">
              Sort
            </label>
            <Select id="tpl-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="w-[150px]">
              <option value="popular">Most used</option>
              <option value="name">A to Z</option>
            </Select>
          </div>
        </div>
        <p className="mt-5 text-[14px] text-muted" role="status">
          {list.length} {list.length === 1 ? 'template' : 'templates'}
          {cat !== 'All' ? ` in ${cat}` : ''}
          {q.trim() ? ` matching “${q.trim()}”` : ''}
        </p>
        {list.length ? (
          <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <li key={t.id}>
                <TemplateCard t={t} onOpen={() => setOpen(t)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5">
            <EmptyState
              icon={<LayoutTemplate />}
              title="No templates match"
              body="Try a different word or category, or start from a blank issue."
              action={
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQ('')
                      setCat('All')
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button href="/editor">Open the editor</Button>
                </div>
              }
            />
          </div>
        )}
      </Container>
      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        width="lg"
        title={shown?.name}
        description={shown?.description}
        footer={
          shown ? (
            <>
              <span className="mr-auto flex items-center gap-2 text-[14px] text-muted">
                <Badge>{shown.category}</Badge>
                {shown.uses.toLocaleString('en-US')} writers
              </span>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Close
              </Button>
              <Button onClick={() => use(shown)} arrow>
                Use this template
              </Button>
            </>
          ) : null
        }
      >
        {shown ? <IssuePreview issue={{ ...shown.issue, accent: shown.accent, font: shown.font }} /> : null}
      </Modal>
    </>
  )
}
