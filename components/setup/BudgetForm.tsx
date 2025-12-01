'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getBudgetDefaults } from '@/lib/utils/budget-defaults'

interface BudgetFormProps {
  value: {
    totalBudget: number
    minAmount: number
    maxAmount: number
  }
  onChange: (budget: { totalBudget: number; minAmount: number; maxAmount: number }) => void
}

export function BudgetForm({ value, onChange }: BudgetFormProps) {
  const [totalBudget, setTotalBudget] = useState(value.totalBudget.toString())
  const [minAmount, setMinAmount] = useState(value.minAmount.toString())
  const [maxAmount, setMaxAmount] = useState(value.maxAmount.toString())
  const [useDefaults, setUseDefaults] = useState(true)

  useEffect(() => {
    const budget = parseFloat(totalBudget) || 0
    if (budget > 0 && useDefaults) {
      const defaults = getBudgetDefaults(budget)
      setMinAmount(defaults.minAmount.toString())
      setMaxAmount(defaults.maxAmount.toString())
      onChange({
        totalBudget: budget,
        minAmount: defaults.minAmount,
        maxAmount: defaults.maxAmount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalBudget, useDefaults])

  const handleChange = (field: 'totalBudget' | 'minAmount' | 'maxAmount', val: string) => {
    const numVal = parseFloat(val) || 0

    if (field === 'totalBudget') {
      setTotalBudget(val)
    } else if (field === 'minAmount') {
      setMinAmount(val)
      setUseDefaults(false)
      onChange({
        totalBudget: parseFloat(totalBudget) || 0,
        minAmount: numVal,
        maxAmount: parseFloat(maxAmount) || 0,
      })
    } else if (field === 'maxAmount') {
      setMaxAmount(val)
      setUseDefaults(false)
      onChange({
        totalBudget: parseFloat(totalBudget) || 0,
        minAmount: parseFloat(minAmount) || 0,
        maxAmount: numVal,
      })
    }
  }

  return (
    <div className="space-y-4">
      <Input
        label="Total Budget"
        type="number"
        min="1"
        step="0.01"
        value={totalBudget}
        onChange={(e) => handleChange('totalBudget', e.target.value)}
        required
        placeholder="e.g., 1000"
      />

      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Minimum Amount Per Day"
          type="number"
          min="1"
          step="0.01"
          value={minAmount}
          onChange={(e) => handleChange('minAmount', e.target.value)}
          required
          placeholder="e.g., 25"
        />
        <Input
          label="Maximum Amount Per Day"
          type="number"
          min={parseFloat(minAmount) || 1}
          step="0.01"
          value={maxAmount}
          onChange={(e) => handleChange('maxAmount', e.target.value)}
          required
          placeholder="e.g., 200"
        />
      </div>

      {!useDefaults && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setUseDefaults(true)}
        >
          Reset to suggested amounts
        </Button>
      )}

      {parseFloat(minAmount) > 0 && parseFloat(maxAmount) > 0 && parseFloat(minAmount) > parseFloat(maxAmount) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          Minimum amount cannot be greater than maximum amount
        </div>
      )}
    </div>
  )
}
