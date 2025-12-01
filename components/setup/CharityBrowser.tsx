'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  INTERNATIONAL_CHARITIES,
  NATIONAL_CHARITIES,
  LOCAL_CHARITY_SUGGESTIONS,
  CHARITY_CATEGORIES
} from '@/lib/constants/charities'
import type { SuggestedCharity, CharityScope } from '@/lib/types/charity'

interface CharityBrowserProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (charity: { name: string; url: string; scope: CharityScope; notes?: string }) => void
}

export function CharityBrowser({ isOpen, onClose, onAdd }: CharityBrowserProps) {
  const [activeTab, setActiveTab] = useState<'international' | 'national' | 'local'>('international')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const handleAddCharity = (charity: SuggestedCharity) => {
    onAdd({
      name: charity.name,
      url: charity.url,
      scope: charity.scope,
      notes: charity.description
    })
  }

  const getCharitiesForTab = () => {
    if (activeTab === 'international') return INTERNATIONAL_CHARITIES
    if (activeTab === 'national') return NATIONAL_CHARITIES
    return []
  }

  const getFilteredCharities = () => {
    let charities = getCharitiesForTab()

    // Apply category filter
    if (selectedCategory) {
      charities = charities.filter(c => c.category === selectedCategory)
    }

    // Apply search filter (searches name and description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      charities = charities.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
      )
    }

    return charities
  }

  const filteredCharities = getFilteredCharities()
  const categories = activeTab === 'international'
    ? CHARITY_CATEGORIES.international
    : CHARITY_CATEGORIES.national

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-green-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Browse Charities</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-3xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('international')
              setSelectedCategory(null)
              setSearchQuery('')
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'international'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🌍 International
          </button>
          <button
            onClick={() => {
              setActiveTab('national')
              setSelectedCategory(null)
              setSearchQuery('')
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'national'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            🏛️ National
          </button>
          <button
            onClick={() => {
              setActiveTab('local')
              setSelectedCategory(null)
              setSearchQuery('')
            }}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'local'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            📍 Local
          </button>
        </div>

        {/* Search Bar (for international and national) */}
        {activeTab !== 'local' && (
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search charities by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Category Filter (for international and national) */}
        {activeTab !== 'local' && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === null
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                    selectedCategory === cat
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'local' ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Local charities vary by region. Below are suggestions for finding reputable organizations in your area.
                </p>
              </div>

              {LOCAL_CHARITY_SUGGESTIONS.map((suggestion, idx) => (
                <Card key={idx}>
                  <h3 className="font-semibold text-lg mb-2">{suggestion.category}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    <strong>How to find:</strong> {suggestion.searchTip}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Examples:</strong> {suggestion.examples.join(', ')}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCharities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No charities found in this category.
                </div>
              ) : (
                filteredCharities.map((charity) => (
                  <Card key={charity.id} className="hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">
                            {charity.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{charity.description}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                            {charity.category.replace('-', ' ')}
                          </span>
                          <span>
                            {'⭐'.repeat(charity.charityNavigatorStars)} {charity.charityNavigatorRating}/100
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAddCharity(charity)}
                        className="shrink-0"
                      >
                        + Add
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
