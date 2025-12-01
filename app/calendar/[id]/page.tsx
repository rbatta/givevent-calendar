'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { CalendarGrid } from '@/components/calendar/CalendarGrid'
import { CalendarMonthView } from '@/components/calendar/CalendarMonthView'
import { CalendarProgress } from '@/components/calendar/CalendarProgress'
import { DayCardModal } from '@/components/calendar/DayCardModal'
import type { DayCardData } from '@/components/calendar/DayCard'
import { createClient } from '@/lib/supabase/client'
import { getNewCharity, swapAmounts } from '@/lib/utils/reroll'
import { formatDate } from '@/lib/utils/format'

interface CalendarDay {
  id: string
  date: string
  amount: number
  is_revealed: boolean
  is_paid: boolean
  is_grand_prize: boolean
  charity_rerolls_used: number
  amount_rerolls_used: number
  charity_id: string
}

interface Charity {
  id: string
  name: string
  url: string
  scope: 'international' | 'national' | 'local'
}

interface Calendar {
  id: string
  name: string
  total_budget: number
  display_mode: 'card_grid' | 'calendar_view'
}

export default function CalendarViewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [calendar, setCalendar] = useState<Calendar | null>(null)
  const [days, setDays] = useState<CalendarDay[]>([])
  const [charities, setCharities] = useState<Charity[]>([])
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'card_grid' | 'calendar_view'>('calendar_view')

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
      setViewMode(calData.display_mode)

      // Fetch charities
      const { data: charData, error: charError } = await supabase
        .from('charities')
        .select('*')
        .eq('calendar_id', params.id)

      if (charError) throw charError
      setCharities(charData)

      // Fetch calendar days
      const { data: daysData, error: daysError } = await supabase
        .from('calendar_days')
        .select('*')
        .eq('calendar_id', params.id)
        .order('date', { ascending: true })

      if (daysError) throw daysError
      setDays(daysData)
    } catch (error) {
      console.error('Error fetching calendar:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = async (dayData: DayCardData) => {
    const day = days.find(d => d.id === dayData.id)
    if (!day) return

    if (!day.is_revealed && !day.is_paid) {
      // Reveal the day
      const { error } = await supabase
        .from('calendar_days')
        .update({ is_revealed: true, revealed_at: new Date().toISOString() })
        .eq('id', day.id)

      if (!error) {
        await fetchCalendarData()
        setSelectedDay({ ...day, is_revealed: true })
        setIsModalOpen(true)
      }
    } else if (day.is_revealed && !day.is_paid) {
      // Open modal for revealed day
      setSelectedDay(day)
      setIsModalOpen(true)
    }
    // If paid, do nothing (card is locked)
  }

  const handleRerollCharity = async () => {
    if (!selectedDay) return

    try {
      const newCharityId = getNewCharity(
        selectedDay.charity_id,
        charities.map(c => c.id),
        charities.find(c => charities.some(ch => ch.id === selectedDay.charity_id && days.some(d => d.charity_id === ch.id && d.is_grand_prize)))?.id
      )

      const { error } = await supabase
        .from('calendar_days')
        .update({
          charity_id: newCharityId,
          charity_rerolls_used: selectedDay.charity_rerolls_used + 1,
        })
        .eq('id', selectedDay.id)

      if (!error) {
        await fetchCalendarData()
        const updatedDay = days.find(d => d.id === selectedDay.id)
        if (updatedDay) setSelectedDay({ ...updatedDay, charity_id: newCharityId, charity_rerolls_used: updatedDay.charity_rerolls_used + 1 })
      }
    } catch (error) {
      console.error('Error rerolling charity:', error)
    }
  }

  const handleRerollAmount = async () => {
    if (!selectedDay) return

    try {
      const unrevealedDays = days.filter(d => !d.is_revealed && d.id !== selectedDay.id)
      const { targetDayId, newAmount } = swapAmounts(
        selectedDay.id,
        selectedDay.amount,
        unrevealedDays.map(d => ({ id: d.id, amount: d.amount }))
      )

      const targetDay = days.find(d => d.id === targetDayId)
      if (!targetDay) return

      // Swap amounts between current day and random unrevealed day
      const { error } = await supabase
        .from('calendar_days')
        .update({ amount: newAmount, amount_rerolls_used: selectedDay.amount_rerolls_used + 1 })
        .eq('id', selectedDay.id)

      if (!error) {
        await supabase
          .from('calendar_days')
          .update({ amount: selectedDay.amount })
          .eq('id', targetDayId)

        await fetchCalendarData()
        const updatedDay = days.find(d => d.id === selectedDay.id)
        if (updatedDay) setSelectedDay({ ...updatedDay, amount: newAmount, amount_rerolls_used: updatedDay.amount_rerolls_used + 1 })
      }
    } catch (error) {
      console.error('Error rerolling amount:', error)
    }
  }

  const handleMarkPaid = async () => {
    if (!selectedDay) return

    const { error } = await supabase
      .from('calendar_days')
      .update({ is_paid: true, paid_at: new Date().toISOString() })
      .eq('id', selectedDay.id)

    if (!error) {
      await fetchCalendarData()
      setIsModalOpen(false)
      setSelectedDay(null)
    }
  }

  const handleUnreveal = async () => {
    if (!selectedDay) return

    const { error } = await supabase
      .from('calendar_days')
      .update({ is_revealed: false, revealed_at: null })
      .eq('id', selectedDay.id)

    if (!error) {
      await fetchCalendarData()
      setIsModalOpen(false)
      setSelectedDay(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading calendar...</p>
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

  const dayCardData: DayCardData[] = days.map(day => {
    const charity = charities.find(c => c.id === day.charity_id)
    return {
      id: day.id,
      date: day.date,
      amount: day.amount,
      isRevealed: day.is_revealed,
      isPaid: day.is_paid,
      isGrandPrize: day.is_grand_prize,
      charityName: charity?.name,
      charityScope: charity?.scope,
    }
  })

  const totalPaid = days.filter(d => d.is_paid).reduce((sum, d) => sum + d.amount, 0)
  const totalRevealed = days.filter(d => d.is_revealed).reduce((sum, d) => sum + d.amount, 0)
  const daysPaid = days.filter(d => d.is_paid).length
  const daysRevealed = days.filter(d => d.is_revealed).length

  const selectedDayCharity = selectedDay ? charities.find(c => c.id === selectedDay.charity_id) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-green-700">Givevent</h1>
          </Link>
          <div className="flex gap-3">
            <Link href="/calendar/new">
              <Button>+ Calendar</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost">My Calendars</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{calendar.name}</h2>
            <p className="text-gray-600">
              {formatDate(days[0]?.date)} - {formatDate(days[days.length - 1]?.date)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/calendar/${params.id}/edit`}>
              <Button variant="outline" size="sm">
                ⚙️ Settings
              </Button>
            </Link>
            <Button
              variant={viewMode === 'calendar_view' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar_view')}
            >
              📅 Calendar
            </Button>
            <Button
              variant={viewMode === 'card_grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card_grid')}
            >
              🎴 Grid
            </Button>
          </div>
        </div>

        <CalendarProgress
          totalBudget={calendar.total_budget}
          totalPaid={totalPaid}
          totalRevealed={totalRevealed}
          daysRevealed={daysRevealed}
          daysPaid={daysPaid}
          totalDays={days.length}
        />

        {viewMode === 'calendar_view' ? (
          <CalendarMonthView days={dayCardData} onDayClick={handleDayClick} />
        ) : (
          <CalendarGrid days={dayCardData} onDayClick={handleDayClick} />
        )}

        {selectedDay && selectedDayCharity && (
          <DayCardModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setSelectedDay(null)
            }}
            day={{
              ...dayCardData.find(d => d.id === selectedDay.id)!,
            }}
            charityUrl={selectedDayCharity.url}
            charityRerollsUsed={selectedDay.charity_rerolls_used}
            amountRerollsUsed={selectedDay.amount_rerolls_used}
            onRerollCharity={handleRerollCharity}
            onRerollAmount={handleRerollAmount}
            onMarkPaid={handleMarkPaid}
            onUnreveal={handleUnreveal}
          />
        )}
      </main>
    </div>
  )
}
