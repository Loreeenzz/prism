/**
 * Public runtime configuration shared by the Supabase browser and server
 * clients. These values are safe to expose to the browser because they use
 * the NEXT_PUBLIC_ prefix and Supabase's publishable key.
 */
function requiredPublicEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required public environment variable: ${name}`)
  }

  return value
}

export function getPublicEnv() {
  return {
    supabaseUrl: requiredPublicEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    supabasePublishableKey: requiredPublicEnv(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  }
}
