# Project architecture

Prism uses the Next.js App Router and keeps routing, reusable UI, feature code, and server integrations separate.

## Conventions

- `app/` contains route entry points and route-specific layouts.
- Parenthesized folders such as `(auth)` and `(protected)` group routes without changing their URLs.
- `_components` and `_lib` may be used inside a route group for code that belongs only to that route.
- `components/ui/` contains shared design-system primitives.
- `components/auth/` contains reusable authentication UI.
- `components/layout/` contains the application shell, navigation, and page chrome.
- `components/shared/` contains reusable UI that is not tied to one feature.
- `features/` is organized by product capability; keep feature-specific components, actions, queries, and schemas together there.
- `lib/supabase/` contains browser, server, and request-proxy Supabase clients.
- `lib/actions/`, `lib/data/`, and `lib/validators/` contain server actions, server-side data access, and validation helpers.
- `hooks/`, `types/`, and `config/` contain shared hooks, TypeScript types, and application configuration.
- `public/` is reserved for static assets that are referenced by URL.

Prefer adding a file to the narrowest appropriate feature or route folder. Promote it to a shared folder only when more than one area needs it.
