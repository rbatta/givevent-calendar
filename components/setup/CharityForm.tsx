'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'

export interface Charity {
  id: string
  name: string
  url: string
  scope: 'international' | 'national' | 'local'
  notes?: string
  isGrandPrize?: boolean
  grandPrizeAmount?: number
}

interface CharityFormProps {
  onAdd: (charity: Omit<Charity, 'id'>) => void
  editingCharity?: Charity
  onUpdate?: (charity: Charity) => void
  onCancel?: () => void
}

export function CharityForm({ onAdd, editingCharity, onUpdate, onCancel }: CharityFormProps) {
  const [name, setName] = useState(editingCharity?.name || '')
  const [url, setUrl] = useState(editingCharity?.url || '')
  const [scope, setScope] = useState<'international' | 'national' | 'local'>(
    editingCharity?.scope || 'international'
  )
  const [notes, setNotes] = useState(editingCharity?.notes || '')
  const [isGrandPrize, setIsGrandPrize] = useState(editingCharity?.isGrandPrize || false)
  const [grandPrizeAmount, setGrandPrizeAmount] = useState(
    editingCharity?.grandPrizeAmount?.toString() || ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const charityData = {
      name,
      url,
      scope,
      notes: notes || undefined,
      isGrandPrize,
      grandPrizeAmount: isGrandPrize && grandPrizeAmount ? parseFloat(grandPrizeAmount) : undefined,
    }

    if (editingCharity && onUpdate) {
      onUpdate({ ...editingCharity, ...charityData })
    } else {
      onAdd(charityData)
    }

    // Reset form
    setName('')
    setUrl('')
    setScope('international')
    setNotes('')
    setIsGrandPrize(false)
    setGrandPrizeAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Charity Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., Doctors Without Borders"
        />
        <Input
          label="Website URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="https://..."
        />
      </div>

      <Select
        label="Scope"
        value={scope}
        onChange={(e) => setScope(e.target.value as any)}
        options={[
          { value: 'international', label: '🌍 International' },
          { value: 'national', label: '🏛️ National' },
          { value: 'local', label: '📍 Local' },
        ]}
      />

      <Input
        label="Notes (Optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Why this charity matters to you..."
      />

      <div className="p-3 bg-white rounded border border-gray-200">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isGrandPrize}
            onChange={(e) => setIsGrandPrize(e.target.checked)}
            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
          />
          <span className="font-medium">⭐ Make this the Grand Prize charity</span>
        </label>
        {isGrandPrize && (
          <Input
            label="Fixed Grand Prize Amount"
            type="number"
            min="1"
            step="0.01"
            value={grandPrizeAmount}
            onChange={(e) => setGrandPrizeAmount(e.target.value)}
            required
            placeholder="e.g., 500"
            className="mt-3"
          />
        )}
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {editingCharity ? 'Update Charity' : 'Add Charity'}
        </Button>
        {editingCharity && onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
