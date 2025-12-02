'use client'

import { DayCard, type DayCardData } from './DayCard'
import { formatDate, parseLocalDate } from '@/lib/utils/format'
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns'

interface CalendarMonthViewProps {
  days: DayCardData[]
  onDayClick: (day: DayCardData) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMonthView({ days, onDayClick }: CalendarMonthViewProps) {
  if (days.length === 0) return null

  // Get the first and last dates from the calendar days
  // Parse as local dates to avoid UTC timezone issues
  const firstDate = parseLocalDate(days[0].date)
  const lastDate = parseLocalDate(days[days.length - 1].date)

  // Determine which month to display by counting days in each month
  const monthCounts = new Map<string, number>()
  days.forEach(day => {
    const date = parseLocalDate(day.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`
    monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1)
  })

  // Find the month with the most calendar days
  let primaryMonthKey = ''
  let maxCount = 0
  monthCounts.forEach((count, monthKey) => {
    if (count > maxCount) {
      maxCount = count
      primaryMonthKey = monthKey
    }
  })

  // Parse the primary month
  const [yearStr, monthStr] = primaryMonthKey.split('-')
  const primaryMonthDate = new Date(parseInt(yearStr), parseInt(monthStr), 1)

  // Get the full month range for the primary month
  const monthStart = startOfMonth(primaryMonthDate)
  const monthEnd = endOfMonth(primaryMonthDate)

  // Get all days in the month
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const startDayOfWeek = getDay(monthStart)

  // Create empty cells for days before the month starts
  const leadingEmptyCells = Array(startDayOfWeek).fill(null)

  // Create a map for quick day lookup
  const dayMap = new Map(days.map(day => [day.date, day]))

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {format(primaryMonthDate, 'MMMM yyyy')}
        </h3>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Leading empty cells */}
        {leadingEmptyCells.map((_, idx) => (
          <div key={`empty-${idx}`} className="aspect-square" />
        ))}

        {/* Month days */}
        {monthDays.map(monthDay => {
          const dateStr = monthDay.toISOString().split('T')[0]
          const dayData = dayMap.get(dateStr)

          if (!dayData) {
            // Day is in the month but not part of the calendar
            return (
              <div
                key={dateStr}
                className="aspect-square flex items-center justify-center text-gray-400 text-sm"
              >
                {monthDay.getDate()}
              </div>
            )
          }

          const dayNumber = parseLocalDate(dayData.date).getDate()

          return (
            <div key={dayData.id} className="aspect-square">
              <DayCard day={dayData} dayNumber={dayNumber} onClick={() => onDayClick(dayData)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
