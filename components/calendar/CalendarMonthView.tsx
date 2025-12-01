'use client'

import { DayCard, type DayCardData } from './DayCard'
import { formatDate } from '@/lib/utils/format'
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns'

interface CalendarMonthViewProps {
  days: DayCardData[]
  onDayClick: (day: DayCardData) => void
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarMonthView({ days, onDayClick }: CalendarMonthViewProps) {
  if (days.length === 0) return null

  // Get the first and last dates from the calendar days
  const firstDate = new Date(days[0].date)
  const lastDate = new Date(days[days.length - 1].date)

  // For December calendars, show the full week containing Dec 1
  // This means showing the last few days of November if Dec 1 doesn't start on Sunday
  const monthStart = startOfMonth(lastDate) // Use last date's month (December)
  const monthEnd = endOfMonth(lastDate)

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
          {format(firstDate, 'MMMM yyyy')}
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

          const dayNumber = new Date(dayData.date).getDate()

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
