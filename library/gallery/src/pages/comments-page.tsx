import { useMemo, useState } from "react"
import {
  Heart,
  ImagePlus,
  Link2,
  Send,
  Trash2,
  UserRound,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { PageHero } from "@/pages/page-hero"
import { WhatsappIcon } from "@/components/social-icons"
import { customRequestWhatsApp, WHATSAPP_LABEL } from "@/lib/site"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  compressImage,
  googleImageUrl,
  isImageUrl,
  readComments,
  writeComments,
  type Comment,
} from "@/lib/comments"
import { cn } from "@/lib/utils"

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>(() => readComments())
  const [name, setName] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [link, setLink] = useState("")
  const [busy, setBusy] = useState(false)
  const [avatarBusy, setAvatarBusy] = useState(false)

  const count = comments.length
  const withImages = useMemo(
    () => comments.filter((comment) => comment.image).length,
    [comments]
  )

  function persist(next: Comment[]) {
    try {
      writeComments(next)
      setComments(next)
      return true
    } catch {
      toast.error("No hay espacio para guardar más imágenes", {
        description:
          "Borra algún comentario antiguo o sube una imagen más ligera.",
      })
      return false
    }
  }

  async function pickAvatar(file: File | undefined) {
    if (!file) return
    setAvatarBusy(true)
    try {
      setAvatar(await compressImage(file, 320))
      toast.success("Foto de perfil lista", {
        description: "Solo se guarda en este navegador.",
      })
    } catch (error) {
      toast.error("No se pudo usar la foto", {
        description:
          error instanceof Error ? error.message : "Prueba con otra imagen.",
      })
    } finally {
      setAvatarBusy(false)
    }
  }

  async function pickFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    try {
      setImage(await compressImage(file))
      setLink("")
      toast.success("Imagen lista", {
        description: "Se guarda solo en este navegador.",
      })
    } catch (error) {
      toast.error("No se pudo usar la imagen", {
        description:
          error instanceof Error ? error.message : "Prueba con otra foto.",
      })
    } finally {
      setBusy(false)
    }
  }

  function applyLink() {
    const value = googleImageUrl(link)
    if (!isImageUrl(value)) {
      toast.error("Ese enlace no parece una imagen", {
        description:
          "Usa un enlace directo .jpg/.png o el enlace de archivo de Google Drive.",
      })
      return
    }
    setImage(value)
    toast.success("Imagen de Google lista", {
      description: "Si el archivo no es público, no se verá.",
    })
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanBody = body.trim()

    if (!cleanName || !cleanBody) {
      toast.error("Faltan datos", {
        description: "Escribe tu nombre y tu comentario.",
      })
      return
    }

    const comment: Comment = {
      id: crypto.randomUUID(),
      name: cleanName,
      body: cleanBody,
      image,
      avatar,
      likes: 0,
      likedByMe: false,
      createdAt: Date.now(),
    }

    if (persist([comment, ...comments])) {
      setName("")
      setBody("")
      setImage(null)
      setLink("")
      toast.success("Comentario publicado", {
        description: "Guardado en este navegador.",
      })
    }
  }

  function remove(id: string) {
    persist(comments.filter((comment) => comment.id !== id))
  }

  function toggleLike(id: string) {
    persist(
      comments.map((comment) => {
        if (comment.id !== id) return comment
        const liked = Boolean(comment.likedByMe)
        return {
          ...comment,
          likedByMe: !liked,
          likes: Math.max(0, (comment.likes ?? 0) + (liked ? -1 : 1)),
        }
      })
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="Comentarios de la comunidad"
        title={
          <>
            Enseña tu versión.{" "}
            <span className="display-italic text-primary">Déjanos verla</span>.
          </>
        }
        description="Sube una foto de tu portátil o pega un enlace de Google Drive: cuéntanos qué plantilla usaste, qué cambiaste y cómo quedó. También puedes poner tu foto de perfil y dar me gusta. Todo se guarda en tu navegador, sin cuentas ni servidores."
        aside={
          <p className="text-[0.78rem] text-muted-foreground">
            {count} {count === 1 ? "comentario" : "comentarios"} · {withImages}{" "}
            con imagen
          </p>
        }
      />

      <div className="mx-auto grid w-full max-w-[1240px] gap-12 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <form
          onSubmit={submit}
          className="h-fit border-t border-border pt-6 lg:sticky lg:top-24"
        >
          <h2 className="font-display text-2xl leading-none">
            Deja tu comentario
          </h2>

          <div className="mt-5 flex items-center gap-3">
            <Avatar className="size-11">
              {avatar ? <AvatarImage src={avatar} alt="" /> : null}
              <AvatarFallback className="bg-primary/12 text-primary">
                {avatar ? <UserRound className="size-5" /> : initials(name) || "Tú"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-[0.78rem] font-medium">Tu foto de perfil</p>
              <p className="text-[0.66rem] leading-4 text-muted-foreground">
                Se recorta y reduce en tu navegador.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 shrink-0 gap-1.5 rounded-full px-3 text-[0.7rem]"
              disabled={avatarBusy}
              render={<label htmlFor="comment-avatar" />}
            >
              <ImagePlus className="size-3.5" />
              {avatarBusy ? "…" : avatar ? "Cambiar" : "Elegir"}
            </Button>
            <input
              id="comment-avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => pickAvatar(event.target.files?.[0])}
            />
          </div>

          <div className="mt-5 grid gap-4">
            <Field>
              <FieldLabel htmlFor="comment-name">Tu nombre</FieldLabel>
              <Input
                id="comment-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Christian"
                className="h-10"
                maxLength={60}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="comment-body">Qué quieres contar</FieldLabel>
              <Textarea
                id="comment-body"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Usé la plantilla Restaurant en un proyecto real y cambié…"
                rows={4}
                maxLength={500}
              />
            </Field>

            <div>
              <FieldLabel>Imagen de tu portátil</FieldLabel>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 gap-2 rounded-full"
                  disabled={busy}
                  render={<label htmlFor="comment-file" className="cursor-pointer" />}
                >
                  <ImagePlus data-icon="inline-start" />
                  {busy ? "Procesando…" : "Elegir foto"}
                </Button>
                <input
                  id="comment-file"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) => pickFile(event.target.files?.[0])}
                />
                <span className="text-[0.7rem] text-muted-foreground">
                  PNG, JPG o WebP · se reduce a 1200 px
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={link}
                    onChange={(event) => setLink(event.target.value)}
                    placeholder="O pega un enlace de Google Drive"
                    className="h-9 pl-8 text-[0.8rem]"
                    aria-label="Enlace de imagen de Google"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full"
                  onClick={applyLink}
                  disabled={!link.trim()}
                >
                  Usar
                </Button>
              </div>
            </div>

            {image ? (
              <div className="relative border-t border-border pt-3">
                <img
                  src={image}
                  alt="Vista previa de la imagen del comentario"
                  className="max-h-56 w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="mt-2 flex items-center justify-between gap-3 text-[0.7rem] text-muted-foreground">
                  <span>Captura adjunta · se guarda en este navegador</span>
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <X className="size-3.5" />
                    Quitar
                  </button>
                </div>
              </div>
            ) : null}

            {busy ? <Skeleton className="h-28 w-full" /> : null}

            <Button
              type="submit"
              className="mt-1 h-11 w-full gap-2 rounded-full"
              disabled={busy}
            >
              <Send data-icon="inline-start" />
              Publicar comentario
            </Button>
            <p className="text-[0.68rem] leading-4 text-muted-foreground">
              Se guarda en este navegador. No se sube a ningún servidor y
              desaparece si borras los datos del sitio.
            </p>

            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-border pt-4">
              <span className="text-[0.72rem] text-muted-foreground">
                ¿Prefieres contarlo en privado?
              </span>
              <a
                href={customRequestWhatsApp()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-foreground underline-offset-4 transition hover:text-primary hover:underline"
              >
                <WhatsappIcon className="size-3.5 text-emerald-500" />
                {WHATSAPP_LABEL}
              </a>
            </div>
          </div>
        </form>

        <div>
          {comments.length ? (
            <div className="grid gap-8">
              {comments.map((comment) => {
                const liked = Boolean(comment.likedByMe)
                return (
                  <article
                    key={comment.id}
                    className="border-t border-border pt-5"
                  >
                    {comment.image ? (
                      <a
                        href={comment.image}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden bg-muted/40"
                      >
                        <img
                          src={comment.image}
                          alt={`Proyecto compartido por ${comment.name}`}
                          className="max-h-[26rem] w-full object-cover transition-transform duration-700 hover:scale-[1.01]"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </a>
                    ) : null}

                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 pt-3">
                      <p className="flex items-center gap-2 text-[0.84rem] font-medium">
                        <Avatar className="size-6">
                          {comment.avatar ? (
                            <AvatarImage src={comment.avatar} alt="" />
                          ) : null}
                          <AvatarFallback className="text-[0.58rem]">
                            {initials(comment.name)}
                          </AvatarFallback>
                        </Avatar>
                        {comment.name}
                      </p>
                      <p className="mono-label">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>

                    <p className="mt-3 text-[0.9rem] leading-7 whitespace-pre-line">
                      {comment.body}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-2.5">
                      <button
                        type="button"
                        onClick={() => toggleLike(comment.id)}
                        aria-pressed={liked}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-1 py-1 text-[0.74rem] transition-colors",
                          liked
                            ? "text-rose-500"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Heart
                          className={cn("size-3.5", liked && "fill-current")}
                        />
                        {comment.likes ? comment.likes : "Me gusta"}
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-muted-foreground hover:text-destructive"
                              aria-label={`Borrar el comentario de ${comment.name}`}
                            >
                              <Trash2 />
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              ¿Borrar este comentario?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Se quitará de este navegador, junto con su imagen.
                              Esta acción no se puede deshacer.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => remove(comment.id)}>
                              Borrar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="flex min-h-[20rem] flex-col justify-center border-t border-border py-14">
              <p className="font-display text-2xl">
                Todavía no hay comentarios.
              </p>
              <p className="mt-2 max-w-sm text-[0.86rem] leading-6 text-muted-foreground">
                Sé la primera persona: sube una foto de tu proyecto y cuenta qué
                plantilla usaste. Aparecerá aquí mismo, sin recargar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
