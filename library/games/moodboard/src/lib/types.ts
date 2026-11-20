export type ItemKind = 'image' | 'note' | 'text' | 'swatch'

export type NoteColor = 'butter' | 'blush' | 'sky' | 'mint' | 'lilac' | 'paper'

/** One thing on the canvas. x/y is the top-left of the unrotated box, in world units. */
export type Item = {
  id: string
  kind: ItemKind
  x: number
  y: number
  w: number
  h: number
  /** Degrees, clockwise, around the box centre. */
  rotation: number
  /** image: `lib:<key>` for built-in art (see IMAGES), `idb:<key>` for an uploaded blob. */
  src?: string
  alt?: string
  /** note / text body. */
  text?: string
  color?: NoteColor
  fontSize?: number
  /** swatch: hex colours. */
  colors?: string[]
}

/** The point at the middle of the viewport, in world units, and the zoom. */
export type Camera = { cx: number; cy: number; zoom: number }

export type Board = {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  items: Item[]
  camera: Camera
}

export type Rect = { x: number; y: number; w: number; h: number }
