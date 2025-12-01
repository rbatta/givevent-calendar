'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepIndicator } from '@/components/setup/StepIndicator'
import { DateRangePicker } from '@/components/setup/DateRangePicker'
import { useCalendarSetup } from '@/lib/contexts/CalendarSetupContext'

const STEP_TITLES = ['Name & Dates', 'Charities', 'Budget', 'Distribution', 'Confirm']

export default function CalendarNewPage() {
  const router = useRouter()
  const { data, updateData } = useCalendarSetup()
  const [name, setName] = useState(data.name || '')
  const [dates, setDates] = useState({
    startDate: data.startDate,
    endDate: data.endDate,
  })
  const [displayMode, setDisplayMode] = useState<'card_grid' | 'calendar_view'>(data.displayMode)

  const dayCount = dates.startDate && dates.endDate
    ? Math.ceil((new Date(dates.endDate).getTime() - new Date(dates.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  const canProceed = name.trim() && dates.startDate && dates.endDate && dayCount > 0 && dayCount <= 31

  const handleNext = () => {
    updateData({
      name: name.trim(),
      startDate: dates.startDate,
      endDate: dates.endDate,
      year: new Date(dates.startDate).getFullYear(),
      displayMode,
    })
    router.push('/calendar/new/charities')
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
        <StepIndicator currentStep={1} totalSteps={5} stepTitles={STEP_TITLES} />

        <Card>
          <h2 className="text-2xl font-bold mb-6">Create Your Charity Calendar</h2>
          <p className="text-gray-600 mb-6">
            Let's start by giving your calendar a name and selecting your date range.
          </p>

          <div className="space-y-6">
            <Input
              label="Calendar Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Bob's Advent Cal 2025"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <DateRangePicker value={dates} onChange={setDates} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDisplayMode('calendar_view')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    displayMode === 'calendar_view'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold mb-1">📅 Calendar View</div>
                  <div className="text-sm text-gray-600">
                    Traditional month calendar with day-of-week headers
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDisplayMode('card_grid')}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    displayMode === 'card_grid'
                      ? 'border-green-600 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold mb-1">🎴 Card Grid</div>
                  <div className="text-sm text-gray-600">
                    Simple 7-column grid, no date awareness
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Link href="/dashboard">
              <Button variant="ghost">Cancel</Button>
            </Link>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next: Add Charities
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
