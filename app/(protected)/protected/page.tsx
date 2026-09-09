import { createClient } from '@/lib/supabase/server'

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data } = await supabase.auth.getClaims()
  const email = typeof data?.claims?.email === 'string' ? data.claims.email : 'there'

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="mt-2 text-muted-foreground">
          Hello {email}. Your Prism workspace is ready.
        </p>
      </div>

      <section className="rounded-xl border bg-card p-6 shadow-xs">
        <h2 className="font-heading text-lg font-medium">Getting started</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This dashboard is the starting point for the product workspace.
        </p>
      </section>

    </div>
  )
}
