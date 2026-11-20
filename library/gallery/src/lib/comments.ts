export type Comment = {
  id: string
  name: string
  body: string
  image: string | null
  avatar?: string | null
  likes?: number
  likedByMe?: boolean
  createdAt: number
}

const KEY = "nexus-comments-v1"

export function readComments(): Comment[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Comment[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function writeComments(comments: Comment[]) {
  localStorage.setItem(KEY, JSON.stringify(comments))
}

export function googleImageUrl(value: string) {
  const url = value.trim()
  const file = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  )
  if (file) {
    return `https://lh3.googleusercontent.com/d/${file[1]}`
  }
  const open = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (open) {
    return `https://lh3.googleusercontent.com/d/${open[1]}`
  }
  return url
}

export function isImageUrl(value: string) {
  return (
    /^https?:\/\//i.test(value) &&
    (/\.(png|jpe?g|webp|gif|avif)(\?.*)?$/i.test(value) ||
      /googleusercontent\.com\/d\//.test(value) ||
      /images\.unsplash\.com\//.test(value))
  )
}

export function compressImage(file: File, maxPixels = 1200): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("El archivo no es una imagen."))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("No se pudo abrir la imagen."))
      image.onload = () => {
        const scale = Math.min(1, maxPixels / Math.max(image.width, image.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.round(image.width * scale)
        canvas.height = Math.round(image.height * scale)
        const context = canvas.getContext("2d")
        if (!context) {
          reject(new Error("Tu navegador no pudo procesar la imagen."))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", maxPixels <= 320 ? 0.82 : 0.78))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}
