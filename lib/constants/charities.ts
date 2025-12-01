import { SuggestedCharity, LocalCharitySuggestion, CharityScope } from '../types/charity'

export const INTERNATIONAL_CHARITIES: SuggestedCharity[] = [
  // Anchored (always show first)
  {
    id: 'pcrf',
    name: 'Palestine Children\'s Relief Fund',
    url: 'https://www.pcrf.net',
    scope: 'international',
    category: 'humanitarian',
    description: 'Medical care and humanitarian aid for Palestinian children',
    charityNavigatorRating: 97,
    charityNavigatorStars: 4,
    isAnchored: true
  },
  {
    id: 'msf',
    name: 'Doctors Without Borders',
    url: 'https://www.doctorswithoutborders.org',
    scope: 'international',
    category: 'medical',
    description: 'Emergency medical care in crisis zones worldwide',
    charityNavigatorRating: 96,
    charityNavigatorStars: 4,
    isAnchored: true
  },
  {
    id: 'wck',
    name: 'World Central Kitchen',
    url: 'https://wck.org',
    scope: 'international',
    category: 'hunger',
    description: 'Chef-prepared meals for disaster and crisis response',
    charityNavigatorRating: 100,
    charityNavigatorStars: 4,
    isAnchored: true
  },
  // Additional international
  {
    id: 'direct-relief',
    name: 'Direct Relief',
    url: 'https://www.directrelief.org',
    scope: 'international',
    category: 'medical',
    description: 'Medical supplies and humanitarian aid worldwide',
    charityNavigatorRating: 100,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'irc',
    name: 'International Rescue Committee',
    url: 'https://www.rescue.org',
    scope: 'international',
    category: 'refugees',
    description: 'Emergency aid and long-term support for refugees',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'unicef',
    name: 'UNICEF USA',
    url: 'https://www.unicefusa.org',
    scope: 'international',
    category: 'children',
    description: 'Children\'s health, education, and protection worldwide',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'oxfam',
    name: 'Oxfam America',
    url: 'https://www.oxfamamerica.org',
    scope: 'international',
    category: 'poverty',
    description: 'Fighting poverty and injustice worldwide',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'care',
    name: 'CARE',
    url: 'https://www.care.org',
    scope: 'international',
    category: 'humanitarian',
    description: 'Fighting global poverty with focus on women',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'mercy-corps',
    name: 'Mercy Corps',
    url: 'https://www.mercycorps.org',
    scope: 'international',
    category: 'humanitarian',
    description: 'Emergency relief and sustainable development',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'save-the-children',
    name: 'Save the Children',
    url: 'https://www.savethechildren.org',
    scope: 'international',
    category: 'children',
    description: 'Education, health, and protection for children',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  }
]

