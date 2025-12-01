'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepIndicator } from '@/components/setup/StepIndicator'
import { useCalendarSetup } from '@/lib/contexts/CalendarSetupContext'
import { createClient } from '@/lib/supabase/client'
import { formatDate, formatCurrency } from '@/lib/utils/format'
import { createDayAssignments } from '@/lib/utils/shuffle'
import { eachDayOfInterval } from 'date-fns'

const STEP_TITLES = ['Name & Dates', 'Charities', 'Budget', 'Distribution', 'Confirm']

export default function ConfirmPage() {
  const router = useRouter()
  const { data, resetData } = useCalendarSetup()
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  // Redirect if haven't completed previous steps
  useEffect(() => {
    if (!data.name || data.charities.length < 2 || data.totalBudget === 0 || data.tiers.length === 0) {
      router.push('/calendar/new')
    }
  }, [data, router])

  const dayCount = data.startDate && data.endDate
    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  // Determine calendar type based on dates
  const getCalendarType = () => {
    if (!data.startDate || !data.endDate) return 'Custom'
    // Parse dates as local dates to avoid timezone issues
    const [startYear, startMonth, startDay] = data.startDate.split('-').map(Number)
    const [endYear, endMonth, endDay] = data.endDate.split('-').map(Number)

    // Advent (Dec 1 - Dec 25)
    if (startMonth === 12 && startDay === 1 && endMonth === 12 && endDay === 25) {
      return 'Advent Calendar'
    }
    // Full December (Dec 1 - Dec 31)
    if (startMonth === 12 && startDay === 1 && endMonth === 12 && endDay === 31) {
      return 'Full December'
    }
    // Christmas Week (any range ending on Dec 25)
    if (endMonth === 12 && endDay === 25 && dayCount <= 7) {
      return 'Christmas Week'
    }
    return 'Custom'
  }

  const calendarType = getCalendarType()

  const handleCreate = async () => {
    setCreating(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // 1. Create calendar
      const { data: calendar, error: calendarError } = await supabase
        .from('calendars')
        .insert({
          user_id: user.id,
          name: data.name,
          year: data.year,
          start_date: data.startDate,
          end_date: data.endDate,
          total_budget: data.totalBudget,
          min_amount: data.minAmount,
          max_amount: data.maxAmount,
          display_mode: data.displayMode,
          status: 'active',
        })
        .select()
        .single()

      if (calendarError) throw calendarError

      // 2. Create charities
      const { data: createdCharities, error: charitiesError } = await supabase
        .from('charities')
        .insert(
          data.charities.map((c) => ({
            calendar_id: calendar.id,
            name: c.name,
            url: c.url,
            scope: c.scope,
            notes: c.notes,
            is_grand_prize: c.isGrandPrize || false,
            grand_prize_amount: c.grandPrizeAmount,
          }))
        )
        .select()

      if (charitiesError) throw charitiesError

      // 3. Create amount tiers
      const { error: tiersError } = await supabase
        .from('amount_tiers')
        .insert(
          data.tiers.map((t) => ({
            calendar_id: calendar.id,
            amount: t.amount,
            count: t.count,
          }))
        )

      if (tiersError) throw tiersError

      // 4. Generate calendar days
      const dates = eachDayOfInterval({
        start: new Date(data.startDate),
        end: new Date(data.endDate),
      })

      // Expand tiers into amounts array
      const amounts: number[] = []
      data.tiers.forEach((tier) => {
        for (let i = 0; i < tier.count; i++) {
          amounts.push(tier.amount)
        }
      })

      const grandPrizeCharity = createdCharities.find((c) => c.is_grand_prize)

      const dayAssignments = createDayAssignments({
        dates,
        charityIds: createdCharities.map((c) => c.id),
        amounts,
        grandPrizeCharityId: grandPrizeCharity?.id,
        grandPrizeAmount: grandPrizeCharity?.grand_prize_amount || undefined,
      })

      const { error: daysError } = await supabase
        .from('calendar_days')
        .insert(
          dayAssignments.map((assignment) => ({
            calendar_id: calendar.id,
            charity_id: assignment.charityId,
            date: assignment.date.toISOString().split('T')[0],
            amount: assignment.amount,
            is_grand_prize: assignment.isGrandPrize,
          }))
        )

      if (daysError) throw daysError

      // Success! Redirect to calendar (context will reset on unmount)
      router.push(`/calendar/${calendar.id}`)
    } catch (err: any) {
      console.error('Error creating calendar:', err)
      setError(err.message || 'Failed to create calendar')
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-green-700">Givevent</h1>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost">Cancel</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <StepIndicator currentStep={5} totalSteps={5} stepTitles={STEP_TITLES} />

        <Card>
          <h2 className="text-2xl font-bold mb-2">Confirm & Generate</h2>
          <p className="text-gray-600 mb-6">
            Review your calendar settings before we generate your personalized giving calendar.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Calendar Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p><strong>Name:</strong> {data.name}</p>
                <p><strong>Type:</strong> {calendarType}</p>
                <p><strong>Dates:</strong> {formatDate(data.startDate)} - {formatDate(data.endDate)} ({dayCount} days)</p>
                <p><strong>Total Budget:</strong> {formatCurrency(data.totalBudget)}</p>
                <p><strong>Amount Range:</strong> {formatCurrency(data.minAmount)} - {formatCurrency(data.maxAmount)}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Charities ({data.charities.length})</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                {data.charities.map((c) => (
                  <p key={c.id}>
                    {c.isGrandPrize && '⭐ '}{c.name} ({c.scope})
                  </p>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                When you click &quot;Create Calendar&quot;, we&apos;ll randomly assign charities and donation amounts
                to each day in your date range. You&apos;ll be able to reveal one day at a time!
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Link href="/calendar/new/distribution">
              <Button variant="ghost" disabled={creating}>Back</Button>
            </Link>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? 'Creating...' : 'Create Calendar'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
