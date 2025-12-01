'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import type { Database } from '@/lib/types/database'

type Calendar = Database['public']['Tables']['calendars']['Row']

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [calendars, setCalendars] = useState<Calendar[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteCalendar, setDeleteCalendar] = useState<Calendar | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuthAndLoadCalendars = async () => {
      const { data: { user: userData } } = await supabase.auth.getUser()

      if (!userData) {
        router.push('/login')
        return
      }

      setUser(userData)

      const { data: calendarsData } = await supabase
        .from('calendars')
        .select('*')
        .order('created_at', { ascending: false })

      if (calendarsData) {
        // If user has exactly 1 calendar, redirect to it
        if (calendarsData.length === 1) {
          router.push(`/calendar/${calendarsData[0].id}`)
          return
        }
        setCalendars(calendarsData)
      }

      setLoading(false)
    }

    checkAuthAndLoadCalendars()
  }, [supabase, router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleDelete = async () => {
    if (!deleteCalendar) return
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('calendars')
        .delete()
        .eq('id', deleteCalendar.id)

      if (error) throw error

      // Refresh calendar list
      const { data: calendarsData } = await supabase
        .from('calendars')
        .select('*')
        .order('created_at', { ascending: false })

      if (calendarsData) {
        if (calendarsData.length === 1) {
          router.push(`/calendar/${calendarsData[0].id}`)
          return
        }
        setCalendars(calendarsData)
      }

      setDeleteCalendar(null)
    } catch (error) {
      console.error('Error deleting calendar:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-green-700">Givevent</h1>
          </Link>
          <Button variant="ghost" onClick={handleSignOut}>Sign Out</Button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Calendars</h2>
          <Link href="/calendar/new">
            <Button size="lg">Create New Calendar</Button>
          </Link>
        </div>

        {calendars && calendars.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calendars.map((calendar) => (
              <Card key={calendar.id} className="h-full relative">
                <Link href={`/calendar/${calendar.id}`}>
                  <h3 className="text-xl font-semibold mb-2">{calendar.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      {formatDate(calendar.start_date)} - {formatDate(calendar.end_date)}
                    </p>
                    <p>Total Budget: {formatCurrency(calendar.total_budget)}</p>
                    <p className="capitalize">Status: <span className={
                      calendar.status === 'active' ? 'text-green-600' :
                      calendar.status === 'complete' ? 'text-blue-600' :
                      'text-gray-600'
                    }>{calendar.status}</span></p>
                  </div>
                </Link>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setDeleteCalendar(calendar)
                    }}
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4 text-lg">
              You haven&apos;t created any calendars yet.
            </p>
            <Link href="/calendar/new">
              <Button>Create Your First Calendar</Button>
            </Link>
          </Card>
        )}
      </main>

      <ConfirmDialog
        isOpen={!!deleteCalendar}
        onClose={() => setDeleteCalendar(null)}
        onConfirm={handleDelete}
        title="Delete Calendar"
        message={deleteCalendar ? `Are you sure you want to delete "${deleteCalendar.name}"? This action cannot be undone.` : ''}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deleting}
      />
    </div>
  )
}
