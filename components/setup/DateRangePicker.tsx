'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getChristianAdventDates } from '@/lib/utils/advent-dates'
import { formatDate } from '@/lib/utils/format'

interface DateRangePickerProps {
  value: {
    startDate: string
    endDate: string
  }
  onChange: (dates: { startDate: string; endDate: string }) => void
}

type PresetType = 'christmas' | 'december' | 'advent' | 'custom'

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState<PresetType>('christmas')
  const currentYear = new Date().getFullYear()

  const presets = {
    christmas: {
      label: 'Dec 1 - Dec 25 (Christmas)',
      startDate: `${currentYear}-12-01`,
      endDate: `${currentYear}-12-25`,
    },
    december: {
      label: 'Dec 1 - Dec 31 (Full December)',
      startDate: `${currentYear}-12-01`,
      endDate: `${currentYear}-12-31`,
    },
    advent: (() => {
      const { start, end } = getChristianAdventDates(currentYear)
      return {
        label: `Christian Advent (${formatDate(start, 'MMM d')} - ${formatDate(end, 'MMM d')})`,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      }
    })(),
    custom: {
      label: 'Custom Date Range',
      startDate: value.startDate || `${currentYear}-12-01`,
      endDate: value.endDate || `${currentYear}-12-25`,
    },
  }

  useEffect(() => {
    if (selectedPreset !== 'custom') {
      onChange(presets[selectedPreset])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset])

  const handlePresetClick = (preset: PresetType) => {
    setSelectedPreset(preset)
  }

  const handleCustomDateChange = (field: 'startDate' | 'endDate', dateValue: string) => {
    onChange({
      ...value,
      [field]: dateValue,
    })
  }

  const dayCount = value.startDate && value.endDate
    ? Math.ceil((new Date(value.endDate).getTime() - new Date(value.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(presets) as PresetType[]).map((preset) => (
          <Button
            key={preset}
            type="button"
            variant={selectedPreset === preset ? 'primary' : 'outline'}
            onClick={() => handlePresetClick(preset)}
            className="justify-start"
          >
            {presets[preset].label}
          </Button>
        ))}
      </div>

      {selectedPreset === 'custom' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Input
            label="Start Date"
            type="date"
            value={value.startDate}
            onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
            max={value.endDate}
          />
          <Input
            label="End Date"
            type="date"
            value={value.endDate}
            onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
            min={value.startDate}
          />
        </div>
      )}

      {dayCount > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">
            <span className="font-semibold">{dayCount} days</span> in your calendar
            {dayCount > 31 && <span className="text-red-600 ml-2">(Maximum 31 days allowed)</span>}
          </p>
        </div>
      )}
    </div>
  )
}
