import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency } from '@/lib/utils/format'

interface CalendarProgressProps {
  totalBudget: number
  totalPaid: number
  totalRevealed: number
  daysRevealed: number
  daysPaid: number
  totalDays: number
}

export function CalendarProgress({
  totalBudget,
  totalPaid,
  totalRevealed,
  daysRevealed,
  daysPaid,
  totalDays,
}: CalendarProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Your Progress</h3>

      <div className="space-y-4">
        <ProgressBar
          current={totalPaid}
          total={totalBudget}
          label={`Donated: ${formatCurrency(totalPaid)} of ${formatCurrency(totalBudget)}`}
        />

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{daysPaid}</p>
            <p className="text-sm text-gray-600">Days Paid</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{daysRevealed - daysPaid}</p>
            <p className="text-sm text-gray-600">Days Revealed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-400">{totalDays - daysRevealed}</p>
            <p className="text-sm text-gray-600">Days Remaining</p>
          </div>
        </div>

        {totalRevealed > 0 && (
          <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
            <p>Total revealed (not yet paid): {formatCurrency(totalRevealed - totalPaid)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
