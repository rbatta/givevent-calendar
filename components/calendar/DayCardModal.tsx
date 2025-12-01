'use client'

import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils/format'
import type { DayCardData } from './DayCard'

interface DayCardModalProps {
  isOpen: boolean
  onClose: () => void
  day: DayCardData
  charityUrl: string
  charityRerollsUsed: number
  amountRerollsUsed: number
  onRerollCharity: () => Promise<void>
  onRerollAmount: () => Promise<void>
  onMarkPaid: () => Promise<void>
  onUnreveal?: () => Promise<void>
}

const MAX_REROLLS = 2
const scopeIcons = {
  international: '🌍',
  national: '🏛️',
  local: '📍',
}

export function DayCardModal({
  isOpen,
  onClose,
  day,
  charityUrl,
  charityRerollsUsed,
  amountRerollsUsed,
  onRerollCharity,
  onRerollAmount,
  onMarkPaid,
  onUnreveal,
}: DayCardModalProps) {
  const canRerollCharity = !day.isGrandPrize && charityRerollsUsed < MAX_REROLLS
  const canRerollAmount = !day.isGrandPrize && amountRerollsUsed < MAX_REROLLS

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formatDate(day.date)}>
      <div className="space-y-4">
        {day.isGrandPrize && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <p className="text-2xl mb-2">⭐ Grand Prize Day! ⭐</p>
            <p className="text-sm text-yellow-700">This is your special grand prize charity</p>
          </div>
        )}

        <div className="text-center py-4">
          {day.charityScope && (
            <div className="text-4xl mb-2">{scopeIcons[day.charityScope]}</div>
          )}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{day.charityName}</h3>
          <a
            href={charityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Visit website →
          </a>
        </div>

        <div className="text-center py-6 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Donation Amount</p>
          <p className="text-4xl font-bold text-green-600">{formatCurrency(day.amount)}</p>
        </div>

        {!day.isPaid && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onRerollCharity}
                  disabled={!canRerollCharity}
                >
                  Reroll Charity
                </Button>
                <p className="text-xs text-center text-gray-500 mt-1">
                  {canRerollCharity
                    ? `${MAX_REROLLS - charityRerollsUsed} left`
                    : 'No rerolls left'}
                </p>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onRerollAmount}
                  disabled={!canRerollAmount}
                >
                  Reroll Amount
                </Button>
                <p className="text-xs text-center text-gray-500 mt-1">
                  {canRerollAmount
                    ? `${MAX_REROLLS - amountRerollsUsed} left`
                    : 'No rerolls left'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={onMarkPaid}>
                Mark as Paid
              </Button>
              {onUnreveal && (
                <Button
                  variant="outline"
                  className="w-full text-gray-600"
                  onClick={onUnreveal}
                >
                  Mark as Unread
                </Button>
              )}
            </div>
          </>
        )}

        {day.isPaid && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-semibold">✓ Marked as Paid</p>
            <p className="text-sm text-green-600 mt-1">Thank you for your donation!</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
