'use client'

import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/format'

export interface DayCardData {
  id: string
  date: string
  amount: number
  isRevealed: boolean
  isPaid: boolean
  isGrandPrize: boolean
  charityName?: string
  charityScope?: 'international' | 'national' | 'local'
}

interface DayCardProps {
  day: DayCardData
  dayNumber: number
  onClick: () => void
}

const scopeIcons = {
  international: '🌍',
  national: '🏛️',
  local: '📍',
}

export function DayCard({ day, dayNumber, onClick }: DayCardProps) {
  // Unrevealed state
  if (!day.isRevealed) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "aspect-square rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all",
          "bg-gradient-to-br from-green-100 to-red-100 hover:shadow-lg hover:scale-105",
          "border-2 border-gray-200"
        )}
      >
        <div className="text-4xl mb-2">🎁</div>
        <div className="text-2xl font-bold text-gray-700">{dayNumber}</div>
        <div className="text-xs text-gray-500 mt-1">Click to reveal</div>
      </div>
    )
  }

  // Paid state
  if (day.isPaid) {
    return (
      <div
        className={cn(
          "aspect-square rounded-lg p-4 flex flex-col items-center justify-center relative",
          "bg-white border-2",
          day.isGrandPrize ? "border-yellow-400 bg-yellow-50" : "border-gray-300",
          "opacity-90"
        )}
      >
        <div className="absolute top-2 right-2 text-green-600">
          ✓
        </div>
        {day.isGrandPrize && <div className="text-2xl mb-1">⭐</div>}
        <div className="text-xs text-gray-500 mb-1">Day {dayNumber}</div>
        <div className="text-center">
          <div className="text-sm font-semibold text-gray-700 line-clamp-2">{day.charityName}</div>
          <div className="text-lg font-bold text-green-600 mt-1">
            {formatCurrency(day.amount)}
          </div>
        </div>
        <div className="absolute bottom-2 text-xs bg-gray-100 px-2 py-1 rounded">
          Paid
        </div>
      </div>
    )
  }

  // Revealed (not paid) state
  return (
    <div
      onClick={onClick}
      className={cn(
        "aspect-square rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-lg",
        "bg-white border-2",
        day.isGrandPrize ? "border-yellow-400 bg-yellow-50" : "border-green-500"
      )}
    >
      {day.isGrandPrize && <div className="text-2xl mb-1">⭐</div>}
      <div className="text-xs text-gray-500 mb-1">Day {dayNumber}</div>
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-700 line-clamp-2">{day.charityName}</div>
        {day.charityScope && (
          <div className="text-xs text-gray-500 mt-1">
            {scopeIcons[day.charityScope]}
          </div>
        )}
        <div className="text-xl font-bold text-green-600 mt-2">
          {formatCurrency(day.amount)}
        </div>
      </div>
    </div>
  )
}
