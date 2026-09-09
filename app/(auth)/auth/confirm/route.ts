import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

import { safeNextPath } from '@/lib/safe-next-path'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const typeParam = searchParams.get('type')
  const validTypes: EmailOtpType[] = [
    'signup',
    'invite',
    'magiclink',
    'recovery',
    'email_change',
    'email',
  ]
  const type = validTypes.includes(typeParam as EmailOtpType)
    ? (typeParam as EmailOtpType)
    : null
  const next = safeNextPath(searchParams.get('next'), '/', new URL(request.url).origin)

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      redirect(next)
    } else {
      redirect('/auth/error?reason=confirmation_failed')
    }
  }

  redirect('/auth/error?reason=invalid_confirmation_link')
}
