'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function DebugAuthPage() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    // Check session
    const { data: { session: sessionData } } = await supabase.auth.getSession()
    setSession(sessionData)

    // Check user
    const { data: { user: userData } } = await supabase.auth.getUser()
    setUser(userData)

    setLoading(false)
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    console.log('Refresh result:', { data, error })
    await checkAuth()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    await checkAuth()
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Auth Debug Page</h1>

        <Card>
          <h2 className="text-xl font-bold mb-4">Session Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Has Session:</strong>{' '}
              {session ? (
                <span className="text-green-600">✓ Yes</span>
              ) : (
                <span className="text-red-600">✗ No</span>
              )}
            </p>
            {session && (
              <>
                <p>
                  <strong>Access Token:</strong>{' '}
                  <code className="text-xs bg-gray-100 p-1 rounded">
                    {session.access_token?.substring(0, 50)}...
                  </code>
                </p>
                <p>
                  <strong>Expires At:</strong> {new Date(session.expires_at * 1000).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">User Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Has User:</strong>{' '}
              {user ? (
                <span className="text-green-600">✓ Yes</span>
              ) : (
                <span className="text-red-600">✗ No</span>
              )}
            </p>
            {user && (
              <>
                <p>
                  <strong>ID:</strong> <code className="text-xs bg-gray-100 p-1 rounded">{user.id}</code>
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Email Confirmed:</strong>{' '}
                  {user.email_confirmed_at ? (
                    <span className="text-green-600">✓ {new Date(user.email_confirmed_at).toLocaleString()}</span>
                  ) : (
                    <span className="text-red-600">✗ Not confirmed</span>
                  )}
                </p>
                <p>
                  <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold mb-4">Raw Data</h2>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify({ session, user }, null, 2)}
          </pre>
        </Card>

        <div className="flex gap-4">
          <Button onClick={refreshSession}>Refresh Session</Button>
          <Button onClick={signOut} variant="danger">
            Sign Out
          </Button>
          <Button onClick={checkAuth} variant="outline">
            Recheck Auth
          </Button>
        </div>
      </div>
    </div>
  )
}
