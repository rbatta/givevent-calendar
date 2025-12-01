'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StepIndicator } from '@/components/setup/StepIndicator'
import { CharityForm, type Charity } from '@/components/setup/CharityForm'
import { CharityList } from '@/components/setup/CharityList'
import { CharityBrowser } from '@/components/setup/CharityBrowser'
import { useCalendarSetup } from '@/lib/contexts/CalendarSetupContext'
import type { CharityScope } from '@/lib/types/charity'

const STEP_TITLES = ['Name & Dates', 'Charities', 'Budget', 'Distribution', 'Confirm']

export default function CharitiesPage() {
  const router = useRouter()
  const { data, updateData } = useCalendarSetup()
  const [charities, setCharities] = useState<Charity[]>(data.charities)
  const [editingCharity, setEditingCharity] = useState<Charity | undefined>()
  const [isBrowserOpen, setIsBrowserOpen] = useState(false)

  // Redirect if no name set (haven't completed step 1)
  useEffect(() => {
    if (!data.name) {
      router.push('/calendar/new')
    }
  }, [data.name, router])

  const handleAddCharity = (charity: Omit<Charity, 'id'>) => {
    const newCharity = {
      ...charity,
      id: crypto.randomUUID(),
    }
    // If marking as grand prize, unmark others
    if (newCharity.isGrandPrize) {
      setCharities((prev) =>
        [...prev.map((c) => ({ ...c, isGrandPrize: false })), newCharity]
      )
    } else {
      setCharities((prev) => [...prev, newCharity])
    }
  }

  const handleUpdateCharity = (updatedCharity: Charity) => {
    // If marking as grand prize, unmark others
    if (updatedCharity.isGrandPrize) {
      setCharities((prev) =>
        prev.map((c) =>
          c.id === updatedCharity.id
            ? updatedCharity
            : { ...c, isGrandPrize: false }
        )
      )
    } else {
      setCharities((prev) =>
        prev.map((c) => (c.id === updatedCharity.id ? updatedCharity : c))
      )
    }
    setEditingCharity(undefined)
  }

  const handleDeleteCharity = (id: string) => {
    setCharities((prev) => prev.filter((c) => c.id !== id))
  }

  const handleAddFromBrowser = (charity: { name: string; url: string; scope: CharityScope; notes?: string }) => {
    handleAddCharity({
      name: charity.name,
      url: charity.url,
      scope: charity.scope,
      notes: charity.notes || '',
      isGrandPrize: false,
      grandPrizeAmount: undefined
    })
  }

  const handleNext = () => {
    updateData({ charities })
    router.push('/calendar/new/budget')
  }

  const canProceed = charities.length >= 2

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
        <StepIndicator currentStep={2} totalSteps={5} stepTitles={STEP_TITLES} />

        <Card>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Add Your Charities</h2>
              <p className="text-gray-600">
                Suggested mix: 2-3 international, 3-4 national, 2-3 local organizations
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsBrowserOpen(true)}>
              Browse Charities
            </Button>
          </div>

          <CharityForm
            onAdd={handleAddCharity}
            editingCharity={editingCharity}
            onUpdate={handleUpdateCharity}
            onCancel={() => setEditingCharity(undefined)}
          />

          <div className="mt-6">
            <CharityList
              charities={charities}
              onEdit={setEditingCharity}
              onDelete={handleDeleteCharity}
            />
          </div>

          {!canProceed && charities.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
              Add at least 2 charities to continue
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Link href="/calendar/new">
              <Button variant="ghost">Back</Button>
            </Link>
            <Button onClick={handleNext} disabled={!canProceed}>
              Next: Set Budget
            </Button>
          </div>
        </Card>
      </main>

      <CharityBrowser
        isOpen={isBrowserOpen}
        onClose={() => setIsBrowserOpen(false)}
        onAdd={handleAddFromBrowser}
      />
    </div>
  )
}
