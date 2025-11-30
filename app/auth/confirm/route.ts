import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    })

    if (!error) {
      // Check if profile exists, create if not
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        // If profile doesn't exist, create it
        if (!profile) {
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              display_name: user.email,
            })
        }
      }

      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect to login on error
  return NextResponse.redirect(new URL('/login?error=verification_failed', request.url))
}
