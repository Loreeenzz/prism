import { redirect } from "next/navigation"

import { AppShell } from "@/components/layout/app-shell"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedLayout({
  children,
}: LayoutProps<"/protected">) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()

  if (error || !data?.claims) {
    redirect("/auth/login")
  }

  const email = typeof data.claims.email === "string" ? data.claims.email : undefined

  return <AppShell email={email}>{children}</AppShell>
}
