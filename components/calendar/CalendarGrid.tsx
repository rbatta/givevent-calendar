'use client'

import { DayCard, type DayCardData } from './DayCard'

interface CalendarGridProps {
  days: DayCardData[]
  onDayClick: (day: DayCardData) => void
}

export function CalendarGrid({ days, onDayClick }: CalendarGridProps) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
      {days.map((day, index) => (
        <DayCard
          key={day.id}
          day={day}
          dayNumber={index + 1}
          onClick={() => onDayClick(day)}
        />
      ))}
    </div>
  )
}
