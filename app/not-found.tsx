import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium tracking-[0.2em] text-muted-foreground uppercase">
          404
        </p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          The page you requested does not exist or may have moved.
        </p>
        <Link className={buttonVariants()} href="/">
          Return home
        </Link>
      </div>
    </main>
  )
}
