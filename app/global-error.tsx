"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

import "./globals.css"

type GlobalErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body className="min-h-svh bg-background text-foreground antialiased">
        <main
          role="alert"
          className="flex min-h-svh w-full items-center justify-center p-6"
        >
          <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
            <p className="text-sm font-medium tracking-[0.2em] text-destructive uppercase">
              Error
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Prism needs a restart
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              An unexpected application error occurred. Try loading the page
              again.
            </p>
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  )
}
