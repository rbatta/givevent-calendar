'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils/format'
import { generateAmountTiers } from '@/lib/utils/amount-distribution'

interface Calendar {
  id: string
  name: string
  start_date: string
  end_date: string
  total_budget: number
  min_amount: number
  max_amount: number
}

export default function EditCalendarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [anyRevealed, setAnyRevealed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchCalendarData()
  }, [params.id])

  const fetchCalendarData = async () => {
    try {
      // Fetch calendar
      const { data: calData, error: calError } = await supabase
        .from('calendars')
        .select('*')
        .eq('id', params.id)
        .single()

      if (calError) throw calError
      setCalendar(calData)
      setMinAmount(calData.min_amount)
      setMaxAmount(calData.max_amount)

      // Check if any days have been revealed
      const { data: daysData, error: daysError } = await supabase
        .from('calendar_days')
        .select('is_revealed')
        .eq('calendar_id', params.id)

      if (daysError) throw daysError
      setAnyRevealed(daysData?.some(d => d.is_revealed) || false)
    } catch (error) {
      console.error('Error fetching calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateDistribution = async () => {
    if (!calendar) return
    setSaving(true)

    try {
      // Calculate new distribution
      const dayCount = Math.ceil((new Date(calendar.end_date).getTime() - new Date(calendar.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1

      // Get grand prize if any
      const { data: grandPrizeCharity } = await supabase
        .from('charities')
        .select('*')
        .eq('calendar_id', params.id)
        .eq('is_grand_prize', true)
        .maybeSingle()

      const distribution = generateAmountTiers({
        minAmount,
        maxAmount,
        totalDays: dayCount,
        totalBudget: calendar.total_budget,
        grandPrizeAmount: grandPrizeCharity?.grand_prize_amount
      })

      // Update calendar with new min/max
      const { error: calError } = await supabase
        .from('calendars')
        .update({
          min_amount: minAmount,
          max_amount: maxAmount
        })
        .eq('id', params.id)

      if (calError) throw calError

      // Delete existing amount tiers
      await supabase
        .from('amount_tiers')
        .delete()
        .eq('calendar_id', params.id)

      // Insert new amount tiers
      await supabase
        .from('amount_tiers')
        .insert(
          distribution.tiers.map(t => ({
            calendar_id: params.id,
            amount: t.amount,
            count: t.count
          }))
        )

      // Update amounts in calendar_days
      // Expand tiers into amounts array
      const amounts: number[] = []
      distribution.tiers.forEach((tier) => {
        for (let i = 0; i < tier.count; i++) {
          amounts.push(tier.amount)
        }
      })

      // Shuffle amounts
      const shuffled = [...amounts].sort(() => Math.random() - 0.5)

      // Get all non-grand-prize days
      const { data: nonGrandPrizeDays } = await supabase
        .from('calendar_days')
        .select('id')
        .eq('calendar_id', params.id)
        .eq('is_grand_prize', false)
        .order('date', { ascending: true })

      if (nonGrandPrizeDays) {
        // Update each day with new amount
        for (let i = 0; i < nonGrandPrizeDays.length; i++) {
          await supabase
            .from('calendar_days')
            .update({ amount: shuffled[i] })
            .eq('id', nonGrandPrizeDays[i].id)
        }
      }

      router.push(`/calendar/${params.id}`)
    } catch (error) {
      console.error('Error regenerating distribution:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      const { error } = await supabase
        .from('calendars')
        .delete()
        .eq('id', params.id)

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      console.error('Error deleting calendar:', error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!calendar) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Calendar not found</p>
      </div>
    )
  }

  const canEdit = !anyRevealed

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-green-700">Givevent</h1>
          </Link>
          <Link href={`/calendar/${params.id}`}>
            <Button variant="ghost">Back to Calendar</Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Card>
          <h2 className="text-2xl font-bold mb-6">Edit Calendar Settings</h2>

          {anyRevealed && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> You cannot edit amounts after revealing days. Only deletion is available.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Amount Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Amount"
                  type="number"
                  value={minAmount}
                  onChange={(e) => setMinAmount(Number(e.target.value))}
                  disabled={!canEdit}
                  min={1}
                  step={1}
                />
                <Input
                  label="Maximum Amount"
                  type="number"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(Number(e.target.value))}
                  disabled={!canEdit}
                  min={minAmount}
                  step={1}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Current budget: {formatCurrency(calendar.total_budget)}
              </p>
            </div>

            {canEdit && (
              <div className="pt-6 border-t border-gray-200">
                <Button
                  onClick={handleRegenerateDistribution}
                  disabled={saving || minAmount >= maxAmount || minAmount < 1}
                  className="w-full"
                >
                  {saving ? 'Regenerating...' : 'Regenerate Distribution'}
                </Button>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  This will recalculate all donation amounts based on your new min/max values.
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-red-600">Danger Zone</h3>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                🗑️ Delete Calendar
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                This action cannot be undone. All data will be permanently deleted.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Calendar"
        message={`Are you sure you want to delete "${calendar.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={deleting}
      />
    </div>
  )
}
