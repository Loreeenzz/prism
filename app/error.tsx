"use client"

import Link from "next/link"
import * as Sentry from "@sentry/nextjs"
import { useEffect } from "react"

import { Button, buttonVariants } from "@/components/ui/button"

type ErrorPageProps = {
  error: Error & { digest?: string }
  retry: () => void
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <main
      role="alert"
      className="flex min-h-svh w-full items-center justify-center p-6"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-destructive uppercase">
          Error
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn&apos;t load this part of Prism. Try again, or return to the
          home page.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={() => retry()}>
            Try again
          </Button>
          <Link className={buttonVariants({ variant: "outline" })} href="/">
            Return home
          </Link>
        </div>
      </div>
    </main>
  )
}
