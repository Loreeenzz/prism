# Environment variables

Prism keeps environment-specific configuration outside the source code. The
repository contains only safe placeholders in `.env.example`; real values
belong in ignored local files or the deployment provider's environment
settings.

## Local development

Create `.env.local` from `.env.example` and set:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Optional until a Sentry project is created.
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_DSN=
```

The Supabase URL and publishable key are intentionally public client
configuration. Never put a Supabase service-role key or another secret in a
`NEXT_PUBLIC_*` variable or in browser code.

The Sentry browser DSN is designed to be public, while `SENTRY_DSN` is used by
server and edge runtimes. The SDK stays disabled when either DSN is blank.

## Preview and production

When a Vercel project is connected, configure the same public variable names
separately in Vercel's Development, Preview, and Production environments.
Use the Supabase project and site URL appropriate to each environment:

| Environment | Supabase project | `NEXT_PUBLIC_SITE_URL` |
| --- | --- | --- |
| Development | local or development project | `http://localhost:3000` |
| Preview | preview/staging project | optional; Vercel's preview URL is used when omitted |
| Production | production project | canonical production URL |

Vercel's `NEXT_PUBLIC_VERCEL_URL` is available automatically for preview
deployments and is used by the authentication redirect helper as a fallback.
Because `NEXT_PUBLIC_*` values are bundled at build time, changing a value
requires a new deployment.

## Vercel CLI workflow

After a Vercel project exists, the standard workflow is:

```bash
vercel link
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env pull .env.local
vercel env run -e preview -- npm run build
```

Repeat the `vercel env add` commands for the publishable key and site URL,
using the value for that environment. Do not commit the generated `.env.local`.

For production source-map uploads, also configure `SENTRY_ORG`,
`SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` as deployment build variables. Keep
the auth token server-side and never prefix it with `NEXT_PUBLIC_`.

## Supabase redirect URLs

The configured site URL and redirect allow-list in Supabase Authentication must
match the environments that can send users back to the app. Keep localhost,
preview, and production URLs explicitly configured rather than relying on a
single production value for every deployment.