export const NATIONAL_CHARITIES: SuggestedCharity[] = [
  // Hunger & Housing
  {
    id: 'feeding-america',
    name: 'Feeding America',
    url: 'https://www.feedingamerica.org',
    scope: 'national',
    category: 'hunger',
    description: 'Nation\'s largest domestic hunger-relief organization',
    charityNavigatorRating: 96,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'habitat',
    name: 'Habitat for Humanity',
    url: 'https://www.habitat.org',
    scope: 'national',
    category: 'housing',
    description: 'Building affordable housing for families in need',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'no-kid-hungry',
    name: 'No Kid Hungry',
    url: 'https://www.nokidhungry.org',
    scope: 'national',
    category: 'hunger',
    description: 'Ending childhood hunger in America',
    charityNavigatorRating: 92,
    charityNavigatorStars: 4,
    isAnchored: false
  },

  // Civil Rights & Justice
  {
    id: 'aclu',
    name: 'ACLU Foundation',
    url: 'https://www.aclu.org',
    scope: 'national',
    category: 'civil-rights',
    description: 'Defending civil liberties and constitutional rights',
    charityNavigatorRating: 99,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'naacp',
    name: 'NAACP',
    url: 'https://www.naacp.org',
    scope: 'national',
    category: 'civil-rights',
    description: 'Advancing civil rights and eliminating discrimination',
    charityNavigatorRating: 97,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'splc',
    name: 'Southern Poverty Law Center',
    url: 'https://www.splcenter.org',
    scope: 'national',
    category: 'civil-rights',
    description: 'Fighting hate, teaching tolerance, seeking justice',
    charityNavigatorRating: 99,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'eji',
    name: 'Equal Justice Initiative',
    url: 'https://eji.org',
    scope: 'national',
    category: 'justice',
    description: 'Ending mass incarceration and excessive punishment',
    charityNavigatorRating: 95,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'schr',
    name: 'Southern Center for Human Rights',
    url: 'https://www.schr.org',
    scope: 'national',
    category: 'justice',
    description: 'Fighting for equality in the criminal legal system',
    charityNavigatorRating: 94,
    charityNavigatorStars: 4,
    isAnchored: false
  },

  // Environment & Climate
  {
    id: 'nrdc',
    name: 'Natural Resources Defense Council',
    url: 'https://www.nrdc.org',
    scope: 'national',
    category: 'environment',
    description: 'Defending clean air, water, and the environment',
    charityNavigatorRating: 92,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'sierra-club',
    name: 'Sierra Club Foundation',
    url: 'https://www.sierraclubfoundation.org',
    scope: 'national',
    category: 'environment',
    description: 'Climate solutions and environmental conservation',
    charityNavigatorRating: 94,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'earthjustice',
    name: 'Earthjustice',
    url: 'https://earthjustice.org',
    scope: 'national',
    category: 'environment',
    description: 'Environmental law organization - "Because the earth needs a good lawyer"',
    charityNavigatorRating: 96,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'edf',
    name: 'Environmental Defense Fund',
    url: 'https://www.edf.org',
    scope: 'national',
    category: 'environment',
    description: 'Science-based solutions for climate and environment',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'ocean-conservancy',
    name: 'Ocean Conservancy',
    url: 'https://oceanconservancy.org',
    scope: 'national',
    category: 'environment',
    description: 'Protecting the ocean from today\'s greatest challenges',
    charityNavigatorRating: 92,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'audubon',
    name: 'National Audubon Society',
    url: 'https://www.audubon.org',
    scope: 'national',
    category: 'environment',
    description: 'Protecting birds and the places they need',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'nature-conservancy',
    name: 'The Nature Conservancy',
    url: 'https://www.nature.org',
    scope: 'national',
    category: 'environment',
    description: 'Conserving lands and waters worldwide',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },

  // Health
  {
    id: 'st-jude',
    name: 'St. Jude Children\'s Research Hospital',
    url: 'https://www.stjude.org',
    scope: 'national',
    category: 'health',
    description: 'Pediatric treatment and research for childhood diseases',
    charityNavigatorRating: 91,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'planned-parenthood',
    name: 'Planned Parenthood',
    url: 'https://www.plannedparenthood.org',
    scope: 'national',
    category: 'health',
    description: 'Reproductive healthcare and education',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'mental-health-america',
    name: 'Mental Health America',
    url: 'https://www.mhanational.org',
    scope: 'national',
    category: 'health',
    description: 'Promoting mental health and preventing mental illness',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },

  // Education & Youth
  {
    id: 'teach-for-america',
    name: 'Teach For America',
    url: 'https://www.teachforamerica.org',
    scope: 'national',
    category: 'education',
    description: 'Educational equity through teaching leadership',
    charityNavigatorRating: 92,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'bgca',
    name: 'Boys & Girls Clubs of America',
    url: 'https://www.bgca.org',
    scope: 'national',
    category: 'youth',
    description: 'Youth development programs nationwide',
    charityNavigatorRating: 91,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'bbbs',
    name: 'Big Brothers Big Sisters',
    url: 'https://www.bbbs.org',
    scope: 'national',
    category: 'youth',
    description: 'One-to-one youth mentoring',
    charityNavigatorRating: 90,
    charityNavigatorStars: 4,
    isAnchored: false
  },

  // Immigration & Refugees
  {
    id: 'raices',
    name: 'RAICES',
    url: 'https://www.raicestexas.org',
    scope: 'national',
    category: 'immigration',
    description: 'Legal services for immigrant families and refugees',
    charityNavigatorRating: 92,
    charityNavigatorStars: 4,
    isAnchored: false
  },
  {
    id: 'kind',
    name: 'Kids in Need of Defense (KIND)',
    url: 'https://supportkind.org',
    scope: 'national',
    category: 'immigration',
    description: 'Legal representation for unaccompanied immigrant children',
    charityNavigatorRating: 93,
    charityNavigatorStars: 4,
    isAnchored: false
  }
]

