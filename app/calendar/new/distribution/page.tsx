'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepIndicator } from '@/components/setup/StepIndicator'
import { TierAdjuster, type AmountTier } from '@/components/setup/TierAdjuster'
import { useCalendarSetup } from '@/lib/contexts/CalendarSetupContext'
import { generateAmountTiers } from '@/lib/utils/amount-distribution'

const STEP_TITLES = ['Name & Dates', 'Charities', 'Budget', 'Distribution', 'Confirm']

export default function DistributionPage() {
  const router = useRouter()
  const { data, updateData } = useCalendarSetup()
  const [tiers, setTiers] = useState<AmountTier[]>(data.tiers)

  // Redirect if haven't completed previous steps
  useEffect(() => {
    if (!data.name || data.charities.length < 2 || data.totalBudget === 0) {
      router.push('/calendar/new')
    }
  }, [data.name, data.charities.length, data.totalBudget, router])

  const grandPrizeCharity = data.charities.find((c) => c.isGrandPrize)
  const grandPrize = grandPrizeCharity?.grandPrizeAmount
    ? { amount: grandPrizeCharity.grandPrizeAmount, count: 1 as const }
    : null

  const dayCount = data.startDate && data.endDate
    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  const currentDayCount = tiers.reduce((sum, t) => sum + t.count, 0) + (grandPrize ? 1 : 0)
  const isValid = currentDayCount === dayCount

  const handleRegenerate = () => {
    try {
      const distribution = generateAmountTiers({
        minAmount: data.minAmount,
        maxAmount: data.maxAmount,
        totalDays: dayCount,
        totalBudget: data.totalBudget,
        grandPrizeAmount: grandPrize?.amount,
      })
      setTiers(distribution.tiers)
    } catch (error) {
      console.error('Error generating tiers:', error)
    }
  }

  const handleNext = () => {
    updateData({ tiers })
    router.push('/calendar/new/confirm')
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
        <StepIndicator currentStep={4} totalSteps={5} stepTitles={STEP_TITLES} />

        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Review Amount Distribution</h2>
              <p className="text-gray-600">
                Adjust the number of days for each donation amount. The distribution favors smaller amounts.
              </p>
            </div>
            <Button variant="outline" onClick={handleRegenerate}>
              Regenerate
            </Button>
          </div>

          <TierAdjuster
            tiers={tiers}
            grandPrize={grandPrize}
            totalDays={dayCount}
            onUpdate={setTiers}
          />

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Link href="/calendar/new/budget">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button onClick={handleNext} disabled={!isValid}>
              Next: Confirm & Generate
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
