export type CharityScope = 'international' | 'national' | 'local'

export interface SuggestedCharity {
  id: string
  name: string
  url: string
  scope: CharityScope
  category: string
  description: string
  charityNavigatorRating: number
  charityNavigatorStars: number
  isAnchored: boolean
}

export interface LocalCharitySuggestion {
  category: string
  searchTip: string
  examples: string[]
}
