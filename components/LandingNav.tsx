'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'

export function LandingNav() {
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="space-x-4">
        <div className="inline-block w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="inline-block w-24 h-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600 hidden sm:inline">
          {user.email}
        </span>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link href="/calendar/new">
          <Button>+ Calendar</Button>
        </Link>
        <Button variant="ghost" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="space-x-4">
      <Link href="/login">
        <Button variant="ghost">Sign In</Button>
      </Link>
      <Link href="/signup">
        <Button>Get Started</Button>
      </Link>
    </div>
  )
}
