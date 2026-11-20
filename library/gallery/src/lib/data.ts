import raw from "@/templates.json"

export type Template = {
  id: string
  name: string
  href: string
  preview: string
  industry: string
  industryShort: string
  audience: string
  category: string
  kind: "site" | "app" | "store" | "game" | string
  kindLabel: string
  status: string
  statusClass: "static" | "app" | "service"
  featured: boolean
  features: string[]
  needs: string[]
  tags: string[]
  description: string
  demoNote: string
}

export type Industry = {
  id: string
  label: string
  short: string
  copy: string
  audience: string
  cover: string | null
  count: number
}

export type GalleryData = {
  items: Template[]
  industries: Industry[]
  total: number
  apps: number
  whatsapp: string
}

export const data = raw as unknown as GalleryData

export const statusTone: Record<Template["statusClass"], string> = {
  static: "border-emerald-700/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-300",
  app: "border-sky-700/30 bg-sky-600/10 text-sky-700 dark:text-sky-300",
  service: "border-amber-700/30 bg-amber-600/10 text-amber-700 dark:text-amber-300",
}

export function cap(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