export const LOCAL_CHARITY_SUGGESTIONS: LocalCharitySuggestion[] = [
  {
    category: 'Food Bank',
    searchTip: 'Search "[your city] food bank" or "second harvest [your region]"',
    examples: ['SF-Marin Food Bank', 'Greater Boston Food Bank', 'LA Regional Food Bank']
  },
  {
    category: 'Homeless Services',
    searchTip: 'Search "[your city] homeless coalition" or "[your city] shelter"',
    examples: ['Coalition for the Homeless', 'St. Anthony Foundation', 'PATH']
  },
  {
    category: 'Animal Welfare',
    searchTip: 'Search "[your city] humane society" or "[your city] SPCA"',
    examples: ['SF SPCA', 'ASPCA', 'Best Friends Animal Society']
  },
  {
    category: 'Community Foundation',
    searchTip: 'Search "[your city/county] community foundation"',
    examples: ['Silicon Valley Community Foundation', 'Chicago Community Trust']
  },
  {
    category: 'Arts & Culture',
    searchTip: 'Your local museum, theater, or public radio station',
    examples: ['Local NPR affiliate', 'Community theater', 'Children\'s museum']
  },
  {
    category: 'Education',
    searchTip: 'Local school foundation, library foundation, or literacy program',
    examples: ['Public school foundation', 'Library friends group', 'Literacy council']
  },
  {
    category: 'Youth Programs',
    searchTip: 'Local Boys & Girls Club, YMCA, or youth sports league',
    examples: ['Local Boys & Girls Club chapter', 'YMCA', 'PAL']
  },
  {
    category: 'LGBTQ+ Services',
    searchTip: 'Search "[your city] LGBTQ center" or "[your city] Pride"',
    examples: ['SF LGBT Center', 'LA LGBT Center', 'Equality Texas']
  },
  {
    category: 'Environmental',
    searchTip: 'Local land trust, watershed association, or parks conservancy',
    examples: ['Local land trust', 'River/bay keeper', 'Parks conservancy']
  }
]

// Helper to get all charities sorted with anchored first
export function getAllCharities(): SuggestedCharity[] {
  const all = [...INTERNATIONAL_CHARITIES, ...NATIONAL_CHARITIES]
  return all.sort((a, b) => {
    // Anchored first
    if (a.isAnchored && !b.isAnchored) return -1
    if (!a.isAnchored && b.isAnchored) return 1
    // Then by name
    return a.name.localeCompare(b.name)
  })
}

// Helper to get charities by scope
export function getCharitiesByScope(scope: CharityScope): SuggestedCharity[] {
  const charities = scope === 'international'
    ? INTERNATIONAL_CHARITIES
    : scope === 'national'
      ? NATIONAL_CHARITIES
      : []

  return charities.sort((a, b) => {
    if (a.isAnchored && !b.isAnchored) return -1
    if (!a.isAnchored && b.isAnchored) return 1
    return a.name.localeCompare(b.name)
  })
}

// Helper to get charities by category
export function getCharitiesByCategory(scope: CharityScope, category: string): SuggestedCharity[] {
  return getCharitiesByScope(scope).filter(c => c.category === category)
}

// Categories for filtering
export const CHARITY_CATEGORIES = {
  international: ['humanitarian', 'medical', 'hunger', 'refugees', 'children', 'poverty'],
  national: ['hunger', 'housing', 'civil-rights', 'justice', 'environment', 'health', 'education', 'youth', 'immigration']
}
