import { cn } from "@/lib/utils"

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  )
}

function Attachment({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="attachment"
      data-orientation={orientation}
      className={cn(
        "group/attachment relative flex overflow-hidden rounded-xl border border-border bg-background",
        orientation === "vertical"
          ? "w-[9.5rem] flex-col"
          : "items-center gap-2.5 p-2 pr-3",
        className
      )}
      {...props}
    />
  )
}

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & { variant?: "icon" | "image" }) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden bg-muted",
        variant === "image"
          ? "aspect-[4/3] w-full [&_img]:size-full [&_img]:object-cover"
          : "size-9 rounded-lg [&_svg]:size-4",
        className
      )}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn("min-w-0 flex-1 p-2", className)}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="attachment-title"
      className={cn("truncate text-[0.74rem] font-medium", className)}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="attachment-description"
      className={cn("mt-0.5 text-[0.64rem] text-muted-foreground", className)}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "flex items-center gap-1 self-start p-1.5",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="attachment-action"
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground [&_svg]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
}
