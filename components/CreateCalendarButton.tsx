'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export function CreateCalendarButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [supabase])

  const handleClick = () => {
    if (user) {
      router.push('/calendar/new')
    } else {
      router.push('/signup')
    }
  }

  if (loading) {
    return (
      <Button size="lg" className="text-lg px-8 py-4" disabled>
        Loading...
      </Button>
    )
  }

  return (
    <Button size="lg" className="text-lg px-8 py-4" onClick={handleClick}>
      {user ? 'Create Calendar' : 'Create Your Calendar'}
    </Button>
  )
}
