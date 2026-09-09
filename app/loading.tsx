export default function Loading() {
  return (
    <main
      aria-live="polite"
      aria-busy="true"
      className="flex min-h-svh w-full items-center justify-center p-6"
    >
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
        />
        <span>Loading Prism…</span>
      </div>
    </main>
  )
}
