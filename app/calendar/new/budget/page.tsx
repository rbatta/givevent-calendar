'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepIndicator } from '@/components/setup/StepIndicator'
import { BudgetForm } from '@/components/setup/BudgetForm'
import { useCalendarSetup } from '@/lib/contexts/CalendarSetupContext'
import { generateAmountTiers } from '@/lib/utils/amount-distribution'
import { parseLocalDate } from '@/lib/utils/format'

const STEP_TITLES = ['Name & Dates', 'Charities', 'Budget', 'Distribution', 'Confirm']

export default function BudgetPage() {
  const router = useRouter()
  const { data, updateData } = useCalendarSetup()
  const [budget, setBudget] = useState({
    totalBudget: data.totalBudget || 0,
    minAmount: data.minAmount || 0,
    maxAmount: data.maxAmount || 0,
  })

  // Redirect if haven't completed previous steps
  useEffect(() => {
    if (!data.name || data.charities.length < 2) {
      router.push('/calendar/new')
    }
  }, [data.name, data.charities.length, router])

  const grandPrizeCharity = data.charities.find((c) => c.isGrandPrize)
  const grandPrizeAmount = grandPrizeCharity?.grandPrizeAmount || 0

  const dayCount = data.startDate && data.endDate
    ? Math.ceil((parseLocalDate(data.endDate).getTime() - parseLocalDate(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  const canProceed =
    budget.totalBudget > 0 &&
    budget.minAmount > 0 &&
    budget.maxAmount > 0 &&
    budget.minAmount <= budget.maxAmount &&
    budget.totalBudget >= budget.minAmount * dayCount

  const handleNext = () => {
    updateData(budget)

    // Generate initial tier distribution
    try {
      const distribution = generateAmountTiers({
        minAmount: budget.minAmount,
        maxAmount: budget.maxAmount,
        totalDays: dayCount,
        totalBudget: budget.totalBudget,
        grandPrizeAmount,
      })

      updateData({ tiers: distribution.tiers })
      router.push('/calendar/new/distribution')
    } catch (error) {
      console.error('Error generating tiers:', error)
    }
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
        <StepIndicator currentStep={3} totalSteps={5} stepTitles={STEP_TITLES} />

        <Card>
          <h2 className="text-2xl font-bold mb-2">Set Your Budget</h2>
          <p className="text-gray-600 mb-6">
            Define how much you want to donate in total and the range for individual days.
          </p>

          <BudgetForm value={budget} onChange={setBudget} />

          {grandPrizeCharity && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700">
                ⭐ Grand Prize: ${grandPrizeAmount.toFixed(2)} set aside for{' '}
                <strong>{grandPrizeCharity.name}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Link href="/calendar/new/charities">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next: Review Distribution
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
