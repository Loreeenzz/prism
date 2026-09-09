# Prism

Prism is a Next.js App Router project with Supabase password-based authentication.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/auth/login](http://localhost:3000/auth/login).

## Structure

The project uses the Next.js App Router with route groups that organize code without changing public URLs:

```text
app/
├── (auth)/auth/           # Authentication routes
├── (protected)/protected/ # Authenticated application routes
├── api/                   # Route handlers
├── fonts/                 # Local font assets
├── globals.css
├── layout.tsx
└── page.tsx
components/
├── auth/                  # Authentication UI
├── layout/                # App shell and navigation
├── shared/                # Cross-feature UI
└── ui/                    # Shared shadcn/ui primitives
config/                    # Application configuration
docs/                      # Architecture and project docs
features/                 # Product feature modules
hooks/                    # Shared client hooks
lib/
├── actions/               # Server Actions
├── data/                  # Server-side data access
├── supabase/              # Browser, server, and proxy clients
├── validators/            # Validation schemas
└── ...                    # Shared utilities
public/
├── icons/                 # Public icons
└── images/                # Public images
types/                     # Shared and generated TypeScript types
```

See [`docs/architecture.md`](docs/architecture.md) for the conventions behind this layout.

## Supabase setup

Copy `.env.example` to `.env.local` and add the Supabase project URL, publishable key, and local site URL.

Environment separation and the later Vercel Preview/Production workflow are documented in [`docs/environment-variables.md`](docs/environment-variables.md). The Supabase clients validate their required public configuration at runtime, while secrets remain outside the repository.

The deployment runbook is in [`docs/deployment.md`](docs/deployment.md). The
project is Vercel-ready without a `vercel.json`: Vercel detects the Next.js
framework and uses the existing `build` script.

The repository uses the project-local Supabase CLI for schema and migration management. Docker is not required for the current workflow.

After installing dependencies, authenticate and link this project to the Supabase project:

```bash
npm run supabase:login
npm run supabase:link -- <your-project-ref>
```

Useful database commands:

```bash
npm run db:new -- create_profiles  # Create a new SQL migration
npm run db:migrations              # Review local/remote migration history
npm run db:push:dry                # Preview changes without applying them
npm run db:lint                    # Check the linked database for schema issues
npm run db:advisors                # Run Supabase security/performance checks
npm run db:push     # Apply committed migrations to the linked project
npm run db:types    # Generate types/database.types.ts from the public schema
```

Storage is prepared with a private `avatars` bucket. Files are restricted to
JPEG, PNG, and WebP images up to 5 MiB, and Storage RLS policies limit each
user to paths under their own user ID. See [`lib/storage/avatars.ts`](lib/storage/avatars.ts)
and [`supabase/migrations/20260908040000_create_private_avatar_storage.sql`](supabase/migrations/20260908040000_create_private_avatar_storage.sql).

Review generated SQL before committing it. The local Docker stack (`npx supabase start`) and Docker-dependent schema pull commands are intentionally not part of this setup.

Authentication routes:

- `/auth/login`
- `/auth/sign-up`
- `/auth/forgot-password`
- `/auth/update-password`
- `/protected`

## Metadata and SEO

The root layout defines the site title, description, canonical origin, Open
Graph/Twitter metadata, and a conservative `noindex` policy while Prism is an
authenticated product without public content. The generated metadata routes
are:

- `/robots.txt` — allows crawling of the public surface but excludes auth and protected routes.
- `/sitemap.xml` — currently empty because there are no public indexable pages yet.
- `/icon.svg` and `/opengraph-image` — browser and social-sharing assets.

When public pages are added, update `app/sitemap.ts` with only canonical public
URLs and override the `robots` metadata for those routes as appropriate.

Configure Supabase Authentication → URL Configuration with:

- Site URL: the production app origin when deployed; use `http://localhost:3000` during local-only development.
- Local redirect URLs: `http://localhost:3000/**`
- Preview redirect URLs: the exact Vercel preview pattern for this team/project.
- Production redirect URLs: exact URLs for `/protected` and `/auth/update-password` on the production domain.

The signup and password-reset flows derive their redirect origin from `NEXT_PUBLIC_SITE_URL`, then the Vercel preview hostname, then the browser origin. See [Supabase URL configuration](https://supabase.com/docs/guides/auth/redirect-urls) for the required allow-list behavior.

For SMTP, email templates, sender-domain verification, and delivery testing, see [`docs/supabase-auth-email.md`](docs/supabase-auth-email.md).

## Validation

Shared authentication schemas live in [`lib/validators/auth.ts`](lib/validators/auth.ts)
and use Zod. They normalize email input, require passwords to be at least eight
characters, and verify password confirmation before calling Supabase. Future
Server Actions and API handlers should call the same schemas with `safeParse`
at their server boundary instead of relying only on browser validation.

## Testing

Unit tests use Vitest with the Next.js TypeScript setup and live in
`__tests__/`. The current suite covers authentication schemas, same-origin
redirect validation, and environment URL resolution. Async Server Components
and full browser flows should be covered with end-to-end tests when those flows
are ready.

## Security baseline

Security headers are configured in `next.config.ts`, including production CSP,
clickjacking protection, MIME sniffing protection, a strict referrer policy, and
a restricted Permissions Policy. HSTS is enabled only for HTTPS deployments.
Supabase server utilities are marked `server-only`, and authentication
confirmation redirects accept only same-origin paths.

## Checks

```bash
npm run lint
npm run type-check
npm run test
npm run build
```

## Observability

Prism uses the official `@sentry/nextjs` SDK for client, server, and edge
error tracking. The integration is disabled when no Sentry DSN is configured,
so local development and CI do not need Sentry credentials.

When a Sentry project is ready, set `NEXT_PUBLIC_SENTRY_DSN` for browser
events, `SENTRY_DSN` for server and edge events, and the `SENTRY_ORG`,
`SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` variables only in the production
build environment for source-map uploads. Never commit those values.

GitHub Actions runs the same checks on pushes to `main`/`master`, pull
requests, and manual workflow dispatches. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
