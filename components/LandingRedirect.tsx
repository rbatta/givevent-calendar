'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LandingRedirect() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // User is logged in, check if they have calendars
        const { data: calendars } = await supabase
          .from('calendars')
          .select('id')
          .order('created_at', { ascending: false })
          .limit(2)

        if (calendars && calendars.length === 1) {
          // Has exactly 1 calendar, redirect to it
          router.push(`/calendar/${calendars[0].id}`)
        } else if (calendars && calendars.length > 1) {
          // Has multiple calendars, redirect to dashboard
          router.push('/dashboard')
        } else {
          // No calendars, stay on landing page
          setLoading(false)
        }
      } else {
        // Not logged in, stay on landing page
        setLoading(false)
      }
    }

    checkUserAndRedirect()
  }, [supabase, router])

  // Return null - this component doesn't render anything
  // It only handles redirect logic
  return null
}
