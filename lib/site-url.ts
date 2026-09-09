const removeTrailingSlashes = (url: string) => url.replace(/\/+$/, '')

/**
 * Returns the app origin used for Supabase Auth redirect URLs.
 *
 * Production should set NEXT_PUBLIC_SITE_URL. Vercel previews can fall back
 * to NEXT_PUBLIC_VERCEL_URL, while local browser flows use the current origin.
 */
export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim()
  const browserUrl = typeof window !== 'undefined' ? window.location.origin : undefined
  const candidate = configuredUrl || vercelUrl || browserUrl || 'http://localhost:3000'

  if (/^https?:\/\//i.test(candidate)) {
    return removeTrailingSlashes(candidate)
  }

  return removeTrailingSlashes(`https://${candidate}`)
}
