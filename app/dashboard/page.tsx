import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatDate, formatCurrency } from '@/lib/utils/format'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: calendars } = await supabase
    .from('calendars')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-green-700">Givevent</h1>
          </Link>
          <form action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/')
          }}>
            <Button type="submit" variant="ghost">Sign Out</Button>
          </form>
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
              <Link key={calendar.id} href={`/calendar/${calendar.id}`}>
                <Card className="h-full">
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
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4 text-lg">
              You haven't created any calendars yet.
            </p>
            <Link href="/calendar/new">
              <Button>Create Your First Calendar</Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  )
}
