import Image from "next/image"
import Link from "next/link"

import { LogoutButton } from "@/components/auth/logout-button"
import { NavLinks } from "@/components/layout/nav-links"

type AppShellProps = {
  children: React.ReactNode
  email?: string
}

export function AppShell({ children, email }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col bg-muted/20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/protected"
            aria-label="Prism dashboard"
            className="flex items-center gap-2.5"
          >
            <Image
              src="/icons/prism-logo.svg"
              alt="Prism"
              width={144}
              height={48}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <NavLinks />

          <div className="ml-auto flex items-center gap-3">
            {email ? (
              <span className="hidden max-w-52 truncate text-sm text-muted-foreground sm:block">
                {email}
              </span>
            ) : null}
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  )
}
