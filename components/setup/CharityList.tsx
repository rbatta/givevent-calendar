'use client'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Charity } from './CharityForm'

interface CharityListProps {
  charities: Charity[]
  onEdit: (charity: Charity) => void
  onDelete: (id: string) => void
}

export function CharityList({ charities, onEdit, onDelete }: CharityListProps) {
  if (charities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No charities added yet. Add your first charity above.
      </div>
    )
  }

  const scopeIcons = {
    international: '🌍',
    national: '🏛️',
    local: '📍',
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-700">
        Added Charities ({charities.length})
      </h3>
      {charities.map((charity) => (
        <Card key={charity.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-lg">
                  {charity.name}
                  {charity.isGrandPrize && <span className="ml-2">⭐</span>}
                </h4>
                <span className="text-sm">
                  {scopeIcons[charity.scope]} {charity.scope}
                </span>
              </div>
              <a
                href={charity.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {charity.url}
              </a>
              {charity.notes && (
                <p className="text-sm text-gray-600 mt-1">{charity.notes}</p>
              )}
              {charity.isGrandPrize && charity.grandPrizeAmount && (
                <p className="text-sm font-semibold text-green-600 mt-1">
                  Grand Prize Amount: ${charity.grandPrizeAmount.toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(charity)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(charity.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
