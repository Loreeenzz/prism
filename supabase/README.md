# Supabase CLI workflow

This project uses the Supabase CLI as a project-local development dependency.

## One-time setup

```bash
npm install
npm run supabase:login
npx supabase link --project-ref <your-project-ref>
```

The project reference is the identifier in the Supabase dashboard URL:
`https://supabase.com/dashboard/project/<project-ref>`.

## Database workflow

1. Create a migration with `npm run db:new -- create_profiles`.
2. Write and review the SQL under `supabase/migrations/`.
3. Check migration history with `npm run db:migrations`.
4. Preview remote changes with `npm run db:push:dry`.
5. Apply reviewed migrations with `npm run db:push`.
6. Regenerate `types/database.types.ts` with `npm run db:types` after schema changes.

## Database quality checks

Run these against the linked Supabase project before a production migration:

```bash
npm run db:lint
npm run db:advisors
```

`db:lint` checks the database for schema and PL/pgSQL issues. `db:advisors`
runs Supabase's Security and Performance Advisor checks, including checks for
missing RLS, missing primary keys, unindexed foreign keys, and unsafe policies.
Treat advisor findings as review items: confirm them against actual query
patterns before adding indexes or changing policies.

The linked project currently also reports leaked-password protection as a
dashboard warning. Enable that under Supabase Authentication → Password
Security before production; it cannot be configured by a migration.

Do not commit access tokens, database passwords, service-role keys, or production seed data.

The local Supabase Docker stack is intentionally not required by this project. Commands such as `supabase start`, `supabase db pull`, and `supabase db dump` are not part of the normal workflow here because the current CLI implementation uses Docker for those operations.

For production, use a CI/CD migration job or Supabase's GitHub integration so
schema changes are applied from version-controlled migrations rather than
manual dashboard edits. Keep staging and production projects separate when
the application begins accepting real users.

## Storage workflow

The `avatars` bucket is private, limited to JPEG/PNG/WebP files up to 5 MiB,
and scoped to paths beginning with the authenticated user's UUID. The storage
policies are versioned in the migration files; do not make the bucket public
or edit `storage.objects` directly.

Client code should upload through the Supabase Storage API using a path created
by `lib/storage/avatars.ts`. Use `createSignedUrl` when an authenticated user
needs temporary access to a private file. Standard uploads are intended for
small files; use resumable uploads for files larger than approximately 6 MiB.
