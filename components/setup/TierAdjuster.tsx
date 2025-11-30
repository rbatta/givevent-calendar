'use client'

import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/format'

export interface AmountTier {
  amount: number
  count: number
}

interface TierAdjusterProps {
  tiers: AmountTier[]
  grandPrize: { amount: number; count: 1 } | null
  totalDays: number
  onUpdate: (tiers: AmountTier[]) => void
}

export function TierAdjuster({ tiers, grandPrize, totalDays, onUpdate }: TierAdjusterProps) {
  const handleAdjust = (index: number, delta: number) => {
    const newTiers = [...tiers]
    newTiers[index].count = Math.max(0, newTiers[index].count + delta)
    onUpdate(newTiers.filter(t => t.count > 0))
  }

  const currentDayCount = tiers.reduce((sum, t) => sum + t.count, 0) + (grandPrize ? 1 : 0)
  const currentTotal = tiers.reduce((sum, t) => sum + (t.amount * t.count), 0) + (grandPrize ? grandPrize.amount : 0)
  const isValid = currentDayCount === totalDays

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">Amount</th>
              <th className="p-3 text-center font-semibold">Count</th>
              <th className="p-3 text-right font-semibold">Subtotal</th>
              <th className="p-3 text-center font-semibold">Adjust</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, index) => (
              <tr key={tier.amount} className="border-b border-gray-200">
                <td className="p-3 font-medium">{formatCurrency(tier.amount)}</td>
                <td className="p-3 text-center">{tier.count}</td>
                <td className="p-3 text-right">{formatCurrency(tier.amount * tier.count)}</td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAdjust(index, -1)}
                      disabled={tier.count === 0}
                    >
                      −
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAdjust(index, 1)}
                    >
                      +
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {grandPrize && (
              <tr className="border-b border-gray-200 bg-yellow-50">
                <td className="p-3 font-medium">⭐ {formatCurrency(grandPrize.amount)}</td>
                <td className="p-3 text-center">{grandPrize.count}</td>
                <td className="p-3 text-right">{formatCurrency(grandPrize.amount)}</td>
                <td className="p-3 text-center text-sm text-gray-500">Grand Prize</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td className="p-3">Total</td>
              <td className="p-3 text-center">{currentDayCount} days</td>
              <td className="p-3 text-right">{formatCurrency(currentTotal)}</td>
              <td className="p-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="space-y-2">
        {!isValid && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            {currentDayCount < totalDays
              ? `Need ${totalDays - currentDayCount} more day${totalDays - currentDayCount > 1 ? 's' : ''}`
              : `Remove ${currentDayCount - totalDays} day${currentDayCount - totalDays > 1 ? 's' : ''}`}
          </div>
        )}
        {isValid && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✓ Distribution is valid! {currentDayCount} days totaling {formatCurrency(currentTotal)}
          </div>
        )}
      </div>
    </div>
  )
}
