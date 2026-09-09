# Deployment

Prism is configured for a standard Next.js deployment. Vercel detects the
Next.js framework automatically, so no `vercel.json`, Dockerfile, or custom
server is required.

## Before the first deployment

1. Create or connect a Vercel project from the repository.
2. Set the project’s production branch to `main`.
3. Add the environment variables from `.env.example` in the appropriate Vercel
   environments:
   - Development: local development values.
   - Preview: staging Supabase values and the optional Sentry DSNs.
   - Production: production Supabase values, the canonical site URL, and
     production Sentry values.
4. In Supabase Authentication → URL Configuration, add the local, preview, and
   production redirect URLs described in the README.
5. If Sentry source maps are enabled, add `SENTRY_ORG`, `SENTRY_PROJECT`, and
   `SENTRY_AUTH_TOKEN` as build-time production variables. Keep the auth token
   server-side.

## Local production check

Run the same checks used by CI before deploying:

```bash
npm ci
npm run lint
npm run type-check
npm run test
npm run build
npm run start
```

`next start` serves the optimized build and requires `next build` to have run
first. Use it for a production-like smoke test at `http://localhost:3000`.

## Preview and production flow

After the repository is connected, pushes and pull requests to non-production
branches should use Preview Deployments. Verify authentication redirects,
email confirmation, password reset, protected-route access, and Sentry error
reporting in Preview before promoting to Production.

The CI workflow remains the first gate for every push and pull request. Vercel
then performs the deployment build with the environment variables configured
for that deployment target.

## Production database migrations

The `Supabase Migrations` workflow applies committed files under
`supabase/migrations` to the production project after they reach `main`. It
also supports a manual run from GitHub Actions and previews pending changes
before applying them. The workflow intentionally does not start the local
Supabase stack or add Docker to the project.

Add these encrypted secrets to the repository's GitHub Actions `production`
environment before the workflow can run:

- `SUPABASE_ACCESS_TOKEN` — a Supabase personal access token.
- `SUPABASE_PROJECT_ID` — the production project reference from the Supabase
  dashboard URL.
- `SUPABASE_DB_PASSWORD` — the production database password.

Never place these values in the repository, `.env.example`, workflow source,
or browser-exposed `NEXT_PUBLIC_*` variables. Review migration SQL before
merging to `main`; the workflow applies it to the production database.
